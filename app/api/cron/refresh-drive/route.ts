import { google } from "googleapis"
import { clerkClient } from "@clerk/nextjs/server"
import { NextResponse, NextRequest } from "next/server"
import { v4 as uuidv4 } from "uuid"
import { db } from "@/lib/db"

export async function GET(req: NextRequest) {
  // 1. Verify the secret to prevent external abuse of this endpoint
  const authHeader = req.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  // 2. Find all users who have connected Google Drive
  const users = await db.user.findMany({
    where: {
      googleResourceId: { not: null },
    },
    select: { clerkId: true },
  })

  const client = await clerkClient()
  const results: string[] = []

  // 3. Re-register the webhook for each user
  for (const user of users) {
    try {
      const clerkResponse = await client.users.getUserOauthAccessToken(
        user.clerkId,
        "oauth_google"
      )
      const accessToken = clerkResponse.data[0]?.token
      if (!accessToken) {
        results.push(`${user.clerkId}: no google token, skipped`)
        continue
      }

      const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.OAUTH2_REDIRECT_URI
      )
      oauth2Client.setCredentials({ access_token: accessToken })

      const drive = google.drive({ version: "v3", auth: oauth2Client })

      const startPageTokenRes = await drive.changes.getStartPageToken({})
      const startPageToken = startPageTokenRes.data.startPageToken
      if (!startPageToken) {
        results.push(`${user.clerkId}: no startPageToken, skipped`)
        continue
      }

      const channelId = uuidv4()
      const listener = await drive.changes.watch({
        pageToken: startPageToken,
        supportsAllDrives: true,
        supportsTeamDrives: true,
        requestBody: {
          id: channelId,
          type: "web_hook",
          address: `${process.env.NGROK_URI}/api/drive-activity/notification`,
          kind: "api#channel",
        },
      })

      if (listener.status === 200) {
        await db.user.updateMany({
          where: { clerkId: user.clerkId },
          data: { googleResourceId: listener.data.resourceId },
        })
        results.push(`${user.clerkId}: refreshed`)
      } else {
        results.push(`${user.clerkId}: watch failed (${listener.status})`)
      }
    } catch (err) {
      console.error(`Failed to refresh for ${user.clerkId}`, err)
      results.push(`${user.clerkId}: error`)
    }
  }

  return NextResponse.json({ message: "Cron finished", results })
}

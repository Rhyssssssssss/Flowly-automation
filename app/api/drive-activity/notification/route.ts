import { postContentToWebHook } from "@/app/(main)/(pages)/connections/_actions/discord-connection"
import { onCreateNewPageInDatabase } from "@/app/(main)/(pages)/connections/_actions/notion-connection"
import { postMessageToSlack } from "@/app/(main)/(pages)/connections/_actions/slack-connection"
import { db } from "@/lib/db"
import axios from "axios"
import { headers } from "next/headers"
import { NextRequest } from "next/server"

export async function POST(req: NextRequest) {
  console.log("🔴 Changed")
  const headersList = await headers()
  let channelResourceId
  headersList.forEach((value, key) => {
    if (key == "x-goog-resource-id") {
      channelResourceId = value
    }
  })

  if (channelResourceId) {
    const user = await db.user.findFirst({
      where: {
        googleResourceId: channelResourceId,
      },
      select: { clerkId: true, credits: true },
    })

    if ((user && parseInt(user.credits!) > 0) || user?.credits == "Unlimited") {
      const workflows = await db.workflows.findMany({
        where: {
          userId: user.clerkId,
        },
      })

      if (workflows) {
        for (const flow of workflows) {
          // Guard 1: skip this workflow if flowPath is empty
          if (!flow.flowPath) continue

          let flowPath: string[]
          try {
            flowPath = JSON.parse(flow.flowPath)
            console.log("📋 flowPath =", flowPath)
          } catch {
            console.log("⚠️ Failed to parse flowPath, skipping", flow.id)
            continue
          }

          // Guard 2: skip if not an array or empty
          if (!Array.isArray(flowPath) || flowPath.length === 0) continue

          let current = 0
          while (current < flowPath.length) {
            const node = flowPath[current]

            if (node == "Discord") {
              const discordMessage = await db.discordWebhook.findFirst({
                where: { userId: flow.userId },
                select: { url: true },
              })
              console.log("🟣 Discord node", {
                hasWebhook: !!discordMessage,
                hasTemplate: !!flow.discordTemplate,
              })
              if (discordMessage && flow.discordTemplate) {
                await postContentToWebHook(
                  flow.discordTemplate,
                  discordMessage.url
                )
              }
            }

            if (node == "Slack") {
              console.log("🔵 Slack node", {
                hasToken: !!flow.slackAccessToken,
                channelCount: flow.slackChannels?.length ?? 0,
                hasTemplate: !!flow.slackTemplate,
              })
              if (flow.slackAccessToken && flow.slackChannels.length > 0) {
                const channels = flow.slackChannels.map((channel) => ({
                  label: "",
                  value: channel,
                }))
                await postMessageToSlack(
                  flow.slackAccessToken,
                  channels,
                  flow.slackTemplate!
                )
              }
            }

            if (node == "Notion") {
              console.log("⚫ Notion node", {
                hasToken: !!flow.notionAccessToken,
                dbId: flow.notionDbId,
                hasTemplate: !!flow.notionTemplate,
              })
              if (
                flow.notionAccessToken &&
                flow.notionDbId &&
                flow.notionTemplate
              ) {
                await onCreateNewPageInDatabase(
                  flow.notionDbId,
                  flow.notionAccessToken,
                  JSON.parse(flow.notionTemplate)
                )
              }
            }

            if (node == "Wait") {
              const res = await axios.put(
                "https://api.cron-job.org/jobs",
                {
                  job: {
                    url: `${process.env.NGROK_URI}?flow_id=${flow.id}`,
                    enabled: "true",
                    schedule: {
                      timezone: "Europe/Istanbul",
                      expiresAt: 0,
                      hours: [-1],
                      mdays: [-1],
                      minutes: ["*****"],
                      months: [-1],
                      wdays: [-1],
                    },
                  },
                },
                {
                  headers: {
                    Authorization: `Bearer ${process.env.CRON_JOB_KEY!}`,
                    "Content-Type": "application/json",
                  },
                }
              )
              if (res) {
                // Store the remaining (not-yet-executed) nodes for the cron job to resume
                const remaining = flowPath.slice(current + 1)
                await db.workflows.update({
                  where: { id: flow.id },
                  data: { cronPath: JSON.stringify(remaining) },
                })
              }
              break // Stop here on Wait; the scheduled job takes over
            }

            current++
          }

          await db.user.update({
            where: { clerkId: user.clerkId },
            data: { credits: `${parseInt(user.credits!) - 1}` },
          })
        }

        return Response.json({ message: "flow completed" }, { status: 200 })
      }
    }
  }

  return Response.json({ message: "success" }, { status: 200 })
}

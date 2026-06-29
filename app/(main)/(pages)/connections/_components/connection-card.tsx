import { ConnectionTypes } from "@/lib/types"
import React from "react"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"

type Props = {
  type: ConnectionTypes
  icon: string
  title: ConnectionTypes
  description: string
  callback?: () => void
  connected: {} & any
}

const ConnectionCard = ({
  description,
  type,
  icon,
  title,
  connected,
}: Props) => {
  return (
    <Card className="flex w-full flex-row items-center justify-between p-4">
      <div className="flex items-center gap-4">
        <Image
          src={icon}
          alt={title}
          height={40}
          width={40}
          className="object-contain"
        />
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>

      <div className="flex flex-col items-center gap-2 p-4">
        {connected[type] ? (
          <div className="border-bg-primary rounded-lg border-2 px-3 py-2 font-bold text-white">
            Connected
          </div>
        ) : (
          <Link
            href={
              title == "Discord"
                ? process.env.NEXT_PUBLIC_DISCORD_REDIRECT!
                : title == "Notion"
                  ? process.env.NEXT_PUBLIC_NOTION_AUTH_URL!
                  : title == "Slack"
                    ? process.env.NEXT_PUBLIC_SLACK_REDIRECT!
                    : "#"
            }
            className="rounded-lg bg-primary p-2 font-bold text-primary-foreground"
          >
            Connect
          </Link>
        )}
      </div>
    </Card>
  )
}

export default ConnectionCard

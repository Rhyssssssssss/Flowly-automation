"use client"
import React, { useState } from "react"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"

import { onFlowPublish } from "../_actions/workflow-connections"

type Props = {
  name: string
  description: string
  id: string
  publish: boolean | null
}

const Workflow = ({ description, id, name, publish }: Props) => {
  const [checked, setChecked] = useState(publish ?? false)

  const onPublishFlow = async (value: boolean) => {
    setChecked(value)
    const response = await onFlowPublish(id, value)
    if (response) toast.message(response)
  }

  return (
    <Card className="flex w-full flex-row items-center justify-between p-4">
      <Link
        href={`/workflows/editor/${id}`}
        className="flex flex-1 items-center gap-4"
      >
        <div className="flex flex-row gap-2">
          <Image
            src="/googleDrive.png"
            alt="Google Drive"
            height={30}
            width={30}
            className="object-contain"
          />
          <Image
            src="/notion.png"
            alt="Notion"
            height={30}
            width={30}
            className="object-contain"
          />
          <Image
            src="/discord.png"
            alt="Discord"
            height={30}
            width={30}
            className="object-contain"
          />
        </div>
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold">{name}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </Link>
      <div className="flex flex-col items-center gap-2 p-4">
        <Label htmlFor="airplane-mode" className="text-muted-foreground">
          {checked ? "On" : "Off"}
        </Label>
        <Switch
          id="airplane-mode"
          checked={checked}
          onCheckedChange={onPublishFlow}
        />
      </div>
    </Card>
  )
}

export default Workflow

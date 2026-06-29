import { db } from "@/lib/db"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import React from "react"

type Props = {}

const Page = async (props: Props) => {
  const user = await currentUser()
  if (!user) redirect("/sign-in")

  const workflows = await db.workflows.findMany({
    where: {
      userId: user.id,
    },
  })

  if (workflows.length > 0) {
    redirect(`/workflows/editor/${workflows[0].id}`)
  }

  redirect("/workflows")
}

export default Page

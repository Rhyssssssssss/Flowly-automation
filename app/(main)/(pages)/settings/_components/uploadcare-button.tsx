"use client"
import { FileUploaderRegular } from "@uploadcare/react-uploader/next"
import "@uploadcare/react-uploader/core.css"
import { useRouter } from "next/navigation"

type Props = {
  onUpload: (e: string) => any
}

const UploadCareButton = ({ onUpload }: Props) => {
  const router = useRouter()

  const handleUpload = async (e: { successEntries: { cdnUrl: string }[] }) => {
    if (e.successEntries.length === 0) return

    const cdnUrl = e.successEntries[0].cdnUrl
    const file = await onUpload(cdnUrl)
    if (file) {
      router.refresh()
    }
  }

  return (
    <div>
      <FileUploaderRegular
        sourceList="local, camera, dropbox, gdrive"
        classNameUploader="uc-light"
        pubkey="8460cdd59b50fa0dc72a"
        onChange={handleUpload}
      />
    </div>
  )
}

export default UploadCareButton

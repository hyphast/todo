import React, { ChangeEvent, FC } from 'react'
import cn from 'classnames'
import { storageAPI } from '../../../firebase/API'
import UploadSVG from '../../../assets/upload.svg'
import FileSVG from '../../../assets/file.svg'
import styles from './UploadFile.module.less'

const MAX_FILES = 3

export type UploadedFile = {
  id: number
  name: string
  url: string
}
type UploadFileProps = {
  uploadedFiles: UploadedFile[]
  setUploadedFiles: React.Dispatch<React.SetStateAction<UploadedFile[]>>
  isUploading: boolean
  setIsUploading: React.Dispatch<React.SetStateAction<boolean>>
}
export const UploadFile: FC<UploadFileProps> = ({
  uploadedFiles,
  setUploadedFiles,
  isUploading,
  setIsUploading,
}) => {
  const fileInput = React.useRef<HTMLInputElement>(null)

  const onNewFileClick = () => {
    fileInput.current?.click()
  }
  const onRemoveClick = (id: number, name: string) => {
    const remove = async () => {
      setIsUploading(true)
      const isDeleted = await storageAPI.deleteFile(name)

      if (isDeleted) {
        setUploadedFiles((prev) => prev.filter((item) => item.id !== id))
        setIsUploading(false)
      }
    }
    remove()
  }
  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const upload = async () => {
      setIsUploading(true)
      if (event.target.files?.length) {
        const data = await storageAPI.getFileData(event.target.files[0])

        if (data) {
          const { name, url } = data
          setUploadedFiles((prev) => [...prev, { id: Date.now(), name, url }])
        }
      }
      setIsUploading(false)
    }
    upload()
  }

  const isFileLimit = uploadedFiles.length >= MAX_FILES

  return (
    <div className={styles.root}>
      <button
        type="button"
        className={cn(styles.newFileBtn, {
          [styles.disabledFile]: isFileLimit,
        })}
        disabled={isFileLimit}
        onClick={onNewFileClick}
      >
        <img src={UploadSVG} alt="Upload file" />
      </button>
      <input
        type="file"
        ref={fileInput}
        className={styles.input}
        onChange={onFileChange}
        multiple
      />

      {isUploading ? (
        <p className={styles.loader}>Загрузка...</p>
      ) : (
        uploadedFiles.map((file) => (
          <button
            type="button"
            key={file.id}
            className={styles.fileItem}
            onClick={() => onRemoveClick(file.id, file.name)}
          >
            <img src={FileSVG} alt="File" />
          </button>
        ))
      )}
    </div>
  )
}

import React, { FC, useEffect, useRef, useState } from 'react'
import FileSVG from '../../../assets/file.svg'
import { storageAPI } from '../../../firebase/API'
import styles from './FileList.module.less'

export type FileListProps = {
  files: string[]
}
export const FileList: FC<FileListProps> = ({ files }) => {
  const [url, setUrl] = useState('#')
  const isMounted = useRef(false)
  const aRef = useRef<HTMLAnchorElement>(null)

  const onFileClick = (file: string) => {
    const download = async (file: string) => {
      const blob = await storageAPI.getFile(file)
      const data = window.URL.createObjectURL(blob)
      setUrl(data)
    }
    download(file)
  }

  useEffect(() => {
    if (isMounted.current) {
      aRef.current?.click()
    }
    isMounted.current = true
  }, [url])

  return (
    <div className={styles.root}>
      {files.map((file, i) => (
        <button className={styles.fileItem} key={i}
                onClick={() => onFileClick(file)}
        >
          <img src={FileSVG} alt="File" />
        </button>
      ))}
      <a ref={aRef} className={styles.hiddenAnchor} href={url} download></a>
    </div>
  )
}

import React, { FC } from 'react'
import FileSVG from '../../../assets/file.svg'
import styles from './FileList.module.less'

export type FileListProps = {
  files: string[]
}
export const FileList: FC<FileListProps> = ({ files }) => {
  return (
    <div className={styles.root}>
      {files.map((file, i) => (
        <a className={styles.fileItem} key={i} href={file} download>
          <img src={FileSVG} alt="File" />
        </a>
      ))}
    </div>
  )
}

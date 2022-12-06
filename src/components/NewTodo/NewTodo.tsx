import React, { ChangeEvent, FC, FormEvent, useState } from 'react'
import cn from 'classnames'
import { createTodo } from '../../reducer/actionCreators'
import { Actions } from '../../reducer'
import { todoAPI } from '../../firebase/API'
import { UploadedFile, UploadFile } from '../File'
import PlusSVG from '../../assets/plus.svg'
import styles from './NewTodo.module.less'

type NewTodoProps = {
  dispatch: React.Dispatch<Actions>
}
export const NewTodo: FC<NewTodoProps> = ({ dispatch }) => {
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [expired, setExpired] = useState<string | null>(null)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const onTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value)
  }
  const onDescChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setDesc(event.target.value)
  }
  const onDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    setExpired(event.target.value)
  }
  const onFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    const create = async () => {
      setIsUploading(true)
      const newTodo = {
        title,
        desc,
        attach: uploadedFiles.map((item) => item.name),
        isDone: false,
        expired,
      }

      const id = await todoAPI.createTodo(newTodo)

      if (id) {
        const action = createTodo({ ...newTodo, id })
        dispatch(action)
        setTitle('')
        setDesc('')
        setExpired('')
        setUploadedFiles([])
      }
      setIsUploading(false)
    }
    event.preventDefault()
    create()
  }

  return (
    <form className={styles.root} onSubmit={onFormSubmit}>
      <input
        className={styles.inputTitle}
        type="text"
        value={title}
        onChange={onTitleChange}
        placeholder="Заголовок"
      />
      <textarea
        className={styles.inputDesc}
        value={desc}
        placeholder="Описание"
        onChange={onDescChange}
      />
      <div className={styles.bottomFields}>
        <UploadFile
          uploadedFiles={uploadedFiles}
          setUploadedFiles={setUploadedFiles}
          isUploading={isUploading}
          setIsUploading={setIsUploading}
        />
        <label htmlFor="date">
          <input id="date" type="datetime-local" onChange={onDateChange} />
        </label>
      </div>
      <button
        className={cn(styles.submitBtn, {
          [styles.disabledBtn]: title === '' || isUploading,
        })}
        type="submit"
        disabled={title === ''}
      >
        <img src={PlusSVG} alt="Add new task icon" />
      </button>
    </form>
  )
}

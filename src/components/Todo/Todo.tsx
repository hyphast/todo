import React, {
  ChangeEvent,
  FC,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from 'react'
import cn from 'classnames'
import dayjs from 'dayjs'
import 'dayjs/locale/ru'
import { deleteTodo, updateTodo } from '../../reducer/actionCreators'
import { todoAPI } from '../../firebase/API'
import { FileList } from '../File'
import { Actions, ITodo } from '../../reducer'
import TrashSVG from '../../assets/trash.svg'
import styles from './Todo.module.less'

interface TodoProps extends ITodo {
  dispatch: React.Dispatch<Actions>
}
export const Todo: FC<TodoProps> = ({ dispatch, ...todo }) => {
  const { id, title, desc, expired, attach, isDone } = todo

  const [isTitleEdit, setIsTitleEdit] = useState(false)
  const [isDescEdit, setIsDescEdit] = useState(false)
  const [isExpiredEdit, setIsExpiredEdit] = useState(false)
  const [newTitle, setNewTitle] = useState(title)
  const [newDesc, setNewDesc] = useState(desc)
  const [newExpired, setNewExpired] = useState<string | null>(expired)
  const titleRef = useRef<HTMLInputElement>(null)
  const descRef = useRef<HTMLInputElement>(null)

  const onHeadingClick = () => {
    setIsTitleEdit(true)
  }
  const onDescClick = () => {
    setIsDescEdit(true)
  }
  const onExpiredClick = () => {
    setIsExpiredEdit(true)
  }
  const onDeleteClick = () => {
    const deleteItem = async () => {
      const isDeleted = await todoAPI.deleteTodo(id)

      if (isDeleted) {
        const action = deleteTodo(id)
        dispatch(action)
      }
    }
    deleteItem()
  }
  const onIsDoneChange = () => {
    const update = async () => {
      const isUpdated = await todoAPI.updateTodo({ ...todo, isDone: !isDone })

      if (isUpdated) {
        const action = updateTodo({ ...todo, isDone: !isDone })
        dispatch(action)
      }
    }
    update()
  }
  const onNewTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value)
  }
  const onNewDescChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNewDesc(event.target.value)
  }
  const onExpiredChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNewExpired(event.target.value)
  }
  const updateTodoData = () => {
    const update = async () => {
      const data = {
        ...todo,
        title: newTitle,
        desc: newDesc,
        expired: newExpired,
      }

      const isUpdated = await todoAPI.updateTodo(data)
      if (isUpdated) {
        const action = updateTodo(data)
        dispatch(action)
      }
      setIsTitleEdit(false)
      setIsDescEdit(false)
      setIsExpiredEdit(false)
    }
    update()
  }
  const onInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      updateTodoData()
    }
  }
  const onInputBlur = () => {
    updateTodoData()
  }

  useEffect(() => {
    titleRef?.current?.focus()
  }, [isTitleEdit])
  useEffect(() => {
    descRef?.current?.focus()
  }, [isDescEdit])

  const date = dayjs(expired).locale('ru').format('DD MMMM YYYY HH:mm')
  const isExpired = dayjs().isAfter(dayjs(expired))

  return (
    <div className={styles.root}>
      <div className={styles.todoData}>
        {!isTitleEdit ? (
          <h3
            className={cn(styles.title, {
              [styles.done]: isDone,
            })}
            onClick={onHeadingClick}
          >
            {title}
          </h3>
        ) : (
          <input
            ref={titleRef}
            className={styles.titleInput}
            type="text"
            value={newTitle}
            onChange={onNewTitleChange}
            onKeyDown={onInputKeyDown}
            onBlur={onInputBlur}
          />
        )}
        {!isExpiredEdit ? (
          expired && (
            <p className={styles.expired} onClick={onExpiredClick}>
              {date} {isExpired && <span>Expired</span>}
            </p>
          )
        ) : (
          <input
            className={styles.expiredInput}
            id="date"
            type="datetime-local"
            onChange={onExpiredChange}
            onBlur={onInputBlur}
          />
        )}
        {!isDescEdit ? (
          <p className={styles.desc} onClick={onDescClick}>
            {desc}
          </p>
        ) : (
          <input
            ref={descRef}
            className={styles.descInput}
            type="text"
            value={newDesc}
            onChange={onNewDescChange}
            onKeyDown={onInputKeyDown}
            onBlur={onInputBlur}
          />
        )}
        <FileList files={attach} />
      </div>
      <div className={styles.actions}>
        <input
          className={styles.checkbox}
          type="checkbox"
          checked={isDone}
          onChange={onIsDoneChange}
        />
        <button type="button" onClick={onDeleteClick}>
          <img src={TrashSVG} alt="Delete todo icon" />
        </button>
      </div>
    </div>
  )
}

Todo.defaultProps = {
  desc: '',
}

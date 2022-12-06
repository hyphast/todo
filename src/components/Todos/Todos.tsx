import React, { useEffect, useReducer, useState } from 'react'
import { initialTodos, reducer } from '../../reducer'
import { setTodos } from '../../reducer/actionCreators'
import { todoAPI } from '../../firebase/API'
import { Todo } from '../Todo'
import { NewTodo } from '../NewTodo'
import styles from './Todos.module.less'

export const Todos = () => {
  const [state, dispatch] = useReducer(reducer, initialTodos)
  const [isLoading, setIsLoading] = useState(true)

  const { todos } = state

  useEffect(() => {
    const getData = async () => {
      const data = await todoAPI.getTodos()
      const action = setTodos(data)
      dispatch(action)

      setIsLoading(false)
    }
    getData()
  }, [])

  return (
    <div className={styles.root}>
      <h1 className={styles.title}>Todo</h1>
      <NewTodo dispatch={dispatch} />
      <hr className={styles.delimiter} />
      {isLoading ? (
        <p className={styles.info}>Загрузка...</p>
      ) : todos.length ? (
        todos.map((todo) => (
          <Todo key={todo.id} {...todo} dispatch={dispatch} />
        ))
      ) : (
        <h1 className={styles.info}>Пусто</h1>
      )}
    </div>
  )
}

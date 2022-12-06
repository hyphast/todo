import { ActionKind, Actions, IState, ITodo } from '../reducer.types'

export const setTodos = (data: IState): Actions => ({
  type: ActionKind.SET_TODOS,
  payload: data,
})
export const createTodo = (todo: ITodo): Actions => ({
  type: ActionKind.CREATE_TODO,
  payload: { todo },
})
export const deleteTodo = (id: string): Actions => ({
  type: ActionKind.DELETE_TODO,
  id,
})
export const updateTodo = (todo: ITodo): Actions => ({
  type: ActionKind.UPDATE_TODO,
  payload: { todo },
})

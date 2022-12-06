export interface ITodo {
  id: string
  title: string
  desc: string
  attach: string[]
  isDone: boolean
  expired: string | null
}

export interface IState {
  todos: ITodo[]
}

export enum ActionKind {
  SET_TODOS = 'todo/SET_TODOS',
  CREATE_TODO = 'todo/CREATE_TODO',
  DELETE_TODO = 'todo/DELETE_TODO',
  UPDATE_TODO = 'todo/UPDATE_TODO',
}

export type Actions =
  | {
      type: ActionKind.SET_TODOS
      payload: IState
    }
  | {
      type: ActionKind.CREATE_TODO
      payload: { todo: ITodo }
    }
  | {
      type: ActionKind.DELETE_TODO
      id: string
    }
  | {
      type: ActionKind.UPDATE_TODO
      payload: { todo: ITodo }
    }

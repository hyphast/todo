import { ActionKind, Actions, IState } from './reducer.types'

export const initialTodos = {
  todos: [],
}

export const reducer = (state: IState, action: Actions): IState => {
  switch (action.type) {
    case ActionKind.SET_TODOS: {
      return { ...state, ...action.payload }
    }
    case ActionKind.CREATE_TODO: {
      return { ...state, todos: [{ ...action.payload.todo }, ...state.todos] }
    }
    case ActionKind.DELETE_TODO: {
      return {
        ...state,
        todos: state.todos.filter((todo) => todo.id !== action.id),
      }
    }
    case ActionKind.UPDATE_TODO: {
      return {
        ...state,
        todos: state.todos.map((todo) => {
          if (todo.id === action.payload.todo.id) {
            return { ...todo, ...action.payload.todo }
          }
          return todo
        }),
      }
    }
    default:
      return state
  }
}

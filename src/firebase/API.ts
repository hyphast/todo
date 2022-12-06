import {
  deleteObject,
  getBlob,
  ref,
  uploadBytesResumable,
} from 'firebase/storage'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore'
import { db, storage } from './firebase'
import { ITodo } from '../reducer'

export const storageAPI = {
  async uploadFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const fileName = Date.now() + file.name
      const storageRef = ref(storage, `files/${fileName}`)
      const uploadTask = uploadBytesResumable(storageRef, file)

      uploadTask.on(
        'state_changed',
        () => {},
        (error) => {
          reject(error)
        },
        () => {
          resolve(fileName)
        }
      )
    })
  },
  async getFileData(file: File) {
    try {
      const data = await storageAPI.uploadFile(file)
      return data
    } catch (e) {
      console.log(e)
      return null
    }
  },
  async getFile(name: string) {
    return getBlob(ref(storage, `files/${name}`))
  },
  async deleteFile(name: string) {
    try {
      const desertRef = ref(storage, `files/${name}`)

      await deleteObject(desertRef)
      return true
    } catch (e) {
      console.log(e)
      return false
    }
  },
}

export const todoAPI = {
  async getTodos() {
    try {
      const q = query(collection(db, 'todos'), orderBy('timestamp', 'desc'))
      const querySnapshot = await getDocs(q)
      const todos: ITodo[] = []
      querySnapshot.forEach((d) => {
        const data = d.data() as Omit<ITodo, 'id'>
        todos.push({ ...data, id: d.id })
      })
      return { todos }
    } catch (e) {
      console.log(e)
      return { todos: [] }
    }
  },
  async createTodo(data: Omit<ITodo, 'id' | 'timestamp'>) {
    try {
      const docRef = await addDoc(collection(db, 'todos'), {
        ...data,
        timestamp: serverTimestamp()
      })
      return docRef.id
    } catch (e) {
      console.log(e)
      return null
    }
  },
  async updateTodo(data: ITodo) {
    try {
      const { id, attach, ...rest } = data
      await updateDoc(doc(db, 'todos', id), rest)
      return true
    } catch (e) {
      console.log(e)
      return false
    }
  },
  async deleteTodo(id: string) {
    try {
      await deleteDoc(doc(db, 'todos', id))
      return true
    } catch (e) {
      console.log(e)
      return false
    }
  },
}

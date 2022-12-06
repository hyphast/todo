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
  updateDoc,
} from 'firebase/firestore'
import { db, storage } from './firebase'
import { ITodo } from '../reducer'

type UploadFileReturn = {
  name: string
  url: string
}

export const storageAPI = {
  async uploadFile(file: File): Promise<UploadFileReturn> {
    return new Promise((resolve, reject) => {
      const storageRef = ref(storage, `files/${file.name}`)
      const uploadTask = uploadBytesResumable(storageRef, file)

      uploadTask.on(
        'state_changed',
        () => {},
        (error) => {
          reject(error)
        },
        () => {
          getBlob(uploadTask.snapshot.ref).then((blob) => {
            const url = window.URL.createObjectURL(blob)
            resolve({ name: uploadTask.snapshot.ref.name, url })
          })
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
      const querySnapshot = await getDocs(collection(db, 'todos'))
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
  async createTodo(data: Omit<ITodo, 'id'>) {
    try {
      const docRef = await addDoc(collection(db, 'todos'), data)
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

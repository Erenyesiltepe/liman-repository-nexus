export interface IKey {
  id: string
  created_at: string
  updated_at: string
  deleted_at: any
  name: string
  content: string
}

export interface IKeyCreate {
  name: string
  content: string
}

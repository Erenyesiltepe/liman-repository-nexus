export interface IRepository {
  id: string
  created_at: string
  updated_at: string
  deleted_at: any
  path: string
  url: string
  repository_name: string
  repository_type: string
  status: boolean
  format: string
  distribution: string
  component: string
  package_count: number
  size: number
}

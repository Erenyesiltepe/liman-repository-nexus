export interface IRepository {
  id: string
  created_at: number
  updated_at: number
  deleted_at: number
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
  available_size: number
  public_key: string
}

export interface ICreateRepository {
  path: string
  repository_name: string
  url: string
  distribution: string
  component: string
  repository_type: string
  public_key: string
}

export interface IPackage {
  name: string
  size: number
  mod_time: string
}

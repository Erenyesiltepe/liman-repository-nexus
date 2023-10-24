import type { IKey } from "@/models/Key"

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
  format: "deb" | "rpm"
  distribution: string
  component: string
  package_count: number
  size: number
  available_size: number
  key: IKey
  key_id: string | null
  latest_sync_status: string
}

export interface ICreateRepository {
  path: string
  repository_name: string
  url: string
  distribution: string
  component: string
  repository_type: string
  key_id: string | null
  format: "deb" | "rpm"
}

export interface IPackage {
  name: string
  size: number
  mod_time: string
}

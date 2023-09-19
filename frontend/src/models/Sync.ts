import type { IRepository } from "./Repository"

export interface ISync {
  id: string
  created_at: string
  updated_at: string
  deleted_at: any
  interval: number
  repository_id: string
  repository: IRepository
  is_active: boolean
  is_one_time: boolean
  run_time: string
  latest_success_sync: number
  latest_error_sync: number
  latest_sync_start_time: number
  latest_sync_end_time: number
  latest_sync_status: string
  latest_error_message: string
}

export interface ICreateSync {
  interval: number
  repository_id: string | null
  run_time: string
  is_one_time: boolean
}

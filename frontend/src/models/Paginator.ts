import type { IData } from "./Data"

export interface IPaginator {
  current_page: number
  records: IData[]
  total_pages: number
  total_records: number
}

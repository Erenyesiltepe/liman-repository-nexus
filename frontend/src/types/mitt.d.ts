// in src/typings/mitt.d.ts
import { Emitter } from "mitt"

declare module "@vue/runtime-core" {
  export interface ComponentCustomProperties {
    emitter: Emitter<any>
  }
}

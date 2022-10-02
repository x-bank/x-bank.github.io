import { proxy } from 'valtio'

export const assetStore = proxy({})
export const addressStore = proxy({address: undefined})
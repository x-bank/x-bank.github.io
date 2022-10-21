import { proxy } from 'valtio'

const assetStore = proxy({})

export {
    assetStore,
}
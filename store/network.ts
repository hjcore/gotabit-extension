import type { ChainConfig, GotaBitConfig } from "@gotabit/wallet-core"
import { DEFAULT_NETWORK_LIST } from "constants/network"

import { BaseStore } from "./base"

interface NetworkStoreData {
  chainName: string
  config: ChainConfig
  networkList: GotaBitConfig[]
}

export const NetworkStore = new BaseStore<NetworkStoreData>("NetworkData")

NetworkStore.set({
  networkList: DEFAULT_NETWORK_LIST
})

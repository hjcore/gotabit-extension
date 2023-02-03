import { GotaBitConfig, getChainConfig } from "@gotabit/wallet-core"
import { NetworkStore } from "store/network"

const getChainNotFoundError = (chainName: string) =>
  `The ${chainName} chain is not exist.`

export class NetworkManager {
  static async isChainExist(chainName: string) {
    const { networkList } = await NetworkStore.get()

    return !!networkList.find((_) => _.chainName === chainName)
  }

  static async set(chainName: string) {
    const { networkList, chainName: currentChainName } =
      await NetworkStore.get()

    if (chainName === currentChainName) return
    const networkConfig = networkList.find((_) => _.chainName === chainName)

    if (!networkConfig) {
      throw new Error(getChainNotFoundError(chainName))
    }
    await NetworkStore.set({
      chainName,
      config: getChainConfig(networkConfig)
    })
  }

  static async get(chainName?: string) {
    const { networkList, config } = await NetworkStore.get()

    const networkConfig = chainName
      ? networkList.find((_) => _.chainName === chainName)
      : config

    if (!networkConfig) {
      throw new Error(getChainNotFoundError(chainName as string))
    }

    return getChainConfig(networkConfig)
  }

  static async add(config: GotaBitConfig) {
    const { networkList } = await NetworkStore.get()
    const networkConfig = networkList.find(
      (_) => _.chainName === config.chainName
    )

    if (networkConfig) {
      throw new Error(`The ${networkConfig.chainName} chain is already exist.`)
    }
    await NetworkStore.set({
      networkList: [...networkList, config]
    })
  }

  static async remove(config: GotaBitConfig) {
    const { networkList } = await NetworkStore.get()

    const newNetworkList = networkList.filter(
      (_) => _.chainName === config.chainName
    )

    await NetworkStore.set({
      networkList: newNetworkList
    })
  }
}

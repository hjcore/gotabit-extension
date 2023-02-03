import { AddressBookStore, AddressItem } from "store/addressBook"

import { NetworkManager } from "./network"

async function findAddressBookData(
  addressItem: AddressItem,
  chainName?: string
) {
  const { chainName: currentChainName } = await NetworkManager.get()
  const addressBook = await AddressBookStore.get()
  const _chainName = chainName ?? currentChainName
  const addressList = addressBook[_chainName]
  const isExist = !!addressList.find((_) => _.name === addressItem.name)

  return {
    addressList,
    isExist,
    chainName: _chainName
  }
}

export class AddressBookManager {
  static async add(addressItem: AddressItem, chainName?: string) {
    const {
      addressList,
      isExist,
      chainName: _chainName
    } = await findAddressBookData(addressItem, chainName)

    if (isExist) {
      throw new Error(`The ${addressItem.name} is already exist.`)
    }

    await AddressBookStore.set({
      [_chainName]: [...addressList, addressItem]
    })
  }

  static async update(addressItem: AddressItem, chainName?: string) {
    const {
      addressList,
      isExist,
      chainName: _chainName
    } = await findAddressBookData(addressItem, chainName)

    if (!isExist) {
      throw new Error(`The ${addressItem.name} is not exist.`)
    }

    await AddressBookStore.set({
      [_chainName]: [
        ...addressList.map((_) =>
          _.name === addressItem.name ? addressItem : _
        )
      ]
    })
  }

  static async remove(addressItem: AddressItem, chainName?: string) {
    const { addressList, chainName: _chainName } = await findAddressBookData(
      addressItem,
      chainName
    )

    await AddressBookStore.set({
      [_chainName]: [...addressList.filter((_) => _.name === addressItem.name)]
    })
  }
}

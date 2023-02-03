import { BaseStore } from "./base"

export interface AddressItem {
  name: string
  address: string
  memo?: string
}

export type AddressBookStoreData = {
  [key in string]: Array<AddressItem>
}

export const AddressBookStore = new BaseStore<AddressBookStoreData>(
  "AddressBookData"
)

AddressBookStore.set({})

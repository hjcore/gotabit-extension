import { WalletStatusEnum } from "~constants/status"

import { BaseStore } from "./base"
import { EncryptBaseStore } from "./encryptBase"

export interface AccountInfo {
  name: string
  mnemonic: string
  account: string
  pubKey: string
  privateKey: string
  path?: string
}

export interface AccountStoreData {
  accountList: AccountInfo[]
  currentAccount: AccountInfo
  walletStatus: WalletStatusEnum
}

export const AccountEncryptStore = new EncryptBaseStore<AccountStoreData>(
  "AccountEncryptData"
)

export const AccountStore = new BaseStore<AccountStoreData>("AccountData")
AccountStore.set({
  walletStatus: WalletStatusEnum.Empty
})

import { action, computed, flow, makeObservable, observable } from "mobx";
import { fromUtf8 } from "@cosmjs/encoding"
import { LocalWallet } from "@gotabit/wallet-local"
import {
  AccountEncryptStore,
  AccountInfo,
  AccountStore,
  AccountStoreData
} from "store/account"

import { DEFAULT_NETWORK } from "../constants/network"
import { NetworkManager } from "./network"
import { WalletStatusEnum } from "~constants/status";

function getNowSeconds() {
  return Math.floor(Date.now() / 1000)
}

async function getAccount(accountParams: AccountArguments, password: string) {
  const { name, path, from, key } = accountParams

  const wallet =
    from === "mnemonic"
      ? await LocalWallet.init({ mnemonic: key, password, path })
      : await LocalWallet.init({ privateKey: key, password, path })

  const [account] = await wallet.getAccounts()
  const privKey = await wallet.getPrivateKey()

  return {
    name,
    account: account.address,
    mnemonic: key,
    privateKey: privKey,
    pubKey: fromUtf8(account.pubkey),
    path
  }
}

async function persistAccountData(
  accountData: AccountStoreData,
  password: string
) {
  await AccountEncryptStore.set(accountData, password)
  await AccountStore.set(accountData)
}

// 1d, unit seconds
// const CACHE_DURATION = 24 * 60 * 60

interface AccountArguments {
  name: string
  path?: string
  from?: "mnemonic" | "privateKey"
  key: string
}

export class AccountManager {
  @observable
  public isLocked: boolean

  @observable
  private lastUnlockTime: number

  @observable
  public accountList: AccountInfo[]

  @observable
  public accountInfo: AccountInfo

  @observable
  public account: string

  constructor(private password: Null<string>, accountList: AccountInfo[], accountInfo: AccountInfo) {
    makeObservable(this)
    if (!password) throw new Error("Invalid password!")
    this.isLocked = false
    this.lastUnlockTime = getNowSeconds()
    this.accountList = accountList
    this.accountInfo = accountInfo
  }

  @action
  public lock() {
    this.password = null
    this.isLocked = true
    AccountStore.set({
      accountList: [],
      currentAccount: undefined,
      walletStatus: WalletStatusEnum.Locked
    })
  }

  @action
  public async unlock(password: string) {
    this.password = password
    this.isLocked = false
    this.lastUnlockTime = getNowSeconds()

    const store = await AccountEncryptStore.get(password)
    AccountStore.set({
      ...store,
      walletStatus: WalletStatusEnum.Unlocked
    })
  }

  static async generateMnemonic(length: 12 | 24 = 12) {
    const wallet = await LocalWallet.init({ walletGenerateLength: length })
    const mnemonic = wallet.getMnemonic()

    return mnemonic
  }

  // The first time you create or import your wallet with setting a password
  static async initWallet(accountParams: AccountArguments, password: string) {
    const newAccount = await getAccount(accountParams, password)

    const accountData: AccountStoreData = {
      accountList: [newAccount],
      currentAccount: newAccount,
      walletStatus: WalletStatusEnum.Unlocked
    }

    await persistAccountData(accountData, password)

    NetworkManager.set(DEFAULT_NETWORK)

    return new AccountManager(password, [newAccount], newAccount)
  }

  // add account when you already init your wallet with password
  @action
  async addAccount(accountParams: AccountArguments) {
    if (!this.password) {
      throw new Error("Please unlock account first.")
    }
    const { name } = accountParams

    const { accountList } = await AccountStore.get("accountList")

    if (accountList.find((_) => _.name === name))
      throw new Error("The account name is already exist!")

    const newAccount = await getAccount(accountParams, this.password)

    const accountData: AccountStoreData = {
      accountList: [...accountList, newAccount],
      currentAccount: newAccount,
      walletStatus: WalletStatusEnum.Unlocked,
    }

    await persistAccountData(accountData, this.password)
  }

  @action
  async remove(accountName: string) {
    const { accountList } = await AccountStore.get("accountList")

    const newAccountList = accountList.filter((_) => _.name !== accountName)

    if (newAccountList.length && this.password) {
      const accountData: AccountStoreData = {
        accountList: newAccountList,
        currentAccount: newAccountList[0],
        walletStatus: WalletStatusEnum.Unlocked
      }

      await persistAccountData(accountData, this.password)
    } else {
      AccountStore.clear()
    }
  }

  @action
  async changeName(oldName: string, newName: string) {
    if (!this.password) return

    const { accountList } = await AccountStore.get()

    let newAccount: AccountInfo | undefined

    const newAccountList = accountList.map((_) => {
      if (_.name === oldName) {
        newAccount = { ..._, name: newName }

        return newAccount
      }

      return _
    })

    if (!newAccount) {
      throw new Error("The old name is not found!")
    }

    const accountData: AccountStoreData = {
      accountList: newAccountList,
      currentAccount: newAccount,
      walletStatus: WalletStatusEnum.Unlocked,
    }

    await persistAccountData(accountData, this.password)
  }
}

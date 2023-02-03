import { GotabitClient } from "@gotabit/client"
import { createMsgSend } from "@gotabit/messages"
import type { ConfigType } from "@gotabit/wallet-core"
import { LocalWallet } from "@gotabit/wallet-local"
import { AccountStore } from "store/account"
import { formatAmount } from "utils/format"

import { BrowserNotification } from "../notification"

export class Tx {
  public client: GotabitClient

  public wallet: LocalWallet

  constructor(client: GotabitClient, wallet: LocalWallet) {
    this.client = client
    this.wallet = wallet
  }

  static async init(chain: ConfigType) {
    const { currentAccount } = await AccountStore.get()

    const { privateKey } = currentAccount

    const wallet = await LocalWallet.init({
      privateKey
    })

    const client = await GotabitClient.init(wallet, chain)

    return new Tx(client, wallet)
  }

  async sendGtb({
    from,
    to,
    amount,
    fee,
    memo
  }: {
    from: string
    to: string
    amount: string
    fee: number
    memo?: string
  }) {
    const msgSendToken = createMsgSend(from, to, formatAmount(amount), "ugtb")

    const signStargateClient = await this.client.signStargateClient()

    BrowserNotification.tx("pending")
    const result = await signStargateClient
      .signAndBroadcast(from, [msgSendToken], fee, memo)
      .catch((e: Error) => {
        BrowserNotification.tx("error", e.message)
      })

    result && result.transactionHash && BrowserNotification.tx("success")

    return result
  }

  async sendToken({
    from,
    to,
    amount,
    fee,
    memo,
    token
  }: {
    from: string
    to: string
    amount: string
    token: Cw20Token
    fee: number
    memo?: string
  }) {
    const signWasmClient = await this.client.signWasmClient()

    BrowserNotification.tx("pending")
    const result = await signWasmClient
      .execute(
        from,
        token.token,
        {
          transfer: {
            recipient: to,
            amount: formatAmount(amount, token.decimals)
          }
        },
        fee,
        memo
      )
      .catch((e: Error) => {
        BrowserNotification.tx("error", e.message)
      })

    result && result.transactionHash && BrowserNotification.tx("success")

    return result
  }

  async signMsg() {}
}

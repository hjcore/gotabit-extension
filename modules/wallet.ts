import { action, computed, flow, makeObservable, observable } from "mobx";
import { GotabitClient } from '@gotabit/client'
import { NetworkStore } from "~store/network";

export class WalletManager {
  @observable
  public account: string

  @observable
  public native_balance: string

  @observable
  tokens: Cw20Token[]

  constructor() {
    makeObservable(this)
  }

  public async queryNativeBalance() {
    const network = await NetworkStore.get()
    const client = await GotabitClient.init(null, network.config)
    const stargateClient = await client.stargateClient()

    const balance = await stargateClient.getBalance(
      this.account,
      network.config.coinMinimalDenom
    )

    return balance
  }

  public async queryTokenBalance() {
    const network = await NetworkStore.get()
    const client = await GotabitClient.init(null, network.config)
    const wasmClient = await client.wasmClient()

    const tokensBalances: Array<TokenWrapper<TokenWrapper<Cw20Token>>> = []

    for (let i = 0; i < this.tokens.length; i++) {
      const token = this.tokens[i] as Cw20Token
      const tokenBalance = await wasmClient
        .queryContractSmart(token.token, {
          balance: {
            address: token.token,
          },
        })
        .catch(console.error)

      tokensBalances.push({
        ...token,
        tokenType: 'cw20',
        balance: tokenBalance?.balance ?? '',
      })
    }

    return tokensBalances
  }
}
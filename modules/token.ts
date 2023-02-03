import { action, computed, flow, makeObservable, observable } from "mobx";
import { GotabitClient } from '@gotabit/client'
import { NetworkStore } from "~store/network";

import { TokenStore } from "store/token"

import { NetworkManager } from "./network"

 async function queryTokenBalance(tokens: TokenWrapper<Token>[]) {
  const network = await NetworkStore.get()
  const client = await GotabitClient.init(null, network.config)
  const wasmClient = await client.wasmClient()

  const tokensBalances: Array<TokenWrapper<Cw20Token>> = []

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i] as Cw20Token
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

export class TokenManager {
  @observable
  public chainName: string

  @observable
  tokensMap: {[x: string]: TokenWrapper<Token>[]}

  @computed
  get tokens(): TokenWrapper<Token>[]  {
    return this.tokensMap[this.chainName] ?? []
  }

  constructor(tokensMap: {[x: string]: TokenWrapper<Token>[]}, chainName: string) {
    makeObservable(this)
    this.tokensMap = tokensMap
    this.chainName = chainName
  }

  static async init(chainName?: string) {
    const { tokensMap } = await TokenStore.get()
    const chainConfig = await NetworkManager.get()
    const _chainName = chainName ?? chainConfig.chainName
    const newTokens = await queryTokenBalance(tokensMap[_chainName])

    tokensMap[_chainName] = newTokens
    await TokenStore.set(tokensMap)

    return new TokenManager(tokensMap, _chainName)
  }

  @action
  async setChainName(chainName: string) {
    this.chainName = chainName
  }

  @action
  async refreshTokens() {
    const newTokens = await queryTokenBalance(this.tokensMap[this.chainName])

    this.tokensMap[this.chainName] = newTokens
    await TokenStore.set(this.tokensMap)
  }

  async getToken(name: string) {

    return this.tokens.find((_) => _.name === name)
  }

  @action
  async addToken(token: TokenWrapper<Token>, chainName?: string) {
    if (chainName) {
      const isChainValid = await NetworkManager.isChainExist(chainName)

      if (!isChainValid) throw new Error("Invalid chain name")
    }
    const { tokensMap } = await TokenStore.get()
    const chainConfig = await NetworkManager.get(chainName)
    const tokens = tokensMap[chainConfig.chainName]

    if (tokens.find((_) => _.name === token.name)) return

    const _tokensMap = { ...tokensMap, [chainConfig.chainName]: [...tokens, token] }
    TokenStore.set({
      tokensMap: _tokensMap,
    })

    this.tokensMap = _tokensMap
  }
}

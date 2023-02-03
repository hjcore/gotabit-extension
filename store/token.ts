import { BaseStore } from "./base"

interface TokenStoreData {
  tokensMap: { [key in string]: TokenWrapper[] }
}

export const TokenStore = new BaseStore<TokenStoreData>("TokenData")

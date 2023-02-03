type TokenType = 'cw20' | 'native' | 'ibc' | 'cw721'

interface Token {
  protocol?: string
  symbol: string
  name: string
  token?: string
  icon: string
  base_denom?: string
  path?: string
  denom?: string
  decimals: number
}

interface Cw20Token {
  protocol: string
  symbol: string
  name: string
  token: string
  icon: string
  decimals: number
}

interface IbcToken {
  symbol: string
  name: string
  icon: string
  base_denom: string
  path: string
  denom: string
  decimals: number
}

type TokenWrapper<T = Token> = {
  tokenType: TokenType
  balance: {
    amount: string
    denom: string
  }
} & T

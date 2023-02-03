import { Decimal } from 'decimal.js'

const AMOUNT_PLACEHOLDER = '--'

export function formatAmount(amount: string, decimals = 6) {
  if (isNaN(Number(amount)) || amount === '') return AMOUNT_PLACEHOLDER
  Decimal.config({ rounding: Decimal.ROUND_DOWN })

  return new Decimal(amount)
    .dividedBy(10 ** decimals)
    .toDecimalPlaces(6)
    .toString()
}

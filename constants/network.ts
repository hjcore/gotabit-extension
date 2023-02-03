import { MAIN_CONFIG, DEV_CONFIG, TEST_CONFIG } from '@gotabit/wallet-core'

export const DEFAULT_NETWORK_LIST = [MAIN_CONFIG, TEST_CONFIG, DEV_CONFIG]

// TODO: update to main before go to production
export const DEFAULT_NETWORK = MAIN_CONFIG.chainName

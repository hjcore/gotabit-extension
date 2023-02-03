import browser from 'webextension-polyfill'

export class BrowserNotification {
  static async tx(type: 'pending' | 'success' | 'error', errorMsg?: string) {
    const getTxDesc = () => {
      switch (type) {
        case 'pending':
          return {
            title: 'Tx is pending',
            content: 'Wait a second',
          }
        case 'success':
          return {
            title: 'Tx succeeds',
            content: 'Congratulations!',
          }
        case 'error':
          return {
            title: 'Tx failed',
            content: errorMsg ?? '',
          }
      }
    }
    const txDesc = getTxDesc()

    await browser.notifications.create({
      iconUrl: 'favicon.svg',
      type: 'basic',
      title: txDesc.title,
      message: txDesc.content,
    })
  }
}

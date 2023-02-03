;(window as any).gotabit = {
  sendTransaction: (
    password: string,
    address: string,
    transactionData: any,
    granter?: string
  ) =>
    new Promise((resolve, reject) => {
      // Trigger background script to open chrome extension
      window.postMessage(
        {
          target: "Gotabit extension",
          event: "sendTransaction",
          data: {
            password,
            address,
            transactionData,
            granter
          }
        },
        window.location.origin
      )

      // Receive broadcast when transaction is done
      const channel = new BroadcastChannel("gotabit")
      const listener = async (e: any) => {
        if (e.data.event === "transactionSuccess") {
          resolve(e.data.data)
        }
        if (e.data.event === "transactionFail") {
          reject(e.data.data)
        }
        channel.removeEventListener("message", listener)
      }

      channel.addEventListener("message", listener)
    })
}

console.log("===========", "send transaction")

export {}

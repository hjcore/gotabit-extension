import browser from "webextension-polyfill"

function WalletPage() {
  const handleAddAccount = () => {
    browser.tabs.create({
      url: "/index.html#/register"
    })
  }

  return (
    <div>
      <p>Wallet page</p>
      <button onClick={handleAddAccount}>Add account</button>
    </div>
  )
}

export default WalletPage

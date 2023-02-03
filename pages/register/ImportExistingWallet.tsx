import Button from "@mui/material/Button"
import Input from "@mui/material/Input"
import { AccountManager } from "modules/account"
import { useState } from "react"

import { useRegister } from "~hooks/useRegister"

const test_mnemonic =
  "dinner proud piano mention silk plunge forest fold trial duck electric define"

function RegisterPage() {
  const [accountName, setAccountName] = useState<string>()

  const registerManager = useRegister()
  const handleImport = async () => {
    await AccountManager.initWallet(
      {
        name: accountName,
        from: "mnemonic",
        key: test_mnemonic
      },
      "123456"
    )
  }

  return (
    <div>
      <Input onChange={(e) => setAccountName(e.target.value)} />
      <Button variant="contained" onClick={handleImport}>
        Next
      </Button>
      <span onClick={() => registerManager.setType("google")}>back</span>
    </div>
  )
}

export default RegisterPage

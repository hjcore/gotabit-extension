import Button from "@mui/material/Button"
import { observer } from "mobx-react-lite"

import { useRegister } from "~hooks/useRegister"

import ImportExistingWallet from "./ImportExistingWallet"

const test_mnemonic =
  "dinner proud piano mention silk plunge forest fold trial duck electric define"

const RegisterPage = observer(() => {
  const registerManager = useRegister()

  return (
    <div>
      {registerManager.type === "register" && (
        <div>
          <Button
            variant="contained"
            onClick={() => registerManager.setType("import")}>
            import existing account
          </Button>
          <Button
            variant="contained"
            onClick={() => registerManager.setType("create")}>
            create new account
          </Button>
        </div>
      )}
      {registerManager.type === "import" && <ImportExistingWallet />}
    </div>
  )
})

export default RegisterPage

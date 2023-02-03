import RegisterPage from "pages/register"
import WalletPage from "pages/wallet"
import { Route, Routes } from "react-router-dom"

const ROUTES = [
  {
    path: "/",
    key: "ROOT",
    component: <WalletPage />
  },
  {
    path: "/register",
    key: "Register",
    exact: true,
    component: <RegisterPage />
  }
]

const AppRoutes = () => {
  return (
    <Routes>
      {ROUTES.map((route) => (
        <Route key={route.key} element={route.component} path={route.path} />
      ))}
    </Routes>
  )
}

export default AppRoutes

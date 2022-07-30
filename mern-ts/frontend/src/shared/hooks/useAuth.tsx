import { useCallback, useEffect, useState } from "react"

let logoutTimer: NodeJS.Timeout

const useAuth = () => {
  const [token, setToken] = useState<string>()
  const [userId, setUserId] = useState("")
  const [tokenExpDate, setTokenExpDate] = useState<Date>()

  const login = useCallback((uid: string, token: string, expDate?: Date) => {
    setToken(token)
    setUserId(uid)

    const tokenExpDate =
      expDate || new Date(new Date().getTime() + 1000 * 60 * 60)
    setTokenExpDate(tokenExpDate)
    localStorage.setItem(
      "userData",
      JSON.stringify({
        userId: uid,
        token,
        expiration: tokenExpDate.toISOString(),
      })
    )
  }, [])
  const logout = useCallback(() => {
    setToken("")
    setUserId("")
    setTokenExpDate(undefined)
    localStorage.removeItem("userData")
  }, [])

  useEffect(() => {
    const localData = JSON.parse(localStorage.getItem("userData")!)
    if (
      localData &&
      localData.token &&
      new Date(localData.expDate!) > new Date()
    )
      login(localData.userId, localData.token, new Date(localData.expDate!))
  }, [login])

  useEffect(() => {
    if (token && tokenExpDate) {
      const timeLeft = tokenExpDate.getTime() - new Date().getTime()
      logoutTimer = setTimeout(logout, timeLeft)
    } else {
      clearTimeout(logoutTimer)
    }
  }, [token, tokenExpDate, logout])

  return {
    login,
    logout,
    token,
    userId,
  }
}

export default useAuth

import { useCallback, useEffect, useRef, useState } from "react"

const useHttp = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const activeHttpRequests = useRef<AbortController[]>([])

  const sendRequest = useCallback(
    async (
      url: string,
      method = "GET",
      body: any = null,
      headers: any = {}
    ) => {
      setIsLoading(true)
      const currentController = new AbortController()
      activeHttpRequests.current.push(currentController)

      try {
        const res = await fetch(url, {
          method,
          body,
          headers,
          signal: currentController.signal,
        })
        const data = await res.json()

        activeHttpRequests.current = activeHttpRequests.current.filter(
          (controller) => controller !== currentController
        )

        if (!res.ok) {
          throw new Error(data.message!)
        }
        setIsLoading(false)
        return data
      } catch (error: any) {
        setIsLoading(false)
        setError(error.message || "Something went wrong")
        throw error
      }
    },
    []
  )

  useEffect(() => {
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      activeHttpRequests.current.forEach((controller) => controller.abort())
    }
  }, [])

  const clearError = useCallback(() => {
    setError("")
  }, [])

  return { isLoading, error, sendRequest, clearError }
}

export default useHttp

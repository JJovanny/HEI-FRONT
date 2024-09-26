import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useSelector } from 'src/redux/hooks'
import Routing from 'src/routing'

export default function HomePage () {
  const router = useRouter()
  const { accessToken, adminAccessToken } = useSelector(({ UserReducer, AdminUserReducer }) => {
    const { accessToken }: {accessToken: string} = UserReducer
    const adminAccessToken: string = AdminUserReducer?.accessToken

    return { accessToken, adminAccessToken }
  })

  useEffect(() => {
    if (!accessToken) {
      if (window.location.pathname === '/admin/login') router.push(Routing.adminLogin)
      else router.push(Routing.login)
    }
    if (accessToken) {
      if (window.location.pathname === '/') router.push(Routing.dashboard)
      if (window.location.pathname !== router.pathname) {
        router.push(`${window.location.pathname}`)
      }
    }
    if (adminAccessToken) {
      if (window.location.pathname === '/') router.push(Routing.adminOnboardingProfiles)
      if (window.location.pathname !== router.pathname) {
        router.push(`${window.location.pathname}`)
      }
    }
  }, [accessToken, router])
}

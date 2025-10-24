import type { PropsWithChildren } from 'react'
import AppRoutes from '../routes'

function Providers({ children }: PropsWithChildren) {
  return <>{children}</>
}

export default function App() {
  return (
    <Providers>
      <AppRoutes />
    </Providers>
  )
}

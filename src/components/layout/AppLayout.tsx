import { Outlet } from 'react-router-dom'
import { Header } from './Header'

export function AppLayout() {
  return (
    <>
      <Header />
      <main className="pt-16.5 min-h-screen">
        <div className="max-w-content mx-auto px-4 lg:px-7 py-8">
          <Outlet />
        </div>
      </main>
    </>
  )
}

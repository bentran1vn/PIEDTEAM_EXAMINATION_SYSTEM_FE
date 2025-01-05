import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import { AppContext } from './context/app.context'
import { Suspense, lazy, useContext } from 'react'
import path from 'src/constant/path'
import Home from 'src/pages/Home'
import ExamphaseDetail from 'src/pages/ExamphaseDetail'

function ProtectedRoute() {
  const { isAuthenticated } = useContext(AppContext)
  return isAuthenticated ? <Outlet /> : <Navigate to='/' />
}

function RejectedRoute() {
  const { isAuthenticated, user } = useContext(AppContext)
  return !isAuthenticated ? (
    <Outlet />
  ) : user?.Role == 'Employee' ? (
    <Navigate to={path.schedule} />
  ) : (
    <Navigate to={path.examphase} />
  )
}

const Login = lazy(() => import('./pages/Login'))
const NotFound = lazy(() => import('./pages/NotFound'))
const LoginLayout = lazy(() => import('./layouts/LoginLayout'))

export default function useRouteElements() {
  const routeElements = useRoutes([
    {
      path: '',
      element: <ProtectedRoute />,
      children: [
        {
          index: true,
          path: path.examphase,
          element: <Home />
        },
        {
          path: path.examphaseDetail,
          element: <ExamphaseDetail />
        }
      ]
    },
    {
      path: '',
      element: <RejectedRoute />,
      children: [
        {
          path: path.login,
          index: true,
          element: (
            <LoginLayout>
              <Suspense>
                <Login />
              </Suspense>
            </LoginLayout>
          )
        }
      ]
    },
    {
      path: '*',
      element: (
        <Suspense>
          <NotFound />
        </Suspense>
      )
    }
  ])
  return routeElements
}

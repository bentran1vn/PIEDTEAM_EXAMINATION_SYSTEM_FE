import { useContext, useEffect } from 'react'
import { ToastContainer } from 'react-toastify'
import { AppContext } from 'src/context/app.context'
import useRouteElements from 'src/useRouteElement'
import { localStorageEventTarget } from 'src/utils/auth'
import 'react-toastify/dist/ReactToastify.css'
import { NextUIProvider } from '@nextui-org/react'

function App() {
  const routeElements = useRouteElements()
  const { reset } = useContext(AppContext)

  useEffect(() => {
    localStorageEventTarget.addEventListener('clearLS', reset)
    return () => {
      localStorageEventTarget.removeEventListener('clearLS', reset)
    }
  }, [reset])

  return (
    <>
      <NextUIProvider>
        <div>{routeElements}</div>
        <ToastContainer />
      </NextUIProvider>
    </>
  )
}

export default App

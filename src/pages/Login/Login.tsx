import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Input } from '@nextui-org/react'
import { useMutation } from '@tanstack/react-query'
import { Typography } from 'antd'
import { useContext, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import authApi from 'src/apis/authenticate.api'
// import path from 'src/constant/path'
import { AppContext } from 'src/context/app.context'
// import { ErrorResponse } from 'src/types/utils.type'
import { loginSchema, LoginSchema } from 'src/utils/rules'
// import { isAxiosUnprocessableEntityError } from 'src/utils/utils'
import { jwtDecode, type JwtPayload } from 'jwt-decode'
import { Role } from 'src/types/employee.type'
import { toast } from 'react-toastify'

export interface CustomJwtPayload extends JwtPayload {
  Role?: Role
  exp?: number
  UserId?: string
}

const { Title } = Typography

type FormData = Pick<LoginSchema, 'emailOrUserName' | 'password'>
const schema = loginSchema.pick(['emailOrUserName', 'password'])

export default function Login() {
  const { setIsAuthenticated, setUser } = useContext(AppContext)
  const [isLoading, setIsLoading] = useState(false)
  // const navigate = useNavigate()
  const {
    handleSubmit,
    control,
    // setError,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      emailOrUserName: '',
      password: ''
    },
    resolver: yupResolver(schema)
  })

  console.log(errors)

  const loginAccountMutation = useMutation({
    mutationFn: (body: { email: string; password: string }) => authApi.loginAccount(body)
  })

  const onSubmit = handleSubmit((data) => {
    setIsLoading(true)
    loginAccountMutation.mutate(
      { email: data.emailOrUserName, password: data.password },
      {
        onSuccess: (data) => {
          setIsAuthenticated(true)
          try {
            const decoded = jwtDecode<CustomJwtPayload>(data.data.accessToken)
            console.log(decoded)
            setUser(decoded)
          } catch (error) {
            console.error('Failed to decode JWT', error)
          }
          setIsLoading(false)
          // navigate(path.dashboard)
          toast.success('Login Successfully !', { autoClose: 1000 })
          // if (data.data.data.employeeDto.roleName == 'Manager') {
          //   navigate(path.dashboard)
          // } else if (data.data.data.employeeDto.roleName == 'Admin') {
          //   navigate(path.approval)
          // } else if (data.data.data.employeeDto.roleName == 'Employee') {
          //   navigate(path.schedule)
          // }
        },
        onError: (_error) => {
          setIsLoading(false) // Reset loading state on error
          // if (isAxiosUnprocessableEntityError<ErrorResponse<LoginSchema>>(error)) {
          //   const formError = error.response?.data.data
          //   if (formError) {
          //     Object.keys(formError).forEach((key) => {
          //       setError(key as keyof LoginSchema, {
          //         message: formError[key as keyof LoginSchema],
          //         type: 'Server'
          //       })
          //     })
          //   }
          // }
          toast.error('Login Fail !', { autoClose: 1000 })
        }
      }
    )
  })

  return (
    <div className='relative min-h-screen flex items-center justify-center'>
      <div className='bg-white bg-opacity-90 p-6 rounded-lg shadow-lg w-full max-w-md h-auto py-10'>
        <div className=' mb-6'>
          <div className='text-left text-[35px] ml-5'>PIEDTEAM</div>
          <div className='text-right text-[40px] mr-5'>EXAMINATION</div>
        </div>
        <form onSubmit={onSubmit} className='space-y-7'>
          <div>
            <Title level={5}>Email</Title>
            <Controller
              control={control}
              name='emailOrUserName'
              render={({ field }) => (
                <Input
                  label='Your Meo'
                  radius='sm'
                  size='sm'
                  isRequired
                  className='w-full mb-3'
                  value={field.value || ''}
                  onChange={field.onChange}
                  errorMessage={errors.emailOrUserName?.message}
                  isDisabled={isLoading}
                />
              )}
            />
          </div>
          <div>
            <Title level={5}>Password</Title>
            <Controller
              control={control}
              name='password'
              render={({ field }) => (
                <Input
                  label='Password'
                  type='password'
                  radius='sm'
                  size='sm'
                  isRequired
                  className='w-full mb-3'
                  value={field.value || ''}
                  onChange={field.onChange}
                  errorMessage={errors.password?.message}
                  isDisabled={isLoading}
                />
              )}
            />
          </div>

          <Button aria-label='btn-login' type='submit' color='primary' className='w-full' isLoading={isLoading}>
            Login
          </Button>
        </form>
      </div>
    </div>
  )
}

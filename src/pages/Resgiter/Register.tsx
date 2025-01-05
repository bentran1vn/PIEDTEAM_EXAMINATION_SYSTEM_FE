import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Input } from '@nextui-org/react'
import { useMutation } from '@tanstack/react-query'
import Title from 'antd/es/typography/Title'
import { Controller, useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import authApi from 'src/apis/authenticate.api'
import path from 'src/constant/path'
import { loginSchema, LoginSchema } from 'src/utils/rules'

type FormData = Pick<LoginSchema, 'emailOrUserName' | 'password' | 'username'>
const schema = loginSchema.pick(['emailOrUserName', 'password', 'username'])

export default function Register() {
  const navigate = useNavigate()
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

  const registerAccountMutation = useMutation({
    mutationFn: (body: { email: string; username: string; password: string }) => authApi.registerAccount(body)
  })

  const onSubmit = handleSubmit((data) => {
    registerAccountMutation.mutate(
      { email: data.emailOrUserName, username: data.username, password: data.password },
      {
        onSuccess: (_data) => {
          toast.success('Register Successfully !', { autoClose: 1000 })
          navigate(path.login)
        },
        onError: (_error) => {
          toast.error('Login Fail !', { autoClose: 1000 })
        }
      }
    )
  })

  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='bg-white bg-opacity-90 p-6 rounded-lg shadow-lg w-full max-w-md h-auto py-10'>
        <div className=' mb-6'>
          <div className='text-left text-[35px] ml-5'>PIEDTEAM</div>
          <div className='text-right text-[40px] mr-5'>EXAMINATION</div>
        </div>
        <form onSubmit={onSubmit} className='space-y-5'>
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
                />
              )}
            />
          </div>
          <div>
            <Title level={5}>Name</Title>
            <Controller
              control={control}
              name='username'
              render={({ field }) => (
                <Input
                  label='Your User Nem'
                  radius='sm'
                  size='sm'
                  isRequired
                  className='w-full mb-3'
                  value={field.value || ''}
                  onChange={field.onChange}
                  errorMessage={errors.username?.message}
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
                />
              )}
            />
          </div>
          <Button
            aria-label='btn-login'
            type='submit'
            color='primary'
            className='w-full'
            isLoading={registerAccountMutation.isPending}
          >
            Register
          </Button>
          <div className='text-center'>
            <Link to={path.login} className='text-small underline'>
              Already has account ?
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

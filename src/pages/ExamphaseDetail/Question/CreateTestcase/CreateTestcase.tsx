import { yupResolver } from '@hookform/resolvers/yup'
import { QueryObserverResult, RefetchOptions, useMutation } from '@tanstack/react-query'
import { AxiosResponse } from 'axios'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import examphaseApi, { Testcase } from 'src/apis/examphase.api'
import { testCaseSchema, TestCaseSchema } from 'src/utils/rules'

interface Props {
  handleClose: () => void
  questionId: string
  refetchTestCase: (options?: RefetchOptions) => Promise<QueryObserverResult<AxiosResponse<Testcase[], any>, Error>>
}

type FormData = Pick<TestCaseSchema, 'questionId' | 'inputArray' | 'expectedValues'>
const schema = testCaseSchema.pick(['questionId', 'inputArray', 'expectedValues'])

export default function CreateTestcase({ handleClose, questionId, refetchTestCase }: Props) {
  const createExamphaseMutation = useMutation({
    mutationFn: examphaseApi.createTestCases,
    onError: (_) => {
      toast.error('Fail to create Examphase !', {
        autoClose: 500
      })
    },
    onSuccess: () => {
      toast.success('Create Examphase successfully !', {
        autoClose: 500
      })
      refetchTestCase()
      handleClose()
    }
  })
  const {
    handleSubmit,
    formState: { errors },
    control,
    reset
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      questionId: questionId,
      inputArray: '',
      expectedValues: ''
    }
  })

  const onSubmit = handleSubmit((data) => {
    createExamphaseMutation.mutate(data)
  })

  return (
    <div className='h-[45%] w-[50%] overflow-hidden overflow-y-scroll rounded-lg bg-white p-6 shadow-lg'>
      <div className='mb-2 flex items-center justify-between'>
        <div className='text-3xl font-medium text-gray-700'>Create TestCases</div>
        <button
          onClick={() => handleClose()}
          className='rounded-md bg-gray-200 px-4 py-2 text-gray-500 hover:bg-gray-300'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='h-6 w-6'
          >
            <path strokeLinecap='round' strokeLinejoin='round' d='M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3' />
          </svg>
        </button>
      </div>
      <form onSubmit={onSubmit}>
        <div className='my-4 border-b-2 pb-2'>
          <p className='font-semibold mb-2'>Expected Values:</p>
          <div>
            <Controller
              control={control}
              name='expectedValues'
              render={({ field }) => (
                <input
                  type='text'
                  className='mb-2 h-[30px] w-[100%] rounded-lg border border-gray-300 bg-gray-50 py-5 px-3 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500'
                  placeholder='Expected Values'
                  {...field}
                  onChange={field.onChange}
                  value={field.value}
                />
              )}
            />
          </div>
          {errors.expectedValues && <p className='text-sm text-red-500'>{errors.expectedValues.message}</p>}
        </div>
        <div className='my-4 border-b-2 pb-2'>
          <p className='font-semibold mb-2'>Input Array:</p>
          <div>
            <Controller
              control={control}
              name='inputArray'
              render={({ field }) => (
                <input
                  type='text'
                  className='mb-2 h-[30px] w-[100%] rounded-lg border border-gray-300 bg-gray-50 py-5 px-3 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500'
                  placeholder='Input Array'
                  {...field}
                  onChange={field.onChange}
                  value={field.value}
                />
              )}
            />
          </div>
          {errors.inputArray && <p className='text-sm text-red-500'>{errors.inputArray.message}</p>}
        </div>
        <div className='flex'>
          <button className='mr-3 rounded-lg bg-slate-400 px-6 py-2 text-white' type='submit'>
            Create
          </button>
          <button
            className='rounded-lg border border-slate-300 px-6 py-2'
            type='button'
            onClick={() => {
              reset({
                questionId: questionId,
                inputArray: '',
                expectedValues: ''
              })
            }}
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  )
}

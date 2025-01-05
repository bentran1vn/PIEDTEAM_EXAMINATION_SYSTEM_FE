import { yupResolver } from '@hookform/resolvers/yup'
import { QueryObserverResult, RefetchOptions, useMutation } from '@tanstack/react-query'
import { AxiosResponse } from 'axios'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import examphaseApi, { ExamphaseDetail } from 'src/apis/examphase.api'
import { questionSchema, QuestionSchema } from 'src/utils/rules'

interface Props {
  handleClose: () => void
  refetchExamphase: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<AxiosResponse<ExamphaseDetail, any>, Error>>
  examphaseId: string
}

type FormData = Pick<QuestionSchema, 'containInput' | 'examPhaseId' | 'point' | 'questionContent'>
const schema = questionSchema.pick(['containInput', 'examPhaseId', 'point', 'questionContent'])

const ContainInput = [
  {
    value: true,
    label: 'Yes'
  },
  {
    value: false,
    label: 'No'
  }
]

export default function CreateQuestion({ handleClose, refetchExamphase, examphaseId }: Props) {
  const createQuestionMutation = useMutation({
    mutationFn: examphaseApi.createQuestion,
    onError: (_) => {
      toast.error('Fail to create Examphase !', {
        autoClose: 500
      })
    },
    onSuccess: () => {
      toast.success('Create Examphase successfully !', {
        autoClose: 500
      })
      refetchExamphase()
      handleClose()
    }
  })
  const {
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    reset
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      questionContent: '',
      examPhaseId: examphaseId,
      point: '0',
      containInput: false
    }
  })

  const onSubmit = handleSubmit((data) => {
    createQuestionMutation.mutate(data)
  })

  return (
    <div className='h-[45%] w-[70%] overflow-hidden overflow-y-scroll rounded-lg bg-white p-6 shadow-lg'>
      <div className='mb-2 flex items-center justify-between'>
        <div className='text-3xl font-medium text-gray-700'>Create Question</div>
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
          <p className='font-semibold mb-2'>Content:</p>
          <div>
            <Controller
              control={control}
              name='questionContent'
              render={({ field }) => (
                <input
                  type='text'
                  className='mb-2 h-[30px] w-[100%] rounded-lg border border-gray-300 bg-gray-50 py-5 px-3 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500'
                  placeholder='Content of Question'
                  {...field}
                  onChange={field.onChange}
                  value={field.value}
                />
              )}
            />
          </div>
          {errors.questionContent && <p className='text-sm text-red-500'>{errors.questionContent.message}</p>}
        </div>
        <div className='my-4 border-b-2 pb-2'>
          <p className='font-semibold mb-2'>Point:</p>
          <div>
            <Controller
              control={control}
              name='point'
              render={({ field }) => (
                <input
                  type='text'
                  className='mb-2 h-[30px] w-[100%] rounded-lg border border-gray-300 bg-gray-50 py-5 px-3 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500'
                  placeholder='Point of Question'
                  {...field}
                  onChange={field.onChange}
                  value={field.value}
                />
              )}
            />
          </div>
          {errors.point && <p className='text-sm text-red-500'>{errors.point.message}</p>}
        </div>
        <div className='my-2 flex items-center border-b-2 py-4'>
          <div className='font-semibold'>Contain Input:</div>
          {ContainInput.map((domain, index) => (
            <div className='ps-4' key={index}>
              <Controller
                name='containInput'
                control={control}
                render={({ field }) => (
                  <>
                    <input
                      id={`radio-${domain.value}`}
                      type='radio'
                      checked={field.value === domain.value}
                      onChange={(_) => {
                        setValue('containInput', domain.value)
                      }}
                      className='h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-0 focus:outline-none dark:border-gray-600 dark:bg-gray-700'
                    />
                    <label
                      htmlFor={`radio-${domain.value}`}
                      className='ml-2 font-medium text-gray-900 dark:text-gray-300'
                    >
                      {domain.label}
                    </label>
                  </>
                )}
              />
            </div>
          ))}
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
                examPhaseId: examphaseId,
                questionContent: '',
                point: '0',
                containInput: false
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

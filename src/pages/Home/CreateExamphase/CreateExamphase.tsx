import { yupResolver } from '@hookform/resolvers/yup'
import { QueryObserverResult, RefetchOptions, useMutation } from '@tanstack/react-query'
import { AxiosResponse } from 'axios'
import { Controller, useForm } from 'react-hook-form'
import examphaseApi, { Examphase } from 'src/apis/examphase.api'
import { examphaseSchema, ExamphaseSchema } from 'src/utils/rules'
import { now, getLocalTimeZone } from '@internationalized/date'
import { DatePicker } from '@nextui-org/react'
import { toast } from 'react-toastify'

interface Props {
  handleClose: () => void
  refetchExamphases: (options?: RefetchOptions) => Promise<QueryObserverResult<AxiosResponse<Examphase[], any>, Error>>
}

type FormData = Pick<
  ExamphaseSchema,
  'code' | 'description' | 'duration' | 'endTime' | 'startTime' | 'isPrivate' | 'title' | 'totalPassRequire'
>
const schema = examphaseSchema.pick([
  'code',
  'description',
  'duration',
  'endTime',
  'startTime',
  'isPrivate',
  'title',
  'totalPassRequire'
])

const IsPrivate = [
  {
    value: true,
    label: 'Yes'
  },
  {
    value: false,
    label: 'No'
  }
]

export default function CreateExamphase({ handleClose, refetchExamphases }: Props) {
  const createExamphaseMutation = useMutation({
    mutationFn: examphaseApi.createExamphase,
    onError: (_) => {
      toast.error('Fail to create Examphase !', {
        autoClose: 500
      })
    },
    onSuccess: () => {
      toast.success('Create Examphase successfully !', {
        autoClose: 500
      })
      refetchExamphases()
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
      title: '',
      code: '',
      description: '',
      duration: 0,
      startTime: '',
      endTime: '',
      isPrivate: false
    }
  })

  const onSubmit = handleSubmit((data) => {
    createExamphaseMutation.mutate(data)
  })

  return (
    <div className='h-[90%] w-[70%] overflow-hidden overflow-y-scroll rounded-lg bg-white p-6 shadow-lg'>
      <div className='mb-2 flex items-center justify-between'>
        <div className='text-3xl font-medium text-gray-700'>Create Examphase</div>
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
      {/* Form */}
      <form onSubmit={onSubmit}>
        <div className='my-4 border-b-2 pb-2'>
          <p className='font-semibold mb-2'>Title:</p>
          <div>
            <Controller
              control={control}
              name='title'
              render={({ field }) => (
                <input
                  type='text'
                  className='mb-2 h-[30px] w-[100%] rounded-lg border border-gray-300 bg-gray-50 py-5 px-3 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500'
                  placeholder='Title of examphase'
                  {...field}
                  onChange={field.onChange}
                  value={field.value}
                />
              )}
            />
          </div>
          {errors.title && <p className='text-sm text-red-500'>{errors.title.message}</p>}
        </div>
        <div className='my-4 border-b-2 pb-2'>
          <p className='font-semibold mb-2'>Code:</p>
          <div>
            <Controller
              control={control}
              name='code'
              render={({ field }) => (
                <input
                  type='text'
                  className='mb-2 h-[30px] w-[100%] rounded-lg border border-gray-300 bg-gray-50 py-5 px-3 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500'
                  placeholder='Code of examphase'
                  {...field}
                  onChange={field.onChange}
                  value={field.value}
                />
              )}
            />
          </div>
          {errors.title && <p className='text-sm text-red-500'>{errors.title.message}</p>}
        </div>
        <div className='my-4 border-b-2 pb-2'>
          <p className='font-semibold mb-2'>Description:</p>
          <div>
            <Controller
              control={control}
              name='description'
              render={({ field }) => (
                <input
                  type='text'
                  className='mb-2 h-[30px] w-[100%] rounded-lg border border-gray-300 bg-gray-50 py-5 px-3 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500'
                  placeholder='Description of examphase'
                  {...field}
                  onChange={field.onChange}
                  value={field.value}
                />
              )}
            />
          </div>
          {errors.title && <p className='text-sm text-red-500'>{errors.title.message}</p>}
        </div>
        <div className='my-4 border-b-2 pb-2'>
          <p className='font-semibold mb-2'>Pass Require:</p>
          <div>
            <Controller
              control={control}
              name='totalPassRequire'
              render={({ field }) => (
                <input
                  type='text'
                  className='mb-2 h-[30px] w-[100%] rounded-lg border border-gray-300 bg-gray-50 py-5 px-3 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500'
                  placeholder='Total Pass Require of examphase'
                  {...field}
                  onChange={field.onChange}
                  value={field.value}
                />
              )}
            />
          </div>
          {errors.totalPassRequire && <p className='text-sm text-red-500'>{errors.totalPassRequire.message}</p>}
        </div>
        <div className='my-4 border-b-2 pb-2'>
          <p className='font-semibold mb-2'>Duration:</p>
          <div>
            <Controller
              control={control}
              name='duration'
              render={({ field }) => (
                <input
                  type='text'
                  className='mb-2 h-[30px] w-[100%] rounded-lg border border-gray-300 bg-gray-50 py-5 px-3 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500'
                  placeholder='Duration of examphase'
                  {...field}
                  onChange={field.onChange}
                  value={field.value}
                />
              )}
            />
          </div>
          {errors.title && <p className='text-sm text-red-500'>{errors.title.message}</p>}
        </div>
        <div className='my-4 border-b-2 pb-2'>
          <p className='font-semibold mb-2'>Start time:</p>
          <div>
            <Controller
              control={control}
              name='startTime'
              render={(_) => (
                <DatePicker
                  aria-label='startDate'
                  hideTimeZone
                  showMonthAndYearPickers
                  // defaultValue={new Date()}
                  defaultValue={now(getLocalTimeZone())}
                  // label="Event Date"
                  onChange={(value) => {
                    if (value) {
                      console.log(value)
                      const localDate = new Date(
                        value.year,
                        value.month - 1, // Month in JavaScript is 0-indexed
                        value.day,
                        value.hour,
                        value.minute,
                        value.second,
                        value.millisecond
                      )

                      const timezoneOffset = localDate.getTimezoneOffset() * 60 * 1000

                      const adjustedDate = new Date(localDate.getTime() - timezoneOffset)

                      const isoTime = adjustedDate.toISOString()

                      setValue('startTime', isoTime)
                    }
                  }}
                  variant='bordered'
                  className='rounded-md border border-gray-300 bg-slate-200'
                  classNames={{
                    calendarContent: 'w-[300px]',
                    popoverContent: 'bg-slate-200 border border-blue-300'
                  }}
                />
              )}
            />
          </div>
          {errors.startTime && <p className='text-sm text-red-500'>{errors.startTime.message}</p>}
        </div>
        <div className='my-4 border-b-2 pb-2'>
          <p className='font-semibold mb-2'>Start time:</p>
          <div>
            <Controller
              control={control}
              name='endTime'
              render={(_) => (
                <DatePicker
                  aria-label='endTime'
                  hideTimeZone
                  showMonthAndYearPickers
                  // defaultValue={new Date()}
                  defaultValue={now(getLocalTimeZone())}
                  // label="Event Date"
                  onChange={(value) => {
                    if (value) {
                      console.log(value)
                      const localDate = new Date(
                        value.year,
                        value.month - 1, // Month in JavaScript is 0-indexed
                        value.day,
                        value.hour,
                        value.minute,
                        value.second,
                        value.millisecond
                      )

                      const timezoneOffset = localDate.getTimezoneOffset() * 60 * 1000

                      const adjustedDate = new Date(localDate.getTime() - timezoneOffset)

                      const isoTime = adjustedDate.toISOString()

                      setValue('endTime', isoTime)
                    }
                  }}
                  variant='bordered'
                  className='rounded-md border border-gray-300 bg-slate-200'
                  classNames={{
                    calendarContent: 'w-[300px]',
                    popoverContent: 'bg-slate-200 border border-blue-300'
                  }}
                />
              )}
            />
          </div>
          {errors.endTime && <p className='text-sm text-red-500'>{errors.endTime.message}</p>}
        </div>
        {/* IsPrivate */}
        <div className='my-2 flex items-center border-b-2 py-4'>
          <div className='font-semibold'>Is Private:</div>
          {IsPrivate.map((domain, index) => (
            <div className='ps-4' key={index}>
              <Controller
                name='isPrivate'
                control={control}
                render={({ field }) => (
                  <>
                    <input
                      id={`radio-${domain.value}`}
                      type='radio'
                      checked={field.value === domain.value}
                      onChange={(_) => {
                        setValue('isPrivate', domain.value)
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
        {/* Button */}
        <div className='flex'>
          <button className='mr-3 rounded-lg bg-slate-400 px-6 py-2 text-white' type='submit'>
            Create
          </button>
          <button
            className='rounded-lg border border-slate-300 px-6 py-2'
            type='button'
            onClick={() => {
              reset({
                title: '',
                code: '',
                description: '',
                duration: 0,
                startTime: '',
                endTime: '',
                isPrivate: false
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

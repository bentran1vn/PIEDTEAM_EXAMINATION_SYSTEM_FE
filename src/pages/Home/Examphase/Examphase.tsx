import { QueryObserverResult, RefetchOptions, useMutation } from '@tanstack/react-query'
import { AxiosResponse } from 'axios'
import classNames from 'classnames'
import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import examphaseApi, { ExamphaseStatus, Examphase as ExamphaseType } from 'src/apis/examphase.api'
import path from 'src/constant/path'
import { AppContext } from 'src/context/app.context'

export default function Examphase({
  x,
  index,
  handleExamphase,
  refetchList
}: {
  x: ExamphaseType
  index: number
  handleExamphase: (examphaseId: string) => void
  refetchList: (options?: RefetchOptions) => Promise<QueryObserverResult<AxiosResponse<ExamphaseType[], any>, Error>>
}) {
  const { user } = useContext(AppContext)
  const joinExamphaseMutation = useMutation({
    mutationFn: examphaseApi.joinClass,
    onError: (error) => {
      console.log(error)
      toast.error((error as any).response.data.detail, {
        autoClose: 1500
      })
    },
    onSuccess: () => {
      toast.success('Join Examphase successfully !', {
        autoClose: 500
      })
      refetchList()
      // handleClose()
    }
  })
  return (
    <div
      key={x.id}
      className='grid grid-cols-12 mr-10 ml-10 mt-5 bg-sky-500/10 text-slate-600 p-3 rounded-md h-auto items-center border border-black/30'
    >
      <div className='col-span-1 border-r border-r-slate-600/50 text-xl pl-3'>{index}</div>
      <Link to={`${path.examphase}/${x.id}`} className='col-span-4 border-r border-r-slate-600/50 pl-3'>
        <div className='text-xl'>{x.title}</div>
        <div className='text-sm'>Ôn lại kiến thức</div>
      </Link>
      <div className='col-span-2 border-r border-r-slate-600/50 pl-3'>{formatDateRange(x.startDate)}</div>
      <div className='col-span-1 border-r border-r-slate-600/50 pl-2 text-center'>
        {x.duration} <span>minutes</span>
      </div>
      <div className='col-span-1 border-r border-r-slate-600/50 pl-2 flex items-center justify-center'>
        {x.isPrivate ? (
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='size-7'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z'
            />
          </svg>
        ) : (
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='size-7'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M13.5 10.5V6.75a4.5 4.5 0 1 1 9 0v3.75M3.75 21.75h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H3.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z'
            />
          </svg>
        )}
      </div>
      <div className='col-span-1 border-r border-r-slate-600/50'>
        <div
          className={classNames(
            ' rounded-md h-[30px] ml-2 mr-2 text-center flex justify-center items-center text-slate-200',
            {
              'bg-yellow-500': x.status == 0,
              'bg-green-600 ': x.status == 1,
              'bg-red-500': x.status == 2
            }
          )}
        >
          {ExamphaseStatus[x.status]}
        </div>
      </div>
      <div className='col-span-1 pl-2 text-center border-r border-r-slate-600/50'>{x.totalCompetitors}</div>
      <div className='col-span-1 pl-2 text-center'>
        {user?.Role == '0' && (
          <button
            onClick={() => {
              joinExamphaseMutation.mutate({ examPhaseId: x.id, studentId: user.UserId as string })
            }}
            className='bg-slate-500 text-white py-2 px-5 rounded-md'
          >
            Join
          </button>
        )}
        {user?.Role == '1' && (
          <button
            onClick={() => {
              handleExamphase(x.id)
            }}
            className='bg-red-500 text-white py-2 px-5 rounded-md'
          >
            Delete
          </button>
        )}
      </div>
    </div>
  )
}

function formatDateRange(startDate: string) {
  const start = new Date(startDate)

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC' // Force UTC time zone
  }

  // Format the start and end dates
  const formattedStartDate = start.toLocaleString('sv-SE', options).replace(',', '')
  const [startDatePart, startTimePart] = formattedStartDate.split(' ')

  // Combine the parts
  return `${startDatePart} ${startTimePart}`
}

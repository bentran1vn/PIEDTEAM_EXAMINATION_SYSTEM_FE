import { useMutation, useQuery } from '@tanstack/react-query'
import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import examphaseApi from 'src/apis/examphase.api'
import Popover from 'src/components/Popover'
import path from 'src/constant/path'
import { AppContext } from 'src/context/app.context'
import CreateExamphase from 'src/pages/Home/CreateExamphase'
import Examphase from 'src/pages/Home/Examphase'
import { removeAccessTokenToLS } from 'src/utils/auth'

export default function Home() {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const navigate = useNavigate()
  const { user, setIsAuthenticated } = useContext(AppContext)

  const { data: examphasesData, refetch } = useQuery({
    queryKey: ['examphase'],
    queryFn: () => {
      return examphaseApi.getExamphases()
    },
    placeholderData: (prevData) => prevData,
    staleTime: 3 * 60 * 1000
  })

  const examphaseList = examphasesData?.data

  const handleClose = () => {
    setIsOpen(false)
  }

  const deleteExamphaseMutation = useMutation({
    mutationFn: examphaseApi.deleteExamphase,
    onError: (_) => {
      toast.error('Fail to delete Examphase !', {
        autoClose: 500
      })
    },
    onSuccess: () => {
      toast.success('Delete Examphase successfully !', {
        autoClose: 500
      })
      refetch()
      handleClose()
    }
  })

  const handleExamphase = (examphaseId: string) => {
    deleteExamphaseMutation.mutate(examphaseId)
  }

  const handleLogout = () => {
    removeAccessTokenToLS()
    navigate(path.login)
    setIsAuthenticated(false)
  }

  return (
    <div className='p-10  w-full h-[100vh]'>
      <div className='bg-slate-200 shadow-sm w-full h-full rounded-md'>
        <div className='flex justify-between items-center mb-8'>
          <div className='pt-5 pl-20 text-3xl text-slate-80 italic'>Examphases</div>
          <div className='flex items-center mr-10 mt-5'>
            {user?.Role == '1' && (
              <Popover
                // className='h-[50px] pr-10'
                initialOpen={isOpen}
                renderPopover={<CreateExamphase handleClose={handleClose} refetchExamphases={refetch} />}
              >
                <button
                  onClick={() => {
                    setIsOpen(true)
                  }}
                  type='button'
                  className='text-xl p-3 rounded-md bg-slate-300 border border-slate-600  hover:bg-slate-700/80 hover:text-white'
                >
                  Create
                </button>
              </Popover>
            )}
            <button
              type='button'
              onClick={() => {
                handleLogout()
              }}
              className={
                'text-xl ml-2 p-3 rounded-md bg-slate-300 border border-slate-600  hover:bg-slate-700/80 hover:text-white'
              }
            >
              Logout
            </button>
          </div>
        </div>
        <div className='grid grid-cols-12 mr-10 ml-10 mt-5 bg-sky-600/30 text-slate-600 p-3 rounded-md'>
          <div className='col-span-1 border-r border-r-slate-600/50 pl-3'>No</div>
          <div className='col-span-4 border-r border-r-slate-600/50 pl-3'>Tilte</div>
          <div className='col-span-2 border-r border-r-slate-600/50 pl-3'>Start Time</div>
          <div className='col-span-1 border-r border-r-slate-600/50 pl-2 text-center'>Duration</div>
          <div className='col-span-1 border-r border-r-slate-600/50 pl-2 text-center'>Private</div>
          <div className='col-span-1 border-r border-r-slate-600/50 pl-2 text-center'>Status</div>
          <div className='col-span-1 pl-2 text-center'>Competitors</div>
          <div className='col-span-1 pl-2 text-center'>Action</div>
        </div>
        {examphaseList != undefined &&
          examphaseList.map((x, index) => (
            <Examphase refetchList={refetch} handleExamphase={handleExamphase} key={x.id} x={x} index={index} />
          ))}
      </div>
    </div>
  )
}

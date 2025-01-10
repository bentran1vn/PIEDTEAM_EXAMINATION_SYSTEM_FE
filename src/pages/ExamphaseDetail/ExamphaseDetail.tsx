import { useMutation, useQuery } from '@tanstack/react-query'
import classNames from 'classnames'
import { useContext, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import examphaseApi, { ExamphaseStatus } from 'src/apis/examphase.api'
import Popover from 'src/components/Popover'
import path from 'src/constant/path'
import { AppContext } from 'src/context/app.context'
import CreateQuestion from 'src/pages/ExamphaseDetail/CreateQuestion'
import Question from 'src/pages/ExamphaseDetail/Question'
import { CustomJwtPayload } from 'src/pages/Login/Login'

export interface FileObject {
  file: File | null
  questionId: string
}

export default function ExamphaseDetail() {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [fileObject, setfileObject] = useState<FileObject>({ file: null, questionId: '' })

  const { phaseId } = useParams()
  const { user } = useContext(AppContext)
  const navigate = useNavigate()
  const {
    data: examphaseData,
    refetch,
    isError
  } = useQuery({
    queryKey: ['examphase', phaseId],
    queryFn: () => {
      return examphaseApi.getExamphase(phaseId as string)
    },
    placeholderData: (prevData) => prevData,
    staleTime: 3 * 60 * 1000
  })

  const handleFileChange = (file: File, questionId: string) => {
    if (file) {
      setfileObject((_) => ({
        file: file,
        questionId: questionId
      }))
    }
  }

  if (isError) {
    toast.error('Invalid Examphase', {
      autoClose: 700
    })
    navigate(path.examphase)
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  const commandExamphaseMutation = useMutation({
    mutationFn: examphaseApi.commandExamphase,
    onError: (error) => {
      toast.error((error as any).response.data.detail, {
        autoClose: 1500
      })
    },
    onSuccess: () => {
      toast.success('Start Examphase successfully !', {
        autoClose: 500
      })
      refetch()
      // refetchTestCase()
      // handleClose()
    }
  })

  const submitMutation = useMutation({
    mutationFn: examphaseApi.submit,
    onError: (error) => {
      toast.error((error as any).response.data.detail, {
        autoClose: 1500
      })
    },
    onSuccess: () => {
      toast.success('Submit Question successfully !', {
        autoClose: 500
      })
      refetch()
    }
  })

  const onSubmit = (questionId: string, examphaseId: string) => {
    if (!fileObject?.file) {
      toast.error('No file selected!', {
        autoClose: 500
      })
      return
    }

    console.log(questionId)
    console.log(fileObject.file)

    const formData = new FormData()
    formData.append('QuestionId', questionId)
    formData.append('ExamphaseId', examphaseId)
    formData.append('StudentFile', fileObject.file)

    submitMutation.mutate(formData)
    setfileObject({ file: null, questionId: '' })
  }

  const deleteQuestionMutation = useMutation({
    mutationFn: examphaseApi.deleteQuestion,
    onError: (error) => {
      toast.error((error as any).response.data.detail, {
        autoClose: 1500
      })
    },
    onSuccess: () => {
      toast.success('Delete Question successfully !', {
        autoClose: 500
      })
      refetch()
      handleClose()
    }
  })

  const handleDeleteQuestion = (questiongId: string) => {
    deleteQuestionMutation.mutate(questiongId)
  }

  const finshxamphaseMutation = useMutation({
    mutationFn: examphaseApi.finish,
    onError: (error) => {
      console.log(error)
      toast.error((error as any).response.data.detail, {
        autoClose: 1500
      })
    },
    onSuccess: () => {
      toast.success('Submit answers successfully !', {
        autoClose: 500
      })
      refetch()
      // handleClose()
    }
  })

  return (
    <div className='p-10 w-full h-[full]'>
      <div className='bg-slate-200 shadow-sm w-full h-full rounded-md'>
        <div className='flex justify-between items-center'>
          <div className='pt-5 pl-20 text-3xl text-slate-80 italic'>Examphases Detail</div>
          <Link
            to={path.examphase}
            className='w-[10%] h-[50px] flex items-center justify-center text-xl rounded-md bg-slate-400 text-slate-200 mt-5 mr-10 hover:bg-slate-600 hover:text-white'
          >
            Back
          </Link>
        </div>
        {/* Detail */}
        <div className='ml-10 mr-10 mt-5 bg-sky-500/10 p-5 border border-black/30 rounded-sm'>
          <div className='flex items-center justify-start mb-2'>
            <div className='text-xl mr-2 font-normal'>Title: </div>
            <div className='text-md font-light'>{examphaseData?.data.title}</div>
          </div>
          <div className='flex items-center justify-start mb-2'>
            <div className='text-xl mr-2 font-normal'>Description: </div>
            <div className='text-md font-light'>{examphaseData?.data.description}</div>
          </div>
          <div className='flex items-center justify-start mb-2'>
            <div className='text-xl mr-2 font-normal'>Code: </div>
            <div className='text-md font-light'>{examphaseData?.data.code}</div>
          </div>
          <div className='flex items-center justify-start mb-2'>
            <div className='text-xl mr-2 font-normal'>Duration: </div>
            <div className='text-md font-normal text-slate-600'>{examphaseData?.data.duration} minutes</div>
          </div>
          <div className='flex items-center justify-start mb-2'>
            <div className='text-xl mr-2 font-normal'>Pass Require: </div>
            <div className='text-md font-normal text-slate-600'>
              Greater than <span className='underline'>{examphaseData?.data.totalPassRequire}</span>
            </div>
          </div>
          <div className='flex items-center justify-start mb-2'>
            <div className='text-xl mr-2 font-normal'>Time: </div>
            <div className='text-md font-normal text-slate-600'>
              {formatDateRange(examphaseData?.data.startDate as string, examphaseData?.data.endDate as string)}
            </div>
          </div>
          <div className='flex items-center justify-start mb-2'>
            <div className='text-xl mr-2 font-normal'>Competitors: </div>
            <div className='text-md font-light'>{examphaseData?.data.totalCompetitors}</div>
          </div>
          <div className='flex items-center justify-start mb-2'>
            <div className='text-xl mr-2 font-normal'>Private: </div>
            <div className='text-md font-light'>{examphaseData?.data.isPrivate ? 'True' : 'False'}</div>
          </div>
          <div className='flex items-center justify-start mb-5'>
            <div className='text-xl mr-2 font-normal'>Status: </div>
            <div
              className={classNames('text-md font-light rounded-md p-2 px-3  text-slate-200', {
                'bg-yellow-500': examphaseData?.data.status == 0,
                'bg-green-600 ': examphaseData?.data.status == 1,
                'bg-red-500': examphaseData?.data.status == 2
              })}
            >
              {ExamphaseStatus[examphaseData?.data.status as number]}
            </div>
          </div>
          {user?.Role == '1' && examphaseData?.data.status != 1 && (
            <div>
              <button
                onClick={() => {
                  commandExamphaseMutation.mutate({
                    id: examphaseData?.data.examphaseId as string,
                    body: {
                      isStart: true,
                      description: 'Start Examphase'
                    }
                  })
                }}
                type='button'
                className='bg-blue-500 px-4 py-2 text-white rounded-md'
              >
                Start Exam
              </button>
            </div>
          )}
          {user?.Role == '1' && examphaseData?.data.status == 1 && (
            <div>
              <button
                onClick={() => {
                  commandExamphaseMutation.mutate({
                    id: examphaseData?.data.examphaseId as string,
                    body: {
                      isStart: false,
                      description: 'Start Examphase'
                    }
                  })
                }}
                type='button'
                className='bg-red-500 px-4 py-2 text-white rounded-md'
              >
                End Exam
              </button>
            </div>
          )}
          {user?.Role == '0' && (
            <div>
              <button
                onClick={() => {
                  const confirmed = window.confirm('Are you sure you want to finish this exam phase?')
                  if (confirmed) {
                    finshxamphaseMutation.mutate({
                      studentId: user.UserId as string,
                      examPhaseId: examphaseData?.data.examphaseId as string
                    })
                  }
                }}
                type='button'
                className='bg-red-500 px-4 py-2 text-white rounded-md'
              >
                Finish
              </button>
            </div>
          )}
        </div>
        {/* Question */}
        <div className=''>
          {examphaseData?.data &&
            examphaseData?.data.questions.length > 0 &&
            examphaseData?.data.questions.map((x, index) => (
              <Question
                examphaseId={examphaseData.data.examphaseId}
                key={x.questionId}
                x={x}
                user={user as CustomJwtPayload}
                index={index}
                userAnswer={examphaseData?.data.userAnswer}
                onSubmitQuestion={onSubmit}
                handleFileChange={handleFileChange}
                handleDeleteQuestion={handleDeleteQuestion}
                file={fileObject}
              />
            ))}
        </div>
        {user?.Role == '1' && (
          <div className='mx-10 flex justify-center items-center mt-5 bg-sky-500/10 p-3 border border-black/30 rounded-sm'>
            <Popover
              className=''
              initialOpen={isOpen}
              renderPopover={
                <CreateQuestion
                  handleClose={handleClose}
                  refetchExamphase={refetch}
                  examphaseId={examphaseData?.data.examphaseId as string}
                />
              }
            >
              <button
                onClick={() => {
                  setIsOpen(true)
                }}
                type='button'
                className='bg-blue-500 p-3 text-white rounded-md'
              >
                Add Question
              </button>
            </Popover>
          </div>
        )}

        {/* Students */}
        {user?.Role == '1' && (
          <div>
            {examphaseData?.data?.competitors && examphaseData?.data.competitors?.length > 0 ? (
              <div className='ml-10 mr-10 mt-5 bg-sky-500/10 p-3 border border-black/30 rounded-sm'>
                {examphaseData?.data?.competitors.map((x) => (
                  <div
                    key={x.id}
                    className='p-3 flex justify-between items-center shadow-xl border border-slate-300 mb-3'
                  >
                    <div className='flex'>
                      <div className='mr-3'>
                        <img className='w-[70px]' src='https://picsum.photos/200' />
                      </div>
                      <div className=''>
                        <div className='text-xl'>Email: {x.email}</div>
                        <div className='text-lg'>Username: {x.userName}</div>
                        <div className='font-normal text-sm'>
                          Correct: 0{x.userAnswerResponses.filter((x) => x.isCorrectAnswer).length}/0
                          {examphaseData?.data.totalPassRequire}
                        </div>
                      </div>
                      <div className='ml-8'>
                        <div>Start At: {x.startAt}</div>
                        <div>Finish At: {x.finishAt}</div>
                        <div>Is Finish: {x.isFinished ? 'True' : 'False'}</div>
                      </div>
                    </div>
                    {x.userAnswerResponses.filter((x) => x.isCorrectAnswer).length >=
                      examphaseData?.data.totalPassRequire && (
                      <div className='bg-green-600 px-5 py-2 text-slate-200 mr-4 rounded-md'>Passed</div>
                    )}
                    {!(
                      x.userAnswerResponses.filter((x) => x.isCorrectAnswer).length <
                      examphaseData?.data.totalPassRequire
                    ) && <div className='bg-red-600 px-5 py-2 text-slate-200 mr-4 rounded-md'>Not Passed</div>}
                  </div>
                ))}
              </div>
            ) : (
              <div className='mx-10 flex justify-center items-center mt-5 bg-sky-500/10 p-3 border border-black/30 rounded-sm'>
                No Competitors
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function formatDateRange(startDate: string, endDate: string) {
  const start = new Date(startDate)
  const end = new Date(endDate)

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC'
  }

  // Format the start and end dates
  const formattedStartDate = start.toLocaleString('sv-SE', options).replace(',', '')
  const [startDatePart, startTimePart] = formattedStartDate.split(' ')

  const formattedEndTime = end.toLocaleTimeString('sv-SE', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC'
  })

  // Combine the parts
  return `${startDatePart} ${startTimePart}-${formattedEndTime}`
}

import { useMutation, useQuery } from '@tanstack/react-query'
import classNames from 'classnames'
import { useState } from 'react'
import { toast } from 'react-toastify'

import examphaseApi, { Question as QuestionType, UserAnswer } from 'src/apis/examphase.api'
import Popover from 'src/components/Popover'
import { FileObject } from 'src/pages/ExamphaseDetail/ExamphaseDetail'
import CreateTestcase from 'src/pages/ExamphaseDetail/Question/CreateTestcase'
import { CustomJwtPayload } from 'src/pages/Login/Login'

interface Props {
  x: QuestionType
  user: CustomJwtPayload
  index: number
  userAnswer?: UserAnswer[]
  examphaseId: string
  onSubmitQuestion: (questionId: string, examphaseId: string) => void
  handleFileChange: (file: File, questionId: string) => void
  handleDeleteQuestion: (questiongId: string) => void
  file: FileObject
}

export default function Question({
  x,
  user,
  index,
  userAnswer,
  examphaseId,
  onSubmitQuestion,
  handleFileChange,
  handleDeleteQuestion,
  file
}: Props) {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const fileInputId = `files-${x.questionId}`

  const { data: usecasesData, refetch } = useQuery({
    queryKey: ['usecases', x.questionId],
    queryFn: () => {
      return examphaseApi.getTestCases(x.questionId as string)
    },
    placeholderData: (prevData) => prevData,
    staleTime: 3 * 60 * 1000,
    enabled: user.Role == '1'
  })

  const handleClose = () => {
    setIsOpen(false)
  }

  const handleSubmit = () => {
    onSubmitQuestion(x.questionId, examphaseId)
  }

  const deleteTestCaseMutation = useMutation({
    mutationFn: examphaseApi.deleteCase,
    onError: (_) => {
      toast.error('Fail to delete TestCase !', {
        autoClose: 500
      })
    },
    onSuccess: () => {
      toast.success('Delete TestCase successfully !', {
        autoClose: 500
      })
      refetch()
      handleClose()
    }
  })

  const handleChange = (file: File) => {
    console.log(x.questionId)
    handleFileChange(file, x.questionId)
  }

  return (
    <div className='ml-10 mr-10 mt-5 bg-sky-500/10 p-3 border border-black/30 rounded-sm'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center justify-start mb-1'>
          <div className='text-md mr-2 font-normal'>No: </div>
          <div className='text-sm font-light'>{index + 1}</div>
        </div>
        {user.Role == '1' && (
          <button
            onClick={() => {
              handleDeleteQuestion(x.questionId)
            }}
            type='button'
            className='bg-red-500 py-3 px-6 text-white rounded-md mr-2'
          >
            Delete
          </button>
        )}
        {userAnswer &&
          userAnswer.length > 0 &&
          user?.Role == '0' &&
          userAnswer.find((x1) => x1.questionId == x.questionId)?.answerContent && (
            <div
              className={classNames('p-2 px-3 rounded-md text-slate-200/95', {
                'bg-green-500 ': userAnswer.find((x1) => x1.questionId == x.questionId)?.isCorrectAnswer,
                'bg-red-500': !userAnswer.find((x1) => x1.questionId == x.questionId)?.isCorrectAnswer
              })}
            >
              {userAnswer.find((x1) => x1.questionId == x.questionId)?.isCorrectAnswer ? 'Passed' : 'Failed'}
            </div>
          )}
      </div>
      <div className='flex items-center justify-start mb-1'>
        <div className='text-md  mr-2 font-normal'>Content: </div>
        <div className='text-sm font-light'>{x.questionContent}</div>
      </div>
      <div className='flex items-center justify-start mb-1'>
        <div className='text-md  mr-2 font-normal'>Require Input: </div>
        <div className='text-sm font-light'>{x.containInput ? 'True' : 'False'}</div>
      </div>
      <div className='flex items-center justify-start mb-1'>
        <div className='text-md  mr-2 font-normal'>Point: </div>
        <div className='text-sm font-light'>{x.point}</div>
      </div>
      {user?.Role == '1' && (
        <div className='mb-1'>
          <div className='text-md  mr-2 font-normal mb-1'>Test cases: </div>
          <div className='text-sm font-normal py-2 px-3 border border-black'>
            {usecasesData?.data &&
              usecasesData?.data.length > 0 &&
              user.Role == '1' &&
              usecasesData?.data.map((x, index) => (
                <div
                  className='flex justify-between items-center bg-slate-200 p-2 mb-2 border border-slate-500'
                  key={index}
                >
                  <div>
                    <div>No: {index}</div>
                    <div>Expected Values: {x.expectedValues}</div>
                    <div>Input Values: {x.inputArray ? x.inputArray : 'Empty'}</div>
                  </div>
                  <button
                    onClick={() => {
                      deleteTestCaseMutation.mutate(x.id)
                    }}
                    type='button'
                    className='bg-red-500 py-2 px-4 text-white rounded-md mr-3'
                  >
                    Delete
                  </button>
                </div>
              ))}
            <Popover
              className='flex items-center justify-center'
              initialOpen={isOpen}
              renderPopover={
                <CreateTestcase handleClose={handleClose} questionId={x.questionId} refetchTestCase={refetch} />
              }
            >
              <button
                onClick={() => {
                  setIsOpen(true)
                }}
                type='button'
                className='bg-blue-500 p-3 text-white rounded-md'
              >
                Add TestCases
              </button>
            </Popover>
          </div>
        </div>
      )}
      {userAnswer &&
        userAnswer?.length > 0 &&
        user?.Role == '0' &&
        !userAnswer.find((x1) => x1.questionId == x.questionId)?.isCorrectAnswer &&
        userAnswer.find((x1) => x1.questionId == x.questionId)?.errorMessage && (
          <div>
            <div className='flex items-center justify-start mb-1'>
              <div className='text-md  mr-2 font-normal'>Error Message: </div>
              <div className='text-sm font-light'>
                {userAnswer.find((x1) => x1.questionId == x.questionId)?.errorMessage}
              </div>
            </div>
            <div className='mb-4'>
              <div className='text-md  mr-2 font-normal mb-1'>Error Detail: </div>
              <div className='text-sm min-h-[100px] font-light bg-slate-700 text-white p-2'>
                {userAnswer.find((x1) => x1.questionId == x.questionId)?.errorDetail}
              </div>
            </div>
          </div>
        )}
      {user.Role == '0' && (
        <div className='flex items-center justify-start mb-2'>
          <div className='text-md  mr-2 font-normal'>File: </div>
          {file && file.questionId == x.questionId && <div className='text-sm font-normal'>{file.file?.name}</div>}
          {file && file.questionId != x.questionId && <div className='text-sm font-thin'>Empty</div>}
        </div>
      )}
      {user?.Role === '0' && (
        <div className='flex items-center'>
          <div className='mr-2'>
            <label htmlFor={fileInputId} className='cursor-pointer text-black border border-black rounded px-3 py-2'>
              Select file
            </label>
            <input
              id={fileInputId}
              className='hidden'
              type='file'
              onChange={(e) => {
                const selectedFile = e.target?.files?.[0] as File
                if (selectedFile) {
                  handleChange(selectedFile)
                }
              }}
            />
          </div>
          <button onClick={handleSubmit} type='button' className='bg-blue-500 text-white px-4 py-2 rounded'>
            Submit
          </button>
        </div>
      )}
    </div>
  )
}

import http from 'src/utils/http'

const URL = '/api/Examphase'
const URL1 = '/api/Question'
const URL2 = '/api/Testcase'
const URL3 = '/api/Examclass'
const URL4 = '/api/UserAnswer'

const examphaseApi = {
  getExamphases() {
    return http.get<Examphase[]>(`${URL}`)
  },
  getExamphase(id: string) {
    return http.get<ExamphaseDetail>(`${URL}/${id}`)
  },
  deleteExamphase(id: string) {
    return http.delete<any>(`${URL}/${id}`)
  },
  createExamphase(body: {
    code: string
    title: string
    description: string
    startTime: string
    endTime: string
    duration: number
    isPrivate: boolean
    isWorkFromHome: boolean
  }) {
    return http.post<any>(`${URL}`, body)
  },
  commandExamphase({ id, body }: { id: string; body: { isStart: boolean; description: string } }) {
    return http.post<any>(`${URL}/${id}`, body)
  },
  createQuestion(body: { examPhaseId: string; questionContent: string; containInput: boolean; point: string }) {
    return http.post<any>(`${URL1}`, body)
  },
  deleteQuestion(id: string) {
    return http.delete<any>(`${URL1}/${id}`)
  },
  getTestCases(id: string) {
    return http.get<Testcase[]>(`${URL2}/${id}`)
  },
  createTestCases(body: { questionId: string; inputArray: string; expectedValues: string }) {
    return http.post<any>(`${URL2}`, body)
  },
  deleteCase(id: string) {
    return http.delete<any>(`${URL2}/${id}`)
  },
  joinClass(body: { examPhaseId: string; studentId: string }) {
    return http.post<any>(`${URL3}`, body)
  },
  finish(body: { examPhaseId: string; studentId: string }) {
    return http.post<any>(`${URL3}/finish`, body)
  },
  submit(body: FormData) {
    return http.post<any>(`${URL4}`, body, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}

export interface Testcase {
  id: string
  inputArray: string
  expectedValues: string
}

export interface Examphase {
  id: string
  title: string
  startDate: string
  duration: number
  isPrivate: boolean
  status: number
  totalCompetitors: number
  isWorkFromHome: boolean
}

export enum ExamphaseStatus {
  Pending,
  'In Progress',
  'Done'
}

export interface ExamphaseDetail {
  examphaseId: string
  code: string
  title: string
  description: string
  startDate: string
  endDate: string
  duration: number
  isPrivate: boolean
  isWorkFromHome: boolean
  status: number
  totalCompetitors: number
  totalPassRequire: number
  questions: Question[]
  userAnswer?: UserAnswer[]
  competitors?: Competitor[]
}

export interface Question {
  questionId: string
  questionContent: string
  containInput: boolean
  point: number
}

export interface Competitor {
  id: string
  email: string
  userName: string
  startAt: string
  finishAt: string
  isFinished: boolean
  userAnswerResponses: UserAnswer[]
  isPassed: boolean
}

export interface UserAnswer {
  id: string
  questionId: string
  answerContent: string
  isCorrectAnswer: boolean
  errorMessage: any
  errorDetail: any
}

export default examphaseApi

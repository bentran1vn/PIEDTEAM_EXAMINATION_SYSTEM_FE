import * as yup from 'yup'

export const loginSchema = yup.object({
  emailOrUserName: yup
    .string()
    .required('emailOrUserName is Required !')
    .min(1, 'Can not under 5 characters')
    .max(160, 'Can not exceed 160 characters'),
  password: yup
    .string()
    .required('Password Is Required !')
    .min(5, 'Can not under 5 characters')
    .max(160, 'Can not exceed 160 characters'),
  username: yup
    .string()
    .required('username Is Required !')
    .min(5, 'Can not under 5 characters')
    .max(160, 'Can not exceed 160 characters')
})

export const examphaseSchema = yup.object({
  code: yup.string().required('Can not be Empty !'),
  title: yup.string().trim().required('Can not be Empty !'),
  description: yup.string().trim().required('Can not be Empty !'),
  totalPassRequire: yup.number().required('Can not be Empty !'),
  startTime: yup.string().required('Can not be Empty !'),
  endTime: yup.string().required('Can not be Empty !'),
  duration: yup.number().required('Can not be Empty !'),
  isPrivate: yup.boolean().required('Can not be Empty !'),
  isWorkFromHome: yup.boolean().required('Can not be Empty !')
})

export const questionSchema = yup.object({
  examPhaseId: yup.string().required('Can not be Empty !'),
  questionContent: yup.string().trim().required('Can not be Empty !'),
  containInput: yup.boolean().required('Can not be Empty !'),
  point: yup.string().trim().required('Can not be Empty !')
})

export const testCaseSchema = yup.object({
  questionId: yup.string().required('Can not be Empty !'),
  inputArray: yup.string().trim().required('Can not be Empty !'),
  expectedValues: yup.string().trim().required('Can not be Empty !')
})

export type LoginSchema = yup.InferType<typeof loginSchema>
export type ExamphaseSchema = yup.InferType<typeof examphaseSchema>
export type QuestionSchema = yup.InferType<typeof questionSchema>
export type TestCaseSchema = yup.InferType<typeof testCaseSchema>

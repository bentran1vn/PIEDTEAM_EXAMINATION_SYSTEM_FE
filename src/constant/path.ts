const path = {
  apply: '/apply',
  examphase: '/examphase',
  examphaseDetail: 'examphase/:phaseId',
  employees: '/employee',
  restaurant: '/restaurant',
  users: '/users',
  approval: '/approval',
  approveAbsent: '/approveAbsent',
  schedule: '/schedule',
  approvalForm: '/approval/:formId',
  login: '/',
  logout: '/logout',
  user: '/user',
  profile: '/profile',
  absentForm: '/absent'
} as const

export default path

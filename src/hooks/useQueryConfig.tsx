// import { QueryConfig } from 'src/pages/MentorTable/MentorTable'
// import { isUndefined, omitBy } from 'lodash'
// import { useQueryParams } from 'src/hooks/useQueryParams'

// export function useQueryConfig() {
//   const queryParams = useQueryParams()
//   const queryConfig: QueryConfig = omitBy(
//     {
//       pageIndex: queryParams.pageIndex || '1',
//       pageSize: Number(queryParams.pageSize) > 9 ? '9' : queryParams.pageSize || '9',
//       searchTerm: queryParams.searchTerm
//     },
//     isUndefined
//   )

//   return queryConfig
// }

// export function useQueryConfig10() {
//   const queryParams = useQueryParams()
//   const queryConfig: QueryConfig = omitBy(
//     {
//       pageNumber: queryParams.pageNumber || '1',
//       pageSize: Number(queryParams.pageSize) > 12 ? '12' : queryParams.pageSize || '12'
//     },
//     isUndefined
//   )

//   return queryConfig
// }

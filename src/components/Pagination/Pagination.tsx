// import classNames from 'classnames'
// import { Link, createSearchParams } from 'react-router-dom'
// import { QueryConfig } from 'src/pages/MentorTable/MentorTable'

// interface Props {
//   queryConfig: QueryConfig
//   pageSize: number
//   pathName: string
// }
// const RANGE = 2
// export default function Pagination({ queryConfig, pageSize, pathName }: Props) {
//   const page = Number(queryConfig.pageIndex)
//   const rederPagination = () => {
//     let dotAfter = false
//     let dotBefore = false

//     const renderDotBefore = (index: number) => {
//       if (!dotBefore) {
//         dotBefore = true
//         return (
//           <span key={index} className='bg-white rounded px-3 py-2 shadow-sm mx-2  border'>
//             ...
//           </span>
//         )
//       }
//       return null
//     }
//     const renderDotAfter = (index: number) => {
//       if (!dotAfter) {
//         dotAfter = true
//         return (
//           <span key={index} className='bg-white rounded px-3 py-2 shadow-sm mx-2  border'>
//             ...
//           </span>
//         )
//       }
//       return null
//     }
//     return Array(pageSize)
//       .fill(0)
//       .map((_, index) => {
//         const pageIndex = index + 1
//         if (page <= RANGE * 2 + 1 && pageIndex > page + RANGE && pageIndex < pageSize - RANGE + 1) {
//           //Trường Hợp ... chỉ xuất hiện duy nhất Ở sau
//           //Page nó nằm ở khúc đầu
//           return renderDotAfter(index)
//         } else if (page > RANGE * 2 + 1 && page < pageSize - RANGE * 2) {
//           //Page nó nằm ở khúc giữa
//           if (pageIndex < page - RANGE && pageIndex > RANGE) {
//             return renderDotBefore(index)
//           } else if (pageIndex > page + RANGE && pageIndex < pageSize - RANGE + 1) {
//             return renderDotAfter(index)
//           }
//         } else if (page >= pageSize - RANGE * 2 && pageIndex > RANGE && pageIndex < page - RANGE) {
//           //Trường Hợp ... chỉ xuất hiện duy nhất Ở đầu
//           //Page nó nằm ở khúc cuối
//           return renderDotBefore(index)
//         }
//         return (
//           <Link
//             to={{
//               pathname: pathName,
//               search: createSearchParams({
//                 ...queryConfig,
//                 pageIndex: pageIndex.toString()
//               }).toString()
//             }}
//             key={index}
//             className={classNames('bg-white rounded px-3 py-2 shadow-sm mx-2 cursor-pointer border', {
//               'border-cyan-500': pageIndex === page,
//               'border-transparent': pageIndex !== page
//             })}
//           >
//             {pageIndex}
//           </Link>
//         )
//       })
//   }
//   return (
//     <div className='flex flex-wrap justify-center'>
//       {page === 1 ? (
//         <span className='bg-white/60 cursor-not-allowed rounded px-3 py-2 shadow-sm mx-2 border'>Prev</span>
//       ) : (
//         <Link
//           to={{
//             pathname: pathName,
//             search: createSearchParams({
//               ...queryConfig,
//               pageIndex: (page - 1).toString()
//             }).toString()
//           }}
//           className='bg-white rounded px-3 py-2 shadow-sm mx-2 cursor-pointer border'
//         >
//           Prev
//         </Link>
//       )}
//       {rederPagination()}
//       {page === pageSize ? (
//         <span className='bg-white/60 cursor-not-allowed rounded px-3 py-2 shadow-sm mx-2 border'>Next</span>
//       ) : (
//         <Link
//           to={{
//             pathname: pathName,
//             search: createSearchParams({
//               ...queryConfig,
//               pageIndex: (page + 1).toString()
//             }).toString()
//           }}
//           className='bg-white rounded px-3 py-2 shadow-sm mx-2 cursor-pointer border'
//         >
//           Next
//         </Link>
//       )}
//     </div>
//   )
// }

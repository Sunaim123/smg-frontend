import React from "react"
import { usePagination } from "../hooks/usePagination"
import { Pagination } from "@mui/material"

const Paginations = (props) => {
  const {
    onPageChange,
    totalCount,
    siblingCount = 1,
    currentPage,
    pageSize
  } = props

  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize
  })

  if (currentPage === 0 || paginationRange.length < 2)
    return null

  let lastPage = paginationRange[paginationRange.length - 1]

  return (
    <Pagination
     size="medium"
     color="primary"
     count={lastPage}
     page={currentPage}
     onChange={(e, page) => onPageChange(page)} 
     />
  )
}

export default Paginations
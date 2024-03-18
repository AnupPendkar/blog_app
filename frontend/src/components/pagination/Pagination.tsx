import { styled, Pagination } from '@mui/material';
import React from 'react';

const CustomPagination = ({ totalCount, currentPage, pageRecords, pageSelectionEmitter, setPageRecordsEmitter }) => {
  const CustomPaginationOption = styled('option')({
    background: '#9C9B9B',
    color: '#191919',
    fontSize: 14,
    paddding: 10,
    margin: 10
  });

  function handlePage(value: number) {
    pageSelectionEmitter(value);
  }

  function handlePageSizeChange(event) {
    setPageRecordsEmitter(event.target.value);
  }

  const totalPages = Math.ceil(totalCount / pageRecords);

  return (
    <div className="flex gap-1 ml-auto pt-1">
      <Pagination count={totalPages} page={currentPage} onChange={(event, value) => handlePage(value)} shape="rounded" />

      <div className="flex items-center">
        <span className="fsr-14 font-im ml-4 mr-3" style={{ color: '#9C9B9B' }}>
          Page records
        </span>
        <select
          value={pageRecords}
          name="page-size"
          id="page-size"
          style={{ background: 'none', borderBottom: '2px solid #9c9b9b', outline: 'none' }}
          onChange={handlePageSizeChange}
        >
          <CustomPaginationOption style={{ background: '#9C9B9B', color: '#191919' }} value={10}>
            10
          </CustomPaginationOption>
          <CustomPaginationOption style={{ background: '#9C9B9B', color: '#191919' }} value={25}>
            25
          </CustomPaginationOption>
          <CustomPaginationOption style={{ background: '#9C9B9B', color: '#191919' }} value={50}>
            50
          </CustomPaginationOption>
          <CustomPaginationOption style={{ background: '#9C9B9B', color: '#191919' }} value={100}>
            100
          </CustomPaginationOption>
          <CustomPaginationOption style={{ background: '#9C9B9B', color: '#191919' }} value={500}>
            500
          </CustomPaginationOption>
        </select>
      </div>
    </div>
  );
};

export default CustomPagination;

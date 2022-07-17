import React, { ReactNode } from 'react';
import { RightArrow, LeftArrow } from '../../../assets';

interface PaginationProps {
  totalCount: number;
  currentPage: number;
  pageLimit: number;
  onChange: (pageNumber: number) => void;
}

export const Pagination = ({
  totalCount,
  currentPage,
  pageLimit,
  onChange,
}: PaginationProps): JSX.Element => {
  const pageCount = Math.floor(totalCount / pageLimit) + (totalCount % pageLimit === 0 ? 0 : 1);
  const pagesHtml: ReactNode[] = [];

  for (let index = 1; index <= pageCount; index++) {
    const className = `page ${index === currentPage ? 'page--currentPage' : ''}`;
    pagesHtml.push(
      <button
        key={index}
        className={className}
        onClick={() => currentPage !== index && onChange(index)}
      >
        {index}
      </button>
    );
  }

  return (
    <>
      {totalCount > 0 && (
        <div className="pagination unselectable">
          <span className="info">
            Showing {(currentPage - 1) * pageLimit + 1} to {pageLimit * currentPage} of {totalCount}{' '}
            records
          </span>
          <div className="pages">
            <LeftArrow
              className={`arrow ${currentPage === 1 ? 'arrow--disabled' : ''}`}
              onClick={() => currentPage > 1 && onChange(currentPage - 1)}
            />
            {pagesHtml}
            <RightArrow
              className={`arrow ${currentPage === pageCount ? 'arrow--disabled' : ''}`}
              onClick={() => currentPage < pageCount && onChange(currentPage + 1)}
            />
          </div>
        </div>
      )}
    </>
  );
};

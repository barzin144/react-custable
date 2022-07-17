import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { Pagination } from './Pagination';

afterEach(() => cleanup);

describe('Table Pagination tests', () => {
  test('Table pagination should have pagination class', async () => {
    const { container } = render(
      <Pagination
        currentPage={1}
        totalCount={50}
        pageLimit={10}
        onChange={() => {
          return;
        }}
      />
    );
    expect(container.getElementsByClassName('pagination').length).toEqual(1);
  });

  test.each`
    totalCount | expected
    ${1}       | ${1}
    ${10}      | ${1}
    ${11}      | ${2}
    ${0}       | ${0}
  `(
    'Table pagination should have $expected page when the totalCount props is $totalCount and pageLimit=10',
    ({ totalCount, expected }) => {
      const { container } = render(
        <Pagination
          currentPage={1}
          totalCount={totalCount}
          pageLimit={10}
          onChange={() => {
            return;
          }}
        />
      );
      expect(container.getElementsByClassName('page').length).toEqual(expected);
    }
  );

  test('Table pagination should disable left arrow when the currentPage is 1', async () => {
    const { container } = render(
      <Pagination
        currentPage={1}
        totalCount={50}
        pageLimit={10}
        onChange={() => {
          return;
        }}
      />
    );
    expect(container.getElementsByClassName('arrow--disabled').length).toEqual(1);
  });

  test('Table pagination should disable right arrow when the currentPage is last page', async () => {
    const { container } = render(
      <Pagination
        currentPage={5}
        totalCount={50}
        pageLimit={10}
        onChange={() => {
          return;
        }}
      />
    );
    expect(container.getElementsByClassName('arrow--disabled').length).toEqual(1);
  });
});

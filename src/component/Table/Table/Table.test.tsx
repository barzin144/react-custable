import React from 'react';
import { render, cleanup, fireEvent, screen } from '@testing-library/react';
import { Table, TableProps } from './Table';

afterEach(() => cleanup);

describe('Table tests', () => {
  test('Table should show the data and pagination', async () => {
    type rowType = { id: string; name: string; email: string };
    const props: TableProps<rowType> = {
      columns: [
        { fieldName: 'name', title: 'Name', width: '180px', sortable: true },
        { fieldName: 'email', title: 'Email', width: '180px', sortable: true },
      ],
      data: [
        { id: '1', name: 'a', email: 'a@a.a' },
        { id: '2', name: 'b', email: 'b@b.b' },
      ],
      pageChangeHandler: jest.fn(),
      pagination: { currentPage: 1, totalCount: 50, pageLimit: 10 },
    };

    const { container } = render(<Table {...props} />);
    expect(container.getElementsByClassName('pagination').length).toEqual(1);
    expect(screen.getAllByText('a@a.a').length).toEqual(1);
  });

  test('When Edit button has been clicked its function should be called once', async () => {
    const buttonClick = jest.fn();
    type rowType = { id: string; name: string; email: string };
    const props: TableProps<rowType> = {
      columns: [
        { fieldName: 'name', title: 'Name', width: '180px', sortable: true },
        { fieldName: 'email', title: 'Email', width: '180px', sortable: true },
        {
          fieldName: 'edit',
          title: 'Edit',
          width: '80px',
          render: () => {
            const cell = {
              value: <button onClick={buttonClick}>EditButton</button>,
              props: {},
            };
            return cell;
          },
        },
      ],
      data: [
        { id: '1', name: 'a', email: 'a@a.a' },
        { id: '2', name: 'b', email: 'b@b.b' },
      ],
      pageChangeHandler: jest.fn(),
      pagination: { currentPage: 1, totalCount: 50, pageLimit: 10 },
    };

    render(<Table {...props} />);

    fireEvent.click(screen.getAllByText('EditButton')[0]);
    expect(buttonClick).toBeCalledTimes(1);
  });

  test('When table row has been clicked its function should be called once', async () => {
    const rowClick = jest.fn();
    type rowType = { id: string; name: string; email: string };
    const props: TableProps<rowType> = {
      columns: [
        { fieldName: 'name', title: 'Name', width: '180px', sortable: true },
        { fieldName: 'email', title: 'Email', width: '180px', sortable: true },
      ],
      data: [
        { id: '1', name: 'a', email: 'a@a.a' },
        { id: '2', name: 'b', email: 'b@b.b' },
      ],
      rowClickHandler: rowClick,
      pageChangeHandler: jest.fn(),
      pagination: { currentPage: 1, totalCount: 50, pageLimit: 10 },
    };

    const { container } = render(<Table {...props} />);

    fireEvent.click(container.getElementsByClassName('tableRow')[0]);
    expect(rowClick).toBeCalledTimes(1);
  });
});

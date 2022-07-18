import React, { FormEvent } from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { useArgs } from '@storybook/client-api';
import { Table as TableComponent, TableProps } from './Table';

export default {
  title: 'Components',
  component: TableComponent,
} as ComponentMeta<typeof TableComponent>;

const Template: ComponentStory<typeof TableComponent> = (args) => {
  const [_, updateArgs] = useArgs();
  const pageChangeHandler = (pageNumber: number) => {
    updateArgs({ ...args, pagination: { currentPage: pageNumber, totalCount: 50, pageLimit: 10 } });
  };
  return <TableComponent {...args} pageChangeHandler={pageChangeHandler} />;
};

type rowType = { id: string; name: string; createDate: number; email: string; status: boolean };
export const Table = Template.bind({});
Table.args = {
  columns: [
    { fieldName: 'name', title: 'Name', width: '180px', sortable: true },
    { fieldName: 'email', title: 'Email', width: '180px', sortable: true },
    {
      fieldName: 'createDate',
      title: 'Create date',
      width: '100px',
      sortable: true,
      sortFunc: (aValue: number, bValue: number) => {
        let result = 0;
        if (aValue < bValue) {
          result = -1;
        }
        if (aValue > bValue) {
          result = 1;
        }
        return result;
      },
      render: (row) => {
        const cell = {
          value: <>{new Date(row['createDate']).toDateString()}</>,
          props: {},
        };
        return cell;
      },
    },
    {
      fieldName: 'status',
      title: 'Status',
      width: '80px',
      render: (row) => {
        const cell = {
          value: (
            <span
              style={{
                backgroundColor: '#e8fff3',
                color: '#50cd89',
                border: '1px solid #50cd89',
                padding: '3px',
                borderRadius: '4px',
                width: '60px',
                margin: 'auto',
              }}
            >
              {row['status'] ? 'Active' : 'Inactive'}
            </span>
          ),
          props: {},
        };
        return cell;
      },
    },
    {
      fieldName: 'edit',
      title: 'Edit',
      width: '80px',
      render: () => {
        const cell = {
          value: (
            <a
              onClick={(e: FormEvent) => {
                e.stopPropagation();
                console.log('edit click');
              }}
            >
              Edit
            </a>
          ),
          props: {},
        };
        return cell;
      },
    },
  ],
  data: [
    { id: '1', name: 'a', createDate: 1646236800000, email: 'a@a.a', status: true },
    { id: '2', name: 'b', createDate: 1641236100000, email: 'b@b.b', status: true },
  ],
  rowClickHandler: () => console.log('row click'),
  selectRowHandler: (ids) => console.log([...ids]),
  pagination: { currentPage: 1, totalCount: 50, pageLimit: 10 },
} as TableProps<rowType>;

export const TableWithFixedColumns = Template.bind({});
TableWithFixedColumns.args = {
  columns: [
    { fieldName: 'name', title: 'Name', width: '180px', sortable: true, fixed: 'left' },
    { fieldName: 'email', title: 'Email', width: '180px', sortable: true },
    {
      fieldName: 'createDate',
      title: 'Create date',
      width: '100px',
      sortable: true,
      sortFunc: (aValue: number, bValue: number) => {
        let result = 0;
        if (aValue < bValue) {
          result = -1;
        }
        if (aValue > bValue) {
          result = 1;
        }
        return result;
      },
      render: (row) => {
        const cell = {
          value: <>{new Date(row['createDate']).toDateString()}</>,
          props: {},
        };
        return cell;
      },
    },
    {
      fieldName: 'status',
      title: 'Status',
      width: '80px',
      render: (row) => {
        const cell = {
          value: (
            <span
              style={{
                backgroundColor: '#e8fff3',
                color: '#50cd89',
                border: '1px solid #50cd89',
                padding: '3px',
                borderRadius: '4px',
                width: '60px',
                margin: 'auto',
              }}
            >
              {row['status'] ? 'Active' : 'Inactive'}
            </span>
          ),
          props: {},
        };
        return cell;
      },
    },
    {
      fieldName: 'edit',
      title: 'Edit',
      width: '80px',
      fixed: 'right',
      render: () => {
        const cell = {
          value: (
            <a
              onClick={(e: FormEvent) => {
                e.stopPropagation();
                console.log('edit click');
              }}
            >
              Edit
            </a>
          ),
          props: {},
        };
        return cell;
      },
    },
  ],
  data: [
    { id: '1', name: 'a', createDate: 1646236800000, email: 'a@a.a', status: true },
    { id: '2', name: 'b', createDate: 1641236100000, email: 'b@b.b', status: true },
  ],
} as TableProps<rowType>;

import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { useArgs } from '@storybook/client-api';
import { Pagination } from './Pagination';

export default {
  title: 'Components',
  component: Pagination,
} as ComponentMeta<typeof Pagination>;

const Template: ComponentStory<typeof Pagination> = (args) => {
  const [_, updateArgs] = useArgs();
  const onChange = (pageNumber: number) => {
    updateArgs({ ...args, currentPage: pageNumber });
  };
  return <Pagination {...args} onChange={onChange} />;
};

export const TablePagination = Template.bind({});
TablePagination.args = {
  totalCount: 50,
  currentPage: 1,
  pageLimit: 10,
};

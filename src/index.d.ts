import React from 'react';
export interface TableProps<T extends Row> {
    columns: Column<T>[];
    data: T[];
    isSelectable?: boolean;
    selectRowHandler?: (selectedRowIds: string[]) => void | undefined;
    selectedRowKeys?: string[] | undefined;
    pagination?: {
        currentPage: number;
        totalCount: number;
        pageLimit: number;
    } | undefined;
    pageChangeHandler?: (pageNumner: number) => void | undefined;
    rowClickHandler?: (row: Row) => void | undefined;
    showLoading?: boolean;
}
interface SortFunction {
    (firstData: unknown, secondData: unknown): number;
}
interface Row {
    id: string;
    [key: string]: unknown;
}
interface Cell {
    value: React.ReactNode;
    props: {
        [key: string]: string;
    };
}
interface Column<T extends Row> {
    fieldName: string;
    title: string;
    width: string;
    fixed?: 'left' | 'right';
    sortable?: boolean;
    sortFunc?: SortFunction | undefined;
    render?: (row: T, index: number) => Cell | undefined;
}
export declare const Table: <T extends Row>({ columns, data, isSelectable, selectRowHandler, selectedRowKeys, pagination, pageChangeHandler, rowClickHandler, showLoading, }: TableProps<T>) => JSX.Element;
export {};

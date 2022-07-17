import React, { CSSProperties, useEffect, useReducer, useRef } from 'react';
import { DownArrow } from '../../../assets';
import { Pagination } from '../Pagination/Pagination';
import { TableCheckbox } from './Checkbox/TableCheckbox';

interface DataRowProps<T extends Row> {
  columns: Column<T>[];
  data: T;
  selected: boolean;
  dataIndex: number;
  isSelectable: boolean;
  checkBoxChange: (id: string) => void;
}

interface HeadRowProps<T extends Row> {
  columns: Column<T>[];
  isSelectable: boolean;
  checkBoxChange: () => void;
  headChecked: boolean;
  headIndeterminate: boolean;
  sortByColumn: string;
  orderBy: Order;
  setSortByColumn: (column: string, sortFunc: SortFunction) => void;
}

interface State<T> {
  headChecked: boolean;
  headIndeterminate: boolean;
  isLoading: boolean;
  rowSelectedCount: number;
  selectedRowIds: string[];
  sortByColumn: string;
  rows: T[];
  orderBy: Order;
}

export interface TableProps<T extends Row> {
  columns: Column<T>[];
  data: T[];
  isSelectable?: boolean;
  selectRowHandler?: (selectedRowIds: string[]) => void | undefined;
  selectedRowKeys?: string[] | undefined;
  pagination?: { currentPage: number; totalCount: number; pageLimit: number } | undefined;
  pageChangeHandler?: (pageNumner: number) => void | undefined;
  rowClickHandler?: (row: Row) => void | undefined;
  showLoading?: boolean;
}

interface SortFunction {
  (firstData: unknown, secondData: unknown): number;
}

enum Order {
  Ascending,
  Descending,
}

interface ActionPayload<T> {
  id?: string;
  headChecked?: boolean;
  headIndeterminate?: boolean;
  isLoading?: boolean;
  rowSelectedCount?: number;
  selectedRowIds?: string[];
  sortByColumn?: string;
  rows?: T[];
  orderBy?: Order;
}

interface Row {
  id: string;
  [key: string]: unknown;
}

interface Cell {
  value: React.ReactNode;
  props: { [key: string]: string };
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

const reducer = <T extends Row>(
  state: State<T>,
  action: { type: string; payload: ActionPayload<T> }
): State<T> => {
  switch (action.type) {
    case 'SET_ISLOADING': {
      return {
        ...state,
        isLoading: action.payload.isLoading,
      };
    }
    case 'SET_SORTBY_COLUMN': {
      return {
        ...state,
        sortByColumn: action.payload.sortByColumn,
        orderBy: action.payload.orderBy,
        rows: action.payload.rows,
      };
    }
    //select all rows and set the header checkbox checked
    case 'SELECT_ALL': {
      const selectedRowIds = Array.from(
        new Set([...state.selectedRowIds, ...state.rows.map((x) => x.id)])
      );

      return {
        ...state,
        headIndeterminate: false,
        headChecked: true,
        rowSelectedCount: selectedRowIds.length,
        selectedRowIds: selectedRowIds,
      };
    }
    //deselect all rows and set the header checkbox unchecked
    case 'DESELECT_ALL': {
      const rowIds = state.rows.map((x) => x.id);
      const selectedRowIds = state.selectedRowIds.filter((x) => !rowIds.includes(x));

      return {
        ...state,
        headChecked: false,
        headIndeterminate: false,
        rowSelectedCount: selectedRowIds.length,
        selectedRowIds: selectedRowIds,
      };
    }

    case 'CHANGE_ROW_CHECKED': {
      let headIndeterminate = false;
      let headChecked = false;
      let rowSelectedCount = state.rowSelectedCount;
      let selectedRowIds = state.selectedRowIds;

      const rowId = action.payload.id;

      //if the row was selected then increase selected rows count otherwise decrease selected rows count
      if (selectedRowIds.indexOf(rowId) === -1) {
        rowSelectedCount++;
        selectedRowIds.push(action.payload.id);
      } else {
        rowSelectedCount--;
        selectedRowIds = selectedRowIds.filter((x) => x !== rowId);
      }

      //if at least one of the rows was selected then change the header checkbox to indeterminate, otherwise change the header checkbox unchecked
      if (rowSelectedCount > 0) {
        headIndeterminate = true;
      } else {
        headIndeterminate = false;
        headChecked = false;
      }

      //if all rows was selected then chenage the header checkbox checked
      if (rowSelectedCount === state.rows.length) {
        headIndeterminate = false;
        headChecked = true;
      }

      return {
        ...state,
        headChecked: headChecked,
        headIndeterminate: headIndeterminate,
        rowSelectedCount: rowSelectedCount,
        selectedRowIds: selectedRowIds,
      };
    }
    case 'SET_ROWS': {
      const rows = action.payload.rows;
      const selectedRowKeys = action.payload.selectedRowIds;
      let selectedRows = 0;

      //check if all rows ids are in selectedRowkeys then all row is selected
      rows.forEach((row: T) => {
        if (selectedRowKeys.indexOf(row.id) !== -1) {
          selectedRows++;
        }
      });

      let headChecked = false;
      let headIndeterminate = false;

      //if all rows were selected then set headChecked otherwise if one or more than one row were selected just set headIndeterminate
      if (rows.length !== 0 && selectedRows === rows.length) {
        headChecked = true;
      } else if (selectedRows > 0) {
        headIndeterminate = true;
      }

      return {
        ...state,
        headChecked: headChecked,
        isLoading: false,
        headIndeterminate: headIndeterminate,
        rowSelectedCount: selectedRows,
        selectedRowIds: selectedRowKeys,
        rows: rows,
      };
    }
    default: {
      return { ...state } as State<T>;
    }
  }
};

export const Table = <T extends Row>({
  columns,
  data,
  isSelectable = false,
  selectRowHandler,
  selectedRowKeys = [],
  pagination,
  pageChangeHandler,
  rowClickHandler,
  showLoading = false,
}: TableProps<T>): JSX.Element => {
  const initialState = {
    headChecked: false,
    headIndeterminate: false,
    isLoading: true,
    rowSelectedCount: 0,
    selectedRowIds: [] as string[],
    sortByColumn: '',
    rows: [] as T[],
    orderBy: Order.Ascending,
  };
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const [state, dispatch] = useReducer(reducer, initialState);
  const { headChecked, headIndeterminate, isLoading, rows, sortByColumn, orderBy, selectedRowIds } =
    state;

  useEffect(() => {
    const tableRef = tableContainerRef.current;

    const tableContainerScrollHandler = () => {
      const scrollLeft = tableRef.scrollLeft;
      const scrollwidth = tableRef.scrollWidth;
      const clientWidth = tableRef.clientWidth;
      if (scrollLeft >= scrollwidth - clientWidth) {
        tableRef.querySelector('thead .fixed-right').classList.add('no-shadow');
        tableRef
          .querySelectorAll('tbody .fixed-right')
          .forEach((e) => e.classList.add('no-shadow'));
      } else {
        tableRef.querySelector('thead .fixed-right').classList.remove('no-shadow');
        tableRef
          .querySelectorAll('tbody .fixed-right')
          .forEach((e) => e.classList.remove('no-shadow'));
      }
      if (scrollLeft === 0) {
        tableRef.querySelector('thead .fixed-left').classList.add('no-shadow');
        tableRef.querySelectorAll('tbody .fixed-left').forEach((e) => e.classList.add('no-shadow'));
      } else {
        tableRef.querySelector('thead .fixed-left').classList.remove('no-shadow');
        tableRef
          .querySelectorAll('tbody .fixed-left')
          .forEach((e) => e.classList.remove('no-shadow'));
      }
    };
    tableRef.addEventListener('scroll', tableContainerScrollHandler);

    return () => tableRef.removeEventListener('scroll', tableContainerScrollHandler);
  }, []);

  //set rows data when the props.data has been changed
  useEffect(() => {
    dispatch({ type: 'SET_ROWS', payload: { rows: data, selectedRowIds: selectedRowKeys } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  //show table loading when the props.showLoading has been changed
  useEffect(() => {
    dispatch({ type: 'SET_ISLOADING', payload: { isLoading: showLoading } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showLoading]);

  //wil be call when selectedRowIds was changed
  useEffect(() => {
    //if parent component has passed selectRowHandler then call it with selectRowIds
    if (!!selectRowHandler && data.length !== 0) {
      selectRowHandler([...selectedRowIds]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRowIds.length]);

  const headCheckboxChange = () => {
    //if the user clicks on header checkbox and the header is indeteminate then select all rows
    if (headIndeterminate) {
      dispatch({ type: 'SELECT_ALL', payload: {} });
      return;
    }
    //if the user clicks on header checkbox and the header is unchecked then select all rows otherwise deselec all rows
    if (!headChecked) {
      dispatch({ type: 'SELECT_ALL', payload: {} });
    } else {
      dispatch({ type: 'DESELECT_ALL', payload: {} });
    }
  };

  const rowsCheckboxChange = (id: string) => {
    dispatch({ type: 'CHANGE_ROW_CHECKED', payload: { id } });
  };

  const setSortByColumn = (column: string, sortFunc: SortFunction) => {
    let order = Order.Ascending;
    if (column === sortByColumn) {
      order = orderBy === Order.Ascending ? Order.Descending : Order.Ascending;
    }
    dispatch({
      type: 'SET_SORTBY_COLUMN',
      payload: {
        sortByColumn: column,
        orderBy: order,
        rows: sort(column, order, sortFunc),
      },
    });
  };

  const sort = (sortByColumn: string, orderBy: Order, sortFunc: SortFunction) => {
    const sortedRows = [...rows];

    sortedRows.sort((a, b) => {
      //if the column definition has a sort function then send the values to it otherwise sort the values as simple text
      if (!!sortFunc) {
        let result = 0;
        result = sortFunc(a[sortByColumn], b[sortByColumn]);
        //if the order is descending we should reverse the return value
        if (orderBy === Order.Descending) {
          result *= -1;
        }

        return result;
      } else {
        const aValue = (a[sortByColumn] as string).toUpperCase();
        const bValue = (b[sortByColumn] as string).toUpperCase();
        let result = 0;
        if (aValue < bValue) {
          result = -1;
        }
        if (aValue > bValue) {
          result = 1;
        }
        //if the order is descending we should reverse the return value
        if (orderBy === Order.Descending) {
          result *= -1;
        }
        return result;
      }
    });

    return sortedRows;
  };

  const paginationPageChangeHandler = (pageNumber: number) => {
    if (pageNumber !== pagination.currentPage) {
      dispatch({ type: 'SET_ISLOADING', payload: { isLoading: true } });
      pageChangeHandler(pageNumber);
    }
  };

  return (
    <div className="customTable">
      {isLoading && (
        <div className="loading-container">
          <div id="custom-spinner" />
        </div>
      )}
      <div ref={tableContainerRef} className={`tableContainer ${isLoading ? 'opacityHalf' : ''}`}>
        <table className="table">
          <thead>
            <tr className="tableRowHeader">
              {
                <HeadRow
                  columns={columns}
                  isSelectable={isSelectable}
                  checkBoxChange={headCheckboxChange}
                  headChecked={headChecked}
                  headIndeterminate={headIndeterminate}
                  sortByColumn={sortByColumn}
                  orderBy={orderBy}
                  setSortByColumn={setSortByColumn}
                />
              }
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr className="tableRow">
                <td colSpan={columns.length + (isSelectable ? 1 : 0)}>
                  <div className="noData">
                    <span>No Data</span>
                  </div>
                </td>
              </tr>
            ) : (
              rows.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  onClick={() => {
                    if (!!rowClickHandler) {
                      rowClickHandler(row);
                    }
                  }}
                  className={`tableRow ${!!rowClickHandler ? 'clickable' : ''}`}
                >
                  <DataRow
                    columns={columns}
                    data={row}
                    selected={selectedRowIds.includes(row.id)}
                    dataIndex={rowIndex}
                    isSelectable={isSelectable}
                    checkBoxChange={rowsCheckboxChange}
                  />
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {!!pagination && !!pageChangeHandler && rows.length !== 0 && (
        <Pagination
          currentPage={pagination.currentPage}
          pageLimit={pagination.pageLimit}
          totalCount={pagination.totalCount}
          onChange={paginationPageChangeHandler}
        />
      )}
    </div>
  );
};

//function for return fixed or normal column className
const columnClassName = <T extends Row>(column: Column<T>) => {
  let className = 'column';
  if (!!column.fixed) {
    className = `${className} fixed fixed-${column.fixed}`;

    if (column.fixed === 'left') {
      className = `${className} no-shadow`;
    }
  }
  return className;
};

const HeadRow = <T extends Row>({
  columns,
  isSelectable,
  checkBoxChange,
  headChecked,
  headIndeterminate,
  sortByColumn,
  orderBy,
  setSortByColumn,
}: HeadRowProps<T>): JSX.Element => {
  return (
    <>
      {isSelectable && (
        <th key={'headChecbox'} style={{ width: '24px' }}>
          <TableCheckbox
            black={true}
            checked={headChecked}
            indeterminate={headIndeterminate}
            onChange={checkBoxChange}
          />
        </th>
      )}
      {columns.map((column, index) => {
        return (
          <th key={index} className={columnClassName(column)} style={{ width: column.width }}>
            <div
              className={column.sortable ? 'headerContainer' : ''}
              onClick={() => {
                if (column.sortable) {
                  setSortByColumn(column.fieldName, column.sortFunc);
                }
              }}
            >
              <span title={column.title}>{column.title}</span>
              {column.sortable &&
                column.fieldName === sortByColumn &&
                (orderBy === Order.Ascending ? <DownArrow /> : <DownArrow className="rotate" />)}
            </div>
          </th>
        );
      })}
    </>
  );
};

const DataRow = <T extends Row>({
  columns,
  data,
  selected,
  dataIndex,
  isSelectable,
  checkBoxChange,
}: DataRowProps<T>) => {
  //it's a custom component so just call the render function of column definition then show the result
  const customCell = (column: Column<T>, data: T, dataIndex: number, columnIndex: number) => {
    const cellData = column.render(data, dataIndex);

    return cell(column, cellData, dataIndex + columnIndex, { width: column.width });
  };
  //it's a simple text cell so just get the value from data and show it
  const textCell = (column: Column<T>, data: T, dataIndex: number, columnIndex: number) => {
    const cellData = { value: data[column.fieldName], props: {} } as Cell;

    return cell(column, cellData, dataIndex + columnIndex, { width: column.width });
  };
  //it's a simple table cell
  const cell = (column: Column<T>, cell: Cell, key: number, style: CSSProperties) => {
    if (!!cell) {
      return (
        <td key={key} className={columnClassName(column)} {...cell.props} style={style}>
          {cell.value}
        </td>
      );
    }
  };

  return (
    <>
      {isSelectable && (
        <td key={`checkbox-${dataIndex}`} style={{ width: '24px' }}>
          <TableCheckbox checked={selected} onChange={() => checkBoxChange(data.id)} />
        </td>
      )}
      {columns.map((column, columnIndex) => {
        //if the data doesn't contain the column field name, if the column definition has a render function it's a custom component otherwise throw the exception
        if (data[column.fieldName] === undefined) {
          if (!!column.render) {
            return customCell(column, data, dataIndex, columnIndex);
          } else {
            throw new Error(
              `Missing data for column '${column.fieldName}' or render fucntion for this column is undefiend`
            );
          }
        }
        //if the data contains the column field name, if the column definition has a render function it's a custom text component otherwise it's a simple text cell
        else {
          if (!!column.render) {
            return customCell(column, data, dataIndex, columnIndex);
          } else {
            return textCell(column, data, dataIndex, columnIndex);
          }
        }
      })}
    </>
  );
};

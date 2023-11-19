/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useReducer, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { State, reducer } from "../reducer";

interface TableProps {
  columns: string[];
  fetchData: () => Promise<any[]>;
  extraColumns?: {
    header: string;
    render: (row: any) => React.ReactNode;
  }[];
  selectedRows?: any[];
}

const Table: React.FC<TableProps> = ({ columns, fetchData, extraColumns }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const urlSearchParams = new URLSearchParams(location.search);
  const pageQueryParam = Number(urlSearchParams.get("page")) || 1;
  const searchQueryParam = urlSearchParams.get("search") || "";
  const sortQueryParam = urlSearchParams.get("sort") || "";

  const initialState: State = {
    data: [],
    loading: true,
    currentPage: pageQueryParam,
    search: searchQueryParam,
    sortColumn: sortQueryParam,
    sortDirection: "asc",
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  const { data, loading, currentPage, search, sortColumn } = state;

  const pageSize = 25;

  const totalPages = Math.ceil(data.length / pageSize);

  const generatePageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <li key={i}>
          <a
            href="#"
            className={`flex items-center justify-center text-sm py-2 px-3 leading-tight ${
              i === currentPage
                ? "text-primary-600 bg-primary-50 border border-primary-300 hover:bg-primary-100 hover:text-primary-700"
                : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
            }`}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </a>
        </li>
      );
    }
    return pageNumbers;
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearchChange(e);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      dispatch({ type: "SET_CURRENT_PAGE", payload: newPage });
    }
  };

  const handleSearchChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.KeyboardEvent<HTMLInputElement>
  ) => {
    const value = (e as React.ChangeEvent<HTMLInputElement>).target.value;
    dispatch({ type: "SET_SEARCH", payload: value });
  };

  const handleSortChange = (column: string) => {
    dispatch({
      type: "SET_SORT_COLUMN",
      payload: column === state.sortColumn ? "" : column,
      sortDirection: state.sortDirection === "asc" ? "desc" : "asc",
    });
  };

  const compareValues = (a: any, b: any) => {
    console.log(a, b)
    const multiplier = state.sortDirection === "asc" ? 1 : -1;

    const aValue = a[state.sortColumn];
    const bValue = b[state.sortColumn];

    if (aValue === undefined || bValue === undefined) {
      return 0;
    }

    if (state.sortColumn === "id") {
      return (aValue - bValue) * multiplier;
    } else if (typeof aValue === "string" && typeof bValue === "string") {
      return aValue.localeCompare(bValue) * multiplier;
    } else {
      return (aValue < bValue ? -1 : aValue > bValue ? 1 : 0) * multiplier;
    }
  };
  const sortedData = [...data].sort(compareValues);

  const mapApiDataToTableData = (apiData: any[]): any[] => {
    return apiData.map((item) => mapObjectFields(item));
  };

  const mapObjectFields = (obj: any): any => {
    const newObj: any = {};

    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        newObj[key] = mapFieldValue(obj[key]);
      }
    }

    return newObj;
  };

  const mapFieldValue = (value: any): any => {
    if (Array.isArray(value)) {
      return value.map((item, index) => (
        <div key={index}>{mapFieldValue(item)}</div>
      ));
    } else if (typeof value === "object" && value !== null) {
      return Object.keys(value).map((key, index) => (
        <div key={index}>
          <strong>{key}: </strong>
          {mapFieldValue(value[key])}
        </div>
      ));
    }

    return value;
  };

  useEffect(() => {
    const fetchDataAndSetState = async () => {
      dispatch({ type: "SET_LOADING", payload: true });
      const rawData =
        typeof fetchData === "function" ? await fetchData() : await fetchData;
      const newData = mapApiDataToTableData(rawData);
      dispatch({ type: "SET_DATA", payload: newData });
      dispatch({ type: "SET_LOADING", payload: false });
    };

    const urlSearchParams = new URLSearchParams();
    urlSearchParams.set("page", String(currentPage));
    urlSearchParams.set("search", search);
    urlSearchParams.set("sort", sortColumn);

    navigate({ search: urlSearchParams.toString() });

    fetchDataAndSetState();
  }, [currentPage, fetchData, navigate]);

  return (
    <div className="bg-white  relative shadow-md sm:rounded-lg overflow-hidden">
      <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
        <div className="w-full md:w-1/2">
          <form className="flex items-center">
            <label htmlFor="simple-search" className="sr-only">
              Search
            </label>
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  aria-hidden="true"
                  className="w-5 h-5 text-gray-500 "
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <input
                type="text"
                id="simple-search"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2"
                value={search}
                onKeyDown={handleSearchKeyDown}
                onChange={handleSearchChange}
                placeholder="Search"
              />
            </div>
          </form>
        </div>
        <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
          <button
            type="button"
            className="flex items-center justify-center text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2"
          >
            <svg
              className="h-3.5 w-3.5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                clipRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              />
            </svg>
            Add product
          </button>
        </div>
      </div>
      <div className="overflow-x-auto max-h-96">
        <table className="w-full text-sm text-left text-gray-500 ">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0 z-10">
            {columns.map((column) => (
              <th key={column} scope="col" className="px-4 py-3 text-center">
                <button
                  type="button"
                  className="uppercase"
                  onClick={() => handleSortChange(column)}
                >
                  {column} {sortColumn === column && "🔽"}
                </button>
              </th>
            ))}
            {extraColumns &&
              extraColumns.map((extraColumn, index) => (
                <th key={index} scope="col" className="px-4 py-3 text-center">
                  {extraColumn.header}
                </th>
              ))}
          </thead>
          <tbody className="overflow-y-auto">
            {loading
              ? [...Array(7)].map((_, index) => (
                  <tr key={index} className="border-b dark:border-gray-700">
                    {columns.map((column) => (
                      <td
                        className="text-center px-4 py-3"
                        key={`${index}-${column}`}
                      >
                        <div className="animate-pulse bg-gray-300 h-4 w-full mb-2 rounded"></div>
                      </td>
                    ))}
                    <td className="text-center">
                      <div className="animate-pulse bg-gray-300 h-4 w-full mb-2 rounded"></div>
                    </td>
                  </tr>
                ))
              : sortedData
                  .filter((row) =>
                    row.name.toLowerCase().includes(search.toLowerCase())
                  )
                  .slice((currentPage - 1) * pageSize, currentPage * pageSize)
                  .map((row) => (
                    <tr key={row.id} className="border-b dark:border-gray-700">
                      {columns.map((column) => (
                        <td
                          className="text-center px-4 py-3"
                          key={`${row.id}-${column}`}
                        >
                          {row[column]}
                        </td>
                      ))}
                      {extraColumns &&
                        extraColumns.map((extraColumn, index) => (
                          <td className="text-center" key={index}>
                            {extraColumn.render(row)}
                          </td>
                        ))}
                    </tr>
                  ))}
          </tbody>
        </table>
      </div>
      <nav
        className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 p-4"
        aria-label="Table navigation"
      >
        <span className="text-sm font-normal text-gray-500">
          {"Showing "}
          <span className="font-semibold text-gray-900">
            {(currentPage - 1) * pageSize + 1}
          </span>
          {"of "}
          <span className="font-semibold text-gray-900">
            {Math.min(currentPage * pageSize, data.length)}
          </span>
        </span>
        <ul className="inline-flex items-stretch -space-x-px">
          <li>
            <a
              href="#"
              className="flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
              onClick={() => handlePageChange(currentPage - 1)}
            >
              <span className="sr-only">Previous</span>
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          </li>
          {generatePageNumbers()}
          <li>
            <a
              href="#"
              className="flex items-center justify-center h-full py-1.5 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
              onClick={() => handlePageChange(currentPage + 1)}
            >
              <span className="sr-only">Next</span>
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Table;

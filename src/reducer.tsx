/* eslint-disable @typescript-eslint/no-explicit-any */
import { Reducer } from "react";

export interface State {
  data: any[];
  loading: boolean;
  currentPage: number;
  search: string;
  sortColumn: string;
}

type Action =
  | { type: "SET_DATA"; payload: any[] }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_CURRENT_PAGE"; payload: number }
  | { type: "SET_SEARCH"; payload: string }
  | { type: "SET_SORT_COLUMN"; payload: string }
  | { type: "TOGGLE_ROW_SELECT"; payload: number };

export const reducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case "SET_DATA":
      return { ...state, data: action.payload };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_CURRENT_PAGE":
      return { ...state, currentPage: action.payload };
    case "SET_SEARCH":
      return { ...state, search: action.payload };
    case "SET_SORT_COLUMN":
      return { ...state, sortColumn: action.payload };
    default:
      return state;
  }
};

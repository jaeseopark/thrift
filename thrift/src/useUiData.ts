import { Dispatch, createContext, useContext, useReducer } from "react";

const LOCAL_STORAGE_DEV_ROLE_KEY = "thrift-developer";

type State = {
  selectedProjectIndices: number[];
  projectMultiSelectPivotIndex: number;
  activeDrawerId: string;
};

type UiDataOperation =
  | {
      type: "SET_SELECTED_PROJECT_INDICES";
      payload: number[];
    }
  | {
      type: "SET_PROJECT_MULTI_SELECT_PIVOT_INDEX";
      payload: number;
    }
  | {
      type: "SET_ACTIVE_DRAWER";
      payload: string;
    }
  | { type: "CLOSE_DRAWER" };

const initialState: State = {
  selectedProjectIndices: [],
  projectMultiSelectPivotIndex: 0,
  activeDrawerId: "",
};

const reducer = (state: State, operation: UiDataOperation): State => {
  switch (operation.type) {
    case "SET_SELECTED_PROJECT_INDICES":
      return {
        ...state,
        selectedProjectIndices: operation.payload,
      };
    case "SET_PROJECT_MULTI_SELECT_PIVOT_INDEX":
      return {
        ...state,
        projectMultiSelectPivotIndex: operation.payload,
      };
    case "SET_ACTIVE_DRAWER":
      return {
        ...state,
        activeDrawerId: operation.payload,
      };
    case "CLOSE_DRAWER":
      return {
        ...state,
        activeDrawerId: "",
      };
    default:
      return state;
  }
};

export const UiDataContext = createContext<{
  state: State;
  dispatch?: Dispatch<UiDataOperation>;
}>({
  state: initialState,
});

export const useUiData = () => {
  const { state, dispatch } = useContext(UiDataContext);

  return {
    ...state,
    isDeveloper: LOCAL_STORAGE_DEV_ROLE_KEY in localStorage,
    exitDeveloperMode: () => localStorage.removeItem(LOCAL_STORAGE_DEV_ROLE_KEY),
    setSelectedProjectIndices: (indices: number[]) =>
      dispatch!({ type: "SET_SELECTED_PROJECT_INDICES", payload: indices }),
    setProjectMultiSelectPivotIndex: (index: number) =>
      dispatch!({
        type: "SET_PROJECT_MULTI_SELECT_PIVOT_INDEX",
        payload: index,
      }),
  };
};

export const useUiReducer = () => useReducer(reducer, initialState);

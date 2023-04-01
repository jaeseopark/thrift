import {
  Dispatch,
  useContext,
  useReducer,
  createContext,
  useEffect,
} from "react";
import { ProjectHeaderProps, SCHEMA_VERSION, State } from "./schema";
import reducer, { ThriftDataOperation } from "./useDataReducer";

const LOCAL_STORAGE_KEY = `thrift-v${SCHEMA_VERSION}`;

const blank: State = {
  projects: [],
  materials: [],
  selectedProjectIndices: [],
  projectMultiSelectPivotIndex: 0,
};

const init: State =
  LOCAL_STORAGE_KEY in localStorage
    ? (() => ({
        ...blank,
        ...(JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)!) as State),
      }))()
    : blank;

const ThirftDataContext = createContext<{
  state: State;
  dispatch?: Dispatch<ThriftDataOperation>;
}>({
  state: init,
});

export const DataProvider = ({ children }: { children: JSX.Element }) => {
  const [state, dispatch] = useReducer(reducer, init);
  const value = { state, dispatch };
  return (
    <ThirftDataContext.Provider value={value}>
      {children}
    </ThirftDataContext.Provider>
  );
};

export const useData = () => {
  const { state, dispatch } = useContext(ThirftDataContext);

  useEffect(
    () => localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state)),
    [state]
  );

  return {
    ...state,
    addProject: () => dispatch!({ type: "ADD_PROJECT" }),
    editProjectHeaderProps: (projectHeaderProps: ProjectHeaderProps) =>
      dispatch!({ type: "EDIT_PROJECT", payload: projectHeaderProps }),
    setSelectedProjectIndices: (indices: number[]) =>
      dispatch!({ type: "SET_SELECTED_PROJECT_INDICES", payload: indices }),
    setProjectMultiSelectPivotIndex: (index: number) =>
      dispatch!({
        type: "SET_PROJECT_MULTI_SELECT_PIVOT_INDEX",
        payload: index,
      }),
  };
};

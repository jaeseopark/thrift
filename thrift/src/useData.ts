import { Dispatch, createContext, useCallback, useContext, useEffect, useReducer } from "react";

import { debounce } from "debounce";

import {
  AbstractMaterial,
  CutlistItem,
  PhysicalMaterial,
  Project,
  ProjectHeaderProps,
  SCHEMA_VERSION,
  State,
  Unit,
} from "./schema";
import { getDefaultMaterialCatalog, getNewProjectName, getRandomValue } from "./utils";

const LOCAL_STORAGE_KEY = `thrift-v${SCHEMA_VERSION}`;

type ThriftDataOperation =
  | {
      type: "ADD_PROJECT";
    }
  | {
      type: "EDIT_PROJECT";
      payload: ProjectHeaderProps;
    }
  | {
      type: "ADD_MATERIAL_TO_PROJECT";
      payload: {
        projectId: string;
        cutlistItem: CutlistItem;
      };
    }
  | {
      type: "ADD_MATERIAL_TO_INVENTORY";
      payload: PhysicalMaterial;
    }
  | {
      type: "UPDATE_MATERIAL_IN_PROJECT";
      payload: {
        projectId: string;
        cutlistItem: CutlistItem;
      };
    }
  | {
      type: "UPDATE_MATERIAL_IN_INVENTORY";
      payload: PhysicalMaterial;
    }
  | {
      type: "SET_PREFERRED_UNIT";
      payload: Unit;
    }
  | { type: "SET_STATE"; payload: State };

const blank: State = {
  projects: [],
  inventory: [],
  catalog: getDefaultMaterialCatalog(),
  preferredUnit: "inch",
};

const initialState: State =
  LOCAL_STORAGE_KEY in localStorage
    ? (() => JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)!))()
    : blank;

export const ThirftDataContext = createContext<{
  state: State;
  dispatch?: Dispatch<ThriftDataOperation>;
}>({
  state: initialState,
});

const reducer = (state: State, operation: ThriftDataOperation): State => {
  switch (operation.type) {
    case "ADD_PROJECT":
      return {
        ...state,
        projects: [
          ...state.projects,
          {
            id: getRandomValue(),
            name: getNewProjectName(state.projects.map((project) => project.name)),
            description: "",
            imageUrls: "",
            cutlist: [],
          },
        ],
      };
    case "EDIT_PROJECT": {
      const projects = state.projects.reduce((acc, next) => {
        let elementToPush = next;
        if (next.id === operation.payload.id) {
          elementToPush = { ...elementToPush, ...operation.payload };
        }
        acc.push(elementToPush);
        return acc;
      }, [] as Project[]);

      return {
        ...state,
        projects,
      };
    }
    case "ADD_MATERIAL_TO_PROJECT": {
      const projects = state.projects.reduce((acc, next) => {
        let elementToPush = next;
        if (next.id === operation.payload.projectId) {
          elementToPush = {
            ...elementToPush,
            cutlist: [...elementToPush.cutlist, operation.payload.cutlistItem],
          };
        }
        acc.push(elementToPush);
        return acc;
      }, [] as Project[]);

      return {
        ...state,
        projects,
      };
    }
    case "ADD_MATERIAL_TO_INVENTORY":
      return {
        ...state,
        inventory: [...state.inventory, operation.payload],
      };
    case "UPDATE_MATERIAL_IN_PROJECT": {
      const getNewCutlist = (project: Project) =>
        project.cutlist.reduce((acc, next) => {
          let toPush = next;
          if (toPush.id === operation.payload.cutlistItem.id) {
            toPush = operation.payload.cutlistItem;
          }
          acc.push(toPush);
          return acc;
        }, [] as CutlistItem[]);

      const projects = state.projects.reduce((accProjects, nextProject) => {
        let elementToPush = nextProject;
        if (nextProject.id === operation.payload.projectId) {
          elementToPush = { ...elementToPush, cutlist: getNewCutlist(nextProject) };
        }
        accProjects.push(elementToPush);
        return accProjects;
      }, [] as Project[]);

      return {
        ...state,
        projects,
      };
    }
    case "UPDATE_MATERIAL_IN_INVENTORY":
      return {
        ...state,
        inventory: state.inventory.reduce((acc, next) => {
          let toPush = next;
          if (toPush.id === operation.payload.id) {
            toPush = operation.payload;
          }
          acc.push(toPush);
          return acc;
        }, [] as PhysicalMaterial[]),
      };
    case "SET_PREFERRED_UNIT":
      return {
        ...state,
        preferredUnit: operation.payload,
      };
    case "SET_STATE":
      return operation.payload;
    default:
      break;
  }
  return state;
};

export const useData = () => {
  const { state, dispatch } = useContext(ThirftDataContext);
  const saveToLocalStorage = useCallback(
    debounce(() => localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state)), 500),
    [state]
  );

  useEffect(() => {
    saveToLocalStorage();
    return () => saveToLocalStorage.clear();
  }, [state]);

  return {
    ...state,
    catalogAsDict: state.catalog.reduce((acc, next) => {
      acc[next.id] = next;
      return acc;
    }, {} as { [id: string]: AbstractMaterial }),
    addProject: () => dispatch!({ type: "ADD_PROJECT" }),
    editProjectHeaderProps: (projectHeaderProps: ProjectHeaderProps) =>
      dispatch!({ type: "EDIT_PROJECT", payload: projectHeaderProps }),
    addMaterialToProject: (payload: { projectId: string; cutlistItem: CutlistItem }) =>
      dispatch!({ type: "ADD_MATERIAL_TO_PROJECT", payload }),
    addMaterialToInventory: (material: PhysicalMaterial) =>
      dispatch!({ type: "ADD_MATERIAL_TO_INVENTORY", payload: material }),
    updateMaterialInProject: (payload: { projectId: string; cutlistItem: CutlistItem }) =>
      dispatch!({ type: "UPDATE_MATERIAL_IN_PROJECT", payload }),
    updateMaterialInInventory: (material: PhysicalMaterial) =>
      dispatch!({ type: "UPDATE_MATERIAL_IN_INVENTORY", payload: material }),
    setPreferredUnit: (unit: Unit) => dispatch!({ type: "SET_PREFERRED_UNIT", payload: unit }),
    reset: () => dispatch!({ type: "SET_STATE", payload: blank }),
    applySampleData: () => {},
  };
};

export const useDataReducer = () => useReducer(reducer, initialState);

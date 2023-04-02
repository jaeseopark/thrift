import { Dispatch, createContext, useContext, useEffect, useReducer } from "react";
import InventoryList from "./ProjectList";

import {
  AbstractMaterial,
  MaterialRequirement,
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
      requirement: MaterialRequirement;
    };
  } | {
    type: "ADD_MATERIAL_TO_INVENTORY",
    payload: PhysicalMaterial
  }
  | {
    type: "UPDATE_MATERIAL_IN_PROJECT";
    payload: {
      projectId: string;
      requirement: MaterialRequirement;
    };
  } | {
    type: "UPDATE_MATERIAL_IN_INVENTORY",
    payload: PhysicalMaterial
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
            requirements: [],
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
            requirements: [...elementToPush.requirements, operation.payload.requirement],
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
        inventory: [...state.inventory, operation.payload]
      }
    case "UPDATE_MATERIAL_IN_PROJECT": {
      const projects = state.projects.reduce((accProjects, nextProject) => {
        let elementToPush = nextProject;
        if (nextProject.id === operation.payload.projectId) {
          const requirements = nextProject.requirements.reduce(
            (accRequirements, nextRequirements) => {
              let requirementToPush = nextRequirements;
              if (requirementToPush.id === operation.payload.requirement.id) {
                requirementToPush = operation.payload.requirement;
              }
              accRequirements.push(requirementToPush);
              return accRequirements;
            },
            [] as MaterialRequirement[]
          );
          elementToPush = { ...elementToPush, requirements };
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
          return acc;
        }, [] as PhysicalMaterial[])
      }
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

  useEffect(() => localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state)), [state]);

  return {
    ...state,
    catalogAsDict: state.catalog.reduce((acc, next) => {
      acc[next.id] = next;
      return acc;
    }, {} as { [id: string]: AbstractMaterial }),
    addProject: () => dispatch!({ type: "ADD_PROJECT" }),
    editProjectHeaderProps: (projectHeaderProps: ProjectHeaderProps) =>
      dispatch!({ type: "EDIT_PROJECT", payload: projectHeaderProps }),
    addMaterialToProject: (payload: { projectId: string; requirement: MaterialRequirement }) =>
      dispatch!({ type: "ADD_MATERIAL_TO_PROJECT", payload }),
    addMaterialToInventory: (material: PhysicalMaterial) => dispatch!({ type: "ADD_MATERIAL_TO_INVENTORY", payload: material }),
    updateMaterialInProject: (payload: { projectId: string; requirement: MaterialRequirement }) =>
      dispatch!({ type: "UPDATE_MATERIAL_IN_PROJECT", payload }),
    updateMaterialInInventory: (material: PhysicalMaterial) => dispatch!({ type: "UPDATE_MATERIAL_IN_INVENTORY", payload: material }),
    setPreferredUnit: (unit: Unit) => dispatch!({ type: "SET_PREFERRED_UNIT", payload: unit }),
    reset: () => dispatch!({ type: "SET_STATE", payload: blank }),
    applySampleData: () => { },
  };
};

export const useDataReducer = () => useReducer(reducer, initialState);

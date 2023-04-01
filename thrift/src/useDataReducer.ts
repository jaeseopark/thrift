import { PhysicalMaterial, Project, ProjectHeaderProps, State } from "./schema";
import { getRandomValue, getNewProjectName } from "./utils";

export type ThriftDataOperation = {
    type: "SET_SELECTED_PROJECT_INDICES",
    payload: number[]
} | {
    type: "SET_PROJECT_MULTI_SELECT_PIVOT_INDEX",
    payload: number
} | {
    type: "ADD_PROJECT"
} | {
    type: "EDIT_PROJECT", payload: ProjectHeaderProps
} | {
    type: "ADD_MATERIAL_TO_PROJECT",
    payload: { material: PhysicalMaterial }
};

const reducer = (state: State, operation: ThriftDataOperation): State => {
    switch (operation.type) {
        case "ADD_PROJECT":
            return {
                ...state,
                projects: [
                    ...state.projects,
                    {
                        id: getRandomValue(),
                        name: getNewProjectName(
                            state.projects.map((project) => project.name)
                        ),
                        description: "",
                        imageUrls: "",
                        requiredMaterials: [],
                    },
                ],
            };
        case "EDIT_PROJECT":
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
                projects
            }
        case "SET_SELECTED_PROJECT_INDICES":
            return {
                ...state,
                selectedProjectIndices: operation.payload
            }
        case "SET_PROJECT_MULTI_SELECT_PIVOT_INDEX":
            return {
                ...state,
                projectMultiSelectPivotIndex: operation.payload
            }
        default:
            break;
    }
    return state;
};

export default reducer;

import { useContext } from "react";

import { UiDataContext } from "./useUiData";

export const useGlobalDrawer = (id: string) => {
  const { state, dispatch } = useContext(UiDataContext);

  return {
    isOpen: state.activeDrawerId === id,
    onOpen: () => dispatch!({ type: "SET_ACTIVE_DRAWER", payload: id }),
    onClose: () => dispatch!({ type: "CLOSE_DRAWER" }),
  };
};

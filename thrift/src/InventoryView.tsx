import { MdInventory } from "react-icons/md";

import {
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Icon,
} from "@chakra-ui/react";

import { useGlobalDrawer } from "./useDrawer";

const InventoryView = () => {
  const { isOpen, onOpen, onClose } = useGlobalDrawer("inventory");

  return (
    <>
      <Box className="button-container" onClick={onOpen}>
        <Icon as={MdInventory} width="100%" height="100%" />
      </Box>

      <Drawer placement="right" size="xl" isOpen={isOpen} onClose={onClose} closeOnEsc={false}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Inventory</DrawerHeader>
            <DrawerBody>
              <div className="inventory-view">Table here</div>
            </DrawerBody>
          </DrawerContent>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default InventoryView;

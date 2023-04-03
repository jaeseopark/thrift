import {
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Icon,
  Tbody,
} from "@chakra-ui/react";
import { MdInventory } from "react-icons/md";

import MaterialTableShell from "./MaterialTableShell";
import { Row } from "./ProjectRequirementView";
import { PhysicalMaterial } from "./schema";
import { useData } from "./useData";
import { useGlobalDrawer } from "./useDrawer";

const ExistingRow = ({ materialInHand }: { materialInHand: PhysicalMaterial }) => {
  const { updateMaterialInInventory } = useData();
  return (
    <Row
      requirement={{ ...materialInHand, shouldMaintainGrainDirection: false }}
      onChange={(material) => {
        updateMaterialInInventory(material);
      }}
    />
  );
};

const NewRow = () => {
  const { addMaterialToInventory } = useData();
  return <Row onAdd={addMaterialToInventory} />;
};

const InventoryView = () => {
  const { isOpen, onOpen, onClose } = useGlobalDrawer("inventory");
  const { inventory } = useData();

  return (
    <>
      <Box className="button-container" onClick={onOpen}>
        <Icon as={MdInventory} width="100%" height="100%" />
      </Box>

      <Drawer placement="right" size="xl" isOpen={isOpen} onClose={onClose} closeOnEsc={false}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Inventory</DrawerHeader>
          <DrawerBody>
            <MaterialTableShell>
              <Tbody>
                {inventory.map((materialInHand) => (
                  <ExistingRow key={materialInHand.id} materialInHand={materialInHand} />
                ))}
                <NewRow />
              </Tbody>
            </MaterialTableShell>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default InventoryView;

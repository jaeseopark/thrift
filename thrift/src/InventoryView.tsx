import { Button, Flex, Heading, Input, Spacer, useDisclosure } from "@chakra-ui/react";
import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
} from "@chakra-ui/react";

import { useGlobalDrawer } from "./useDrawer";

const InventoryView = () => {
  // const { isOpen, onOpen, onClose } = useGlobalDrawer("inventory");
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Drawer placement="right" size="md" isOpen={isOpen} onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Create your account</DrawerHeader>
            <DrawerBody>
              <Input placeholder="Type here..." />
            </DrawerBody>
            <DrawerFooter>
              <Button colorScheme="blue">Save</Button>
            </DrawerFooter>
          </DrawerContent>
        </DrawerContent>
      </Drawer>
      <div className="inventory-view">
        <Flex>
          <Heading as="h2" size="md" marginTop="1em">
            Inventory
          </Heading>
          <Spacer />
          <Button size="xs" colorScheme="teal" onClick={onOpen}>
            +
          </Button>
        </Flex>
      </div>
    </>
  );
};

export default InventoryView;

import {
  Box,
  Button,
  FocusLock,
  Heading,
  Icon,
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Radio,
  RadioGroup,
  Stack,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import { BsFillGearFill } from "react-icons/bs";
import { GrDocumentTest } from "react-icons/gr";
import { ImDownload3 } from "react-icons/im";
import { MdOutlineRestore } from "react-icons/md";
import { RiDeleteBin5Line } from "react-icons/ri";
import styled from "styled-components";

import { Unit } from "./schema";
import { useData } from "./useData";
import { useGlobalDrawer } from "./useDrawer";
import { useUiData } from "./useUiData";

const FullWidthButton = styled(Button)`
  width: 100%;
`;

const DataMgmtView = () => {
  const { isOpen, onOpen, onClose } = useGlobalDrawer("data");
  const { preferredUnit, setPreferredUnit, reset, applySampleData } = useData();
  const { isDeveloper, exitDeveloperMode } = useUiData();

  return (
    <Popover isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
      <PopoverTrigger>
        <Box className="button-container">
          <Icon as={BsFillGearFill} width="100%" height="100%" />
        </Box>
      </PopoverTrigger>
      <PopoverContent p={5}>
        <FocusLock persistentFocus={false}>
          <PopoverArrow />
          <PopoverHeader>
            <Heading as="h2" size="md">
              Preferences
            </Heading>
          </PopoverHeader>
          <Box className="preferences-form" padding="1em">
            <Tooltip
              hasArrow
              label="The selected option will be used if you omit the unit in an input"
              fontSize="md"
            >
              <span>Preferred Unit:</span>
            </Tooltip>
            <RadioGroup onChange={(unit) => setPreferredUnit(unit as Unit)} value={preferredUnit}>
              <Stack direction="row">
                <Radio value="inch">Inch (")</Radio>
                <Radio value="mm">Millimetre (mm)</Radio>
              </Stack>
            </RadioGroup>
          </Box>
          <PopoverHeader>
            <Heading as="h2" size="md">
              Data
            </Heading>
          </PopoverHeader>
          <VStack className="data-buttons" padding="1em" spacing=".5em">
            <FullWidthButton leftIcon={<RiDeleteBin5Line />} colorScheme="red" onClick={reset}>
              Start Over
            </FullWidthButton>
            <FullWidthButton leftIcon={<ImDownload3 />} colorScheme="teal">
              Backup
            </FullWidthButton>
            <FullWidthButton leftIcon={<MdOutlineRestore />}>Restore</FullWidthButton>
          </VStack>
          {isDeveloper && (
            <>
              <PopoverHeader>
                <Heading as="h2" size="md">
                  Developer
                </Heading>
              </PopoverHeader>
              <VStack className="data-buttons" padding="1em" spacing=".5em">
                <FullWidthButton leftIcon={<GrDocumentTest />} onClick={applySampleData}>
                  Apply Sample Data
                </FullWidthButton>
                <FullWidthButton leftIcon={<GrDocumentTest />} onClick={exitDeveloperMode}>
                  Exit Developer Mode
                </FullWidthButton>
              </VStack>
            </>
          )}
        </FocusLock>
      </PopoverContent>
    </Popover>
  );
};

export default DataMgmtView;

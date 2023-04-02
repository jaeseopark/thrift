import { GrDocumentTest } from "react-icons/gr";
import { ImDownload3 } from "react-icons/im";
import { MdBuild, MdOutlineRestore } from "react-icons/md";
import { RiDeleteBin5Line } from "react-icons/ri";

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
  VStack,
} from "@chakra-ui/react";

import styled from "styled-components";

import { ImperialPrecision, Unit } from "./schema";
import { useData } from "./useData";
import { useGlobalDrawer } from "./useDrawer";
import { useUiData } from "./useUiData";

const TriggerButton = styled.div`
  position: absolute;
  right: 1em;
  width: 2.5em;
  height: 2.5em;
  padding: 0.5em;
  background-color: white;
  border-radius: 0.25em;
  // TODO: button alignment
`;

const FullWidthButton = styled(Button)`
  width: 100%;
`;

const DataMgmtView = () => {
  const { isOpen, onOpen, onClose } = useGlobalDrawer("data");
  const {
    preferredUnit,
    imperialPrecision,
    setPreferredUnit,
    setImperialPrecision,
    reset,
    applySampleData,
  } = useData();
  const { isDeveloper, exitDeveloperMode } = useUiData();

  return (
    <Popover isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
      <PopoverTrigger>
        <TriggerButton>
          <Icon as={MdBuild} />
        </TriggerButton>
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
            Preferred Unit:
            <RadioGroup onChange={(unit) => setPreferredUnit(unit as Unit)} value={preferredUnit}>
              <Stack direction="row">
                <Radio value="inch">Inch (")</Radio>
                <Radio value="mm">Millimetre (mm)</Radio>
              </Stack>
            </RadioGroup>
          </Box>
          {preferredUnit === "inch" && (
            <Box padding="1em">
              <RadioGroup
                onChange={(precision) =>
                  setImperialPrecision(Number.parseInt(precision) as ImperialPrecision)
                }
                value={imperialPrecision.toFixed(0)}
              >
                <Stack direction="row">
                  <Radio value="4">Nearest 1/4</Radio>
                  <Radio value="8">Nearest 1/8</Radio>
                  <Radio value="16">Nearest 1/16</Radio>
                </Stack>
              </RadioGroup>
            </Box>
          )}
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

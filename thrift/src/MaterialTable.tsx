import { KeyboardEvent, useCallback, useEffect, useMemo, useState } from "react";
import { ReactNode } from "react";

import { Button, Checkbox, Flex, Icon, Input, Select, Spacer, Td, Tr } from "@chakra-ui/react";
import { Table, Th, Thead } from "@chakra-ui/react";
import { Tooltip } from "@chakra-ui/react";
import { debounce } from "debounce";
import { MdAdd, MdInfoOutline, MdOutlineDone } from "react-icons/md";

import { AbstractMaterial, CutlistItem } from "./schema";
import { useData } from "./useData";
import { equals, getRandomValue, toHumanFormat, toMeasurement } from "./utils";

export const Row = ({
  cutlistItem,
  onChange,
  onAdd,
  allowGrainDirectionSelection,
  readonly,
}: {
  cutlistItem?: CutlistItem;
  onChange?: (material: CutlistItem) => void;
  onAdd?: (material: CutlistItem) => void;
  allowGrainDirectionSelection?: boolean;
  readonly?: boolean;
}) => {
  const { catalog, catalogAsDict, preferredUnit } = useData();
  const [abstractMaterial, setAbstractMaterial] = useState<AbstractMaterial | undefined>(
    catalogAsDict[cutlistItem?.abstractMaterialId || ""]
  );
  const toPreferredMeasurement = (s: string) => toMeasurement(s, preferredUnit);
  // TODO: consider grain direction
  const [thickness, setThickness] = useState(cutlistItem?.thickness);
  const [width, setWidth] = useState(cutlistItem?.width);
  const [length, setLength] = useState(cutlistItem?.length);
  const [quantity, setQuantity] = useState(cutlistItem?.quantity || 1);
  const [shouldMaintainGrainDirection, setShouldMaintainGrainDirection] = useState(
    !!cutlistItem?.shouldMaintainGrainDirection
  );

  const [editThickness, setEditThickness] = useState(thickness ? toHumanFormat(thickness) : "");
  const [editWidth, setEditWidth] = useState(width ? toHumanFormat(width) : "");
  const [editLength, setEditLength] = useState(length ? toHumanFormat(length) : "");

  const [showUpdateIndicator, setShowUpdateIndicator] = useState(false);

  const isReadyToSave = useMemo(() => {
    if (readonly) {
      return false;
    }
    if (abstractMaterial && thickness && width && length && quantity > 0) {
      if (!cutlistItem) {
        // this is the 'new row' scenario.
        return true;
      }

      // this is the 'existing row' scenario. ie. only ready to save if the values have changed.
      return (
        abstractMaterial.id !== cutlistItem.abstractMaterialId ||
        !equals(thickness, cutlistItem.thickness) ||
        !equals(width, cutlistItem.width) ||
        !equals(length, cutlistItem.length) ||
        quantity !== cutlistItem.quantity ||
        shouldMaintainGrainDirection !== cutlistItem.shouldMaintainGrainDirection
      );
    }
    return false;
  }, [
    abstractMaterial,
    thickness,
    width,
    length,
    quantity,
    shouldMaintainGrainDirection,
    cutlistItem,
  ]);

  const save = useCallback(
    debounce(() => {
      onChange!(getNewCutlistItem()!);
      setShowUpdateIndicator(true);
      setTimeout(() => setShowUpdateIndicator(false), 2000);
    }, 500),
    [isReadyToSave]
  );

  useEffect(() => {
    if (onChange && isReadyToSave) {
      save();
    }
  }, [isReadyToSave]);

  const getNewCutlistItem = (): CutlistItem | undefined => {
    if (isReadyToSave) {
      return {
        id: cutlistItem?.id || getRandomValue(),
        abstractMaterialId: abstractMaterial!.id,
        shouldMaintainGrainDirection:
          abstractMaterial!.hasGrainDirection && shouldMaintainGrainDirection,
        thickness: thickness!,
        width: width!,
        length: length!,
        quantity,
      };
    }
  };

  const clearFields = () => {
    setAbstractMaterial(undefined);
    setEditThickness("");
    setEditWidth("");
    setEditLength("");
    setQuantity(1);
    setShouldMaintainGrainDirection(false);
  };

  const tryAdd = () => {
    if (isReadyToSave && onAdd) {
      onAdd(getNewCutlistItem()!);
      clearFields();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      tryAdd();
    }
  };

  return (
    <Tr>
      <Td>
        <Flex flexDir="row">
          <Select
            maxWidth="275px"
            value={abstractMaterial?.id || ""}
            isDisabled={readonly}
            onChange={(e) => {
              const [absMat] = catalog.filter((absMat) => absMat.id === e.target.value);
              setAbstractMaterial(absMat);
            }}
          >
            {onAdd && <option />}
            {catalog.map((absMat) => (
              <option key={absMat.id} value={absMat.id}>
                {absMat.name}
              </option>
            ))}
          </Select>
          <Spacer />
          {allowGrainDirectionSelection && abstractMaterial?.hasGrainDirection && (
            <Checkbox
              isChecked={shouldMaintainGrainDirection}
              isReadOnly={readonly}
              onChange={(e) => setShouldMaintainGrainDirection(e.target.checked)}
            >
              Maintain Grain Direction
            </Checkbox>
          )}
        </Flex>
      </Td>
      <Td>
        <Input
          type="text"
          value={editThickness}
          isInvalid={!thickness}
          errorBorderColor={editThickness && !thickness ? "red.500" : "gray.400"}
          onKeyDown={handleKeyDown}
          isReadOnly={readonly}
          onChange={(e) => {
            setEditThickness(e.target.value);
            setThickness(toPreferredMeasurement(e.target.value));
          }}
          onBlur={() => {
            if (thickness) {
              setEditThickness(toHumanFormat(thickness));
            }
          }}
        />
      </Td>
      <Td>
        <Input
          type="text"
          value={editWidth}
          isInvalid={!width}
          errorBorderColor={editWidth && !width ? "red.500" : "gray.400"}
          onKeyDown={handleKeyDown}
          isReadOnly={readonly}
          onChange={(e) => {
            setEditWidth(e.target.value);
            setWidth(toPreferredMeasurement(e.target.value));
          }}
          onBlur={() => {
            if (width) {
              setEditWidth(toHumanFormat(width));
            }
          }}
        />
      </Td>
      <Td>
        <Input
          type="text"
          value={editLength}
          isInvalid={!length}
          errorBorderColor={editLength && !length ? "red.500" : "gray.400"}
          onKeyDown={handleKeyDown}
          isReadOnly={readonly}
          onChange={(e) => {
            setEditLength(e.target.value);
            setLength(toPreferredMeasurement(e.target.value));
          }}
          onBlur={() => {
            if (length) {
              setEditLength(toHumanFormat(length));
            }
          }}
        />
      </Td>
      <Td>
        <Input
          type="number"
          value={quantity}
          min={1}
          max={10000}
          step={1}
          isInvalid={quantity < 1}
          errorBorderColor="red.500"
          onKeyDown={handleKeyDown}
          isReadOnly={readonly}
          onChange={(e) => setQuantity(e.target.valueAsNumber)}
        />
      </Td>
      <Td>
        {onAdd && (
          <Button
            leftIcon={<MdAdd />}
            onClick={tryAdd}
            isDisabled={!isReadyToSave}
            colorScheme="teal"
          >
            Add
          </Button>
        )}
        {showUpdateIndicator && <MdOutlineDone />}
      </Td>
    </Tr>
  );
};

export const MaterialTableShell = ({ children }: { children: ReactNode }) => (
  <Table>
    <Thead>
      <Tr>
        <Th width="550px">Material</Th>
        <Th width="200px">
          Thickness
          <Tooltip label='Example: 3/4" or 19 mm' fontSize="md">
            <span>
              <Icon as={MdInfoOutline} />
            </span>
          </Tooltip>
        </Th>
        <Th width="200px">
          Width
          <Tooltip label='Example: 5 1/2" or 140 mm' fontSize="md">
            <span>
              <Icon as={MdInfoOutline} />
            </span>
          </Tooltip>
        </Th>
        <Th width="200px">
          Length
          <Tooltip label='Example: 36" or 914 mm' fontSize="md">
            <span>
              <Icon as={MdInfoOutline} />
            </span>
          </Tooltip>
        </Th>
        <Th width="200px">Quantity</Th>
        <Th />
      </Tr>
    </Thead>
    {children}
  </Table>
);

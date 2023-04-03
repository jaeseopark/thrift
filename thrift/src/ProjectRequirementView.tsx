import { KeyboardEvent, useCallback, useEffect, useMemo, useState } from "react";

import { Button, Checkbox, Flex, Input, Select, Spacer, Tbody, Td, Tr } from "@chakra-ui/react";
import { debounce } from "debounce";
import { MdAdd, MdOutlineDone } from "react-icons/md";

import MaterialTableShell from "./MaterialTableShell";
import { AbstractMaterial, MaterialRequirement, PhysicalMaterial } from "./schema";
import { useData } from "./useData";
import { equals, getRandomValue, toHumanFormat, toMeasurement } from "./utils";

import "./App.scss";

export const Row = ({
  requirement,
  onChange,
  onAdd,
  allowGrainDirectionSelection,
  readonly,
}: {
  requirement?: MaterialRequirement;
  onChange?: (material: MaterialRequirement) => void;
  onAdd?: (material: MaterialRequirement) => void;
  allowGrainDirectionSelection?: boolean;
  readonly?: boolean;
}) => {
  const { catalog, catalogAsDict, preferredUnit } = useData();
  const [abstractMaterial, setAbstractMaterial] = useState<AbstractMaterial | undefined>(
    catalogAsDict[requirement?.abstractMaterialId || ""]
  );
  const toPreferredMeasurement = (s: string) => toMeasurement(s, preferredUnit);
  // TODO: consider grain direction
  const [thickness, setThickness] = useState(requirement?.thickness);
  const [width, setWidth] = useState(requirement?.width);
  const [length, setLength] = useState(requirement?.length);
  const [quantity, setQuantity] = useState(requirement?.quantity || 1);
  const [shouldMaintainGrainDirection, setShouldMaintainGrainDirection] = useState(
    !!requirement?.shouldMaintainGrainDirection
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
      if (!requirement) {
        // this is the 'new row' scenario.
        return true;
      }

      // this is the 'existing row' scenario. ie. only ready to save if the values have changed.
      return (
        abstractMaterial.id !== requirement.abstractMaterialId ||
        !equals(thickness, requirement.thickness) ||
        !equals(width, requirement.width) ||
        !equals(length, requirement.length) ||
        quantity !== requirement.quantity ||
        shouldMaintainGrainDirection !== requirement.shouldMaintainGrainDirection
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
    requirement,
  ]);

  const save = useCallback(
    debounce(() => {
      onChange!(getNewRequirement()!);
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

  const getNewRequirement = (): MaterialRequirement | undefined => {
    if (isReadyToSave) {
      return {
        id: requirement?.id || getRandomValue(),
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
      onAdd(getNewRequirement()!);
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
          placeholder='Example: 3/4" or 19 mm'
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
          placeholder='Example: 9 3/4" or 248 mm'
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
          placeholder='Example: 64" or 1626 mm'
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

const ExistingRow = ({
  projectId,
  requirement,
  readonly,
}: {
  projectId: string;
  requirement: MaterialRequirement;
  readonly?: boolean;
}) => {
  const { updateMaterialInProject } = useData();
  return (
    <Row
      allowGrainDirectionSelection={true}
      requirement={requirement}
      readonly={readonly}
      onChange={(requirement) => {
        updateMaterialInProject({ projectId, requirement });
      }}
    />
  );
};

const NewRow = ({ projectId }: { projectId: string }) => {
  const { addMaterialToProject } = useData();
  return (
    <Row
      allowGrainDirectionSelection={true}
      onAdd={(requirement) => {
        addMaterialToProject({ projectId, requirement });
      }}
    />
  );
};

export const ReadOnlyMaterialView = ({ requirements }: { requirements: MaterialRequirement[] }) => {
  return (
    <MaterialTableShell>
      <Tbody>
        {requirements.map((requirement) => (
          <ExistingRow key={requirement.id} projectId="" requirement={requirement} readonly />
        ))}
      </Tbody>
    </MaterialTableShell>
  );
};

export const EditableMaterialView = ({
  projectId,
  requirements,
}: {
  projectId: string;
  requirements: MaterialRequirement[];
}) => {
  return (
    <MaterialTableShell>
      <Tbody>
        {requirements.map((requirement) => (
          <ExistingRow key={requirement.id} projectId={projectId} requirement={requirement} />
        ))}
        <NewRow projectId={projectId} />
      </Tbody>
    </MaterialTableShell>
  );
};

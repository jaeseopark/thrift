import { useEffect, useMemo, useState } from "react";
import Select from "react-dropdown-select";
import { MdAdd, MdOutlineDone } from "react-icons/md";

import { Button, Input, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";

import { AbstractMaterial, MaterialRequirement, PhysicalMaterial, Project } from "./schema";
import { useData } from "./useData";
import { useUiData } from "./useUiData";
import { equals, getRandomValue, toHumanFormat, toMeasurement } from "./utils";

import "./App.scss";

const ProjectGallery = ({ urls }: { urls: string[] }) => {
  return (
    <div>
      {urls.map((url, i) => (
        <img key={`${url}${i}`} src={url} />
      ))}
    </div>
  );
};

const ProjectHeader = ({ project }: { project: Project }) => {
  return (
    <div>
      {project.name}
      <Button size="xs">✏️</Button>
    </div>
  );
};

const ReadOnlyMaterialView = ({ requirements }: { requirements: PhysicalMaterial[] }) => {
  // TODO
  return <div>ReadOnlyMaterialView</div>;
};

const Row = ({
  requirement,
  onChange,
  onAdd,
}: {
  requirement?: MaterialRequirement;
  onChange?: (material: MaterialRequirement) => void;
  onAdd?: (material: MaterialRequirement) => void;
}) => {
  const { catalog, catalogAsDict, preferredUnit, imperialPrecision } = useData();
  const [abstractMaterial, setAbstractMaterial] = useState<AbstractMaterial | undefined>(
    catalogAsDict[requirement?.abstractMaterialId || ""]
  );
  const toPreferredMeasurement = (s: string) => toMeasurement(s, preferredUnit);
  // TODO: consider grain direction
  const [thickness, setThickness] = useState(requirement?.thickness);
  const [width, setWidth] = useState(requirement?.width);
  const [length, setLength] = useState(requirement?.length);
  const [quantity, setQuantity] = useState(requirement?.quantity || 1);

  const [editThickness, setEditThickness] = useState(thickness ? toHumanFormat(thickness) : "");
  const [editWidth, setEditWidth] = useState(width ? toHumanFormat(width) : "");
  const [editLength, setEditLength] = useState(length ? toHumanFormat(length) : "");
  const [editQuantity, setEditQuantity] = useState(requirement?.quantity || 1);

  const [showUpdateIndicator, setShowUpdateIndicator] = useState(false);

  const isReadyToSave = useMemo(() => {
    if (abstractMaterial && thickness && width && length && quantity > 0) {
      if (!requirement) {
        return true;
      }
      const isDirty =
        abstractMaterial.id !== requirement.abstractMaterialId ||
        !equals(thickness, requirement.thickness) ||
        !equals(width, requirement.width) ||
        !equals(length, requirement.length) ||
        quantity !== requirement.quantity;

      return isDirty;
    }
    return false;
  }, [abstractMaterial, thickness, width, length, quantity, requirement]);

  useEffect(() => {
    if (onChange && isReadyToSave) {
      onChange(getNewRequirement()!);
      setShowUpdateIndicator(true);
      setTimeout(() => {
        // hide the indicator after 2000ms.
        setShowUpdateIndicator(false);
      }, 2000);
    }
  }, [isReadyToSave]);

  const getNewRequirement = (): MaterialRequirement | undefined => {
    if (isReadyToSave) {
      return {
        id: requirement?.id || getRandomValue(),
        abstractMaterialId: abstractMaterial!.id,
        shouldMaintainGrainDirection: false,
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
    setEditQuantity(1);
  };

  return (
    <Tr>
      <Td>
        <Select
          options={catalog}
          labelField="name"
          valueField="id"
          searchBy="name"
          values={abstractMaterial ? [abstractMaterial] : []}
          onChange={([value]) => setAbstractMaterial(value)}
        />
      </Td>
      <Td>
        <Input
          type="text"
          value={editThickness}
          onChange={(e) => setEditThickness(e.target.value)}
          onBlur={() => setThickness(toPreferredMeasurement(editThickness))}
          placeholder='Example: 3/4" or 19 mm'
        />
      </Td>
      <Td>
        <Input
          type="text"
          value={editWidth}
          onChange={(e) => setEditWidth(e.target.value)}
          onBlur={() => setWidth(toPreferredMeasurement(editWidth))}
          placeholder='Example: 9 3/4" or 248 mm'
        />
      </Td>
      <Td>
        <Input
          type="text"
          value={editLength}
          onChange={(e) => setEditLength(e.target.value)}
          onBlur={() => setLength(toPreferredMeasurement(editLength))}
          placeholder='Example: 64" or 1626 mm'
        />
      </Td>
      <Td>
        <Input
          type="number"
          value={editQuantity}
          onChange={(e) => setEditQuantity(e.target.valueAsNumber)}
          onBlur={() => setQuantity(editQuantity)}
          min={0}
          max={10000}
          step={1}
        />
      </Td>
      <Td>
        {onAdd && (
          <Button
            leftIcon={<MdAdd />}
            onClick={() => {
              onAdd(getNewRequirement()!);
              clearFields();
            }}
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
}: {
  projectId: string;
  requirement: MaterialRequirement;
}) => {
  const { updateMaterialInProject } = useData();
  return (
    <Row
      requirement={requirement}
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
      onAdd={(requirement) => {
        addMaterialToProject({ projectId, requirement });
      }}
    />
  );
};

const EditableMaterialView = ({
  projectId,
  requirements,
}: {
  projectId: string;
  requirements: MaterialRequirement[];
}) => {
  return (
    <div>
      <Table>
        <Thead>
          <Tr>
            <Th>Material</Th>
            <Th>Thickness</Th>
            <Th>Width</Th>
            <Th>Length</Th>
            <Th>Quantity</Th>
            <Th />
          </Tr>
        </Thead>
        <Tbody>
          {requirements.map((requirement) => (
            <ExistingRow key={requirement.id} projectId={projectId} requirement={requirement} />
          ))}
          <NewRow projectId={projectId} />
        </Tbody>
      </Table>
    </div>
  );
};

const ProjectView = () => {
  const { projects } = useData();
  const { selectedProjectIndices } = useUiData();

  const selectedProjects: Project[] = useMemo(
    () => projects.filter((_, i) => selectedProjectIndices.includes(i)),
    [selectedProjectIndices, projects]
  );

  if (selectedProjects.length === 0) {
    return <div className="project-view">Welcome!</div>;
  }

  const urls = selectedProjects
    .map((p) => p.imageUrls)
    .join("\n")
    .split("\n");

  const requirements = selectedProjects.flatMap((project) => project.requirements);

  return (
    <div className="project-view">
      {selectedProjects.length > 1 && <div>{selectedProjects.map((p) => p.name).join(", ")}</div>}
      {selectedProjects.length === 1 && <ProjectHeader project={selectedProjects[0]} />}
      <ProjectGallery urls={urls} />
      {selectedProjects.length > 1 && <ReadOnlyMaterialView requirements={requirements} />}
      {selectedProjects.length === 1 && (
        <EditableMaterialView projectId={selectedProjects[0].id} requirements={requirements} />
      )}
    </div>
  );
};

export default ProjectView;

import { Button, Flex, Heading, Spacer } from "@chakra-ui/react";

import cls from "classnames";

import { useData } from "./useData";
import { useUiData } from "./useUiData";
import { range } from "./utils";

const InventoryList = () => {
  const { projects, addProject } = useData();
  const {
    selectedProjectIndices,
    projectMultiSelectPivotIndex,

    setSelectedProjectIndices,
    setProjectMultiSelectPivotIndex,
  } = useUiData();

  const onProjectClick = (e: MouseEvent, projectIndex: number) => {
    if (e.getModifierState("Shift")) {
      setSelectedProjectIndices(range(projectMultiSelectPivotIndex, projectIndex));
    } else if (e.getModifierState("Meta")) {
      if (!selectedProjectIndices.includes(projectIndex)) {
        setSelectedProjectIndices([...selectedProjectIndices, projectIndex]);
      } else {
        setSelectedProjectIndices(selectedProjectIndices.filter((i) => i !== projectIndex));
      }
    } else {
      setProjectMultiSelectPivotIndex(projectIndex);
      setSelectedProjectIndices([projectIndex]);
    }
  };

  return (
    <div className="project-list">
      <Flex>
        <Heading as="h2" size="md">
          Projects
        </Heading>
        <Spacer />
        <Button onClick={addProject} size="xs" colorScheme="teal" className="add-project">
          +
        </Button>
      </Flex>
      {projects.map((project, i) => (
        <Heading
          as="h5"
          size="sm"
          key={project.id}
          className={cls("submenu", {
            highlighted: selectedProjectIndices.includes(i),
          })}
          onClick={(e) => onProjectClick(e as any, i)}
        >
          {project.name}
        </Heading>
      ))}
      {!projects.length && <Spacer minHeight="1em" />}
    </div>
  );
};

export default InventoryList;

import { Button, Heading, Spacer } from "@chakra-ui/react";
import { useData } from "./useData";
import cls from "classnames";
import { range } from "./utils";

const Sidebar = () => {
  const {
    selectedProjectIndices,
    projectMultiSelectPivotIndex,
    projects,
    addProject,
    setSelectedProjectIndices,
    setProjectMultiSelectPivotIndex,
  } = useData();

  const onProjectClick = (e: MouseEvent, projectIndex: number) => {
    if (e.getModifierState("Shift")) {
      setSelectedProjectIndices(
        range(projectMultiSelectPivotIndex, projectIndex)
      );
    } else if (e.getModifierState("Meta")) {
      if (!selectedProjectIndices.includes(projectIndex)) {
        setSelectedProjectIndices([...selectedProjectIndices, projectIndex]);
      } else {
        // TODO: remove
      }
    } else {
      setProjectMultiSelectPivotIndex(projectIndex);
      setSelectedProjectIndices([projectIndex]);
    }
  };

  return (
    <div className="sidebar">
      <Heading as="h2" size="md">
        Projects
        <Button onClick={addProject} size="xs" className="add-project">
          +
        </Button>
      </Heading>
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
      <Heading as="h2" size="md">
        Inventory
      </Heading>
      <Heading as="h2" size="md">
        Data
      </Heading>
      <Heading as="h5" size="sm" className="submenu">
        ✅ Backup
      </Heading>
      <Heading as="h5" size="sm" className="submenu">
        ♻️ Restore
      </Heading>
      <Heading as="h2" size="md">
        Preferences
      </Heading>
    </div>
  );
};

export default Sidebar;

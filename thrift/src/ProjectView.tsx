import "./App.scss";
import { useData } from "./useData";
import { useMemo } from "react";
import { PhysicalMaterial, Project } from "./schema";
import { Button } from "@chakra-ui/react";
import { getRandomValue } from "./utils";

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
  const { editProjectHeaderProps } = useData();

  const editProject = () =>
    // this is test code
    editProjectHeaderProps({
      ...project,
      name: `Project ${getRandomValue()}`,
      imageUrls:
        "https://sm.mashable.com/mashable_sea/photo/default/man-fakes-death-cat-q6u_2z9w.png",
    });

  return (
    <div>
      {project.name}
      <Button onClick={editProject} size="xs">
        ✏️
      </Button>
    </div>
  );
};

const ReadOnlyMaterialView = ({
  materials,
}: {
  materials: PhysicalMaterial[];
}) => {
  // TODO
  return <div>ReadOnlyMaterialView</div>;
};

const EditableMaterialView = ({
  projectId,
  materials,
}: {
  projectId: string;
  materials: PhysicalMaterial[];
}) => {
  return <div>EditableMaterialView</div>;
};

const ProjectView = () => {
  const { selectedProjectIndices, projects } = useData();

  const selectedProjects: Project[] = useMemo(
    () => projects.filter((_, i) => selectedProjectIndices.includes(i)),
    [selectedProjectIndices, projects]
  );

  if (selectedProjects.length === 0) {
    return <div>Welcome!</div>;
  }

  const urls = selectedProjects
    .map((p) => p.imageUrls)
    .join("\n")
    .split("\n");

  const materials = selectedProjects.flatMap(
    (project) => project.requiredMaterials
  );

  return (
    <div>
      {selectedProjects.length > 1 && (
        <div>{selectedProjects.map((p) => p.name).join(", ")}</div>
      )}
      {selectedProjects.length === 1 && (
        <ProjectHeader project={selectedProjects[0]} />
      )}
      <ProjectGallery urls={urls} />
      {selectedProjects.length > 1 && (
        <ReadOnlyMaterialView materials={materials} />
      )}
      {selectedProjects.length === 1 && (
        <EditableMaterialView
          projectId={selectedProjects[0].id}
          materials={materials}
        />
      )}
    </div>
  );
};

export default ProjectView;

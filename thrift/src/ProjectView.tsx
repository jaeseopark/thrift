import { useMemo } from "react";

import { Button } from "@chakra-ui/react";

import { EditableMaterialView, ReadOnlyMaterialView } from "./ProjectRequirementView";
import { Project } from "./schema";
import { useData } from "./useData";
import { useUiData } from "./useUiData";

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

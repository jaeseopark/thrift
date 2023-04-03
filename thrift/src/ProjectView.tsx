import { useMemo } from "react";

import {
  Box,
  Button,
  HStack,
  Heading,
  ListItem,
  Textarea,
  UnorderedList,
  VStack,
} from "@chakra-ui/react";
import { AiFillEdit } from "react-icons/ai";
import ResponsiveGallery from "react-responsive-gallery";

import { EditableMaterialView, ReadOnlyMaterialView } from "./CutlistView";
import { Project } from "./schema";
import { useData } from "./useData";
import { useUiData } from "./useUiData";

const ProjectGallery = ({ urls }: { urls: string[] }) => {
  const InnerContent = () => {
    if (urls.length === 0) {
      return <Heading>No Images</Heading>;
    }
    return <ResponsiveGallery images={urls.map((url) => ({ src: url }))} useLightBox />;
  };

  return (
    <div className="project-image-gallery">
      <InnerContent />
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

  const cutlist = selectedProjects.flatMap((project) => project.cutlist);

  const getProjectHeader = () => {
    if (selectedProjects.length > 1) {
      return () => (
        <div className="project-header">
          <Heading as="h2" size="lg">
            Multiple Projects Selected
          </Heading>
          <UnorderedList>
            {selectedProjects.map((p) => (
              <ListItem key={p.id}>{p.name}</ListItem>
            ))}
          </UnorderedList>
        </div>
      );
    }

    const [project] = selectedProjects;
    return () => (
      <VStack className="project-header" spacing="1em">
        <Textarea value={project.name} width="100%" />
        <Textarea value={project.description} width="100%" />
        <Heading as="h3" size="md" width="100%">
          Images <Button leftIcon={<AiFillEdit />} size="sm" paddingLeft="1.4em" />
        </Heading>
      </VStack>
    );
  };

  const getMaterialView = () => {
    const InnerComponent = () => {
      if (selectedProjects.length > 1) {
        return <ReadOnlyMaterialView cutlist={cutlist} />;
      }
      return <EditableMaterialView projectId={selectedProjects[0].id} cutlist={cutlist} />;
    };

    return () => (
      <Box width="100%">
        <Heading as="h2" size="lg">
          Cut List
        </Heading>
        <InnerComponent />
      </Box>
    );
  };

  const ProjectHeader = getProjectHeader();
  const MaterialView = getMaterialView();

  // const urls = selectedProjects
  //   .map((p) => p.imageUrls)
  //   .join("\n")
  //   .split("\n");
  const urls = [
    "https://homedesignlover.com/wp-content/uploads/2015/09/1-cinema.jpg",
    "https://capablegroupinc.ca/wp-content/uploads/2021/03/5D3_0099-HDR.jpg",
    "https://farmfoodfamily.com/wp-content/uploads/2021/12/1-basement-home-theater-ideas.jpg",
    "https://cdn-bdilb.nitrocdn.com/HLQpTIIuNEYamdXTprwtltrexJwWJIMc/assets/images/optimized/rev-daba379/wp-content/uploads/2020/05/IMG_1877.jpeg",
  ];

  return (
    <VStack className="project-view" padding="1em">
      <HStack className="project-header-and-gallery" spacing="1em">
        <ProjectGallery urls={urls} />
        <ProjectHeader />
      </HStack>
      <MaterialView />
    </VStack>
  );
};

export default ProjectView;

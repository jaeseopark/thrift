import { useMemo, useState } from "react";

import {
  Box,
  Button,
  Flex,
  FocusLock,
  HStack,
  Heading,
  ListItem,
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverTrigger,
  Spacer,
  Textarea,
  UnorderedList,
  VStack,
} from "@chakra-ui/react";
import { AiFillEdit } from "react-icons/ai";
import ResponsiveGallery from "react-responsive-gallery";

import { EditableMaterialView, ReadOnlyMaterialView } from "./CutlistView";
import EditableHeading from "./EditableHeading";
import { Project } from "./schema";
import { useData } from "./useData";
import { useGlobalDrawer } from "./useDrawer";
import { useUiData } from "./useUiData";

const ImageUrlEditTrigger = ({
  urls,
  onChange,
}: {
  urls: string[];
  onChange: (urls: string[]) => void;
}) => {
  const { isOpen, onOpen, onClose } = useGlobalDrawer("edit-project-images");
  return (
    <Popover isOpen={isOpen} onOpen={onOpen} onClose={onClose} placement="bottom">
      <PopoverTrigger>
        <Button leftIcon={<AiFillEdit />} size="sm" paddingLeft="1.4em" />
      </PopoverTrigger>
      <FocusLock persistentFocus={false}>
        <PopoverContent p={5} width="30vw" height="30vh">
          <PopoverArrow />
          {isOpen && (
            <ImageUrlForm
              urls={urls}
              onChange={(imageUrls) => {
                onChange(imageUrls);
                onClose();
              }}
            />
          )}
        </PopoverContent>
      </FocusLock>
    </Popover>
  );
};

const ImageUrlForm = ({
  urls,
  onChange,
}: {
  urls: string[];
  onChange: (urls: string[]) => void;
}) => {
  const [newUrls, setNewUrls] = useState(urls.join("\n"));

  return (
    <>
      <Heading as="h3" size="md">
        Image URL's
      </Heading>
      <Textarea
        value={newUrls}
        onChange={({ target: { value } }) => setNewUrls(value)}
        placeholder="Enter one Image URL in each line"
      />
      <Button onClick={() => onChange(newUrls.split("\n").filter((url) => url))} colorScheme="teal">
        Save
      </Button>
    </>
  );
};

const ProjectGallery = ({ projects }: { projects: Project[] }) => {
  const { editProjectHeaderProps } = useData();

  const urls = projects.flatMap((p) => p.imageUrls).filter((url) => url);

  return (
    <Flex className="project-image-gallery">
      <ResponsiveGallery images={urls.map((url) => ({ src: url }))} useLightBox />
      <Spacer />
      {projects.length === 1 && (
        <ImageUrlEditTrigger
          urls={urls}
          onChange={(imageUrls) => {
            editProjectHeaderProps({
              ...projects[0],
              imageUrls,
            });
          }}
        />
      )}
    </Flex>
  );
};

const ProjectView = () => {
  const { projects, editProjectHeaderProps } = useData();
  const { getSelectedProjects } = useUiData();

  const selectedProjects = useMemo(
    () => getSelectedProjects(projects),
    [getSelectedProjects, projects]
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
      <VStack className="project-header" spacing="1em" height="100%">
        <div>
          <EditableHeading
            defaultValue={project.name}
            onBlur={(name) => editProjectHeaderProps({ ...project, name })}
          />
          <EditableHeading
            size="md"
            defaultValue={project.description}
            onBlur={(description) => editProjectHeaderProps({ ...project, description })}
          />
        </div>
        <Spacer />
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

  return (
    <VStack className="project-view" padding="1em">
      <HStack className="project-header-and-gallery" spacing="1em">
        <ProjectGallery projects={selectedProjects} />
        <ProjectHeader />
      </HStack>
      <MaterialView />
    </VStack>
  );
};

export default ProjectView;

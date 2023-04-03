import { Tbody } from "@chakra-ui/react";

import { MaterialTableShell, Row } from "./MaterialTable";
import { CutlistItem } from "./schema";
import { useData } from "./useData";

const ExistingRow = ({
  projectId,
  cutlistItem,
  readonly,
}: {
  projectId: string;
  cutlistItem: CutlistItem;
  readonly?: boolean;
}) => {
  const { updateMaterialInProject } = useData();
  return (
    <Row
      allowGrainDirectionSelection={true}
      cutlistItem={cutlistItem}
      readonly={readonly}
      onChange={(cutlistItem) => {
        updateMaterialInProject({ projectId, cutlistItem });
      }}
    />
  );
};

const NewRow = ({ projectId }: { projectId: string }) => {
  const { addMaterialToProject } = useData();
  return (
    <Row
      allowGrainDirectionSelection={true}
      onAdd={(cutlistItem) => {
        addMaterialToProject({ projectId, cutlistItem });
      }}
    />
  );
};

export const ReadOnlyMaterialView = ({ cutlist }: { cutlist: CutlistItem[] }) => {
  return (
    <MaterialTableShell>
      <Tbody>
        {cutlist.map((cutlistItem) => (
          <ExistingRow key={cutlistItem.id} projectId="" cutlistItem={cutlistItem} readonly />
        ))}
      </Tbody>
    </MaterialTableShell>
  );
};

export const EditableMaterialView = ({
  projectId,
  cutlist,
}: {
  projectId: string;
  cutlist: CutlistItem[];
}) => {
  return (
    <MaterialTableShell>
      <Tbody>
        {cutlist.map((cutlistItem) => (
          <ExistingRow key={cutlistItem.id} projectId={projectId} cutlistItem={cutlistItem} />
        ))}
        <NewRow projectId={projectId} />
      </Tbody>
    </MaterialTableShell>
  );
};

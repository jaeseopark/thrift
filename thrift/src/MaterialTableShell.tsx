import React, { ReactNode } from "react";

import { Table, Th, Thead, Tr } from "@chakra-ui/react";

const MaterialTableShell = ({ children }: { children: ReactNode }) => (
  <Table>
    <Thead>
      <Tr>
        <Th width="550px">Material</Th>
        <Th width="240px">Thickness</Th>
        <Th width="240px">Width</Th>
        <Th width="240px">Length</Th>
        <Th width="240px">Quantity</Th>
        <Th />
      </Tr>
    </Thead>
    {children}
  </Table>
);

export default MaterialTableShell;

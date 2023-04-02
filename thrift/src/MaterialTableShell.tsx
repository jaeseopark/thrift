import React, { ReactNode } from "react";

import { Table, Th, Thead, Tr } from "@chakra-ui/react";

const MaterialTableShell = ({ children }: { children: ReactNode }) => (
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
    {children}
  </Table>
);

export default MaterialTableShell;

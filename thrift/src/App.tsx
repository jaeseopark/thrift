import { Flex, HStack, Heading } from "@chakra-ui/react";
import styled from "styled-components";

import InventoryView from "./InventoryView";
import PreferencesView from "./PreferencesView";
import ProjectList from "./ProjectList";
import ProjectView from "./ProjectView";

import "./App.scss";

const CornerMenu = styled(HStack)`
  position: absolute;
  right: 2.5em;

  .button-container {
    width: 2.5em;
    height: 2.5em;
    padding: 0.5em;
    background-color: white;
    border-radius: 0.25em;
  }
`;

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Heading as="h1" size="2xl" color="white">
          Thrift
        </Heading>
        <CornerMenu>
          <InventoryView />
          <PreferencesView />
        </CornerMenu>
      </header>
      <Flex flexDirection="row">
        <ProjectList />
        <ProjectView />
      </Flex>
    </div>
  );
}

export default App;

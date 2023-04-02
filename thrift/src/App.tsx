import { Flex, Heading } from "@chakra-ui/react";

import InventoryView from "./InventoryView";
import PreferencesView from "./PreferencesView";
import ProjectList from "./ProjectList";
import ProjectView from "./ProjectView";

import "./App.scss";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Heading as="h1" size="2xl" color="white">
          Thrift
        </Heading>
        <PreferencesView />
      </header>
      <div>
        <Flex flexDirection="row">
          <ProjectList />
          <ProjectView />
          <InventoryView />
        </Flex>
      </div>
    </div>
  );
}

export default App;

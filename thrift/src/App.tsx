import { Navigate, Route, Routes } from "react-router-dom";
import Sidebar from "./Sidebar";
import "./App.scss";
import { Flex, Heading } from "@chakra-ui/react";
import ProjectView from "./ProjectView";

const AppRoutes = () => (
  <Routes>
    <Route path="*" element={<Navigate to="/" replace />} />
    <Route path="/" element={<ProjectView />} />
    {/* <Route path="/scrape" element={<ScrapeRouteHandler />} /> */}
  </Routes>
);

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Heading as="h1" size="2xl">
          Thrift
        </Heading>
      </header>
      <div>
        <Flex flexDirection="row">
          <Sidebar />
          <AppRoutes />
        </Flex>
      </div>
    </div>
  );
}

export default App;

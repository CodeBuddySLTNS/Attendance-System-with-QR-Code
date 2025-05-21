import React from "react";
import LandingPage from "./pages/landing-page";
import Layout from "./layout";

const App: React.FC = () => {
  return (
    <div>
      <Layout>
        <LandingPage />
      </Layout>
    </div>
  );
};

export default App;

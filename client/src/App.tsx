import React from "react";
import LandingPage from "./pages/landing-page";
import Layout from "./layout";

const App: React.FC = () => {
  return (
    <div className="w-full h-dvh">
      <Layout>
        <LandingPage />
      </Layout>
    </div>
  );
};

export default App;

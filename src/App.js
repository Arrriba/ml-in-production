import React from "react";
import './App.css';
import HomePage from './pages/Home';
import Layout from "./components/Layout/Layout";

function App() {
  return (
    <div>
      <Layout>
        <div className="main-content">
          <HomePage/>
          {/* <Switch>
            {routes.map((route, index) => (
              <RouteProgress key={index} {...route} />
            ))}
          </Switch> */}
        </div>
      </Layout>
    </div>
  );
}

export default App;

import React from "react";
import { Switch, Route } from "react-router-dom";

//import components
import {
  Home,
  NavBar,
  Profile,
  Projects,
  Contact,
  Login,
} from "./components/commons";

function App() {
  const RoutesWithNavBar = () => {
    return (
      <div>
        <NavBar />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/profile" component={Profile} />
          <Route path="/projects" component={Projects} />
          <Route path="/contact" component={Contact} />
        </Switch>
      </div>
    );
  };
  return (
    <>
      <Switch>
        <Route path="/login" component={Login} />
        <Route component={RoutesWithNavBar} />
      </Switch>
    </>
  );
}

export default App;

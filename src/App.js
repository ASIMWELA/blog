import React, { useEffect, useState } from "react";
import { Switch, Route } from "react-router-dom";

//import components
import {
  Home,
  NavBar,
  Profile,
  Projects,
  Contact,
  Login,
  PageLoader,
} from "./components/commons";
import { AdminSidebar } from "./components/admin";
import ApiUtil from "./ApiUtil/ApiUtilityClass";

import { admin, projects } from "./recoilState";
import { useRecoilState } from "recoil";

function App() {
  // eslint-disable-next-line no-unused-vars
  const [pageAdmin, setAdmin] = useRecoilState(admin);
  // eslint-disable-next-line no-unused-vars
  const [projectsData, setProjects] = useRecoilState(projects);

  //no data yet, deafult to loading
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchAdmin = async () => {
      setLoading(true);
      const admin = await ApiUtil.getAdmin()
        .then((res) => {
          setLoading(false);
          return res;
        })
        .catch((err) => {
          console.log(err);
        });

      //make available all the admin data to all component
      setAdmin(admin);
    };

    const fetchProjects = async () => {
      const projects = await ApiUtil.getProjects()
        .then((res) => res)
        .catch((err) => {
          console.log(err);
        });

      setProjects(projects);
    };

    fetchAdmin();
    fetchProjects();

    //clean the storage if the user leaves the the site
    window.addEventListener("beforeunload", () => {
      if (localStorage.data) {
        localStorage.removeItem("data");
      }
    });
  }, [setAdmin, setProjects]);

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
      {loading ? (
        <PageLoader />
      ) : (
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/admin" component={AdminSidebar} />
          <Route component={RoutesWithNavBar} />
        </Switch>
      )}
    </>
  );
}

export default App;

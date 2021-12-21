import './App.css';
import React from "react";
import Guest from './components/Guest';
import { useRoutes } from 'react-router';

const App = () => {
  let routes = useRoutes([
    { path: "/", element: <Guest /> },

  ]);
  return routes;
}

export default App;

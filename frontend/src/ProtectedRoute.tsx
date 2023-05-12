/**
 * A higher-order component that wraps a route and checks if the user is authenticated.
 * If the user is authenticated, the component renders the route component.
 * If the user is not authenticated, the component redirects to the login page.
 * Contains a redirect state that allows the user to be redirected to the page 
 * they were trying to access before being redirected to the login page.
 */

import React, {useContext} from "react";
import {Navigate, useLocation} from "react-router-dom"
import {AuthContext} from "./contexts/AuthContextProvider";

export type ProtectedRouteProps = {
    outlet: JSX.Element;
  };
  
export default function ProtectedRoute({ outlet }: ProtectedRouteProps) {
    const { currentUser } = useContext(AuthContext);
    const location = useLocation();
    if(!currentUser) {
        return <Navigate to="/login" replace state={{redirect: location.pathname}}/>;
    } else {
      return outlet;
    }
  };
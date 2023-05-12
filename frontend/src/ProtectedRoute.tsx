import React, {useContext} from "react";
import {Navigate, useLocation} from "react-router-dom"
import {AuthContext} from "./contexts/AuthContextProvider";

export type ProtectedRouteProps = {
    outlet: JSX.Element;
  };
  
export default function ProtectedRoute({ outlet }: ProtectedRouteProps) {
    const { currentUser} = useContext(AuthContext);
    const location = useLocation();
    if(!currentUser) {
        return <Navigate to="/login" replace state={{redirect: location.pathname}}/>;
    } else {
      return outlet;
    }
  };
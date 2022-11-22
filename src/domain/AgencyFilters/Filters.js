import { useEffect, useState } from "react";
import "./FiltersCustom.css";
import { useDispatch, useSelector } from "react-redux";
import apiHandler from "api";
import endpoint from "api/endpoint";

const Filters = () => {
  const { authToken } = useSelector((state) => state.login);

  useEffect(() => {
    apiHandler({
      url: `${endpoint.AVAILABLE_EVENT_TYPES}`,
      authToken,
    }).then((result) => {
      const { data } = result;
      
    });
    
  }, []);

 

  return (
    <div className="filterSidebar">
      
    </div>
  );
};

export default Filters;

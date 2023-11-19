/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback } from "react";
import CustomTable from "./CustomTable";
import axios from "axios";
import { Link } from "react-router-dom";

const SearchApi = () => {

  const fetchData = useCallback(async () => {
    return axios
      .get("https://jsonplaceholder.typicode.com/users")
      .then((resp) => resp.data);
  }, []);


  return (
    <div className="flex justify-center items-center h-screen w-full">
      <div className=" p-3 sm:p-5 w-full">
        <div className="mx-auto max-w-screen-xl px-4 lg:px-12">
        <Link className="focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2" to="/"> Go Back</Link>
          <h1 className="text-center font-bold">Fetch Sample API</h1>
          <CustomTable
            columns={[
              "id",
              "name",
              "phone",
              "email",
              "username",
              "address",
              "company"
            ]}
            fetchData={fetchData}

          />
        
        </div>
      </div>
    </div>
  );
};

export default SearchApi;

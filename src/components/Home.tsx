import React  from "react";
import { Link } from "react-router-dom";

const Home: React.FC = () => {

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <Link
        type="button"
        className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200"
        to="/search"
      >
        Try Search Generic
      </Link>
      <Link
        type="button"
        className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200"
        to="/searchapi"
      >
        Try Search Api using Axios
      </Link>
    </div>
  );
};

export default Home;

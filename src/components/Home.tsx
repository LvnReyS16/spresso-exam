import React, { MouseEvent }  from "react";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleButton = (e: MouseEvent<HTMLButtonElement>)=>{
    e.preventDefault()
    navigate("/search")
  }

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <button
        type="button"
        className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200"
        onClick={(e)=> handleButton(e)}
      >
        Search
      </button>
    </div>
  );
};

export default Home;

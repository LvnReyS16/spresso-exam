/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useState } from "react";
import CustomTable from "./CustomTable";
import { Link } from "react-router-dom";

const SearchSample: React.FC = () => {
  const [selectedRows, setSelectedRows] = useState<any[]>([]);

  const fetchData = useCallback(async () => {
    return new Promise<any[]>((resolve) => {
      setTimeout(() => {
        const newData = Array.from({ length: 100 }, (_, index) => ({
          id: index + 1,
          name: `Item ${index + 1}`,
          category: `Category ${Math.floor(Math.random() * 5) + 1}`,
          brand: `Brand ${Math.floor(Math.random() * 3) + 1}`,
          description: `Description ${index + 1}`,
          price: `$${Math.floor(Math.random() * 500) + 500}`,
        }));
        resolve(newData);
      }, 1000);
    });
  }, []);

  const handleRowSelect = (clickedRow: any) => {
    const isSelected = selectedRows.some((row) => row.id === clickedRow.id);

    if (isSelected) {
      setSelectedRows((prevSelectedRows) =>
        prevSelectedRows.filter((row) => row.id !== clickedRow.id)
      );
    } else {
      setSelectedRows((prevSelectedRows) => [...prevSelectedRows, clickedRow]);
    }
  };

  const extraColumns = [
    {
      header: "Select",
      render: (row: any) => (
        <input
          type="checkbox"
          checked={selectedRows.some(
            (selectedRow) => selectedRow.id === row.id
          )}
          onChange={() => handleRowSelect(row)}
        />
      ),
    },
  ];

  return (
    <div className="flex justify-center items-center h-screen w-full">
      <div className=" p-3 sm:p-5 w-full">
        <div className="mx-auto max-w-screen-xl px-4 lg:px-12">
        <Link className="focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2" to="/"> Go Back</Link>
        <h1 className="text-center font-bold">Fetch Sample</h1>
          <CustomTable
            columns={['id',"name", "category", "brand", "description", "price"]}
            fetchData={fetchData}
            extraColumns={extraColumns}
            selectedRows={selectedRows}
          />
          <div className="h-64 overflow-y-auto">
            <h2 className="text-lg font-bold mb-2">Selected Rows</h2>
            <div className="bg-gray-100 p-4 rounded">
              <code className="whitespace-pre-wrap block text-sm">
                {JSON.stringify(selectedRows, null, 2)}
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchSample;

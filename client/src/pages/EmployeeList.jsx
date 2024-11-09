import React, { useContext, useEffect, useMemo, useState } from "react";
import { useTable, useSortBy, usePagination } from "react-table";
import { AiOutlineSortAscending } from "react-icons/ai";
import { AiOutlineSortDescending } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";

import { UserContext } from "../context/userContext";
import axios from "axios";

const columns = [
  {
    Header: "Id",
    accessor: "id",
  },
  {
    Header: "Image",
    accessor: "image",
  },
  {
    Header: "Name",
    accessor: "name",
  },
  {
    Header: "Email",
    accessor: "email",
  },
  {
    Header: "Mobile",
    accessor: "mobile",
  },
  {
    Header: "Designation",
    accessor: "designation",
  },
  {
    Header: "Gender",
    accessor: "gender",
  },
  {
    Header: "Course",
    accessor: "courses",
    Cell: ({ value }) => (
      <td className="p-3">
        {value && value.length > 0 ? value.join(", ") : ""}
      </td>
    ),
  },
  {
    Header: "Created Date",
    accessor: "createdAt",
    Cell: ({ value }) => {
      const dateObject = new Date(value);
      const formattedDate = dateObject.toLocaleDateString();
      return <span>{formattedDate}</span>;
    },
  },
  {
    Header: "Actions",
    accessor: "actions",
    Cell: ({ row }) => (
      <>
        <div className="flex gap-5 font-semibold">
          <Link to={`/edit/${row.original._id}`}> Edit </Link>
          <Link to={`/delete/${row.original._id}`}> Delete </Link>
        </div>
      </>
    ),
  },
];

const EmployeeList = () => {
  const { currUser } = useContext(UserContext);
  const token = currUser?.token;

  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [navigate, token]);

  const [data, setData] = useState([]);

  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchdata = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_REACT_APP_BASE_URL}/employee`,
          {
            withCredentials: true,
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setData(response.data.employees);
      } catch (error) {
        console.log(error);
      }
    };
    fetchdata();
  }, [token]);

  const filteredData = useMemo(() => {
    return data.filter((employee) => {
      return employee.name.toLowerCase().includes(search.toLowerCase());
    });
  }, [search, data]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    nextPage,
    previousPage,
    state: { pageIndex },
    pageCount,
  } = useTable(
    { columns, data: filteredData, initialState: { pageSize: 6 } },
    useSortBy,
    usePagination
  );

  return (
    <div className="px-16 py-4 mt-16 text-md">
      <div className="flex justify-between mb-4 items-center">
        <form className="w-80 flex">
          <input
            type="text"
            placeholder="Search"
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 "
          />
        </form>

        <div className="flex gap-20 ml-20">
          <h1 className="font-semibold">total-count : {data.length}</h1>
          <Link
            to={"/createEmployee"}
            className="px-2 py-1 bg-blue-500 font-semibold rounded-md  text-white"
          >
            + Create Employee
          </Link>
        </div>
      </div>
      <table
        {...getTableProps()}
        className="min-w-full border-gray-300 rounded-md overflow-hidden text-sm "
      >
        <thead className="bg-zinc-700 text-white">
          {headerGroups.map((headergroup) => (
            <tr
              {...headergroup.getHeaderGroupProps()}
              className="p-3 text-left font-semibold "
            >
              {headergroup.headers.map((col) => (
                <th
                  {...col.getHeaderProps(col.getSortByToggleProps())}
                  className="p-3 text-left font-semibold"
                >
                  <div className="flex items-center">
                    {col.render("Header")}
                    {col.isSorted && (
                      <span className="ml-2">
                        {col.isSortedDesc ? (
                          <AiOutlineSortDescending />
                        ) : (
                          <AiOutlineSortAscending />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr
                {...row.getRowProps()}
                className="even:bg-gray-100 hover:bg-gray-200"
              >
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()} className="p-3">
                    {cell.column.id === "image"
                      ? cell.value && (
                          <img
                            src={cell.value}
                            alt="Employee"
                            style={{ width: "50px", height: "50px" }}
                          />
                        )
                      : cell.render("Cell")}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="flex justify-center gap-2 mt-3 font-semibold">
        <button
          className="px-2 py- bg-black text-white rounded-md"
          onClick={previousPage}
        >
          prev
        </button>
        <span>
          {pageIndex + 1} of {pageCount}
        </span>
        <button
          className="px-2 py- bg-black text-white rounded-md"
          onClick={nextPage}
        >
          next
        </button>
      </div>
    </div>
  );
};

export default EmployeeList;

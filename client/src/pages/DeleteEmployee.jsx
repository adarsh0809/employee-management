import React, { useContext, useEffect } from "react";
import { UserContext } from "../context/userContext";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const DeleteEmployee = () => {
  const { currUser } = useContext(UserContext);
  const token = currUser?.token;

  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [navigate, token]);

  const { id } = useParams();

  useEffect(() => {
    const deleteEmployee = async () => {
      try {
        const response = await axios.delete(
          `${import.meta.env.VITE_REACT_APP_BASE_URL}/employee/delete/${id}`,
          {
            withCredentials: true,
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.status === 203) {
          navigate("/employee-list");
        }
      } catch (error) {
        console.log(error.response.data.message);
      }
    };
    deleteEmployee();
  }, [id]);

  return <></>;
};

export default DeleteEmployee;

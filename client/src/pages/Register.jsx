import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRegisterData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_BASE_URL}/admin/register`,
        registerData
      );
      const newUser = await response.data;
      if (!newUser) {
        setError("couldn't registered please try again");
      }
      navigate("/login");
    } catch (err) {
      setError(err.response.data.message);
    }

    setRegisterData({
      username: "",
      email: "",
      password: "",
    });
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-gray-100 border rounded-md p-8 w-96">
        <h1 className="text-2xl font-semibold mb-4">Register</h1>
        <form onSubmit={handleRegister}>
          {error && (
            <p className="bg-red-500 px-3 py-1 rounded-md my-3 font-semibold">
              {error}
            </p>
          )}
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-900"
            >
              Username:
              <input
                type="text"
                id="username"
                name="username"
                value={registerData.username}
                onChange={handleInputChange}
                className="mt-1 p-2 w-full border rounded-md"
                required
              />
            </label>
          </div>

          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-900"
            >
              Email:
              <input
                type="email"
                id="email"
                name="email"
                value={registerData.email}
                onChange={handleInputChange}
                className="mt-1 p-2 w-full border rounded-md"
                required
              />
            </label>
          </div>

          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-900"
            >
              Password:
              <input
                type="password"
                id="password"
                name="password"
                value={registerData.password}
                onChange={handleInputChange}
                className="mt-1 p-2 w-full border rounded-md"
                required
              />
            </label>
          </div>

          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-green-500 text-white rounded-md"
            >
              Register
            </button>
          </div>
          <small className="block mt-2 ">
            Already registered{" "}
            <Link className="text-blue-700 ml-2" to={"/login"}>
              SignIn
            </Link>
          </small>
        </form>
      </div>
    </div>
  );
};

export default Register;

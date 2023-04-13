import axios, { AxiosError } from "axios";
import { useState } from "react";
import { useMutation } from "react-query";
import { Link, useNavigate } from "react-router-dom";

type UserData = {
  email: string;
  password: string;
};
export default function Login() {
  const [userData, setUserData] = useState<UserData>({ email: "", password: "" });
  const navigate = useNavigate();
  const {
    data: loginResponse,
    isLoading,
    mutate: login,
  } = useMutation<any, AxiosError>({
    mutationFn: async () => {
      const response = await axios.post("http://localhost:5000/api/v1/login", { ...userData }, { withCredentials: true });
      const data = response.data;
      console.log(data);
      return data;
    },

    onSuccess: (data) => {
      navigate("/");
    },
  });

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    login();
  };
  return (
    <div className="min-h-screen flex items-center justify-center py-10">
      {/* <form onSubmit={(e) => onSubmitHandler(e)}>
        <input
          type="text"
          placeholder="email"
          name="email"
          onChange={(e) => {
            onChangeHandler(e);
          }}
          value={userData.email}
        />
        <input
          type="text"
          placeholder="password"
          name="password"
          onChange={(e) => {
            onChangeHandler(e);
          }}
          value={userData.password}
        />
        <input type="submit" />
      </form> */}

      <form
        action=""
        className="w-full rounded-lg bg-white p-8 shadow-xl max-w-lg"
        onSubmit={(e) => {
          onSubmitHandler(e);
        }}
      >
        <div className="flex flex-col gap-6">
          <h2 className="text-center text-4xl font-semibold">Login to CRM app</h2>
          <div>
            <input
              type="text"
              name="email"
              placeholder="email"
              className={`rounded-lg border-2 w-full p-3`}
              required
              onChange={(e) => {
                onChangeHandler(e);
              }}
              value={userData.email}
            />
            {/* <span className="mt-2 text-red-500">{emailErrorMessage}</span> */}
          </div>
          <div>
            <input
              type="password"
              name="password"
              className={`rounded-lg border-2 w-full p-3`}
              required
              placeholder="password"
              onChange={(e) => {
                onChangeHandler(e);
              }}
              value={userData.password}
            />
            {/* <span className="mt-2 text-red-500">{passwordErrorMessage}</span> */}
          </div>

          {/* {errorMessage ? <span className="mt-2 text-red-500">{errorMessage}</span> : ""} */}
          {/* <button className="flex h-14 w-full items-center justify-center border-2 border-black bg-primary uppercase text-white transition-colors duration-300">{loading ? <LoadingSpinner color="white" /> : "login"}</button> */}
          <button className="flex h-14 w-full items-center justify-center border-2 border-black bg-black uppercase text-white transition-colors duration-300">login</button>
          {/* <Link href="/">
            <a className="text-center hover:underline">Forgot Password or Username?</a>
          </Link> */}
          <div className="grid grid-cols-[1fr_auto_1fr] items-center">
            <div className="h-[1px] bg-slate-600"></div>
            <div className="px-3 text-center">Login with</div>
            <div className="h-[1px] bg-slate-600"></div>
          </div>
          <button className="w-full border-2 bg-red-500 py-4 uppercase text-white transition-colors duration-300">Google</button>
          <div className="text-center">
            <span className="text-lg">Dont have an account? </span>
            <Link
              to="/register"
              className="text-lg font-medium hover:underline"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}

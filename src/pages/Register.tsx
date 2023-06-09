import { useMutation } from "react-query";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

type UserData = {
  username: string;
  email: string;
  password: string;
};
export default function Register() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData>({ username: "", email: "", password: "" });
  const {
    data: registerResponse,
    isLoading,
    mutate: register,
  } = useMutation<any, AxiosError>({
    mutationFn: async () => {
      const response = await axios.post("http://localhost:5000/api/v1/register", { ...userData });
      const data = response.data;
      return data;
    },

    onSuccess: () => {
      toast.success("Account created");
      navigate("/login");
    },

    onError: (err) => {
      if (err.response!.status === 409) {
        toast.error("Email is already registered");
      } else {
        toast.error("Something went wrong please try again later");
      }
    },
  });

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmitHandler = () => {
    if (!userData.username) {
      return toast.error("Username field can't be empty");
    }
    if (!userData.email) {
      return toast.error("Email field can't be empty");
    }

    if (!userData.password) {
      return toast.error("Password field can't be empty");
    }

    register();
  };
  return (
    <div className="min-h-screen flex justify-center items-center">
      {/* <form onSubmit={(e) => onSubmitHandler()}>
        <input
          type="text"
          placeholder="username"
          name="username"
          onChange={(e) => {
            onChangeHandler(e);
          }}
          value={userData.username}
        />
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
        className="mx-auto w-full rounded-lg bg-white p-8 shadow-xl max-w-lg"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmitHandler();
        }}
      >
        <div className="flex flex-col gap-6">
          <h2 className="text-center text-4xl font-semibold">Register to Jerrell Store</h2>
          <div>
            <input
              type="text"
              required
              name="username"
              placeholder="username"
              className="w-full rounded-lg border-2 p-3"
              value={userData.username}
              onChange={(e) => {
                onChangeHandler(e);
              }}
            />
          </div>

          <div className="flex flex-col">
            <input
              type="text"
              required
              name="email"
              placeholder="email"
              className={`rounded-lg border-2 w-full p-3`}
              value={userData.email}
              onChange={(e) => {
                onChangeHandler(e);
              }}
            />
          </div>

          <div>
            <input
              type="password"
              name="password"
              className="w-full rounded-lg border-2 p-3"
              placeholder="password"
              value={userData.password}
              required
              onChange={(e) => {
                onChangeHandler(e);
              }}
            />
          </div>

          <button className="flex h-14 w-full items-center justify-center border-2 border-black bg-black uppercase text-white transition-colors duration-300">register</button>
        </div>
      </form>
    </div>
  );
}

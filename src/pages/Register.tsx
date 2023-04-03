import { useMutation } from "react-query";
import { useState } from "react";
import axios from "axios";

type UserData = {
  username: string;
  email: string;
  password: string;
};
export default function Register() {
  const [userData, setUserData] = useState<UserData>({ username: "", email: "", password: "" });
  const {
    data: registerResponse,
    isLoading,
    mutate: register,
  } = useMutation({
    mutationFn: async () => {
      const response = await axios.post("http://localhost:5000/api/v1/register", { ...userData });
      const data = response.data;
      return data;
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
    register();
  };
  return (
    <div>
      <form onSubmit={(e) => onSubmitHandler(e)}>
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
      </form>
    </div>
  );
}

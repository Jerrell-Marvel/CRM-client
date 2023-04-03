import axios from "axios";
import { useState } from "react";
import { useMutation } from "react-query";

type UserData = {
  email: string;
  password: string;
};
export default function Login() {
  const [userData, setUserData] = useState<UserData>({ email: "", password: "" });
  const {
    data: loginResponse,
    isLoading,
    mutate: login,
  } = useMutation({
    mutationFn: async () => {
      const response = await axios.post("http://localhost:5000/api/v1/login", { ...userData }, { withCredentials: true });
      const data = response.data;
      console.log(data);
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
    login();
  };
  return (
    <div>
      <form onSubmit={(e) => onSubmitHandler(e)}>
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

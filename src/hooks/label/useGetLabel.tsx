import axios, { AxiosError } from "axios";
import { useQuery } from "react-query";
import { useNavigate } from "react-router";
type Label = {
  _id: string;
  name: string;
  createdBy: string;
};
type Labels = {
  labels: Label[];
};

const useGetLabel = () => {
  const navigate = useNavigate();
  return useQuery<Labels, AxiosError>({
    queryKey: ["labels"],
    queryFn: async () => {
      const response = await axios.get<Labels>("http://localhost:5000/api/v1/label", { withCredentials: true });
      const data = response.data;
      return data;
    },
    onError: (err) => {
      if (err.request.status === 401) {
        navigate("/login");
      }
    },
    retry: false,
    refetchOnWindowFocus: false,
  });
};

export default useGetLabel;

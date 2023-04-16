import axios, { AxiosError } from "axios";
import { useMutation, useQueryClient } from "react-query";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { Label, Labels } from "../../types/label";

type UseCreateLabel = {
  successCb: () => void;
};

const useCreateLabel = ({ successCb }: UseCreateLabel) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation<{ label: Label }, AxiosError, string>({
    mutationFn: async (labelName) => {
      const response = await axios.post<{ label: Label }>(`http://localhost:5000/api/v1/label`, { name: labelName }, { withCredentials: true });
      const data = response.data;
      console.log(data);
      return data;
    },

    onSuccess: (data) => {
      const labelData = queryClient.getQueryData<Labels>("labels");
      if (labelData) {
        const labels = [...labelData?.labels];

        labels.push(data.label);
        queryClient.setQueryData<Labels>("labels", { labels });
        toast.success("Customer created");
      }

      successCb();
    },

    onError: (err) => {
      if (err.request.status === 400) {
        toast.error("Label name can't be empty");
      } else if (err.request.status === 401) {
        return navigate("/login");
      } else {
        toast.error("Something went wrong please try again later");
      }
    },
  });
};

export default useCreateLabel;

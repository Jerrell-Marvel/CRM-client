import axios, { AxiosError } from "axios";
import { useMutation, useQueryClient } from "react-query";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { Label, Labels } from "../../types/label";

type UseUpdateLabelParams = {
  // setIsLabelRename: React.Dispatch<React.SetStateAction<boolean>>;
  // setLabelRename: React.Dispatch<React.SetStateAction<string>>;

  onSuccess: () => void;
};

type MutationFnParam = {
  labelId: string;
  labelName: string;
};

const useUpdateLabel = ({ onSuccess }: UseUpdateLabelParams) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation<{ updatedLabel: Label }, AxiosError, MutationFnParam>({
    mutationFn: async ({ labelId, labelName }) => {
      const response = await axios.patch<{ updatedLabel: Label }>(`http://localhost:5000/api/v1/label/${labelId}`, { name: labelName }, { withCredentials: true });
      const data = response.data;
      return data;
    },

    onSuccess: (data) => {
      const labels = queryClient.getQueryData<Labels>(["labels"]);

      if (labels) {
        const updateLabelIdx = labels.labels.findIndex((label) => {
          return data.updatedLabel._id === label._id;
        });

        const tempLabels = [...labels.labels];
        tempLabels[updateLabelIdx] = data.updatedLabel;

        queryClient.setQueryData<Labels>(["labels"], { labels: tempLabels });

        toast.success("Label updated successfully");

        onSuccess();
        // setIsLabelRename(false);
        // setLabelRename("");
      }
    },

    onError: (err) => {
      if (err.request.status === 404) {
        toast.error("Label doesn't exist");
      } else if (err.request.status === 401) {
        navigate("/login");
      } else {
        toast.error("Something went wrong please try again later");
      }
    },
  });
};

export default useUpdateLabel;

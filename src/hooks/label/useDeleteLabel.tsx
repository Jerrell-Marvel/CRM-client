import axios, { AxiosError } from "axios";
import { useMutation, useQueryClient } from "react-query";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { Label, Labels } from "../../types/label";
import { Customer, Customers } from "../../types/customer";

type UseDeleteLabelParam = {
  onSuccess: () => void;
};

const useDeleteLabel = ({ onSuccess }: UseDeleteLabelParam) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation<{ deletedLabel: Label }, AxiosError, string>({
    mutationFn: async (labelId: string) => {
      const response = await axios.delete<{ deletedLabel: Label }>(`http://localhost:5000/api/v1/label/${labelId}`, { withCredentials: true });
      const data = response.data;
      return data;
    },

    onSuccess: (data) => {
      const labelsData = queryClient.getQueryData<Labels>(["labels"]);
      console.log(labelsData);
      if (labelsData) {
        const labels = [...labelsData.labels];
        const deletedLabels = labels.filter((label) => {
          return label._id !== data.deletedLabel._id;
        });
        queryClient.setQueryData<Labels>(["labels"], { labels: deletedLabels });
        queryClient.setQueryData<Customers>(["customers", data.deletedLabel._id], { customers: [] });
      }

      toast.success("Label deleted successfully");
      // navigate("/");

      onSuccess();
      // setSelectedLabel(null);
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

export default useDeleteLabel;

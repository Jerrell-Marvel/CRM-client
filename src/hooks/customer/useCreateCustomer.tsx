import axios, { AxiosError } from "axios";
import { useMutation, useQueryClient } from "react-query";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { Customer, Customers } from "../../types/customer";

type MutationFnParam = {
  name: string;
  description: string;
  labelId: string | null;
};

type UseCreateCustomerParam = {
  onSuccess: () => void;
};

const useCreateCustomer = ({ onSuccess }: UseCreateCustomerParam) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation<{ customer: Customer }, AxiosError, MutationFnParam>({
    mutationFn: async ({ name, description, labelId }) => {
      console.log({ name, description, labelId });
      const response = await axios.post<{ customer: Customer }>(`http://localhost:5000/api/v1/customer`, { name, description, labelId }, { withCredentials: true });
      const data = response.data;
      return data;
    },

    onSuccess: (data) => {
      // const customerData = queryClient.getQueryData<Customers>(["customers", data.customer.labelId]);
      // if (customerData) {
      //   const customers = [...customerData.customers];
      //   customers.unshift(data.customer);
      //   queryClient.setQueryData<Customers>(["customers", data.customer.labelId], { customers: customers });
      // }

      toast.success("Customer added successfully");
      onSuccess();
    },

    onError: (err) => {
      // if ((err.request.status === 400 && err.response?.data.message === "Invalid label id") || err.request.status === 422) {
      //   toast.error("Invalid label id, please select a label");
      // } else if (err.request.status === 400) {
      //   toast.error("Customer name can't be empy");
      // } else if (err.request.status === 401) {
      //   return navigate("/login");
      // } else {
      //   toast.error("Something went wrong please try again later");
      // }
      if (err.request.status === 422) {
        toast.error("Invalid label id, please select a label");
      } else if (err.request.status === 401) {
        return navigate("/login");
      } else {
        toast.error("Something went wrong please try again later");
      }
    },
  });
};

export default useCreateCustomer;

import axios, { AxiosError } from "axios";
import { useMutation, useQueryClient } from "react-query";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

type Customer = {
  _id: string;
  name: string;
  description: string;
  createdBy: string;
  labelId: string;
};

type Customers = {
  customers: Customer[];
};

type UseDeleteCustomerParams = {
  setSelectedCustomer: React.Dispatch<React.SetStateAction<Customer | null>>;
  setIsMoveToActive: React.Dispatch<React.SetStateAction<boolean>>;
};

const useDeleteCustomer = ({ setSelectedCustomer, setIsMoveToActive }: UseDeleteCustomerParams) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation<{ deletedCustomer: Customer }, AxiosError, string>({
    mutationFn: async (customerId: string) => {
      const response = await axios.delete<{ deletedCustomer: Customer }>(`http://localhost:5000/api/v1/customer/${customerId}`, { withCredentials: true });
      const data = response.data;
      return data;
    },

    onSuccess: (data) => {
      const customerData = queryClient.getQueryData<Customers>(["customers", data.deletedCustomer.labelId]);
      if (customerData) {
        const customers = [...customerData.customers];
        const deletedCustomers = customers.filter((customer) => {
          return customer._id !== data.deletedCustomer._id;
        });
        queryClient.setQueryData<Customers>(["customers", data.deletedCustomer.labelId], { customers: deletedCustomers });
      }

      toast.success("Customer deleted successfully");

      setSelectedCustomer(null);
      setIsMoveToActive(false);
    },

    onError: (err) => {
      if (err.request.status === 404) {
        toast.error("Customer doesn't exist");
      } else if (err.request.status === 401) {
        navigate("/login");
      } else {
        toast.error("Something went wrong please try again later");
      }
    },
  });
};

export default useDeleteCustomer;

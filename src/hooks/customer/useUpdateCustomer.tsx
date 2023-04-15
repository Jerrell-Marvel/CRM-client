import axios, { AxiosError } from "axios";
import { useMutation, useQueryClient } from "react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
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

type MutationFnParams = {
  customerId: string;
  prevLabelId: string;
  customerData: {
    name: string;
    description?: string;
    labelId?: string;
  };
};

type UseUpdateCustomerParams = {
  setIsMoveToActive?: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedCustomer?: React.Dispatch<React.SetStateAction<Customer | null>>;
};

const useUpdateCustomer = ({ setIsMoveToActive, setSelectedCustomer }: UseUpdateCustomerParams = {}) => {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  return useMutation<{ customer: Customer }, AxiosError<{ message: string }>, MutationFnParams>({
    mutationFn: async ({ customerId, prevLabelId, customerData }) => {
      const response = await axios.patch<{ customer: Customer }>(
        `http://localhost:5000/api/v1/customer/${customerId}`,
        {
          ...customerData,
        },
        { withCredentials: true }
      );
      const data = response.data;
      return data;
    },

    onSuccess: (data, { prevLabelId }) => {
      //Check if the customer is moved, if yes then remove customer from prev label id
      if (prevLabelId !== data.customer.labelId) {
        const customerData = queryClient.getQueryData<Customers>(["customers", prevLabelId]);
        if (customerData) {
          const customers = [...customerData.customers];
          const deletedCustomers = customers.filter((customer) => {
            return customer._id !== data.customer._id;
          });
          queryClient.setQueryData<Customers>(["customers", searchParams.get("label")], { customers: deletedCustomers });
        }
      }

      if (setIsMoveToActive) {
        setIsMoveToActive(false);
      }

      if (setSelectedCustomer) {
        setSelectedCustomer(null);
      }
      toast.success("Updated successfully");
    },

    onError: (err) => {
      if (err.request.status === 400) {
        if (err.response?.data.message === "invalid label id") {
          toast.error("Invalid label id, please select a label");
        } else {
          toast.error("Message can't be empty");
        }
      } else if (err.request.status === 404) {
        toast.error("Customer doesn't exist");
      } else if (err.request.status === 401) {
        return navigate("/login");
      } else {
        toast.error("Something went wrong please try again later");
      }
    },
  });
};

export default useUpdateCustomer;

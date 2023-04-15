import axios, { AxiosError } from "axios";
import { UseQueryOptions, useQuery } from "react-query";

type Customer = {
  customer: {
    _id: string;
    name: string;
    description: string;
    createdBy: string;
    labelId: string;
  };
};

type Customers = {
  customers: Customer[];
};

type UseGetCustomerParams = {
  customerId: string | null | undefined;
  config?: UseQueryOptions<Customer, AxiosError>;
};

const useGetCustomer = ({ customerId, config }: UseGetCustomerParams) => {
  return useQuery<Customer, AxiosError>({
    queryKey: ["customer", customerId],
    queryFn: async () => {
      const response = await axios.get<Customer>(`http://localhost:5000/api/v1/customer/${customerId}`, { withCredentials: true });
      const data = response.data;
      return data;
    },

    ...config,
  });
};

export default useGetCustomer;

import axios, { AxiosError } from "axios";
import { UseQueryOptions, useQuery } from "react-query";
import { Customer } from "../../types/customer";

type UseGetCustomerParams = {
  customerId: string | null | undefined;
  config?: UseQueryOptions<Customer, AxiosError>;
};

const useGetCustomer = ({ customerId, config }: UseGetCustomerParams) => {
  return useQuery<Customer, AxiosError>({
    queryKey: ["customer", customerId],
    queryFn: async () => {
      const response = await axios.get<{ customer: Customer }>(`http://localhost:5000/api/v1/customer/${customerId}`, { withCredentials: true });
      const data = response.data.customer;
      return data;
    },

    ...config,
  });
};

export default useGetCustomer;

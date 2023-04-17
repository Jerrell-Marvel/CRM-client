import axios, { AxiosError } from "axios";
import { Customers } from "../../types/customer";
import { UseQueryOptions, useQuery } from "react-query";

type UseSearchCustomerParam = {
  q: string | null;
  config?: UseQueryOptions<Customers, AxiosError>;
};

const useSearchCustomer = ({ q, config }: UseSearchCustomerParam) => {
  return useQuery<Customers, AxiosError>({
    queryKey: ["customer", "search", q],
    queryFn: async () => {
      const response = await axios.get<Customers>(`http://localhost:5000/api/v1/customer/search`, { withCredentials: true, params: { q } });
      const data = response.data;
      return data;
    },

    ...config,
  });
};

export default useSearchCustomer;

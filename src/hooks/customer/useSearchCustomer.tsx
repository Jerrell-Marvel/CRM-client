import axios, { AxiosError } from "axios";
import { Customers, CustomersWithLabel } from "../../types/customer";
import { UseQueryOptions, useQuery } from "react-query";
import { Label } from "../../types/label";

type UseSearchCustomerParam = {
  q: string | null;
  config?: UseQueryOptions<CustomersWithLabel, AxiosError>;
};

const useSearchCustomer = ({ q, config }: UseSearchCustomerParam) => {
  return useQuery<CustomersWithLabel, AxiosError>({
    queryKey: ["customer", "search", q],
    queryFn: async () => {
      const response = await axios.get<CustomersWithLabel>(`http://localhost:5000/api/v1/customer/search`, { withCredentials: true, params: { q } });
      const data = response.data;
      return data;
    },

    ...config,
  });
};

export default useSearchCustomer;

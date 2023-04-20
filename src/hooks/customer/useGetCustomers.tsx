import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { UseQueryResult, useQuery } from "react-query";
import { useNavigate } from "react-router";
import { convertToValidPage } from "../../utils/convertToValidPage";

type UseGetCustomerParam = {
  labelId: string | null;
  page: number;
};

type Customer = {
  _id: string;
  name: string;
  description: string;
  createdBy: string;
  labelId: string;
};

// type Customers = {
//   customers: Customer[];
//   customersCount: number;
// };

type Customers = {
  customers: Customer[];
  customersCount: number;
};

const useGetCustomers = ({ labelId, page }: UseGetCustomerParam) => {
  const navigate = useNavigate();
  const [customersCount, setCustomersCount] = useState(0);

  return {
    ...useQuery<Customers, AxiosError>({
      queryKey: ["customers", labelId, page],
      queryFn: async () => {
        if (!labelId) {
          return { customers: [], customersCount: 0 };
        }
        const response = await axios.get<Customers>(`http://localhost:5000/api/v1/customer`, {
          withCredentials: true,
          params: {
            label: labelId,
            page: page,
          },
        });
        const data = response.data;
        return data;
      },
      onError: (err) => {
        if (err.request.status === 401) {
          navigate("/login");
        }
      },

      onSuccess: (data) => {
        setCustomersCount(data.customersCount);
      },

      retry: false,
      refetchOnWindowFocus: false,
    }),

    customersCount,
  };
};

export default useGetCustomers;

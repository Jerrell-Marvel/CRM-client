import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { UseQueryResult, useInfiniteQuery, useQuery } from "react-query";
import { useNavigate } from "react-router";
// import { Customers } from "../../types/customer";

type UseGetCustomerParam = {
  labelId: string | null;
  limit?: number;
};

export type Customer = {
  _id: string;
  name: string;
  description: string;
  createdBy: string;
  labelId: string;
};

export type Customers = {
  customers: Customer[];
  customersCount: number;
};

const useGetCustomers2 = ({ labelId, limit = 10 }: UseGetCustomerParam) => {
  const navigate = useNavigate();

  return useInfiniteQuery<Customers, AxiosError>({
    queryKey: ["customers", labelId],
    queryFn: async ({ pageParam = 1 }) => {
      if (!labelId) {
        return { customers: [], customersCount: 0 };
      }
      const response = await axios.get<Customers>(`http://localhost:5000/api/v1/customer?label=${labelId}&page=${pageParam}&limit=${limit}`, { withCredentials: true });
      const data = response.data;
      return data;
    },
    onError: (err) => {
      if (err.request.status === 401) {
        navigate("/login");
      }
    },

    getNextPageParam: (lastPage, pages) => {
      // console.log(lastPage);
      //   console.log(lastPage.customersCount);
      //   console.log(pages.length < Math.ceil(lastPage.customersCount / 2));
      if (pages.length < Math.ceil(lastPage.customersCount / limit)) {
        return pages.length + 1;
      }

      return undefined;
    },

    retry: false,
    refetchOnWindowFocus: false,
  });
};

export default useGetCustomers2;

import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { UseQueryResult, useQuery } from "react-query";
import { useNavigate } from "react-router";

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

type UseGetCustomerParams = {
  labelId: string | null;
};

const useGetCustomers = ({ labelId }: UseGetCustomerParams) => {
  const navigate = useNavigate();

  return useQuery<Customers, AxiosError>({
    queryKey: ["customers", labelId],
    queryFn: async () => {
      if (!labelId) {
        return { customers: [] };
      }
      const response = await axios.get<Customers>(`http://localhost:5000/api/v1/customer?label=${labelId}`, { withCredentials: true });
      const data = response.data;
      return data;
    },
    onError: (err) => {
      if (err.request.status === 401) {
        navigate("/login");
      }
    },

    retry: false,
    refetchOnWindowFocus: false,
  });
};

export default useGetCustomers;

import axios, { AxiosError } from "axios";
import { useQuery } from "react-query";
import { useParams } from "react-router";
import useGetCustomer from "../hooks/customer/useGetCustomer";

type Customer = {
  customer: {
    _id: string;
    name: string;
    description: string;
    createdBy: string;
    labelId: string;
  };
};

export default function Customer() {
  const { id: customerId } = useParams();

  const { data, isLoading } = useGetCustomer({ customerId });
  return (
    <div>
      <div>
        <p>{data?.customer.name}</p>
      </div>
      <div>
        <p>{data?.customer._id}</p>
      </div>
      <div>
        <p>{data?.customer.description}</p>
      </div>
    </div>
  );
}

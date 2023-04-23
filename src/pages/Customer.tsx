import axios, { AxiosError } from "axios";
import { useQuery } from "react-query";
import { useParams } from "react-router";
import useGetCustomer from "../hooks/customer/useGetCustomer";
import { Link } from "react-router-dom";

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
      <h1 className="uppercase font-medium text-xl my-2 mx-4 sm:text-2xl md:text-3xl">Customer Details</h1>
      <div
        onSubmit={(e) => {
          e.preventDefault();
        }}
        className="p-4 rounded-md bg-white flex flex-col gap-2"
      >
        <div className="">
          <span className="font-medium">Name</span>
          <div>{data?.name}</div>
        </div>

        <div className="">
          <span className="font-medium">Description</span>
          <div>{data?.description}</div>
        </div>

        <div className="flex justify-end">
          <Link
            to={`/edit-customer/${customerId}`}
            className="btn"
          >
            Edit
          </Link>
        </div>
      </div>
    </div>
  );
}

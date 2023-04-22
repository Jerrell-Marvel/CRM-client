import axios, { AxiosError } from "axios";
import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useParams } from "react-router";
import useUpdateCustomer from "../hooks/customer/useUpdateCustomer";
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

type CustomerState = {
  name: string;
  description: string;
};

export default function EditCustomer() {
  const { id } = useParams();

  const [customerData, setCustomerData] = useState<Customer["customer"]>({
    _id: "",
    name: "",
    description: "",
    createdBy: "",
    labelId: "",
  });
  // const { data, isLoading } = useQuery<Customer, AxiosError>({
  //   queryKey: ["customer", id],
  //   queryFn: async () => {
  //     const response = await axios.get<Customer>(`http://localhost:5000/api/v1/customer/${id}`, { withCredentials: true });
  //     const data = response.data;
  //     return data;
  //   },

  //   onSuccess: (data) => {
  //     setCustomerData(data.customer);
  //   },
  // });

  const { data, isLoading } = useGetCustomer({
    customerId: id,
    config: {
      onSuccess: (data) => {
        console.log(data);
        setCustomerData(data);
      },
    },
  });

  const { data: updateCustData, isLoading: isUpdateCustLoading, mutate: updateCustomer } = useUpdateCustomer({});

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomerData({
      ...customerData,
      [e.target.name]: e.target.value,
    });
  };
  return (
    <div>
      <h1 className="uppercase font-medium text-xl my-2 mx-4 sm:text-2xl md:text-3xl">Update Customer</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          updateCustomer({
            customerId: customerData._id,
            prevLabelId: customerData.labelId,
            customerData: {
              name: customerData.name,
              description: customerData.description,
            },
          });
        }}
        className="p-4 rounded-md bg-white flex flex-col gap-4"
      >
        <div className="flex flex-col">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            value={customerData.name}
            name="name"
            onChange={(e) => {
              onChangeHandler(e);
            }}
            id="name"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="name">Description</label>
          <input
            type="text"
            value={customerData.description}
            name="description"
            onChange={(e) => {
              onChangeHandler(e);
            }}
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="btn w-fit"
          >
            submit
          </button>
        </div>
      </form>
    </div>
  );
}

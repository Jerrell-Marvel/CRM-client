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
        setCustomerData(data.customer);
      },
    },
  });

  const { data: updateCustData, isLoading: isUpdateCustLoading, mutate: updateCustomer } = useUpdateCustomer();

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomerData({
      ...customerData,
      [e.target.name]: e.target.value,
    });
  };
  return (
    <div>
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
      >
        <input
          type="text"
          value={customerData.name}
          name="name"
          onChange={(e) => {
            onChangeHandler(e);
          }}
        />
        <input
          type="text"
          value={customerData.description}
          name="description"
          onChange={(e) => {
            onChangeHandler(e);
          }}
        />

        <button type="submit">SUBMIT</button>
      </form>
    </div>
  );
}

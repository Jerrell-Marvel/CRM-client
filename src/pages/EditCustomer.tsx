import axios, { AxiosError } from "axios";
import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useParams } from "react-router";

type Customer = {
  customer: {
    _id: string;
    name: string;
    description: string;
    createdBy: string;
    labelId: string;
  };
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
  const { data, isLoading } = useQuery<Customer, AxiosError>({
    queryKey: ["customer", id],
    queryFn: async () => {
      const response = await axios.get<Customer>(`http://localhost:5000/api/v1/customer/${id}`, { withCredentials: true });
      const data = response.data;
      return data;
    },

    onSuccess: (data) => {
      setCustomerData(data.customer);
    },
  });

  const {
    data: updateCustData,
    isLoading: isUpdateCustLoading,
    mutate: updateCust,
  } = useMutation<Customer["customer"]>({
    mutationFn: async () => {
      const response = await axios.patch<Customer["customer"]>(
        `http://localhost:5000/api/v1/customer/${id}`,
        {
          name: customerData.name,
          description: customerData.description,
          labelId: customerData.labelId,
        },
        {
          withCredentials: true,
        }
      );
      const data = response.data;
      return data;
    },
  });

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
          updateCust();
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

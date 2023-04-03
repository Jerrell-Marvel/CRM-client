import axios, { AxiosError } from "axios";
import { useState } from "react";
import { QueryClient, useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate, useSearchParams } from "react-router-dom";

type Label = {
  _id: string;
  name: string;
  createdBy: string;
};
type Labels = {
  labels: Label[];
};

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

type CreateLabelResponse = {
  name: string;
};
type CreateCustomerResponse = {
  _id: string;
  name: string;
  labelId: string;
};

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [labelName, setLabelName] = useState("");
  const [customer, setCustomer] = useState<{ name: string; description: string }>({ name: "", description: "" });
  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const { data: labels, isLoading: isLabelLoading } = useQuery<Labels, AxiosError>({
    queryKey: ["labels"],
    queryFn: async () => {
      const response = await axios.get<Labels>("http://localhost:5000/api/v1/label", { withCredentials: true });
      const data = response.data;
      return data;
    },
    onError: (err) => {
      if (err.request.status === 401) {
        navigate("/login");
      }
    },
  });

  const { data: customers, isLoading: isCustomerLoading } = useQuery<Customers, AxiosError>({
    queryKey: ["customers", searchParams.get("label")],
    queryFn: async () => {
      const response = await axios.get<Customers>(`http://localhost:5000/api/v1/customer?label=${searchParams.get("label")}`, { withCredentials: true });
      const data = response.data;
      return data;
    },
    onError: (err) => {
      if (err.request.status === 401) {
        navigate("/login");
      }
    },
  });

  const {
    data: createLabelResponse,
    isLoading: isCreateLabelLoading,
    mutate: createLabel,
  } = useMutation<{ label: Label }, AxiosError>({
    mutationFn: async () => {
      const response = await axios.post<{ label: Label }>(`http://localhost:5000/api/v1/label`, { name: labelName }, { withCredentials: true });
      const data = response.data;
      console.log(data);
      return data;
    },

    onSuccess: (data) => {
      const labelData = queryClient.getQueryData<Labels>("labels");
      if (labelData) {
        const labels = [...labelData?.labels];

        labels.push(data.label);
        queryClient.setQueryData<Labels>("labels", { labels });
      }
    },

    onError: (err) => {
      if (err.request.status === 401) {
        navigate("/login");
      }
    },
  });

  const {
    data: createCustomerResponse,
    isLoading: isCreateCustomerLoading,
    mutate: createCustomer,
  } = useMutation<{ customer: Customer }, AxiosError>({
    mutationFn: async () => {
      console.log({ name: customer.name, description: customer.description, labelId: searchParams.get("label") });
      const response = await axios.post<{ customer: Customer }>(`http://localhost:5000/api/v1/customer`, { name: customer.name, description: customer.description, labelId: searchParams.get("label") }, { withCredentials: true });
      const data = response.data;
      return data;
    },

    onSuccess: (data) => {
      const customerData = queryClient.getQueryData<Customers>(["customers", searchParams.get("label")]);
      if (customerData) {
        const customers = [...customerData.customers];
        customers.push(data.customer);
        queryClient.setQueryData<Customers>(["customers", searchParams.get("label")], { customers: customers });
      }
    },
  });

  const labelOnSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createLabel();
  };

  const customerOnSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createCustomer();
  };

  return (
    <div>
      <form
        onSubmit={(e) => {
          labelOnSubmitHandler(e);
        }}
      >
        <input
          type="text"
          onChange={(e) => {
            setLabelName(e.target.value);
          }}
          value={labelName}
        />
        <h2>{searchParams.get("label")}</h2>
        <button type="submit">create label</button>
      </form>
      <div>
        {labels?.labels.map((label) => {
          return (
            <div
              key={label._id}
              onClick={() => {
                navigate(`/?label=${label._id}`);
              }}
            >
              {label.name}
            </div>
          );
        })}
      </div>

      <div>
        {customers?.customers.map((customer) => {
          return (
            <div key={customer._id}>
              <p>{customer.name}</p>
              {/* <span>Move to</span> */}
            </div>
          );
        })}
      </div>

      <form
        onSubmit={(e) => {
          customerOnSubmitHandler(e);
        }}
      >
        <input
          type="text"
          onChange={(e) => {
            setCustomer({ ...customer, name: e.target.value });
          }}
          value={customer.name}
        />
        <button type="submit">create customer</button>
      </form>
    </div>
  );
}

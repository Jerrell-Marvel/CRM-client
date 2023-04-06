import axios, { AxiosError } from "axios";
import { useState } from "react";
import { QueryClient, useMutation, useQuery, useQueryClient } from "react-query";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

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

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [selectedLabel, setSelectedLabel] = useState<Label | null>(null);
  const [isLabelRename, setIsLabelRename] = useState(false);
  const [labelRename, setLabelRename] = useState("");

  const [counter, setCounter] = useState(0);

  //get labels
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
    retry: false,
    refetchOnWindowFocus: false,
  });

  //get customer
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
    retry: false,
    refetchOnWindowFocus: false,
  });

  //create label
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

  //create customer
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

  // delete label
  const {
    data: deleteLabelResponse,
    isLoading: isDeleteLabelLoading,
    mutate: deleteLabel,
  } = useMutation<{ deletedLabel: Label }, AxiosError>({
    mutationFn: async () => {
      const response = await axios.delete<{ deletedLabel: Label }>(`http://localhost:5000/api/v1/label/${selectedLabel?._id}`, { withCredentials: true });
      const data = response.data;
      return data;
    },

    onSuccess: (data) => {
      const labelsData = queryClient.getQueryData<Labels>(["labels"]);
      console.log(labelsData);
      if (labelsData) {
        const labels = [...labelsData.labels];
        const deletedLabels = labels.filter((label) => {
          return label._id !== data.deletedLabel._id;
        });
        queryClient.setQueryData<Labels>(["labels"], { labels: deletedLabels });
      }

      setSelectedLabel(null);
    },
  });

  //delete customer
  const {
    data: deleteCustomerResponse,
    isLoading: isDeleteCustomerLoading,
    mutate: deleteCustomer,
  } = useMutation<{ deletedCustomer: Customer }, AxiosError>({
    mutationFn: async () => {
      const response = await axios.delete<{ deletedCustomer: Customer }>(`http://localhost:5000/api/v1/customer/${selectedCustomer?._id}`, { withCredentials: true });
      const data = response.data;
      return data;
    },

    onSuccess: (data) => {
      const customerData = queryClient.getQueryData<Customers>(["customers", searchParams.get("label")]);
      if (customerData) {
        const customers = [...customerData.customers];
        const deletedCustomers = customers.filter((customer) => {
          return customer._id !== data.deletedCustomer._id;
        });
        queryClient.setQueryData<Customers>(["customers", searchParams.get("label")], { customers: deletedCustomers });
      }

      setSelectedCustomer(null);
    },
  });

  //update label
  const { data: updateLabelResponse, mutate: updateLabel } = useMutation<{ updatedLabel: Label }, AxiosError>({
    mutationFn: async () => {
      const response = await axios.patch<{ updatedLabel: Label }>(`http://localhost:5000/api/v1/label/${selectedLabel?._id}`, { name: labelRename }, { withCredentials: true });
      const data = response.data;
      return data;
    },

    onSuccess: (data) => {
      const labels = queryClient.getQueryData<Labels>(["labels"]);

      if (labels) {
        const updateLabelIdx = labels.labels.findIndex((label) => {
          return data.updatedLabel._id === label._id;
        });

        const tempLabels = [...labels.labels];
        tempLabels[updateLabelIdx] = data.updatedLabel;

        queryClient.setQueryData<Labels>(["labels"], { labels: tempLabels });

        setIsLabelRename(false);
        setLabelRename("");
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
      <div
        onClick={() => {
          setCounter(counter + 1);
        }}
      >
        +
      </div>
      {selectedCustomer ? (
        <div className="bg-red-200">
          <p>{selectedCustomer._id}</p>
          <p>{selectedCustomer.name}</p>
          <Link to={`/edit-customer/${selectedCustomer._id}`}>edit</Link>
          <p
            onClick={() => {
              deleteCustomer();
            }}
          >
            delete
          </p>
        </div>
      ) : null}
      {selectedLabel ? (
        <div className="bg-red-200">
          <p>{selectedLabel._id}</p>
          <p>{selectedLabel.name}</p>

          <p
            onClick={() => {
              setIsLabelRename(true);
              setLabelRename(selectedLabel.name);
            }}
          >
            Rename
          </p>

          {isLabelRename ? (
            <div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  console.log(labelRename);
                  updateLabel();
                }}
              >
                <input
                  type="text"
                  value={labelRename}
                  onChange={(e) => setLabelRename(e.target.value)}
                />
                <button type="submit">Submit</button>
              </form>
            </div>
          ) : null}
          <p
            onClick={() => {
              deleteLabel();
            }}
          >
            delete
          </p>
        </div>
      ) : null}
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

      {/* Render label */}
      <div>
        {labels?.labels.map((label) => {
          return (
            <div
              className="flex gap-2"
              key={label._id}
            >
              <div
                key={label._id}
                onClick={() => {
                  navigate(`/?label=${label._id}`);
                }}
              >
                {label.name}
              </div>
              <span
                onClick={() => {
                  setSelectedLabel(label);
                }}
              >
                ...
              </span>
            </div>
          );
        })}
      </div>

      <div>
        <h3 className="font-bold text-2xl">CUSTOMERS</h3>
        {customers?.customers.map((customer) => {
          return (
            <div className="flex gap-2">
              <Link
                key={customer._id}
                to={`/customer/${customer._id}`}
              >
                <p>{customer.name}</p>

                {/* <span>Move to</span> */}
              </Link>
              <span
                onClick={() => {
                  setSelectedCustomer(customer);
                }}
              >
                ...
              </span>
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

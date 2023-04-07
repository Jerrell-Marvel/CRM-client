import axios, { AxiosError } from "axios";
import { useEffect, useRef, useState } from "react";
import { QueryClient, useMutation, useQuery, useQueryClient } from "react-query";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

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
  const [isMoveToActive, setIsMoveToActive] = useState(false);

  const [counter, setCounter] = useState(0);
  const [isCreateCustomerActive, setIsCreateCustomerActive] = useState(false);

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
      if (err.request.status === 400) {
        toast.error("Label name can't be empty");
      } else if (err.request.status === 401) {
        return navigate("/login");
      } else {
        toast.error("Something went wrong please try again later");
      }
    },
  });

  //create customer
  const {
    data: createCustomerResponse,
    isLoading: isCreateCustomerLoading,
    mutate: createCustomer,
  } = useMutation<{ customer: Customer }, AxiosError<{ message: string; statusCode: number }>>({
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
        customers.unshift(data.customer);
        queryClient.setQueryData<Customers>(["customers", searchParams.get("label")], { customers: customers });
      }
      setIsCreateCustomerActive(false);
      toast.success("Customer added successfully");
    },

    onError: (err) => {
      if ((err.request.status === 400 && err.response?.data.message === "Invalid label id") || err.request.status === 422) {
        toast.error("Invalid label id, please select a label");
      } else if (err.request.status === 400) {
        toast.error("Customer name can't be empy");
      } else if (err.request.status === 401) {
        return navigate("/login");
      } else {
        toast.error("Something went wrong please try again later");
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
        queryClient.setQueryData<Customers>(["customers", data.deletedLabel._id], { customers: [] });
      }

      setSelectedLabel(null);
    },

    onError: (err) => {
      if (err.request.status === 404) {
        toast.error("Label doesn't exist");
      } else if (err.request.status === 401) {
        navigate("/login");
      } else {
        toast.error("Something went wrong please try again later");
      }
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

      setIsMoveToActive(false);
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

  //Move customer
  const { data: updateCustomerResponse, mutate: updateCustomer } = useMutation<{ customer: Customer }, AxiosError, string>({
    mutationFn: async (labelId: string) => {
      const response = await axios.patch<{ customer: Customer }>(
        `http://localhost:5000/api/v1/customer/${selectedCustomer?._id}`,
        {
          labelId: labelId,
        },
        { withCredentials: true }
      );
      const data = response.data;
      return data;
    },

    onSuccess: (data) => {
      const customerData = queryClient.getQueryData<Customers>(["customers", searchParams.get("label")]);
      if (customerData) {
        const customers = [...customerData.customers];
        const deletedCustomers = customers.filter((customer) => {
          return customer._id !== data.customer._id;
        });
        queryClient.setQueryData<Customers>(["customers", searchParams.get("label")], { customers: deletedCustomers });
      }

      setSelectedCustomer(null);
    },
  });

  const labelOnSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!labelName) {
      return toast.error("Label name can't be empty");
    }
    createLabel();
  };

  const customerOnSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!customer.name) {
      return toast.error("Customer name can't be empty");
    }

    // const isLabelValid = labels?.labels.filter((label) => label._id === searchParams.get("label"));
    // if (isLabelValid?.length === 0) {
    //   return toast.error("Invalid label id, please select the label first");
    // }
    createCustomer();
  };

  return (
    <div className="py-4">
      {/* <div
        onClick={() => {
          setCounter(counter + 1);
        }}
      >
        +
      </div> */}
      {selectedCustomer ? (
        <>
          <div
            className="fixed top-0 left-0 w-screen h-screen bg-slate-500 bg-opacity-50 flex justify-center items-center"
            // onClick={() => {
            //   setSelectedCustomer(null);
            // }}
          ></div>

          <div className="bg-white max-w-3xl py -6 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col divide-y-2 min-w-[18rem] rounded-lg max-h-screen overflow-auto">
            <div
              className="px-4 flex justify-center py-2 cursor-pointer"
              onClick={() => {
                deleteCustomer();
              }}
            >
              <p>Delete</p>
            </div>

            <Link
              to={`/edit-customer/${selectedCustomer._id}`}
              className="px-4 flex justify-center py-2"
            >
              Edit
            </Link>

            <div
              className="px-4 flex justify-center py-2 cursor-pointer"
              onClick={() => {
                setIsMoveToActive((prev) => !prev);
              }}
            >
              <p>Move to</p>
            </div>

            {isMoveToActive ? (
              <div>
                {labels?.labels.map((label) => {
                  return (
                    <div
                      className="px-4 flex justify-center py-2 cursor-pointer text-center"
                      onClick={() => {
                        updateCustomer(label._id);
                      }}
                      key={label._id}
                    >
                      {label.name}
                    </div>
                  );
                })}
              </div>
            ) : null}

            <div
              className="px-4 flex justify-center py-2 cursor-pointer"
              onClick={() => {
                setSelectedCustomer(null);
              }}
            >
              <p>Cancel</p>
            </div>
          </div>
        </>
      ) : null}

      {/* label prompt */}
      {selectedLabel ? (
        <div>
          <div
            className="fixed top-0 left-0 w-screen h-screen bg-slate-500 bg-opacity-50 flex justify-center items-center"
            // onClick={() => {
            //   setSelectedLabel(null);
            //   setIsLabelRename(false);
            // }}
          ></div>
          <div className="bg-white max-w-3xl fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col divide-y-2 min-w-[18rem] rounded-lg">
            {isLabelRename ? (
              <div className="px-4 flex justify-center py-2 cursor-pointer">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    console.log(labelRename);
                    updateLabel();
                  }}
                  className="flex flex-col"
                >
                  <input
                    type="text"
                    value={labelRename}
                    onChange={(e) => setLabelRename(e.target.value)}
                    className="text-center mb-2 bg-slate-100 py-1"
                    placeholder="Enter new label here"
                  />
                  <button type="submit">Save</button>
                </form>
              </div>
            ) : (
              <div
                className="px-4 flex justify-center py-2 cursor-pointer"
                onClick={() => {
                  setIsLabelRename(true);
                  // setLabelRename(selectedLabel.name);
                }}
              >
                <p>Rename</p>
              </div>
            )}

            <div
              className="px-4 flex justify-center py-2 cursor-pointer"
              onClick={() => {
                deleteLabel();
              }}
            >
              <p>Delete</p>
            </div>

            <div
              onClick={() => {
                setSelectedLabel(null);
                setIsLabelRename(false);
              }}
              className="px-4 flex justify-center py-2 cursor-pointer"
            >
              <p>Cancel</p>
            </div>
          </div>
        </div>
      ) : null}

      {/* add label form */}
      <form
        onSubmit={(e) => {
          labelOnSubmitHandler(e);
        }}
        className="mb-2 flex gap-2"
      >
        <input
          type="text"
          onChange={(e) => {
            setLabelName(e.target.value);
          }}
          value={labelName}
          placeholder="add new label"
        />
        <button type="submit">create label</button>
      </form>

      {/* Render label */}
      <div className="flex gap-x-4 gap-y-2 overflow-auto border-b-2 flex-wrap mb-2l">
        {labels?.labels.map((label) => {
          return (
            <div
              className={`flex gap-2 border-[1px] border-slate-300 px-4 rounded-full ${searchParams.get("label") === label._id ? "bg-slate-300" : ""}`}
              key={label._id}
            >
              <div
                className="cursor-pointer"
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
                className="cursor-pointer"
              >
                ...
              </span>
            </div>
          );
        })}
      </div>

      {/* Create customer form */}
      {isCreateCustomerActive ? (
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
            placeholder="create customer"
          />
          <button type="submit">Add</button>
          <button onClick={() => setIsCreateCustomerActive(false)}>X</button>
        </form>
      ) : (
        <div
          onClick={() => {
            const isLabelValid = labels?.labels.filter((label) => label._id === searchParams.get("label"));
            if (isLabelValid?.length === 0) {
              return toast.error("Please select or create a label first");
            }
            setIsCreateCustomerActive(true);
          }}
        >
          Create customer
        </div>
      )}

      {/* Render customer */}
      <div className="flex flex-col gap-2 my-2">
        {customers?.customers.map((customer) => {
          return (
            <div
              className="flex gap-2 bg-white px-4 rounded-md py-2"
              key={customer._id}
            >
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
    </div>
  );
}

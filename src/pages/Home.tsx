import axios, { AxiosError } from "axios";
import { useEffect, useRef, useState } from "react";
import { QueryClient, useMutation, useQuery, useQueryClient } from "react-query";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import useGetLabel from "../hooks/label/useGetLabel";
import useGetCustomer from "../hooks/customer/useGetCustomers";
import useCreateLabel from "../hooks/label/useCreateLabel";
import useCreateCustomer from "../hooks/customer/useCreateCustomer";
import useDeleteLabel from "../hooks/label/useDeleteLabel";
import useDeleteCustomer from "../hooks/customer/useDeleteCustomer";
import useUpdateLabel from "../hooks/label/useUpdateLabel";
import useUpdateCustomer from "../hooks/customer/useUpdateCustomer";
import CustomerModal from "../components/modals/CustomerModal";

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

type CustomerDataParam = {
  name: string;
  description: string;
  labelId: string | null;
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

  //get labels (Custom hooks)
  const { data: labels, isLoading: isLabelLoading } = useGetLabel();

  //get customer (Custom hooks)
  const { data: customers, isLoading: isCustomerLoading } = useGetCustomer({ labelId: searchParams.get("label") });

  //create label (err handled, success handled) (Custom hooks)
  const { data: createLabelResponse, isLoading: isCreateLabelLoading, mutate: createLabel } = useCreateLabel();

  //create customer (err handled, success handled) (custom hooks)
  const { data: createCustomerResponse, isLoading: isCreateCustomerLoading, mutate: createCustomer } = useCreateCustomer(setIsCreateCustomerActive);

  // delete label (err handled, success handled) (custom hooks)
  const { data: deleteLabelResponse, isLoading: isDeleteLabelLoading, mutate: deleteLabel } = useDeleteLabel(setSelectedLabel);

  //delete customer (err handled, success handled) (custom hooks)
  const { data: deleteCustomerResponse, isLoading: isDeleteCustomerLoading, mutate: deleteCustomer } = useDeleteCustomer({ setSelectedCustomer, setIsMoveToActive });

  //update label (err handled, success handled) (custom hooks)
  const { data: updateLabelResponse, mutate: updateLabel } = useUpdateLabel({ setIsLabelRename, setLabelRename });

  //update customer (err handled, success handled) (custom hooks)
  const { data: updateCustomerResponse, mutate: updateCustomer } = useUpdateCustomer({ setIsMoveToActive, setSelectedCustomer });

  const labelOnSubmitHandler = (e: React.FormEvent<HTMLFormElement>, labelName: string) => {
    e.preventDefault();

    if (!labelName) {
      return toast.error("Label name can't be empty");
    }
    createLabel(labelName);
  };

  const customerOnSubmitHandler = (e: React.FormEvent<HTMLFormElement>, custData: CustomerDataParam) => {
    e.preventDefault();
    if (!customer.name) {
      return toast.error("Customer name can't be empty");
    }

    // const isLabelValid = labels?.labels.filter((label) => label._id === searchParams.get("label"));
    // if (isLabelValid?.length === 0) {
    //   return toast.error("Invalid label id, please select the label first");
    // }
    createCustomer(custData);
  };

  if (isLabelLoading || isCustomerLoading) {
    return <div>LOADING ...</div>;
  }

  return (
    <div className="py-4">
      {/* <div
        onClick={() => {
          setCounter(counter + 1);
        }}
      >
        +
      </div> */}
      {/* Selected customer modal */}
      <CustomerModal
        selectedCustomer={selectedCustomer}
        setSelectedCustomer={setSelectedCustomer}
        labels={labels}
      />

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
                    updateLabel({ labelId: selectedLabel._id, labelName: labelRename });
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
                deleteLabel(selectedLabel._id);
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
          labelOnSubmitHandler(e, labelName);
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
      <div className="flex gap-x-4 gap-y-2 overflow-auto border-b-2 mb-2l">
        {labels?.labels.map((label) => {
          return (
            <div
              className={`flex h-fit whitespace-nowrap gap-2 border-[1px] border-slate-300 px-4 rounded-full ${searchParams.get("label") === label._id ? "bg-slate-300" : ""}`}
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
            customerOnSubmitHandler(e, { name: customer.name, description: customer.description, labelId: searchParams.get("label") });
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

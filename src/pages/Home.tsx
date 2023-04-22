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
import LabelModal from "../components/modals/LabelModal";
import AddLabelForm from "../components/forms/CreateLabelForm";
import CreateCustomerForm from "../components/forms/CreateCustomerForm";
import SearchCustomerForm from "../components/forms/SearchCustomerForm";
import CreateLabelForm from "../components/forms/CreateLabelForm";

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
  const { data: labels, isLoading: isLabelLoading, isError: isLabelsError } = useGetLabel();

  //get customer (Custom hooks)
  const { data: customers, isLoading: isCustomerLoading, isError: isCustomersError } = useGetCustomer({ labelId: searchParams.get("label") });

  //create label (err handled, success handled) (Custom hooks, moved into AddLabelForm component)
  // const { data: createLabelResponse, isLoading: isCreateLabelLoading, mutate: createLabel } = useCreateLabel();

  //create customer (err handled, success handled) (custom hooks)
  // const { data: createCustomerResponse, isLoading: isCreateCustomerLoading, mutate: createCustomer } = useCreateCustomer(setIsCreateCustomerActive);

  // delete label (err handled, success handled) (custom hooks, moved to LabelModal component)
  // const { data: deleteLabelResponse, isLoading: isDeleteLabelLoading, mutate: deleteLabel } = useDeleteLabel(setSelectedLabel);

  //delete customer (err handled, success handled) (custom hooks, moved into CustomerModal component)
  // const { data: deleteCustomerResponse, isLoading: isDeleteCustomerLoading, mutate: deleteCustomer } = useDeleteCustomer({ setSelectedCustomer, setIsMoveToActive });

  //update label (err handled, success handled) (custom hooks, moved to LabelModal component)
  // const { data: updateLabelResponse, mutate: updateLabel } = useUpdateLabel({ setIsLabelRename, setLabelRename });

  //update customer (err handled, success handled) (custom hooks, moved into CustomerModal component)
  // const { data: updateCustomerResponse, mutate: updateCustomer } = useUpdateCustomer({ setIsMoveToActive, setSelectedCustomer });

  //Label submit handler
  // const labelOnSubmitHandler = (e: React.FormEvent<HTMLFormElement>, labelName: string) => {
  //   e.preventDefault();

  //   if (!labelName) {
  //     return toast.error("Label name can't be empty");
  //   }
  //   createLabel(labelName);
  // };

  // const customerOnSubmitHandler = (e: React.FormEvent<HTMLFormElement>, custData: CustomerDataParam) => {
  //   e.preventDefault();
  //   if (!customer.name) {
  //     return toast.error("Customer name can't be empty");
  //   }

  //   // const isLabelValid = labels?.labels.filter((label) => label._id === searchParams.get("label"));
  //   // if (isLabelValid?.length === 0) {
  //   //   return toast.error("Invalid label id, please select the label first");
  //   // }
  //   createCustomer(custData);
  // };

  if (isLabelLoading || isCustomerLoading) {
    return <div>LOADING ...</div>;
  }

  return (
    <>
      {/* Selected customer modal */}
      <CustomerModal
        selectedCustomer={selectedCustomer}
        setSelectedCustomer={setSelectedCustomer}
        labels={labels}
      />

      {/* label modal */}
      <LabelModal
        selectedLabel={selectedLabel}
        setSelectedLabel={setSelectedLabel}
      />
      <div className="py-4 flex flex-col gap-2">
        <SearchCustomerForm />
        {/* <div
        onClick={() => {
          setCounter(counter + 1);
        }}
      >
        +
      </div> */}

        {/* add label form */}
        <CreateLabelForm />

        {/* Render label */}
        <div className="flex gap-x-2 overflow-auto border-b-2 bg-white p-4 rounded-md">
          {labels?.labels.map((label) => {
            return (
              <div
                className={`flex whitespace-nowrap border-[1px] border-slate-200 rounded-full ${searchParams.get("label") === label._id ? "bg-slate-200 border-none" : ""}`}
                key={label._id}
              >
                <div
                  className="cursor-pointer px-4"
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
                  className="cursor-pointer pr-4"
                >
                  ...
                </span>
              </div>
            );
          })}
        </div>

        {/* Create customer form */}
        {/* {isCreateCustomerActive ? (
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
      )} */}

        {/* <CreateCustomerForm labels={labels!} /> */}

        {/* Render customer */}
        <div className="flex flex-col gap-2">
          {customers?.customers.map((customer) => {
            return (
              <div
                className="flex gap-2 bg-white px-4 rounded-md py-2 justify-between "
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
                  className="cursor-pointer"
                >
                  ...
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

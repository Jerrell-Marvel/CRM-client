import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import useCreateCustomer from "../../hooks/customer/useCreateCustomer";
import { toast } from "react-toastify";
import { Labels } from "../../types/label";
import useCreateCustomer2 from "../../hooks/customer/useCreateCustomer2";

type CustomerDataParam = {
  name: string;
  description: string;
  labelId: string | null;
};

type CreateCustomerFormParam = {
  labels: Labels;
};

const CreateCustomerForm = ({ labels }: CreateCustomerFormParam) => {
  const [isCreateCustomerActive, setIsCreateCustomerActive] = useState(false);
  const [searchParams] = useSearchParams();
  const [customer, setCustomer] = useState<{ name: string; description: string }>({ name: "", description: "" });

  const {
    data: createCustomerResponse,
    isLoading: isCreateCustomerLoading,
    mutate: createCustomer,
  } = useCreateCustomer2({
    onSuccess: () => {
      setIsCreateCustomerActive(false);
      setCustomer({ name: "", description: "" });
    },
  });

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

  return (
    <>
      {searchParams.get("label") ? (
        isCreateCustomerActive ? (
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
        )
      ) : null}
    </>
  );
};

export default CreateCustomerForm;

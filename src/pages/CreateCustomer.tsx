import { useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import useCreateCustomer from "../hooks/customer/useCreateCustomer";

type CustomerDataParam = {
  name: string;
  description: string;
  labelId: string | null;
};

// type CreateCustomerFormParam = {
//   labels: Labels;
// };

const CreateCustomer = () => {
  const [isCreateCustomerActive, setIsCreateCustomerActive] = useState(false);
  const [searchParams] = useSearchParams();
  const [customer, setCustomer] = useState<{ name: string; description: string }>({ name: "", description: "" });

  const { labelId } = useParams();

  const {
    data: createCustomerResponse,
    isLoading: isCreateCustomerLoading,
    mutate: createCustomer,
  } = useCreateCustomer({
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
      <form
        onSubmit={(e) => {
          customerOnSubmitHandler(e, { name: customer.name, description: customer.description, labelId: labelId! });
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
        {/* <button onClick={() => setIsCreateCustomerActive(false)}>X</button> */}
      </form>
    </>
  );
};

export default CreateCustomer;

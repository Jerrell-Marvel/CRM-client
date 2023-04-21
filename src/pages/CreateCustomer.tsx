import { useNavigate, useParams } from "react-router";
import CreateCustomerForm from "../components/forms/CreateCustomerForm";
import useCreateCustomer from "../hooks/customer/useCreateCustomer";
import { useState } from "react";
import { toast } from "react-toastify";
import { useSearchParams } from "react-router-dom";

type CustomerDataParam = {
  name: string;
  description: string;
  labelId: string | null;
};

const CreateCustomer = () => {
  const { labelId } = useParams();
  const [isCreateCustomerActive, setIsCreateCustomerActive] = useState(false);
  const [customer, setCustomer] = useState<{ name: string; description: string }>({ name: "", description: "" });
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const {
    data: createCustomerResponse,
    isLoading: isCreateCustomerLoading,
    mutate: createCustomer,
  } = useCreateCustomer({
    onSuccess: () => {
      // setIsCreateCustomerActive(false);
      // setCustomer({ name: "", description: "" });
      navigate(`/?label=${labelId}`);
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
      <div>CREATING CUSTOMER</div>
      <form
        onSubmit={(e) => {
          if (!labelId) {
            return toast.error("Invalid label id, please select a label");
          }

          customerOnSubmitHandler(e, { name: customer.name, description: customer.description, labelId: labelId });
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
    </>
  );
};

export default CreateCustomer;

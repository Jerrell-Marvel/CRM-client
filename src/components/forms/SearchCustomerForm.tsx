import { useState } from "react";
import { useNavigate } from "react-router";

type SearchCustomerFormProps = {
  customerName?: string | null;
};

const SearchCustomerForm = ({ customerName: custName }: SearchCustomerFormProps) => {
  const [customerName, setCustomerName] = useState(() => {
    return custName || "";
  });
  const navigate = useNavigate();
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        navigate(`/search?q=${customerName}`);
      }}
    >
      <input
        type="text"
        value={customerName}
        placeholder="search"
        onChange={(e) => {
          setCustomerName(e.target.value);
        }}
      />

      <button type="submit">SUBMIT</button>
    </form>
  );
};

export default SearchCustomerForm;

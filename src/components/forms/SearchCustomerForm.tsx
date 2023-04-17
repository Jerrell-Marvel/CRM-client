import { useState } from "react";
import { useNavigate } from "react-router";

const SearchCustomerForm = () => {
  const [customerName, setCustomerName] = useState("");
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
        onChange={(e) => {
          setCustomerName(e.target.value);
        }}
      />

      <button type="submit">SUBMIT</button>
    </form>
  );
};

export default SearchCustomerForm;

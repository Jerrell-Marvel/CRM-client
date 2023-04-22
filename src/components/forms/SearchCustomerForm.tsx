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
      className=""
    >
      <div className="flex w-full gap-2">
        <input
          type="text"
          value={customerName}
          placeholder="type to search..."
          onChange={(e) => {
            setCustomerName(e.target.value);
          }}
          className="bg-slate-100 px-2 py-1 focus:outline-none"
        />

        <button type="submit">
          <svg
            width="24"
            height="24"
            xmlns="http://www.w3.org/2000/svg"
            fillRule="evenodd"
            clipRule="evenodd"
            className="scale-[85%]"
          >
            <path d="M15.853 16.56c-1.683 1.517-3.911 2.44-6.353 2.44-5.243 0-9.5-4.257-9.5-9.5s4.257-9.5 9.5-9.5 9.5 4.257 9.5 9.5c0 2.442-.923 4.67-2.44 6.353l7.44 7.44-.707.707-7.44-7.44zm-6.353-15.56c4.691 0 8.5 3.809 8.5 8.5s-3.809 8.5-8.5 8.5-8.5-3.809-8.5-8.5 3.809-8.5 8.5-8.5z" />
          </svg>
        </button>
      </div>
    </form>
  );
};

export default SearchCustomerForm;

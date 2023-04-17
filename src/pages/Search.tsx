import { useSearchParams } from "react-router-dom";
import useSearchCustomer from "../hooks/customer/useSearchCustomer";
import SearchCustomerForm from "../components/forms/SearchCustomerForm";

const Search = () => {
  const [searchParams] = useSearchParams();
  const { data } = useSearchCustomer({ q: searchParams.get("q") });
  return (
    <>
      <SearchCustomerForm />
      <div>
        {data?.customers.map((customer) => {
          return <div>{customer.name}</div>;
        })}
      </div>
    </>
  );
};

export default Search;

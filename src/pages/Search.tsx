import { Link, useSearchParams } from "react-router-dom";
import useSearchCustomer from "../hooks/customer/useSearchCustomer";
import SearchCustomerForm from "../components/forms/SearchCustomerForm";

const Search = () => {
  const [searchParams] = useSearchParams();
  const { data } = useSearchCustomer({ q: searchParams.get("q") });
  return (
    <>
      <SearchCustomerForm customerName={searchParams.get("q")} />
      <div>
        {data?.customers.map((customer) => {
          return (
            <div>
              <p> {customer.name}</p>
              <Link to={`/?label=${customer.labelId._id}`}>in {customer.labelId.name}</Link>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Search;

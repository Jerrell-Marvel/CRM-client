import { Link, useSearchParams } from "react-router-dom";
import useSearchCustomer from "../hooks/customer/useSearchCustomer";
import SearchCustomerForm from "../components/forms/SearchCustomerForm";

const Search = () => {
  const [searchParams] = useSearchParams();
  const { data } = useSearchCustomer({ q: searchParams.get("q") });
  return (
    <>
      <div className="bg-white p-4 rounded-md">
        <SearchCustomerForm customerName={searchParams.get("q")} />
      </div>

      <div className="flex flex-col gap-2 mt-2">
        {data?.customers.map((customer) => {
          return (
            <div className="gap-2 bg-white px-4 rounded-md py-2">
              <Link to={`/customer/${customer._id}`}>
                <p> {customer.name}</p>
              </Link>

              <span>
                in{" "}
                <Link
                  to={`/?label=${customer.labelId._id}`}
                  className="font-medium underline"
                >
                  {customer.labelId.name}
                </Link>
              </span>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Search;

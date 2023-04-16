import { Link } from "react-router-dom";
import { Customer } from "../../types/customer";
import { Labels } from "../../types/label";
import useDeleteCustomer from "../../hooks/customer/useDeleteCustomer";
import { useState } from "react";
import useUpdateCustomer from "../../hooks/customer/useUpdateCustomer";

type CustomerModalProps = {
  selectedCustomer: Customer | null;
  setSelectedCustomer: React.Dispatch<React.SetStateAction<Customer | null>>;
  labels: Labels | undefined;
};
const CustomerModal = ({ selectedCustomer, setSelectedCustomer, labels }: CustomerModalProps) => {
  const [isMoveToActive, setIsMoveToActive] = useState(false);
  const { data: deleteCustomerResponse, isLoading: isDeleteCustomerLoading, mutate: deleteCustomer } = useDeleteCustomer({ setSelectedCustomer, setIsMoveToActive });
  const { data: updateCustomerResponse, mutate: updateCustomer } = useUpdateCustomer({ setIsMoveToActive, setSelectedCustomer });
  return (
    <>
      {selectedCustomer ? (
        <>
          <div
            className="fixed top-0 left-0 w-screen h-screen bg-slate-500 bg-opacity-50 flex justify-center items-center"
            // onClick={() => {
            //   setSelectedCustomer(null);
            // }}
          ></div>

          <div className="bg-white max-w-3xl py -6 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col divide-y-2 min-w-[18rem] rounded-lg max-h-screen overflow-auto">
            <div
              className="px-4 flex justify-center py-2 cursor-pointer"
              onClick={() => {
                deleteCustomer(selectedCustomer._id);
              }}
            >
              <p>Delete</p>
            </div>

            <Link
              to={`/edit-customer/${selectedCustomer._id}`}
              className="px-4 flex justify-center py-2"
            >
              Edit
            </Link>

            <div
              className="px-4 flex justify-center py-2 cursor-pointer"
              onClick={() => {
                setIsMoveToActive((prev) => !prev);
              }}
            >
              <p>Move to</p>
            </div>

            {/* MOve to */}
            {isMoveToActive ? (
              <div>
                {labels?.labels.map((label) => {
                  if (label._id !== selectedCustomer.labelId) {
                    return (
                      <div
                        className="px-4 flex justify-center py-2 cursor-pointer text-center"
                        onClick={() => {
                          updateCustomer({ customerId: selectedCustomer._id, prevLabelId: selectedCustomer.labelId, customerData: { name: selectedCustomer.name, labelId: label._id } });
                        }}
                        key={label._id}
                      >
                        {label.name}
                      </div>
                    );
                  }

                  return null;
                })}
              </div>
            ) : null}

            <div
              className="px-4 flex justify-center py-2 cursor-pointer"
              onClick={() => {
                setSelectedCustomer(null);
              }}
            >
              <p>Cancel</p>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
};

export default CustomerModal;

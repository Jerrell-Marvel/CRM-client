import { Label } from "./label";

export type Customer = {
  _id: string;
  name: string;
  description: string;
  createdBy: string;
  labelId: string;
};

export type Customers = {
  customers: Customer[];
};

type CustomerWithLabel = Omit<Customer, "labelId"> & { labelId: Label };

export type CustomersWithLabel = {
  customers: CustomerWithLabel[];
};

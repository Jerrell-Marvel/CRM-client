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

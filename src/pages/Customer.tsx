import axios, { AxiosError } from "axios";
import { useQuery } from "react-query";
import { useParams } from "react-router";

type Customer = {
  customer: {
    _id: string;
    name: string;
    description: string;
    createdBy: string;
    labelId: string;
  };
};

export default function Customer() {
  const { id } = useParams();

  const { data, isLoading } = useQuery<Customer, AxiosError>({
    queryKey: ["customer", id],
    queryFn: async () => {
      const response = await axios.get<Customer>(`http://localhost:5000/api/v1/customer/${id}`, { withCredentials: true });
      const data = response.data;
      return data;
    },
  });
  return (
    <div>
      <div>
        <p>{data?.customer.name}</p>
      </div>
      <div>
        <p>{data?.customer._id}</p>
      </div>
      <div>
        <p>{data?.customer.description}</p>
      </div>
    </div>
  );
}

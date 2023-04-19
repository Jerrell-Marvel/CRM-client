import { useEffect, useMemo, useRef } from "react";
import useGetCustomers2 from "../hooks/customer/useGetCustomers2";

const Test = () => {
  const { data, hasNextPage, fetchNextPage, isLoading } = useGetCustomers2({ labelId: "6436ad593cb1c96c15bc42b4", limit: 2 });

  const lastElementRef = useRef<HTMLDivElement>(null);

  //Memoize the observer by using useMemo, this observer can also be put inside the useEffect, but the observer will be created every time the data changes
  const observer = useMemo(() => {
    return new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          console.log("is visible");
          fetchNextPage();
        }
      });
    });
  }, []);

  useEffect(() => {
    // console.log("YES DATA" + data);
    const tempLastElementRef = lastElementRef.current;

    // console.log("OBSERVING");
    // console.log(tempLastElementRef);
    if (tempLastElementRef && hasNextPage) {
      observer.observe(lastElementRef.current);
    }

    // console.log(a);

    return () => {
      if (tempLastElementRef) {
        observer.unobserve(tempLastElementRef);
        // console.log("CLEANING UP");
        // console.log(tempLastElementRef);
      }

      //   console.log("CLEANing UP ");
      //   console.log(tempLastElementRef);
      //   console.log(a);
    };
  }, [data]);

  return (
    <>
      <div>{hasNextPage ? "Has next page bro" : "No next page"}</div>
      <div>{hasNextPage}</div>

      <div>
        {data?.pages.map((group, i) => {
          return (
            <div key={i}>
              {group.customers.map((customer, idx) => {
                if (idx + 1 === group.customers.length) {
                  return (
                    <div
                      key={customer._id}
                      className="h-96 bg-pink-200 mb-6"
                      ref={lastElementRef}
                    >
                      {customer.name}
                    </div>
                  );
                } else {
                  return (
                    <div
                      key={customer._id}
                      className="h-96 bg-pink-200 mb-6"
                    >
                      {customer.name}
                    </div>
                  );
                }
              })}
            </div>
          );
        })}
      </div>
      <button
        onClick={() => {
          fetchNextPage();
        }}
      >
        Load more
      </button>
    </>
  );
};

export default Test;

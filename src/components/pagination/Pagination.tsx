import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { convertToValidPage } from "../../utils/convertToValidPage";

type PaginationProps = {
  dataCount: number;
  activePage: number;
  limit: number;
};

const Pagination = ({ dataCount, activePage, limit }: PaginationProps) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const navigate = useNavigate();

  return (
    <div>
      <div>pagination</div>
      <div>Data Count : {dataCount}</div>
      <div>Active Page : {activePage}</div>

      <div className="flex">
        {[...Array(Math.ceil(dataCount / limit))].map((e, idx) => {
          return (
            <div
              className={`p-4 border-black border-2 ${activePage === idx + 1 ? "bg-slate-300" : ""}`}
              key={idx}
              onClick={() => {
                // setSearchParams(params);
                navigate(`/?label=${searchParams.get("label")}&page=${idx + 1}`);
              }}
            >
              {idx + 1}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Pagination;

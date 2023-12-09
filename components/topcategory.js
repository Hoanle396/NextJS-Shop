import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/dist/client/router";
import Search from "./search";
import { useDispatch, useSelector } from "react-redux";
import { recentCategory, selectCategory } from "../slices/categorySlice";

function TopCategory({ categories }) {
  const dispatch = useDispatch();
  const data = useSelector(recentCategory);
  const [recent, setRecent] = useState();
  useEffect(() => setRecent(data));

  return (
    <div className="navbot bg-cusgray z-30 w-full px-1 md:px-0">
      <div className=" mx-auto md:flex place-items-center max-w-screen-2xl">
        <div className="category overflow-x-auto flex flex-wrap place-items-center py-2">
          <Link key="all" href={`/shop`}>
            <button
              className={`${
                recent == ""
                  ? `bg-cusblack text-white shadow-lg `
                  : `bg-white text-cusblack`
                } py-2.5 px-6 rounded-3xl text-xs mr-3 mb-2 md:mb-0`}
                onClick={() => dispatch(selectCategory(""))}
            >
              All items
            </button>
          </Link>
          {categories.map((cat, idx) => (
            
              <button
                className={`${
                  recent == cat.name
                    ? `bg-cusblack text-white shadow-lg `
                    : `bg-white text-cusblack`
                } py-2.5 px-6 rounded-3xl text-xs mr-3 mb-2 md:mb-0`}
                onClick={() => dispatch(selectCategory(cat.name))}
              >
                {cat.name}
              </button>
          ))}
        </div>
        <Search />
      </div>
    </div>
  );
}

export default TopCategory;

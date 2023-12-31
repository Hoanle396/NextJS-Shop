import React from "react";
import NumberFormat from "react-number-format";
import moment from "moment";
import { ORDER_STATUS } from "../app/constants";

const RenderStatus = ({ status = ORDER_STATUS.PENDING }) => {
  let color;
  let title;

  switch (status) {
    case 0:
      color = "bg-yellow-500";
      title = "Pending";
      break;
    case 2:
      color = "bg-green-500";
      title = "Success";
      break;
    case 1:
      color = "bg-red-500";
      title = "Closed";
      break;
    case 3:
      color = " bg-blue-500";
      title = "Confirm";
      break;
    default:
      color = "bg-yellow-500";
      title = "Pending";
  }

  return (
    <div
      className={`py-0.5 px-2 text-white mx-3 flex text-[8px] place-items-center rounded-lg ${color}`}
    >
      {title}
    </div>
  );
};

function OrderCard({ order }) {
  return (
    <div className="py-2 px-4 rounded-lg shadow-lg mb-2">
      <div className="flex place-items-center text-xs text-cusblack py-1">
        <svg
          className="w-5 h-5 text-cusblack"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z"
            clipRule="evenodd"
          />
        </svg>
        <p className="mx-2 font-semibold">Shop</p>
        <p>{moment(order.createdAt).format("DD MMM YYYY")}</p>
        <RenderStatus status={order.status} />
      </div>

      <div className="flex flex-col my-1">
        <div className="md:flex mt-2">
          <div className="md:w-3/4 border-b md:border-b-0 md:border-r border-gray-300">
            <div className="flex mb-2">
              <div className="mx-3 text-xs text-cusblack">
                <p className="text-sm font-semibold">{order.code}</p>
              </div>
            </div>
          </div>
          <div className="md:w-1/4 mt-2 md:mt-0 text-xs text-cusblack flex md:flex-col justify-center place-items-center">
            <p className="text-gray-400 md:mb-1">Total Amount :</p>
            <NumberFormat
              value={order.amount}
              className="font-semibold"
              displayType={"text"}
              thousandSeparator={true}
              prefix={"$"}
              renderText={(value, props) => (
                <p className="text-gray-400 text-xs" {...props}>
                  {value}
                </p>
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderCard;

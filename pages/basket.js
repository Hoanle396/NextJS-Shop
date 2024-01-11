import { useRouter } from "next/dist/client/router";
import Head from "next/head";
import Link from "next/link";
import nookies from "nookies";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import NumberFormat from "react-number-format";
import QR from "react-qr-code";
import { useMutation } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { createOrder } from "../app/apis/orders/request";
import BasketProduct from "../components/basketproduct";
import Header from "../components/header";
import { deleteFromBasket, selectItems } from "../slices/basketSlice";

import { QRCode } from "@hoanle396/viet-qr";
import { BANK_ACCOUNT, BANK_ID, BANK_NAME } from "../app/constants";

function Basket() {
  const router = useRouter();
  const items = useSelector(selectItems);
  const [cookie, setCookie] = useState({});
  const [field, setField] = useState({});
  const dispatch = useDispatch();
  const [bank, setBank] = useState({
    name: BANK_NAME,
    account: BANK_ACCOUNT,
    amount: 0,
    message: "",
    qr: "",
  });

  const [step, setStep] = useState("checkout");

  const { mutate, isLoading } = useMutation(createOrder, {
    onSuccess: (data) => {
      const value = new QRCode()
        .setBeneficiaryOrganization(BANK_ID, BANK_ACCOUNT)
        .setTransactionAmount(data.amount)
        .setAdditionalDataFieldTemplate(data.code)
        .build();
      setBank({
        name: BANK_NAME,
        account: BANK_ACCOUNT,
        amount: data.amount,
        message: data.code,
        qr: value,
      });
      toast.success("Order has been created");
      setField({});
      dispatch(deleteFromBasket());
      setStep("payment");
    },
    onError: (e) => {
      toast.error(e?.message ?? "Order has been created failed");
    },
  });

  useEffect(() => {
    const dataCookie = nookies.get();
    try {
      setCookie(JSON.parse(dataCookie.user));
    } catch (err) {
      setCookie(dataCookie.user);
    }
  }, []);

  const handleChange = (e) => {
    setField({ ...field, [e.target.name]: e.target.value });
  };

  const createCheckoutSession = () => {
    if (!cookie) {
      router.push("/login");
      return;
    }

    const payload = {
      ...field,
      products: [
        ...items.map((item) => ({
          product: item.id,
          size: item.selectedSizeProp.sizeName,
          quantity: item.quantity,
        })),
      ],
    };
    mutate(payload);
  };

  const handleConfirm = () => {
    setStep("checkout");
    router.push("/shop");
  };

  return (
    <>
      <Head>
        <title>wefootwear | Basket</title>
      </Head>
      <div className="w-full min-h-screen relative bg-cusgray pb-10">
        <Header />
        <div className="max-w-screen-2xl mx-auto pt-20 px-5">
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-x-4">
            <div className="md:col-span-2 md:mr-5">
              <div className="">
                <div className="shadow-lg rounded-xl bg-cusblack text-white px-5 py-3">
                  <h1 className="font-semibold text-lg md:text-xl mb-1">
                    GET FREE SHIPPING WITH MEMBER+ ON EVERY ORDER
                  </h1>
                  <p className="text-xs mb-1 text-gray-100">
                    Non member receive free-shipping for purchases $ 1,500,000
                    or more
                  </p>
                </div>
                <div className="rounded-xl bg-white px-5 pt-5 mt-5 shadow-lg overflow-hidden">
                  <p>Your Basket ({items.length})</p>
                  <div className="pt-5 pb-2">
                    {items.length > 0 &&
                      items.map((item, idx) => (
                        <BasketProduct idx={idx} key={item.slug} item={item} />
                      ))}
                    {items.length === 0 && (
                      <div className="text-gray-400 text-sm mb-10 mx-auto">
                        <img
                          className="md:w-1/3 object-cover w-full"
                          src="https://i.ibb.co/hWZhd6F/empty-cart-4a7779da-Convert-Image.png"
                          alt=""
                        />
                        <p className="text-center">
                          Your basket is empty,
                          <br />
                          to start shopping click
                          <span className="underline">
                            <Link href="/shop">here</Link>
                          </span>
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 md:mt-0 col-span-1">
              <div className="rounded-xl bg-white shadow-lg py-6 px-5">
                {step === "checkout" && (
                  <from onSubmit={createCheckoutSession}>
                    <h1 className="text-cusblack font-bold text-md">SUMMARY</h1>
                    <div className="px-4 py-3 text-xs font-medium flex place-items-center text-gray-400 border border-gray-200 rounded-md my-4">
                      <svg
                        fill="currentColor"
                        version="1.1"
                        className="w-5 h-5 mr-3"
                        id="Capa_1"
                        xmlns="http://www.w3.org/2000/svg"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                        viewBox="0 0 75.294 75.294"
                        xmlSpace="preserve"
                      >
                        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                        <g
                          id="SVGRepo_tracerCarrier"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          stroke="#CCCCCC"
                          stroke-width="0.150588"
                        ></g>
                        <g id="SVGRepo_iconCarrier">
                          <g>
                            <path d="M66.097,12.089h-56.9C4.126,12.089,0,16.215,0,21.286v32.722c0,5.071,4.126,9.197,9.197,9.197h56.9 c5.071,0,9.197-4.126,9.197-9.197V21.287C75.295,16.215,71.169,12.089,66.097,12.089z M61.603,18.089L37.647,33.523L13.691,18.089 H61.603z M66.097,57.206h-56.9C7.434,57.206,6,55.771,6,54.009V21.457l29.796,19.16c0.04,0.025,0.083,0.042,0.124,0.065 c0.043,0.024,0.087,0.047,0.131,0.069c0.231,0.119,0.469,0.215,0.712,0.278c0.025,0.007,0.05,0.01,0.075,0.016 c0.267,0.063,0.537,0.102,0.807,0.102c0.001,0,0.002,0,0.002,0c0.002,0,0.003,0,0.004,0c0.27,0,0.54-0.038,0.807-0.102 c0.025-0.006,0.05-0.009,0.075-0.016c0.243-0.063,0.48-0.159,0.712-0.278c0.044-0.022,0.088-0.045,0.131-0.069 c0.041-0.023,0.084-0.04,0.124-0.065l29.796-19.16v32.551C69.295,55.771,67.86,57.206,66.097,57.206z"></path>
                          </g>
                        </g>
                      </svg>
                      <input
                        name="email"
                        onChange={handleChange}
                        required
                        placeholder="Email Address"
                        className="w-full focus:outline-none h-full text-md"
                      />
                    </div>
                    <div className="px-4 py-3 text-xs font-medium flex place-items-center text-gray-400 border border-gray-200 rounded-md my-4">
                      <svg
                        fill="currentColor"
                        className="w-5 h-5 mr-3"
                        version="1.1"
                        id="Capa_1"
                        xmlns="http://www.w3.org/2000/svg"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                        viewBox="0 0 473.806 473.806"
                        xmlSpace="preserve"
                      >
                        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                        <g
                          id="SVGRepo_tracerCarrier"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></g>
                        <g id="SVGRepo_iconCarrier">
                          <g>
                            <g>
                              <path d="M374.456,293.506c-9.7-10.1-21.4-15.5-33.8-15.5c-12.3,0-24.1,5.3-34.2,15.4l-31.6,31.5c-2.6-1.4-5.2-2.7-7.7-4 c-3.6-1.8-7-3.5-9.9-5.3c-29.6-18.8-56.5-43.3-82.3-75c-12.5-15.8-20.9-29.1-27-42.6c8.2-7.5,15.8-15.3,23.2-22.8 c2.8-2.8,5.6-5.7,8.4-8.5c21-21,21-48.2,0-69.2l-27.3-27.3c-3.1-3.1-6.3-6.3-9.3-9.5c-6-6.2-12.3-12.6-18.8-18.6 c-9.7-9.6-21.3-14.7-33.5-14.7s-24,5.1-34,14.7c-0.1,0.1-0.1,0.1-0.2,0.2l-34,34.3c-12.8,12.8-20.1,28.4-21.7,46.5 c-2.4,29.2,6.2,56.4,12.8,74.2c16.2,43.7,40.4,84.2,76.5,127.6c43.8,52.3,96.5,93.6,156.7,122.7c23,10.9,53.7,23.8,88,26 c2.1,0.1,4.3,0.2,6.3,0.2c23.1,0,42.5-8.3,57.7-24.8c0.1-0.2,0.3-0.3,0.4-0.5c5.2-6.3,11.2-12,17.5-18.1c4.3-4.1,8.7-8.4,13-12.9 c9.9-10.3,15.1-22.3,15.1-34.6c0-12.4-5.3-24.3-15.4-34.3L374.456,293.506z M410.256,398.806 C410.156,398.806,410.156,398.906,410.256,398.806c-3.9,4.2-7.9,8-12.2,12.2c-6.5,6.2-13.1,12.7-19.3,20 c-10.1,10.8-22,15.9-37.6,15.9c-1.5,0-3.1,0-4.6-0.1c-29.7-1.9-57.3-13.5-78-23.4c-56.6-27.4-106.3-66.3-147.6-115.6 c-34.1-41.1-56.9-79.1-72-119.9c-9.3-24.9-12.7-44.3-11.2-62.6c1-11.7,5.5-21.4,13.8-29.7l34.1-34.1c4.9-4.6,10.1-7.1,15.2-7.1 c6.3,0,11.4,3.8,14.6,7c0.1,0.1,0.2,0.2,0.3,0.3c6.1,5.7,11.9,11.6,18,17.9c3.1,3.2,6.3,6.4,9.5,9.7l27.3,27.3 c10.6,10.6,10.6,20.4,0,31c-2.9,2.9-5.7,5.8-8.6,8.6c-8.4,8.6-16.4,16.6-25.1,24.4c-0.2,0.2-0.4,0.3-0.5,0.5 c-8.6,8.6-7,17-5.2,22.7c0.1,0.3,0.2,0.6,0.3,0.9c7.1,17.2,17.1,33.4,32.3,52.7l0.1,0.1c27.6,34,56.7,60.5,88.8,80.8 c4.1,2.6,8.3,4.7,12.3,6.7c3.6,1.8,7,3.5,9.9,5.3c0.4,0.2,0.8,0.5,1.2,0.7c3.4,1.7,6.6,2.5,9.9,2.5c8.3,0,13.5-5.2,15.2-6.9 l34.2-34.2c3.4-3.4,8.8-7.5,15.1-7.5c6.2,0,11.3,3.9,14.4,7.3c0.1,0.1,0.1,0.1,0.2,0.2l55.1,55.1 C420.456,377.706,420.456,388.206,410.256,398.806z"></path>
                              <path d="M256.056,112.706c26.2,4.4,50,16.8,69,35.8s31.3,42.8,35.8,69c1.1,6.6,6.8,11.2,13.3,11.2c0.8,0,1.5-0.1,2.3-0.2 c7.4-1.2,12.3-8.2,11.1-15.6c-5.4-31.7-20.4-60.6-43.3-83.5s-51.8-37.9-83.5-43.3c-7.4-1.2-14.3,3.7-15.6,11 S248.656,111.506,256.056,112.706z"></path>
                              <path d="M473.256,209.006c-8.9-52.2-33.5-99.7-71.3-137.5s-85.3-62.4-137.5-71.3c-7.3-1.3-14.2,3.7-15.5,11 c-1.2,7.4,3.7,14.3,11.1,15.6c46.6,7.9,89.1,30,122.9,63.7c33.8,33.8,55.8,76.3,63.7,122.9c1.1,6.6,6.8,11.2,13.3,11.2 c0.8,0,1.5-0.1,2.3-0.2C469.556,223.306,474.556,216.306,473.256,209.006z"></path>
                            </g>
                          </g>
                        </g>
                      </svg>
                      <input
                        onChange={handleChange}
                        required
                        name="phone"
                        placeholder="Phone Number"
                        className="w-full focus:outline-none h-full text-md"
                      />
                    </div>
                    <div className="px-4 py-3 text-xs font-medium flex place-items-center text-gray-400 border border-gray-200 rounded-md my-4">
                      <svg
                        fill="currentColor"
                        className="w-5 h-5 mr-3"
                        viewBox="0 0 100 100"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                        <g
                          id="SVGRepo_tracerCarrier"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></g>
                        <g id="SVGRepo_iconCarrier">
                          <path d="M49,18.92A23.74,23.74,0,0,0,25.27,42.77c0,16.48,17,31.59,22.23,35.59a2.45,2.45,0,0,0,3.12,0c5.24-4.12,22.1-19.11,22.1-35.59A23.74,23.74,0,0,0,49,18.92Zm0,33.71a10,10,0,1,1,10-10A10,10,0,0,1,49,52.63Z"></path>
                        </g>
                      </svg>
                      <input
                        name="address"
                        onChange={handleChange}
                        required
                        placeholder="Address"
                        className="w-full focus:outline-none h-full text-md"
                      />
                    </div>
                    <div className="px-4 py-3 text-xs font-medium flex place-items-center text-gray-400 border border-gray-200 rounded-md my-4">
                      <svg
                        className="w-5 h-5 mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z"
                        />
                      </svg>
                      <input
                        name="discount"
                        onChange={handleChange}
                        placeholder="DO YOU HAVE PROMO CODE?"
                        className="w-full focus:outline-none h-full text-md"
                      />
                    </div>

                    <div className="text-sm pt-1 font-semibold pb-2 border-b border-cusblack flex justify-between place-items-center">
                      <p className="">SUBTOTAL</p>
                      <NumberFormat
                        value={items.reduce(
                          (val, item) => val + item.price * item.quantity,
                          0
                        )}
                        displayType={"text"}
                        thousandSeparator={true}
                        prefix={"$"}
                        renderText={(value, props) => <p {...props}>{value}</p>}
                      />
                    </div>

                    <div className="my-3 border-b border-cusblack pb-2">
                      {items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between place-items-center text-sm mb-1"
                        >
                          <p className="pr-3">{item.name}</p>
                          <NumberFormat
                            value={item.price * item.quantity}
                            displayType={"text"}
                            thousandSeparator={true}
                            prefix={"$"}
                            renderText={(value, props) => (
                              <p {...props}>{value}</p>
                            )}
                          />
                        </div>
                      ))}
                      <div className="flex justify-between place-items-center text-sm mb-1">
                        <p>TAX</p>
                        <p>FREE</p>
                      </div>
                    </div>

                    <div className="flex justify-between place-items-center font-semibold">
                      <p>TOTAL</p>
                      <NumberFormat
                        value={items.reduce(
                          (val, item) => val + item.price * item.quantity,
                          0
                        )}
                        displayType={"text"}
                        thousandSeparator={true}
                        prefix={"$"}
                        renderText={(value, props) => <p {...props}>{value}</p>}
                      />
                    </div>

                    <button
                      disabled={!items.length}
                      onClick={createCheckoutSession}
                      className="py-2 px-3 disabled:cursor-not-allowed text-white w-full mt-6 rounded-lg bg-cusblack "
                    >
                      {!isLoading ? (
                        <span className="flex justify-center place-items-center">
                          CHECKOUT
                          <svg
                            className="ml-2 w-4 h-4 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                            />
                          </svg>
                        </span>
                      ) : (
                        <img
                          className="w-6 h-6 mx-auto"
                          src="https://i.ibb.co/pL1TJSg/Rolling-1s-200px-2.gif"
                          alt=""
                        />
                      )}
                    </button>
                  </from>
                )}
                {step === "payment" && (
                  <from>
                    <h1 className="text-cusblack font-bold text-md">PAYMENT</h1>
                    <div className="px-4 py-3 text-xs font-medium flex place-items-center text-gray-400 border border-gray-200 rounded-md my-4">
                      <svg
                        fill="currentColor"
                        className="w-5 h-5 mr-3"
                        viewBox="-1.5 0 19 19"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                        <g
                          id="SVGRepo_tracerCarrier"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></g>
                        <g id="SVGRepo_iconCarrier">
                          <path d="M15.442 14.75v.491H.558v-.49a.476.476 0 0 1 .475-.476h.478a.487.487 0 0 1-.003-.048v-.443a.476.476 0 0 1 .475-.475h.713V7.164H1.508a.554.554 0 0 1-.22-1.063L7.78 3.288a.554.554 0 0 1 .44 0L14.712 6.1a.554.554 0 0 1-.22 1.063h-1.188v6.145h.713a.476.476 0 0 1 .475.475v.443a.443.443 0 0 1-.003.048h.478a.476.476 0 0 1 .475.475zM3.804 13.31h2.058V8.264H3.804zm.377-7.254h7.639L8 4.4zm2.79 2.21v5.043h2.058V8.265zm5.225 5.043V8.265h-2.059v5.044z"></path>
                        </g>
                      </svg>
                      <input
                        name="bankName"
                        disabled
                        value={bank.name}
                        placeholder="Bank Name"
                        className="w-full focus:outline-none h-full text-md"
                      />
                    </div>
                    <div className="px-4 py-3 text-xs font-medium flex place-items-center text-gray-400 border border-gray-200 rounded-md my-4">
                      <svg
                        fill="currentColor"
                        className="w-5 h-5 mr-3"
                        viewBox="-1.5 0 19 19"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                        <g
                          id="SVGRepo_tracerCarrier"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></g>
                        <g id="SVGRepo_iconCarrier">
                          <path d="M15.442 14.75v.491H.558v-.49a.476.476 0 0 1 .475-.476h.478a.487.487 0 0 1-.003-.048v-.443a.476.476 0 0 1 .475-.475h.713V7.164H1.508a.554.554 0 0 1-.22-1.063L7.78 3.288a.554.554 0 0 1 .44 0L14.712 6.1a.554.554 0 0 1-.22 1.063h-1.188v6.145h.713a.476.476 0 0 1 .475.475v.443a.443.443 0 0 1-.003.048h.478a.476.476 0 0 1 .475.475zM3.804 13.31h2.058V8.264H3.804zm.377-7.254h7.639L8 4.4zm2.79 2.21v5.043h2.058V8.265zm5.225 5.043V8.265h-2.059v5.044z"></path>
                        </g>
                      </svg>
                      <input
                        name="bank"
                        value={bank.account}
                        disabled
                        placeholder="Bank Account"
                        className="w-full focus:outline-none h-full text-md"
                      />
                    </div>
                    <div className="px-4 py-3 text-xs font-medium flex place-items-center text-gray-400 border border-gray-200 rounded-md my-4">
                      <svg
                        fill="currentColor"
                        className="w-5 h-5 mr-3"
                        version="1.1"
                        id="Capa_1"
                        xmlns="http://www.w3.org/2000/svg"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                        viewBox="0 0 235.517 235.517"
                        xmlSpace="preserve"
                      >
                        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                        <g
                          id="SVGRepo_tracerCarrier"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></g>
                        <g id="SVGRepo_iconCarrier">
                          <g>
                            <path d="M118.1,235.517c7.898,0,14.31-6.032,14.31-13.483c0-7.441,0-13.473,0-13.473 c39.069-3.579,64.932-24.215,64.932-57.785v-0.549c0-34.119-22.012-49.8-65.758-59.977V58.334c6.298,1.539,12.82,3.72,19.194,6.549 c10.258,4.547,22.724,1.697,28.952-8.485c6.233-10.176,2.866-24.47-8.681-29.654c-11.498-5.156-24.117-8.708-38.095-10.236V8.251 c0-4.552-6.402-8.251-14.305-8.251c-7.903,0-14.31,3.514-14.31,7.832c0,4.335,0,7.843,0,7.843 c-42.104,3.03-65.764,25.591-65.764,58.057v0.555c0,34.114,22.561,49.256,66.862,59.427v33.021 c-10.628-1.713-21.033-5.243-31.623-10.65c-11.281-5.755-25.101-3.72-31.938,6.385c-6.842,10.1-4.079,24.449,7.294,30.029 c16.709,8.208,35.593,13.57,54.614,15.518v13.755C103.79,229.36,110.197,235.517,118.1,235.517z M131.301,138.12 c14.316,4.123,18.438,8.257,18.438,15.681v0.555c0,7.979-5.776,12.651-18.438,14.033V138.12z M86.999,70.153v-0.549 c0-7.152,5.232-12.657,18.71-13.755v29.719C90.856,81.439,86.999,77.305,86.999,70.153z"></path>
                          </g>
                        </g>
                      </svg>
                      <input
                        name="amount"
                        value={bank.amount}
                        disabled
                        placeholder="Amount"
                        className="w-full focus:outline-none h-full text-md"
                      />
                    </div>
                    <div className="px-4 py-3 text-xs font-medium flex place-items-center text-gray-400 border border-gray-200 rounded-md my-4">
                      <svg
                        fill="currentColor"
                        className="w-5 h-5 mr-3"
                        version="1.1"
                        id="Layer_1"
                        xmlns="http://www.w3.org/2000/svg"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                        viewBox="0 0 458 458"
                        xmlSpace="preserve"
                      >
                        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                        <g
                          id="SVGRepo_tracerCarrier"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></g>
                        <g id="SVGRepo_iconCarrier">
                          <g>
                            <g>
                              <path d="M428,41.534H30c-16.569,0-30,13.431-30,30v252c0,16.568,13.432,30,30,30h132.1l43.942,52.243 c5.7,6.777,14.103,10.69,22.959,10.69c8.856,0,17.258-3.912,22.959-10.69l43.942-52.243H428c16.568,0,30-13.432,30-30v-252 C458,54.965,444.568,41.534,428,41.534z M323.916,281.534H82.854c-8.284,0-15-6.716-15-15s6.716-15,15-15h241.062 c8.284,0,15,6.716,15,15S332.2,281.534,323.916,281.534z M67.854,198.755c0-8.284,6.716-15,15-15h185.103c8.284,0,15,6.716,15,15 s-6.716,15-15,15H82.854C74.57,213.755,67.854,207.039,67.854,198.755z M375.146,145.974H82.854c-8.284,0-15-6.716-15-15 s6.716-15,15-15h292.291c8.284,0,15,6.716,15,15C390.146,139.258,383.43,145.974,375.146,145.974z"></path>
                            </g>
                          </g>
                        </g>
                      </svg>
                      <input
                        name="message"
                        disabled
                        value={bank.message}
                        placeholder="Message"
                        className="w-full focus:outline-none h-full text-md"
                      />
                    </div>
                    <div className="my-3 border-b border-cusblack pb-2">
                      <div className="flex justify-between place-items-center text-sm mb-1">
                        <p>Or scan QR code</p>
                      </div>
                    </div>
                    <div className="px-4 py-3 text-xs font-medium flex place-items-center text-gray-400 border border-gray-200 rounded-md my-4">
                      <QR
                        size={256}
                        style={{
                          height: "auto",
                          maxWidth: "100%",
                          width: "100%",
                        }}
                        value={bank.qr}
                        viewBox={`0 0 256 256`}
                      />
                    </div>
                    <button
                      onClick={handleConfirm}
                      className="py-2 px-3 disabled:cursor-not-allowed text-white w-full mt-6 rounded-lg bg-cusblack "
                    >
                      <span className="flex justify-center place-items-center">
                        CONFIRM PAYMENT
                        <svg
                          className="ml-2 w-4 h-4 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                          />
                        </svg>
                      </span>
                    </button>
                  </from>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Basket;

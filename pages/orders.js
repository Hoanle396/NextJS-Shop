import Head from "next/head";
import nookies from "nookies";
import React from "react";
import CardProfile from "../components/cardprofile";
import Header from "../components/header";
import OrderCard from "../components/ordercard";

export async function getServerSideProps(ctx) {
  const cookie = nookies.get(ctx, "user").user;
  let session = null;
  if (cookie) {
    session = JSON.parse(cookie);
  }

  if (!cookie) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  return {
    props: {
      session,
    },
  };
}

function Order({ session }) {
  return (
    <>
      <Head>
        <title>wefootwear | Orders</title>
      </Head>
      <div className="w-full min-h-screen relative bg-cusgray pb-10">
        <Header />
        <div className="max-w-screen-2xl mx-auto pt-20 px-5 grid grid-cols-1 md:grid-cols-4">
          <div className="col-span-1 mb-7">
            <CardProfile session={session} orders={orders} />
          </div>
          <div className="col-span-3 md:ml-10 rounded-2xl px-8 py-6 bg-white shadow-lg">
            <h1 className="mb-4">Your Orders ({orders.length})</h1>
            <div className="container">
              {orders?.map((order, idx) => (
                <OrderCard key={idx} order={order} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Order;

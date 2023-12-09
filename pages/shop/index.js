import React, { useEffect, useMemo, useState } from "react";
import CardSkeleton from "../../components/cardskeleton";
import Layout from "../../components/layout";
import ProductCard from "../../components/productcard";
import { useSelector } from "react-redux";
import { recentCategory } from "../../slices/categorySlice";
import Head from "next/head";
import { useProduct } from "../../app/apis/products";
import { useCategory } from "../../app/apis/category";
export async function getServerSideProps() {
  return {
    props: {},
  };
}

function Category() {
  const [sort, setSort] = useState(0);
  const recent_category = useSelector(recentCategory);

  const { data: product, isLoading } = useProduct();
  const { data: category } = useCategory();

  const data = useMemo(
    () =>
      product
        ?.filter((item) => {
          if (recent_category.length > 0) {
            return item.category.name == recent_category;
          } else {
            return true;
          }
        })
        .sort((a, b) => {
          if (sort === 1) {
            return a.price - b.price;
          }
          if (sort === 2) {
            return b.price - a.price;
          }
          return true;
        }) ?? [],
    [recent_category, product]
  );

  return (
    <>
      <Head>
        <title>wefootwear | Shop</title>
      </Head>
      <Layout
        categories={category ?? []}
        setSort={setSort}
        types={category ?? []}
      >
        {!isLoading ? (
          data.length < 1 ? (
            <p className="col-span-full mx-auto text-sm text-gray-400">
              No item found
            </p>
          ) : (
            data.map((item) => <ProductCard key={item.id} item={item} />)
          )
        ) : (
          <>
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </>
        )}
      </Layout>
    </>
  );
}

export default Category;

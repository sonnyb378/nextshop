import React, { MouseEventHandler, SetStateAction, useEffect, useState } from 'react'

import { fakeAdminCollection } from '../../model/admin_collection';
import { fakeCollectionWithProducts } from '../../model/collection_with_products';

import Head from 'next/head';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

import Pagination from '../../components/Pagination';
import ProductList from '../../components/ProductList';

import { PageInfo } from '../../components/Pagination';

const parseLinkHeaders = (headers:any) => {
  // console.log("headers: ", headers);
  const links = headers?.split(",");
  const pages:PageInfo = {
    previous: null,
    next: null
  }
  // console.log("headers: ", headers);
  links.forEach((link:any) => {
    const page_link = link.split(";");
    const page_info = page_link[0].replace(/[<>]/g,"").split("page_info=")[1];
    const rel = page_link[1].trim().replace(/["]/g,"").split("=")[1];
    if ( rel === "previous") {
      pages.previous = page_info
    }
    if ( rel === "next") {
      pages.next = page_info
    }
  })
  // console.log("parse: ", pages);
  return pages;
  
}

const CollectionDetail = (props: any) => {
  const [productsData, setProductsData] = useState(null);
  const [productHeaders, setProductHeaders] = useState<SetStateAction<string|null>>();

  const { collection: { id: collectionID, title: collectionTitle, products_count: productsCount }, products, headers }  = props;

  // console.log("page headers: ", headers);
  useEffect(() => {
    setProductsData(products);
    setProductHeaders(headers);
  },[products, headers])

  let pages:PageInfo = { previous: null, next: null}
  if (productHeaders || headers) {
    pages = parseLinkHeaders( productHeaders || headers);

  }
  // console.log("pages---> ", pages);

  const onPageClickHandler = async (pageInfo: string) => {
    // console.log("onPageClickHandler pageInfo: ", pageInfo)

    let queryString = `&collection_id=${collectionID}&api_version=${process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION}`;
    if (pageInfo) {
      queryString = `&page_info=${pageInfo}`;
    }

    const result = await fetch(`${process.env.NEXT_PUBLIC_SHOP_URL}/api/products`, {
      method: "POST",
      headers: {
        'content-type': 'application/json;charset=UTF-8',
      },
      body: JSON.stringify({
        limit: 10,
        query: queryString
      })
    })
    const { products, headers } = await result.json();
    // console.log("onClick headers: ", headers);
    setProductsData(products);
    setProductHeaders(headers);
  }


  return (
    <div>
      <Head>
        <title>Collection Page</title>
        <meta name="description" content="The Next Online Shop" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className='flex flex-col justify-between min-h-screen'>
        <Header />
        <div className='flex flex-1 flex-col sm:flex-row'>
          <div className="min-h-full min-w-[200px] ">
            SideBar
          </div>
          <div className="h-full w-full " >
            {
              productsData && (
                <div className='flex flex-col items-start justify-between mt-10'>
                  <h1 className='text-2xl font-bold'>{collectionTitle}</h1>
                  <ProductList products={productsData} />
                  <Pagination 
                    collection_id={collectionID} 
                    productsCount={productsCount} 
                    pages={pages} 
                    onClickHandler={onPageClickHandler}
                  />
                </div>                
              )            
            } 
          </div>
        </div>
        <Footer />
      </main>
    </div>
  )
}

export default CollectionDetail


export async function getServerSideProps(ctx: any) {
  const id = ctx.query?.id[0]
  // console.log("id: ", ctx.query?.id);

  let queryString = `&collection_id=${id}&api_version=${process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION}`;

  const [req1, req2] = await Promise.all([
    await fetch(`${process.env.NEXT_PUBLIC_SHOP_URL}/api/collections`, {
      method: "POST",
      headers: {
        'content-type': 'application/json;charset=UTF-8',
      },
      body: JSON.stringify({
        collectionID: id,
        apiVersion: process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION
      })
    }),

    await fetch(`${process.env.NEXT_PUBLIC_SHOP_URL}/api/products`, {
      method: "POST",
      headers: {
        'content-type': 'application/json;charset=UTF-8',
      },
      body: JSON.stringify({
        limit: 10,
        query: `&collection_id=${id}`
      })
    }),
  
  ])

  const [res1, res2] = await Promise.all([
    req1.json(),
    req2.json()
  ])


  return {
    props: {
      collection: res1?.collection,
      products: res2?.products,
      headers: res2?.headers
    },
  };
}
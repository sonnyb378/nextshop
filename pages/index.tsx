import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useDispatch, useSelector } from 'react-redux'
import Link from 'next/link'
import { wrapper } from '../app/store'
import { selectProfile, setProfileData } from '../app/store/slices/profile';

import Header from '../components/Header'
import Footer from '../components/Footer'

import { gql } from '@apollo/client'
import client from '../utils/apolloClient'
import HeroImage from '../components/HeroImage'
import FeaturedItem from '../components/FeaturedItem'
import CustomerService from '../components/CustomerService'
import ShopCategories from '../components/ShopCategories'

import { fakeFeaturedItems } from '../model/featuredItems'
import { fakeTodaysDeal } from '../model/todaysdeal'
import { fakeShopCategories } from '../model/shopCategories'
import Info from '../components/Info'
import CardCashback from '../components/CardCashback'

import { selectBrowsingHistory } from '../app/store/slices/browsinghistory'
import BrowsingHistory from '../components/BrowsingHistory'

import { selectAuth } from '../app/store/slices/auth'

const Home: NextPage = (props: any) => {
  const browsing_history = useSelector(selectBrowsingHistory);
  const auth = useSelector(selectAuth);

  const { shopCategories, featureditems, todaysdeal} = props.data;

  const { 
    shopCategories: {
      collections: {
        edges: categories
      }
    },
    todaysdeal: {
      collection: {
        products: {
          edges: dataTodaysDeal
        }
      }
    }, 
    featureditems: {
      collection: {
        id: featuredCollectionId,
        title: featuredCollectionTitle,
        handle: featuredCollectionHandle,
        products: {
          edges: dataFeaturedItems
        }
      }
    }, 
  } = props.data;
  
  const todays_deal = dataTodaysDeal[0].node;
  const featured_items = dataFeaturedItems



  return (
    <div className="bg-slate-200">
      <Head>
        <title>TEMPLATE - Home</title>
        <meta name="description" content="The Next Online Shop" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className='flex flex-col justify-between min-h-screen'>
        <Header />
        <div className='text-red-500 grow'>
            <HeroImage deal={todays_deal}/>
            <FeaturedItem items={featured_items} />
            <CustomerService />
            <ShopCategories items={categories} />
            <Info />
            <CardCashback />
            {
              auth?.accessToken && browsing_history && browsing_history.length > 0 && <BrowsingHistory history={browsing_history}/>
            }            
            <div>
              Trending Now
            </div>
        </div>
        <Footer />
      </main>
    </div>  
  )
}

export default Home

export async function getServerSideProps (ctx: any) {

  // const [reqCategories, reqFeaturedItems, reqTodaysDeal] = await Promise.all([

  //   await fetch(`${process.env.NEXT_PUBLIC_SHOP_URL}/api/collections/categories`),
  //   await fetch(`${process.env.NEXT_PUBLIC_SHOP_URL}/api/collections/featureditem`, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json"
  //     },
  //     body: JSON.stringify({
  //       id: "gid://shopify/Collection/279945150670"
  //     })
  //   }),
  //   await fetch(`${process.env.NEXT_PUBLIC_SHOP_URL}/api/collections/todaysdeal`, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json"
  //     },
  //     body: JSON.stringify({
  //       id: "gid://shopify/Collection/279945117902"
  //     })
  //   }),
  // ]) 

  // const [resCategories, resFeaturedItems, resTodaysDeal] = await Promise.all([
  //   reqCategories.json(),
  //   reqFeaturedItems.json(),
  //   reqTodaysDeal.json(),
  // ])

  return {
    props: {
      data: {
        shopCategories: fakeShopCategories?.data, //resCategories?.data, //fakeShopCategories?.data,
        todaysdeal: fakeTodaysDeal?.data, //resTodaysDeal?.data, //fakeTodaysDeal?.data,
        featureditems: fakeFeaturedItems?.data, //resFeaturedItems?.data //fakeFeaturedItems?.data,
      }
    }
  }
}

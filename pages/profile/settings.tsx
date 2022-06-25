import React, { useEffect, useState } from 'react'
import { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useSelector } from 'react-redux'

import Header from '../../components/Header'
import Footer from '../../components/Footer'

import { selectAuth } from '../../app/store/slices/auth'
import { gql, useQuery } from '@apollo/client'

import { selectProfile, setProfileData } from '../../app/store/slices/profile'
import { setAuthData } from '../../app/store/slices/auth'

import { useDispatch } from 'react-redux'
import { useRouter } from 'next/router'

import Spinner from '../../components/Spinner'
import client from '../../utils/apolloClient'

import ProfileSidebar from '../../components/ProfileSidebar'
import PageHeader from '../../components/profilepage/PageHeader'
import PageTemplate from '../../components/profilepage/PageTemplate'
import PageContent from '../../components/profilepage/PageContent'

const  Settings: NextPage = (props: any) => {
  const [pageLoading, setPageLoading ] = useState(true);
  const dispatch = useDispatch();
  const auth = useSelector(selectAuth);
  const router = useRouter();

  useEffect(() => {
    if (!auth.accessToken) {
      router.push("/auth/signin")
    } else {
      setPageLoading(false)
    }
  },[auth.accessToken, router])

  return (

        <div className='bg-black'>
          <Head>
              <title>TEMPLATE - Addresses</title>
              <meta name="description" content="The Next Online Shop" />
              <link rel="icon" href="/favicon.ico" />
            </Head>
          {
            pageLoading ? <div></div>
            :            
            <PageTemplate>
              <PageHeader title="Settings" subtitle=""/>
              <PageContent>
                still working...
              </PageContent>
            </PageTemplate>
          }
        
      </div>
    
  )
}

export default Settings


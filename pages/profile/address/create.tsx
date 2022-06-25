import Head from 'next/head'
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import AddAddressForm from '../../../components/profilepage/AddAddressForm';
import PageContent from '../../../components/profilepage/PageContent';
import PageHeader from '../../../components/profilepage/PageHeader';
import PageTemplate from '../../../components/profilepage/PageTemplate';

const CreateAddress:React.FC = () => {
  const [pageLoading, setPageLoading ] = useState(true);

  useEffect(() => {
    setPageLoading(false)
  },[])

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
        <PageHeader title="Address" subtitle="You can save multiple addresses">
          <div></div>
        </PageHeader>
        <PageContent>
          <AddAddressForm />
        </PageContent>
      </PageTemplate>    
    }
    </div>
  )
}

export default CreateAddress
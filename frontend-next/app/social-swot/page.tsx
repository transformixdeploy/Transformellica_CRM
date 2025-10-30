"use client";

import CheckingUserCard from '@/components/CheckingUserCard';
import UserDataHistory from '@/components/UserDataHistory';
import { AuthContext } from '@/context/AuthContext';
import { userDataCategories } from '@/lib/constants';
import { authenticatePageUseEffect } from '@/utilities/authenticatePageUseEffect';
import { getDataHistory } from '@/utilities/axiosRequester';
import { useRouter } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react'

const SocialSWOTHome = () => {


    const router = useRouter();    
    const [dataHistory, setDataHistory] = useState([{title: "", id: "", categoryUrl: ""}]);

    const {user, isAuthenticated, isLoading, accessToken} = useContext(AuthContext);

    useEffect(()=>{
      
      const getData = async ()=>{
        if(accessToken){
          const userHistory = await getDataHistory(userDataCategories.SOCIAL_SWOT);
          setDataHistory(userHistory.data.userHistoryDataObjects);
        }
      }

      getData();

    }, [accessToken]);

    authenticatePageUseEffect(isAuthenticated, isLoading, router);


    if(!isAuthenticated){
        return (
            <CheckingUserCard/>
        )
    }else{
        return (
          <div className='w-full max-h-[70vh] overflow-y-scroll'>
            <UserDataHistory data={dataHistory}/>
          </div>
        )
    }
}

export default SocialSWOTHome
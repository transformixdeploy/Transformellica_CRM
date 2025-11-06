"use client";

import React, { useContext, useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {userDataCategories, websiteSWOTData} from "@/lib/constants";
import { ReanalyzeButton } from '@/components/ReanalyzeButton';
import CircularProgress  from '@/components/CicrularProgress';
import { AuthContext } from '@/context/AuthContext';
import { authenticatePageUseEffect } from '@/utilities/authenticatePageUseEffect';
import CheckingUserCard from '@/components/CheckingUserCard';
import { checkServiceLimitReached, deleteUserData, getUserData, getDataHistory, storeWebsiteAnalysisData } from '@/utilities/axiosRequester';
import { AlertCircle } from 'lucide-react';
import UserDataHistory from '@/components/UserDataHistory';


interface Props {
	params : {
		id: string
	}
}

const WebsiteSWOT = ({params} : Props) => {
    const router = useRouter();    
    
    const [data, setData] = useState(websiteSWOTData);
    const [dataHistory, setDataHistory] = useState([{title: "", id: "", categoryUrl: ""}]);
    const [requestsLimitError, setRequestsLimitError] = useState("");

    const {user, isAuthenticated, isLoading, accessToken} = useContext(AuthContext);

    useEffect(()=>{
    
        if(!accessToken) return;
        const searchParams = useSearchParams();
      
        const getData = async ()=>{
            
            // Get user social analysis history
            const userHistory = await getDataHistory(userDataCategories.WEBSITE_SWOT);
            setDataHistory(userHistory.data.userHistoryDataObjects);
  
            // get user data using UUID
            const currentWebsiteData = await getUserData(params.id); 
            
            // if user data exists
            if(currentWebsiteData.data){
              setData(currentWebsiteData.data);
              return;
            }
  
            // Let's check for all query params
  
            // params
            const business_description = searchParams.get('business_description');
            const company_name = searchParams.get('company_name');
            const country = searchParams.get('country');
            const goal = searchParams.get('goal');
            const serviceId = searchParams.get('serviceId');
            const website_url = searchParams.get('website_url');
  
            if( !business_description || !company_name || !country || !goal || !serviceId || !website_url ){
              return router.push("/");
            }
  
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/social/website-swot`, {
              method: "POST",
              headers: { 
                "Content-Type": "application/json", 
                "authorization": `Bearer ${accessToken}` 
              },
              body: JSON.stringify({
                business_description,
                company_name,
                country,
                goal,
                website_url,
              })
            });
        
            const reader = response!.body?.getReader();
            const decoder = new TextDecoder("utf-8");
            let buffer = "";
  
            var finalData;
        
            while (true) {
              const { value, done } = await reader!.read();
              if (done) break;
        
              buffer += decoder.decode(value, { stream: true });
        
              // Split on double newlines (end of SSE message)
              const parts = buffer.split("\n\n");
        
              // Keep incomplete chunk in buffer
              buffer = parts.pop()!;
        
              for (const part of parts) {
                if (part.startsWith("data:")) {
                  const jsonText = part.replace(/^data:\s*/, "");
                  try {
                    const json = JSON.parse(jsonText);
                    console.log("Received SSE chunk:", json);
                    finalData = json;
                    setData(json);
                  } catch (err) {
                    console.error("Invalid JSON chunk:", jsonText);
                  }
                }
              }
            }
        
            console.log("Stream ended");
  
            await storeWebsiteAnalysisData({
              dataId: params.id, 
              country, 
              website_url, 
              data: finalData, 
              userEmail: user?.email
            });  
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
        <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
          <header className="mb-12">
              <h1 className="text-5xl font-extrabold text-center text-white mb-4">
                Website optimization analytics
              </h1>
              <div className='max-h-[300] overflow-y-scroll'>
                <UserDataHistory data={dataHistory}/>
              </div>
          </header>
    
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
    
            {/* Performance Metrics with Circular Progress */}
            <div className='lg:col-span-2'>
              <Card className="bg-gray-800 rounded-lg shadow-xl border border-gray-700">
                <CardHeader>
                  <CardTitle className="text-3xl font-bold text-white mb-4 text-center">Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center">
                    {/* Page Speed Score with Progress */}
                    <CircularProgress
                      value={data.pageSpeedScore}
                      maxValue={100}
                      size={140}
                      strokeWidth={10}
                      color="#f97316" // Orange color
                      showProgress={true}
                      label="Page Speed Score"
                    />
                    
                    {/* Internal Links - Full Circle */}
                    <CircularProgress
                      value={data.internalLinks}
                      size={140}
                      strokeWidth={10}
                      color="#10b981" // Green color
                      showProgress={false}
                      label="Internal Links"
                    />
                    
                    {/* External Links - Full Circle */}
                    <CircularProgress
                      value={data.externalLinks}
                      size={140}
                      strokeWidth={10}
                      color="#3b82f6" // Blue color
                      showProgress={false}
                      label="External Links"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
    
            {/* Full Social Analysis */}
            <div className="lg:col-span-2">
              <Card className="bg-gray-800 rounded-lg shadow-xl border border-gray-700">
                <CardHeader>
                  <CardTitle className="text-3xl font-bold text-white mb-4 text-center">Full Website Analysis</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-invert break-words max-w-none text-gray-300 leading-relaxed
                    [&_pre]:whitespace-pre-wrap
                    [&_pre]:break-words
                    [&_pre]:bg-gray-800
                    [&_pre]:rounded-xl
                    [&_pre]:p-4
                    [&_code]:break-words">
                  <ReactMarkdown>{data.fullSocialAnalysis}</ReactMarkdown>
                </CardContent>
              </Card>
            </div>
    
    
            {/* Page Info */}
            <div>
              <Card className="bg-gray-800 rounded-lg shadow-xl border border-gray-700">
                <CardHeader>
                  <CardTitle className="text-3xl font-bold text-white mb-4 text-center">Page Details</CardTitle>
                </CardHeader>
                <CardContent className="text-gray-300 space-y-2">
                  <p className='text-xl'><span className="font-semibold text-gray-300">Title:</span> <span className="text-blue-400">{data.pageInfo.title}</span> ({data.pageInfo.titleLength} chars)</p>
                  <p className='text-xl'><span className="font-semibold text-gray-300">Meta Description:</span> <span className="text-blue-400">{data.pageInfo.metaDescription}</span> ({data.pageInfo.metaDescriptionLength} chars)</p>
                  <p className='text-xl'><span className="font-semibold text-gray-300">HTTPS:</span> <span className={`${data.pageInfo.https ? "text-green-500" : "text-red-500"} font-bold`}>{data.pageInfo.https ? 'Yes' : 'No'}</span></p>
                  <span className='me-2 font-semibold text-gray-300 text-xl'>Canonical URL:</span>
                  <Link href={data.pageInfo.canonicalUrl} className='text-secondary hover:underline break-words text-xl'>{data.pageInfo.canonicalUrl}</Link>
                </CardContent>
              </Card>
            </div>
    
            {/* Open Graph Tags */}
            <div>
              <Card className="bg-gray-800 rounded-lg shadow-xl border border-gray-700">
                <CardHeader>
                  <CardTitle className="text-3xl font-bold text-white mb-4 text-center">Open Graph Tags</CardTitle>
                </CardHeader>
                <CardContent className="text-gray-300 space-y-2">
                  <p className='text-xl'><span className="font-semibold text-gray-300">Title:</span> <span className="text-blue-400">{data.openGraphTags.title}</span></p>
                  <p className='text-xl'><span className="font-semibold text-gray-300">Description:</span> <span className="text-blue-400">{data.openGraphTags.description}</span></p>
                  <p className='text-xl'><span className="font-semibold text-gray-300">Type:</span> <span className="text-blue-400">{data.openGraphTags.type}</span></p>
                  <p className='text-xl'><span className="font-semibold text-gray-300">Site Name:</span> <span className="text-blue-400">{data.openGraphTags.siteName}</span></p>
                  <span className="font-semibold text-gray-300 text-xl ">URL:</span> <Link href={data.openGraphTags.url} className="text-secondary hover:underline text-xl break-words">{data.openGraphTags.url}</Link>
                </CardContent>
              </Card>
            </div>
    
    
            {/* Content Info */}
            <div>
              <Card className="bg-gray-800 rounded-lg shadow-xl border border-gray-700">
                <CardHeader>
                  <CardTitle className="text-3xl font-bold text-white mb-4 text-center">Content Overview</CardTitle>
                </CardHeader>
                <CardContent className="text-gray-300 space-y-2">
                  <p className='text-xl'><span className="font-semibold text-gray-300">Images Count:</span> <span className="text-blue-400">{data.contentInfo.imagesCount}</span></p>
                  <p className='text-xl'><span className="font-semibold text-gray-300">Images Missing Alt Tags:</span> <span className="text-red-400">{data.contentInfo.imagesMissingAltTage}</span></p>
                </CardContent>
              </Card>
            </div>
    
            {/* Social Links */}
            <div>
              <Card className="bg-gray-800 rounded-lg shadow-xl border border-gray-700">
                <CardHeader>
                  <CardTitle className="text-3xl font-bold text-white mb-4 text-center">Social Links</CardTitle>
                </CardHeader>
                <CardContent className="text-gray-300 space-y-2">
                  <ul className='ms-5'>
                    {data.socialLinks.map((link, index)=>(
                        <li key={index} className='list-disc break-all overflow-hidden text-xl'>
                            <Link href={link} className='text-secondary hover:underline'><div className='bg-white inline-block w-1.5 h-1.5 rounded-4xl me-3'></div>{link}</Link>
                        </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
    
          </div>
    
        </div>
      );
    }
};

export default WebsiteSWOT;
"use client";

import { socialSWOTData, userDataCategories } from '@/lib/constants';
import React, { useContext, useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import { ReanalyzeButton } from '@/components/ReanalyzeButton';
import { AlertCircle, HeartPlus, MessageSquareMore, ThumbsUp } from 'lucide-react';
import { authenticatePageUseEffect } from '@/utilities/authenticatePageUseEffect';
import { AuthContext } from '@/context/AuthContext';
import CheckingUserCard from '@/components/CheckingUserCard';
import { checkServiceLimitReached, createInstagramAnalysisData, createTikTokAnalysisData, getDataHistory, getUserData, storeInstagramAnalysisData, storeTiktokAnalysisData } from '@/utilities/axiosRequester';
import UserDataHistory from '@/components/UserDataHistory';
import { useSearchParams } from 'next/navigation';
import NormalSkeleton from '@/components/NormalSkeleton';
import BoxSkeleton from '@/components/BoxSkeleton';

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-700 border border-gray-600 rounded-lg p-3 shadow-lg">
        <p className="text-white font-semibold text-lg mb-1">{`${label}`}</p>
        <p className="text-green-400 font-medium">
          {`Frequency: ${payload[0].value}`}
        </p>
      </div>
    );
  }
  return null;
};

interface Props {
	params : {
		id: string
	}
}

const SocialSWOT = ({params} : Props) => {
  
  const router = useRouter();
  const searchParams = useSearchParams();

  const [data, setData] = useState(socialSWOTData);
  const [dataHistory, setDataHistory] = useState([{title: "", id: "", categoryUrl: ""}]);
  const [requestsLimitError, setRequestsLimitError] = useState("");

  const {user, isAuthenticated, isLoading, accessToken} = useContext(AuthContext);

  useEffect(()=>{
    
      if(!accessToken) return;
    
      const getData = async ()=>{
          
          // Get user social analysis history
          const userHistory = await getDataHistory(userDataCategories.SOCIAL_SWOT);
          setDataHistory(userHistory.data.userHistoryDataObjects);

          // get user data using UUID
          const currentSocialData = await getUserData(params.id); 
          
          // if user data exists
          if(currentSocialData.data){
            setData(currentSocialData.data);
            return;
          }

          // Let's check for all query params

          // params
          const business_description = searchParams.get('business_description');
          const company_name = searchParams.get('company_name');
          const country = searchParams.get('country');
          const goal = searchParams.get('goal');
          const serviceId = searchParams.get('serviceId');
          const instagram_link = searchParams.get('instagram_link');
          const tiktok_link = searchParams.get('tiktok_link');

          if( !business_description || !company_name || !country || !goal || !serviceId || ( !instagram_link && !tiktok_link ) ){
            return router.push("/");
          }

          let response;

          if(serviceId === "tiktok_analysis"){
            response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/social/tiktok-analysis`, {
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
                tiktok_link,
              })
            });
          }else if(serviceId === "instagram_analysis"){
            response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/social/instagram-analysis`, {
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
                instagram_link,
              })
            });
          }
      
          const reader = response!.body?.getReader();
          const decoder = new TextDecoder("utf-8");
          let buffer = "";

          let finalData;
      
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

          if(serviceId === "tiktok_analysis"){
            await storeTiktokAnalysisData({
              dataId: params.id, 
              country, 
              tiktok_link, 
              data: finalData, 
              userEmail: user?.email
            });
          }else if(serviceId === "instagram_analysis"){
            await storeInstagramAnalysisData({
              dataId: params.id, 
              country, 
              instagram_link, 
              data: finalData, 
              userEmail: user?.email
            });
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
      <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
        
        {/* title */}
        <header className="mb-12">
          <h1 className="text-5xl font-extrabold text-center text-white mb-4 break-words">
            {data.analysisTitle || "Social Media Analysis"}
          </h1>
          <p className="text-center text-gray-400 text-lg mb-6">
            Detailed insights into your social media performance and competitive landscape.
          </p>
          <div className='max-h-[300] overflow-y-scroll'>
            <UserDataHistory data={dataHistory}/>
          </div>
        </header>
  
        {/* 3 cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-gray-800 rounded-lg shadow-xl p-6 text-center">
            <h2 className="text-xl font-semibold text-gray-200 mb-2">Followers</h2>
            {data.followers !== null ?
              <p className="text-5xl font-bold text-purple-400">{data.followers}</p> :
              <NormalSkeleton />
            }
          </div>
          <div className="bg-gray-800 rounded-lg shadow-xl p-6 text-center">
            <h2 className="text-xl font-semibold text-gray-200 mb-2">Following</h2>
            {data.following !== null ?
              <p className="text-5xl font-bold text-teal-400">{data.following}</p> : 
              <NormalSkeleton/>
            }
          </div>
          <div className="bg-gray-800 rounded-lg shadow-xl p-6 text-center">
            <h2 className="text-xl font-semibold text-gray-200 mb-2">Engagement Rate</h2>
            {data.engagementRate !== null ?
              <p className="text-5xl font-bold text-pink-400">{Math.round(data.engagementRate * 100)}%</p> : 
              <NormalSkeleton/>
            }
          </div>
        </section>
  
        {/* profile */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Profile Information */}
          <div className="bg-gray-800 rounded-lg shadow-xl p-8 border border-gray-700">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">Profile Information</h2>
            <div className="space-y-4 text-lg">
              <p>
                <span className="me-2 font-semibold text-gray-300">Name:</span>
                {data.profileInfo.basicInfo.name !== null? 
                  data.profileInfo.basicInfo.name : 
                  <NormalSkeleton width={"30%"}/>
                }
              </p>
              <p>
                <span className="me-2 font-semibold text-gray-300">Bio:</span>
                {data.profileInfo.basicInfo.bio !== null ? 
                  data.profileInfo.basicInfo.bio:
                  <NormalSkeleton width={"30%"}/>
                }
              </p>
              <p className={`${data.profileInfo.basicInfo.verified ? "text-green-500" : "text-red-500"} font-bold`}>
                <span className="me-2 font-semibold text-gray-300">Verified:</span>
                {data.profileInfo.basicInfo.verified !== null ? 
                  (data.profileInfo.basicInfo.verified ? 'Yes' : 'No') :
                  <NormalSkeleton width={"10%"}/>
                }
              </p>
              <p className={`${data.profileInfo.basicInfo.private ? "text-green-500" : "text-red-500"} font-bold`}>
                <span className="me-2 font-semibold text-gray-300">Private:</span>
                {data.profileInfo.basicInfo.private !== null ? 
                  (data.profileInfo.basicInfo.private ? 'Yes' : 'No') :
                  <NormalSkeleton width={"10%"}/>
                }
              </p>
              <p>
                <span className="me-2 font-semibold text-gray-300">Website:</span> 
                {data.profileInfo.basicInfo.website !== null ? 
                  <Link href={data.profileInfo.basicInfo.website} target="_blank" rel="noopener noreferrer" className="text-blue-400 break-words hover:underline">{data.profileInfo.basicInfo.website}</Link> :
                  <NormalSkeleton width={"30%"}/>
                }
              </p>
            </div>
          </div>
  
          {/* Additional Metrics */}
          <div className="bg-gray-800 rounded-lg shadow-xl p-8 border border-gray-700">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">Additional Metrics</h2>
            <div className="space-y-6">
              <div className="max-sm:flex-col max-sm:gap-3 flex items-center justify-between p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                <span className="font-semibold text-gray-300 text-lg">Posts Count:</span>
                {data.profileInfo.additionalMetrics.postsCount !== null ? 
                  <span className="text-xl font-bold text-blue-400">{data.profileInfo.additionalMetrics.postsCount}</span> :
                  <NormalSkeleton width={100}/>
                }
              </div>
              
              <div className="max-sm:flex-col max-sm:gap-3 flex items-center justify-between p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                <span className="font-semibold text-gray-300 text-lg">Average Likes:</span>
                <div className="flex items-center gap-3">
                  {data.profileInfo.additionalMetrics.averageLikes !== null ? 
                    <span className="text-xl font-bold text-pink-400">{data.profileInfo.additionalMetrics.averageLikes.toFixed(2)}</span> : 
                    <NormalSkeleton width={100}/>
                  }
                  {(data.profileInfo.additionalMetrics.averageLikes !== null) && 
                    <div className="p-2 bg-pink-500/20 rounded-full border border-pink-500/30">
                      <ThumbsUp className="w-5 h-5 text-pink-400" />
                    </div>
                  }
                </div>
              </div>
              
              <div className="max-sm:flex-col max-sm:gap-3 flex items-center justify-between p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                <span className="font-semibold text-gray-300 text-lg">Average Comments:</span>
                <div className="flex items-center gap-3">
                  {data.profileInfo.additionalMetrics.averageComments !== null ?
                    <span className="text-xl font-bold text-blue-400">{data.profileInfo.additionalMetrics.averageComments.toFixed(2)}</span> :
                    <NormalSkeleton width={100}/>
                  }
                  {data.profileInfo.additionalMetrics.averageComments !== null && 
                    <div className="p-2 bg-blue-500/20 rounded-full border border-blue-500/30">
                      <MessageSquareMore className="w-5 h-5 text-blue-400" />
                    </div>
                  }
                </div>
              </div>
              
              <div className="max-sm:flex-col max-sm:gap-3 flex text-center items-center justify-between p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                <span className="font-semibold text-gray-300 text-lg">Average Engagement Per Post:</span>
                <div className="flex items-center gap-3">
                  {data.profileInfo.additionalMetrics.EngagementPerPost !== null ? 
                    <span className="text-xl font-bold text-green-400">{data.profileInfo.additionalMetrics.EngagementPerPost.toFixed(2)}</span> :
                    <NormalSkeleton width={100}/>
                  }
                  {data.profileInfo.additionalMetrics.EngagementPerPost !== null &&
                    <div className="p-2 bg-green-500/20 rounded-full border border-green-500/30">
                      <HeartPlus className="w-5 h-5 text-green-400" />
                    </div>
                  }
                </div>
              </div>
            </div>
          </div>
        </section>
  
        {/* Top Hashtags Chart */}
        <section className="mb-12">
          <h2 className="text-4xl font-bold text-white mb-8 text-center">Top Hashtags Usage</h2>
          <div className="bg-gray-800 rounded-lg shadow-xl p-6">
            {data.topHashTags !== null ? 
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={data.topHashTags}
                  margin={{
                    top: 20, right: 30, left: 20, bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
                  <XAxis dataKey="tag" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="frequency" fill="#82ca9d" name="Frequency" />
                </BarChart>
              </ResponsiveContainer> :
              <BoxSkeleton width={"100%"} height={300} borderRadius={"2%"} />
            }
          </div>
        </section>
  
        {/* Full Social Analysis */}
        <section className="mb-12 ">
          <h2 className="text-4xl font-bold text-white mb-8 text-center">Full Social Analysis</h2>
          <div className="bg-gray-800 rounded-lg shadow-xl p-8 border border-gray-700">
            {data.fullSocialAnalysis !== null ? 
              // <div className="break-words prose prose-invert text-gray-300 leading-relaxed">
              <div className="prose prose-invert break-words max-w-none text-gray-300 leading-relaxed
                  [&_pre]:whitespace-pre-wrap
                  [&_pre]:break-words
                  [&_pre]:bg-gray-800
                  [&_pre]:rounded-xl
                  [&_pre]:p-4
                  [&_code]:break-words">
                <ReactMarkdown>
                  {data.fullSocialAnalysis}
                </ReactMarkdown>
              </div> :
              <NormalSkeleton count={5.5}/>
            }
          </div>
        </section>
  
      </div>
    );
  }
};

export default SocialSWOT;
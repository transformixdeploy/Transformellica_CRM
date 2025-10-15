"use client";

import { localStorageDataNames, socialSWOTData } from '@/lib/constants';
import React, { useContext, useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import { ReanalyzeButton } from '@/components/ReanalyzeButton';
import { HeartPlus, MessageSquareMore, ThumbsUp } from 'lucide-react';
import { authenticatePageUseEffect } from '@/utilities/authenticatePageUseEffect';
import { AuthContext } from '@/context/AuthContext';
import CheckingUserCard from '@/components/CheckingUserCard';

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

const SocialSWOT = () => {
  const router = useRouter();

  const [data, setData] = useState(socialSWOTData);

  const {user, isAuthenticated, isLoading} = useContext(AuthContext);

  authenticatePageUseEffect(isAuthenticated, isLoading, router);

  useEffect(() => {
    if (!localStorage.getItem(localStorageDataNames.SOCIAL_MEDIA_SWOT)) {
      return router.push("/");
    }
    setData(JSON.parse(localStorage.getItem(localStorageDataNames.SOCIAL_MEDIA_SWOT)!));
  }, []);

  function handleDeleteAnalysis() {
    localStorage.removeItem(localStorageDataNames.SOCIAL_MEDIA_SWOT);
    router.push("/");
  }

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
          <div className="flex justify-center">
            <ReanalyzeButton onClick={handleDeleteAnalysis}/>
          </div>
        </header>
  
        {/* 3 cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-gray-800 rounded-lg shadow-xl p-6 text-center">
            <h2 className="text-xl font-semibold text-gray-200 mb-2">Followers</h2>
            <p className="text-5xl font-bold text-purple-400">{data.followers}</p>
          </div>
          <div className="bg-gray-800 rounded-lg shadow-xl p-6 text-center">
            <h2 className="text-xl font-semibold text-gray-200 mb-2">Following</h2>
            <p className="text-5xl font-bold text-teal-400">{data.following}</p>
          </div>
          <div className="bg-gray-800 rounded-lg shadow-xl p-6 text-center">
            <h2 className="text-xl font-semibold text-gray-200 mb-2">Engagement Rate</h2>
            <p className="text-5xl font-bold text-pink-400">{Math.round(data.engagementRate * 100)}%</p>
          </div>
        </section>
  
        {/* profile */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Profile Information */}
          <div className="bg-gray-800 rounded-lg shadow-xl p-8 border border-gray-700">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">Profile Information</h2>
            <div className="space-y-4 text-lg">
              <p><span className="font-semibold text-gray-300">Name:</span> {data.profileInfo.basicInfo.name}</p>
              <p><span className="font-semibold text-gray-300">Bio:</span> {data.profileInfo.basicInfo.bio}</p>
              <p className={`${data.profileInfo.basicInfo.verified ? "text-green-500" : "text-red-500"} font-bold`}><span className="font-semibold text-gray-300">Verified:</span> {data.profileInfo.basicInfo.verified ? 'Yes' : 'No'}</p>
              <p className={`${data.profileInfo.basicInfo.private ? "text-green-500" : "text-red-500"} font-bold`}><span className="font-semibold text-gray-300">Private:</span> {data.profileInfo.basicInfo.private ? 'Yes' : 'No'}</p>
              <p><span className="font-semibold text-gray-300">Website:</span> <Link href={data.profileInfo.basicInfo.website} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">{data.profileInfo.basicInfo.website}</Link></p>
            </div>
          </div>
  
          {/* Additional Metrics */}
          <div className="bg-gray-800 rounded-lg shadow-xl p-8 border border-gray-700">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">Additional Metrics</h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                <span className="font-semibold text-gray-300 text-lg">Posts Count:</span>
                <span className="text-xl font-bold text-blue-400">{data.profileInfo.additionalMetrics.postsCount}</span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                <span className="font-semibold text-gray-300 text-lg">Average Likes:</span>
                <div className="flex items-center gap-3">
                  <span className="text-xl font-bold text-pink-400">{data.profileInfo.additionalMetrics.averageLikes.toFixed(2)}</span>
                  <div className="p-2 bg-pink-500/20 rounded-full border border-pink-500/30">
                    <ThumbsUp className="w-5 h-5 text-pink-400" />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                <span className="font-semibold text-gray-300 text-lg">Average Comments:</span>
                <div className="flex items-center gap-3">
                  <span className="text-xl font-bold text-blue-400">{data.profileInfo.additionalMetrics.averageComments.toFixed(2)}</span>
                  <div className="p-2 bg-blue-500/20 rounded-full border border-blue-500/30">
                    <MessageSquareMore className="w-5 h-5 text-blue-400" />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                <span className="font-semibold text-gray-300 text-lg">Average Engagement Per Post:</span>
                <div className="flex items-center gap-3">
                  <span className="text-xl font-bold text-green-400">{data.profileInfo.additionalMetrics.EngagementPerPost.toFixed(2)}</span>
                  <div className="p-2 bg-green-500/20 rounded-full border border-green-500/30">
                    <HeartPlus className="w-5 h-5 text-green-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
  
        {/* Top Hashtags Chart */}
        <section className="mb-12">
          <h2 className="text-4xl font-bold text-white mb-8 text-center">Top Hashtags Usage</h2>
          <div className="bg-gray-800 rounded-lg shadow-xl p-6">
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
            </ResponsiveContainer>
          </div>
        </section>
  
        {/* Full Social Analysis */}
        <section className="mb-12">
          <h2 className="text-4xl font-bold text-white mb-8 text-center">Full Social Analysis</h2>
          <div className="bg-gray-800 rounded-lg shadow-xl p-8 border border-gray-700">
            <div className="prose prose-invert text-gray-300 leading-relaxed">
              <ReactMarkdown>
                {data.fullSocialAnalysis}
              </ReactMarkdown>
            </div>
          </div>
        </section>
  
      </div>
    );
  }
};

export default SocialSWOT;
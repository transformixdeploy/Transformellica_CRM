"use client";

import { sentimentData, userDataCategories } from '@/lib/constants';
import React, { useContext, useEffect, useState } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, ZAxis, Label, PieLabelRenderProps } from 'recharts';
import { useRouter, useSearchParams } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import { ReanalyzeButton } from '@/components/ReanalyzeButton';
import { AuthContext } from '@/context/AuthContext';
import { authenticatePageUseEffect } from '@/utilities/authenticatePageUseEffect';
import CheckingUserCard from '@/components/CheckingUserCard';
import { checkServiceLimitReached, getDataHistory, getUserData, storeSentimentAnalysisData } from '@/utilities/axiosRequester';
import { AlertCircle } from 'lucide-react';
import UserDataHistory from '@/components/UserDataHistory';
import NormalSkeleton from '@/components/NormalSkeleton';
import BoxSkeleton from '@/components/BoxSkeleton';

interface Props {
	params : {
		id: string
	}
}

const SentimentAnalysis = ({params} : Props) => {

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            // console.log(payload[0].fill);
            
            return (
                <div className="bg-gray-700 border border-gray-600 rounded-lg p-3 shadow-lg">
                <p className="text-white font-semibold text-lg mb-1">{`${label ?? ""}`}</p>
                {payload.map((item: { value: string; name: string; fill?: string; color?: string }, index: number) => {
                    if(isNaN(Number(item.value))){
                        return (
                            <p key={index} className="font-medium" style={{ color: item.fill ?? item.color }}>
                                {`${item.name}: ${item.value}`}
                            </p>
                        )
                    }else{
                        if(item.name === "Average Sentiment"){
                            return (
                                <p key={index} className="font-medium" style={{ color: item.fill ?? item.color }}>
                                    {`${item.name}: ${Number(item.value).toFixed(2)}`}
                                </p>
                            )
                        }else{
                            return (
                                <p key={index} className="font-medium" style={{ color: item.fill ?? item.color }}>
                                    {`${item.name}: ${Math.round(Number(item.value))}`}
                                </p>
                            )
                        }
                    }
                })}
                </div>
            );
        }
        return null;
    };

    const router = useRouter();  
    const searchParams = useSearchParams();

    const [data, setData] = useState(sentimentData);
    const [dataHistory, setDataHistory] = useState([{title: "", id: "", categoryUrl: ""}]);
    const [requestsLimitError, setRequestsLimitError] = useState("");

    const {user, isAuthenticated, isLoading, accessToken} = useContext(AuthContext);

    useEffect(()=>{
    
        if(!accessToken) return;
      
        const getData = async ()=>{
            
            // Get user social analysis history
            const userHistory = await getDataHistory(userDataCategories.SENTIMENT);
            setDataHistory(userHistory.data.userHistoryDataObjects);
  
            // get user data using UUID
            const currentSentimentData = await getUserData(params.id); 
            
            // if user data exists
            if(currentSentimentData.data){
              setData(currentSentimentData.data);
              return;
            }
  
            // Let's check for all query params
  
            // params
            const business_description = searchParams.get('business_description');
            const company_name = searchParams.get('company_name');
            const country = searchParams.get('country');
            const goal = searchParams.get('goal');
            const serviceId = searchParams.get('serviceId');
            const industry_field = searchParams.get('industry_field');
  
            if( !business_description || !company_name || !country || !goal || !serviceId || !industry_field ){
              return router.push("/");
            }
  
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/social/sentiment-analysis`, {
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
                industry_field,
              })
            });
        
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
  
            await storeSentimentAnalysisData({
              dataId: params.id, 
              country, 
              industry_field, 
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
                
                {/* title */}
                <header className="mb-12">
                    <h1 className="text-5xl font-extrabold text-center text-white mb-4">
                        {data.analysisTitle !== null ? 
                            data.analysisTitle : 
                            <NormalSkeleton/>
                        }
                    </h1>
                    <p className="text-center text-gray-400 text-lg">
                        Comprehensive insights into your customer sentiment and competitive landscape.
                    </p>
                    <div className='max-h-[300] overflow-y-scroll'>
                        <UserDataHistory data={dataHistory}/>
                    </div>
                </header>
    
                {/* first 3 crads */}
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                    <div className="bg-gray-800 rounded-lg shadow-xl p-6 text-center">
                        <h2 className="text-xl font-semibold text-gray-200 mb-2">Total Competitors Analyzed</h2>
                        {data.competitorsAnalyzedNumber !== null ? 
                            <p className="text-5xl font-bold text-blue-400">{data.competitorsAnalyzedNumber}</p> :
                            <NormalSkeleton/>
                        }
                    </div>
                    <div className="bg-gray-800 rounded-lg shadow-xl p-6 text-center">
                        <h2 className="text-xl font-semibold text-gray-200 mb-2">Total Reviews Analyzed</h2>
                        {data.totalReview !== null ? 
                            <p className="text-5xl font-bold text-green-400">{data.totalReview}</p> :
                            <NormalSkeleton/>
                        }
                    </div>
                    <div className="bg-gray-800 rounded-lg shadow-xl p-6 text-center">
                        <h2 className="text-xl font-semibold text-gray-200 mb-2">Average Google Rating</h2>
                        {data.avgGoogleRating !== null ? 
                            <p className="text-5xl font-bold text-yellow-400">{data.avgGoogleRating.toFixed(1)} ⭐</p> :
                            <NormalSkeleton/>
                        }
                    </div>
                </section>
    
                {/* competitors break down */}
                <section className="mb-12">
                    <h2 className="text-4xl font-bold text-white mb-8 text-center">Competitor Breakdown</h2>
                        {data.competitorsAnalyzed !== null ?
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {data.competitorsAnalyzed.map((competitor, index) => (
                                    <div key={index} className="bg-gray-800 rounded-lg shadow-xl p-8 border border-gray-700 hover:border-blue-500 transition-all duration-300">
                                        <h3 className="text-3xl font-bold text-blue-400 mb-4">{competitor.name}</h3>
                                        <div className="space-y-3 text-lg">
                                            <p><span className="font-semibold text-gray-300">Google Rating:</span> <span className="text-yellow-400">{competitor.googleRating.toFixed(1)} ⭐</span></p>
                                            <p><span className="font-semibold text-gray-300">Reviews Analyzed:</span> {competitor.reviewsAnalyzed}</p>
                                            <p><span className="font-semibold text-gray-300">Positive:</span> <span className="text-green-400">{Math.round(competitor.positivePercentage)}%</span></p>
                                            <p><span className="font-semibold text-gray-300">Negative:</span> <span className="text-red-400">{Math.round(competitor.negativePercentage)}%</span></p>
                                            <p><span className="font-semibold text-gray-300">Average Sentiment:</span> {competitor.avgSentiment.toFixed(2)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div> :
                            <div className='grid grid-cols-1 lg:grid-cols-3 gap-5 justify-items-center'>
                                <BoxSkeleton width={300} borderRadius={"2%"}/>
                                <BoxSkeleton width={300} borderRadius={"2%"}/>
                                <BoxSkeleton width={300} borderRadius={"2%"}/>
                            </div>
                        }
                </section>
    
                {/* Charts Section */}
                <section className="mb-12">
                <h2 className="text-4xl font-bold text-white mb-8 text-center">Sentiment Analysis Visualizations</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 justify-items-center" >
                    
                    {/* Big screens => Pie Chart: Overall Sentiment Score */}
                    {data.pieChart.title !== null ?
                        <div className="max-sm:hidden bg-gray-800 rounded-lg shadow-xl p-6 min-w-full">
                            <h3 className="text-xl font-semibold text-gray-200 mb-4 text-center">{data.pieChart.title}</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={[
                                            { name: 'Positive', value: data.pieChart.positive },
                                            { name: 'Negative', value: data.pieChart.negative },
                                            { name: 'Neutral', value: data.pieChart.neutral },
                                        ]}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={100}
                                        fill="#8884d8"
                                        dataKey="value"
                                        label={({ name, percent }: PieLabelRenderProps) => `${name || 'N/A'}: ${(((percent as number) || 0) * 100).toFixed(0)}%`}
                                    >
                                        <Cell key="cell-0" fill="#34D399" /> {/* Green for Positive */}
                                        <Cell key="cell-1" fill="#EF4444" /> {/* Red for Negative */}
                                        <Cell key="cell-2" fill="#60A5FA" /> {/* Blue for Neutral */}
                                    </Pie>
                                    <Tooltip content={CustomTooltip} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div> : 
                        <div className='max-sm:hidden min-w-full'>
                            <BoxSkeleton width={"100%"} borderRadius={"2%"}/>
                        </div>
                    }

                    {/* Small screens => Pie Chart: Overall Sentiment Score */}
                    {data.pieChart.title !== null ?
                        <div className="sm:hidden bg-gray-800 rounded-lg shadow-xl p-6 min-w-full">
                            <h3 className="text-xl font-semibold text-gray-200 mb-4 text-center">{data.pieChart.title}</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={[
                                            { name: 'Positive', value: data.pieChart.positive },
                                            { name: 'Negative', value: data.pieChart.negative },
                                            { name: 'Neutral', value: data.pieChart.neutral },
                                        ]}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={75}
                                        fill="#8884d8"
                                        dataKey="value"
                                        label={({ name, percent }: PieLabelRenderProps) => `${(((percent as number) || 0) * 100).toFixed(0)}%`}
                                    >
                                        <Cell key="cell-0" fill="#34D399" /> {/* Green for Positive */}
                                        <Cell key="cell-1" fill="#EF4444" /> {/* Red for Negative */}
                                        <Cell key="cell-2" fill="#60A5FA" /> {/* Blue for Neutral */}
                                    </Pie>
                                    <Tooltip content={CustomTooltip} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div> :
                        <div className='sm:hidden min-w-full'>
                            <BoxSkeleton width={"100%"} borderRadius={"2%"}/>
                        </div>
                    }

                    {/* Big screens => Stacked Bar Chart: Sentiment Analysis for Each Competitor */}
                    {data.competitorSentimentComparisonChart !== null ?
                        <div className="max-sm:hidden bg-gray-800 rounded-lg shadow-xl p-6 min-w-full">
                            <h3 className="text-xl font-semibold text-gray-200 mb-4 text-center">Competitor Sentiment Comparison</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart
                                    data={data.competitorSentimentComparisonChart}
                                    margin={{
                                        top: 20, right: 30, left: 20, bottom: 5,
                                    }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
                                    <XAxis dataKey="name" stroke="#9CA3AF" />
                                    <YAxis stroke="#9CA3AF" />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend />
                                    <Bar dataKey="positive" stackId="a" fill="#34D399" name="Positive" />
                                    <Bar dataKey="negative" stackId="a" fill="#EF4444" name="Negative" />
                                    <Bar dataKey="neutral" stackId="a" fill="#60A5FA" name="Neutral" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div> :
                        <div className='max-sm:hidden min-w-full'>
                            <BoxSkeleton width={"100%"} borderRadius={"2%"}/>
                        </div>
                    }

                    {/* Small screens => Stacked Bar Chart: Sentiment Analysis for Each Competitor */}
                    {data.competitorSentimentComparisonChart !== null ?
                        <div className="sm:hidden bg-gray-800 rounded-lg shadow-xl p-6 min-w-full">
                            <h3 className="text-xl font-semibold text-gray-200 mb-4 text-center">Competitor Sentiment Comparison</h3>
                            <ResponsiveContainer width="100%" height={300} >
                                <BarChart
                                    data={data.competitorSentimentComparisonChart}
                                    margin={{
                                        top: 20, bottom: 5,
                                    }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
                                    <XAxis hide dataKey="name" stroke="#9CA3AF" />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend  />
                                    <Bar dataKey="positive" stackId="a" fill="#34D399" name="Positive" />
                                    <Bar dataKey="negative" stackId="a" fill="#EF4444" name="Negative" />
                                    <Bar dataKey="neutral" stackId="a" fill="#60A5FA" name="Neutral" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div> :
                        <div className='sm:hidden min-w-full'>
                            <BoxSkeleton width={"100%"} borderRadius={"2%"}/>
                        </div>
                    }
    
                    {/* Big screens => Scatter Chart: Google Score vs. Average Sentiment Score */}
                    {data.competitorRating_averageSentiment_chart !== null ?
                        <div className="max-sm:hidden bg-gray-800 rounded-lg shadow-xl p-6 min-w-full">
                            <h3 className="text-xl font-semibold text-gray-200 mb-4 text-center">Google Rating vs. Average Sentiment</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <ScatterChart
                                    margin={{
                                        top: 20, right: 20, bottom: 20, left: 20,
                                    }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
                                    <XAxis type="number" dataKey="googleRating" name="Google Rating" stroke="#9CA3AF" />
                                    <YAxis type="number" dataKey="averageSentiment" name="Average Sentiment" stroke="#9CA3AF" />
                                    <ZAxis dataKey="competitorName" name="Competitor" />
                                    <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
                                    <Legend />
                                    <Scatter name="Competitors" data={data.competitorRating_averageSentiment_chart} fill="#8884d8" />
                                </ScatterChart>
                            </ResponsiveContainer>
                        </div> :
                        <div className='max-sm:hidden min-w-full'>
                            <BoxSkeleton width={"100%"} borderRadius={"2%"}/>
                        </div>
                    }

                    {/* Small Screens => Scatter Chart: Google Score vs. Average Sentiment Score */}
                    {data.competitorRating_averageSentiment_chart !== null ?
                        <div className="sm:hidden bg-gray-800 rounded-lg shadow-xl p-6 min-w-full">
                            <h3 className="text-xl font-semibold text-gray-200 mb-4 text-center">Google Rating vs. Average Sentiment</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <ScatterChart
                                    margin={{
                                        top: 20, right: 30, bottom: 20,
                                    }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
                                    <XAxis type="number" dataKey="googleRating" name="Google Rating" stroke="#9CA3AF" />
                                    <YAxis type="number" dataKey="averageSentiment" name="Average Sentiment" stroke="#9CA3AF" />
                                    <ZAxis dataKey="competitorName" name="Competitor" />
                                    <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
                                    <Legend />
                                    <Scatter name="Competitors" data={data.competitorRating_averageSentiment_chart} fill="#8884d8" />
                                </ScatterChart>
                            </ResponsiveContainer>
                        </div> : 
                        <div className='sm:hidden min-w-full'>
                            <BoxSkeleton width={"100%"} borderRadius={"2%"}/>
                        </div>
                    }   


                    {/* Big Screens =>  Bar Chart: Reviews Analyzed Per Competitor */}
                    {data.reviewsAnalyzedPerCompetitor !== null ?
                        <div className="max-sm:hidden bg-gray-800 rounded-lg shadow-xl p-6 min-w-full">
                            <h3 className="text-xl font-semibold text-gray-200 mb-4 text-center">Reviews Analyzed Per Competitor</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart
                                    data={data.reviewsAnalyzedPerCompetitor}
                                    margin={{
                                        top: 20, right: 30, left: 20, bottom: 5,
                                    }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
                                    <XAxis dataKey="name" stroke="#9CA3AF" />
                                    <YAxis stroke="#9CA3AF" />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend />
                                    <Bar dataKey="reviews" fill="#82ca9d" name="Reviews" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div> : 
                        <div className='max-sm:hidden min-w-full'>
                            <BoxSkeleton width={"100%"} borderRadius={"2%"}/>
                        </div>
                    }


                    {/* Small Screens =>  Bar Chart: Reviews Analyzed Per Competitor */}
                    {data.reviewsAnalyzedPerCompetitor !== null ?
                        <div className="sm:hidden bg-gray-800 rounded-lg shadow-xl p-6 min-w-full">
                            <h3 className="text-xl font-semibold text-gray-200 mb-4 text-center">Reviews Analyzed Per Competitor</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart
                                    data={data.reviewsAnalyzedPerCompetitor}
                                    margin={{
                                        top: 20, right: 30, bottom: 5,
                                    }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
                                    <XAxis hide dataKey="name" stroke="#9CA3AF" />
                                    <YAxis stroke="#9CA3AF" />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend />
                                    <Bar dataKey="reviews" fill="#82ca9d" name="Reviews" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div> : 
                        <div className='sm:hidden min-w-full'>
                            <BoxSkeleton width={"100%"} borderRadius={"2%"}/>
                        </div>
                    }

                </div>
                </section>
    
                {/* ai powered insights */}
                <section className="mb-12">
                    <h2 className="text-4xl font-bold text-white mb-8 text-center">AI-Powered Competitive Insights</h2>
                    <div className="space-y-8">
                        {(data.competitorsDetails !== null && data.competitorsAnalyzed !== null) ?
                            data.competitorsDetails.map((detail, index) => (
                                <div key={index} className="bg-gray-800 rounded-lg shadow-xl p-8 border border-gray-700">
                                    <h3 className="text-2xl font-bold text-blue-400 mb-4">Insights for {data.competitorsAnalyzed![index]?.name || `Competitor ${index + 1}`}</h3>
                                    <div className="text-gray-300 leading-relaxed mb-4"><ReactMarkdown>{detail.aiInsights}</ReactMarkdown></div>
                                    <div className="max-md:flex-col max-md:text-center max-md:gap-2 flex items-center space-x-4">
                                        <span className="font-semibold text-gray-300">Address:</span>
                                        <p className="text-gray-400">{detail.address}</p>
                                        {detail.googleMaps && (
                                            <Link href={detail.googleMaps} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                                View on Google Maps
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            )) :
                            <div className='grid grid-cols-1 lg:grid-cols-3 gap-5 justify-items-center'>
                                <BoxSkeleton width={300} borderRadius={"2%"}/>
                                <BoxSkeleton width={300} borderRadius={"2%"}/>
                                <BoxSkeleton width={300} borderRadius={"2%"}/>
                            </div>
                        }
                    </div>
                </section>
    
            </div>
        );
    }

};

export default SentimentAnalysis;
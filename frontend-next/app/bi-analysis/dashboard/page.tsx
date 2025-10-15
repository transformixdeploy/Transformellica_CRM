"use client";

import {useContext, useEffect, useState} from "react";
import { Icon } from "@iconify/react";
import { Card, CardContent } from "@/components/ui/card";
import { CircleCheck, Footprints, Loader2 } from "lucide-react";
import Markdown from 'react-markdown';
import { PieChart, BarChart ,Bar, CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis, Rectangle, Cell, Pie } from "recharts";
import { ChartContainer } from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import { checkTable, getDashboardData } from "@/utilities/axiosRequester";
import { crmDashboardData } from "@/lib/constants";
import { AuthContext } from "@/context/AuthContext";
import { authenticatePageUseEffect } from "@/utilities/authenticatePageUseEffect";
import { useRouter } from "next/navigation";
import CheckingUserCard from "@/components/CheckingUserCard";

function DashboardPage() {

    const router = useRouter();

    const [checkingData, setCheckingData] = useState(true);
    const [dataExists, setDataExists] = useState(true);
    const [data, setData] = useState(crmDashboardData);
    const RADIAN = Math.PI / 180;

    const {user, isAuthenticated, isLoading} = useContext(AuthContext);

    authenticatePageUseEffect(isAuthenticated, isLoading, router);

    interface PieLabelRenderProps {
      cx: number;
      cy: number;
      midAngle: number;
      innerRadius: number;
      outerRadius: number;
      percent: number;
      value: number;
    }

    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: PieLabelRenderProps) => {
      const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
      const x = cx + radius * Math.cos(-(midAngle ?? 0) * RADIAN);
      const y = cy + radius * Math.sin(-(midAngle ?? 0) * RADIAN);

      return (
        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
          {`${((percent ?? 1) * 100).toFixed(0)}%`}
        </text>
      );
    };

    useEffect(()=>{
        const checkData = async () => {

          try{
            const response = await checkTable();

            setDataExists(response.data.status);

            const storageData = localStorage.getItem("userData");
            if(storageData){
              setData(JSON.parse(storageData));
            }

            if(response.data.status && !storageData){
                const response = await getDashboardData();
                
                setData(response.data);
                localStorage.setItem("userData", JSON.stringify(response.data));
            }
          }finally{
            setCheckingData(false);
          }
        }

        checkData();
    }, [])

    function reCalculateInsights(){
      localStorage.removeItem("userData");
      window.location.reload();
    }

    if(!isAuthenticated){
      return (
        <CheckingUserCard/>
      )
    }else{
      return (
        <div className="min-h-screen bg-background text-foreground">
          <div className="container mx-auto px-6 py-8">
            
            {/* title */}
            <div className="text-center mb-12">
              <h2 className="font-heading text-4xl font-bold text-foreground mb-4">
                Instant Insights, Smarter Decisions
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Transform business data into actionable intelligence with AI. Get real-time analytics, predictive insights, and comprehensive reports through natural language queries for faster, data-driven decisions.            
              </p>
            </div>
  
            {(!dataExists && !checkingData) && <p className="text-center pb-3 text-destructive font-bold">Please upload your data for analysis.</p>}
  
            {checkingData && <div className="container mx-auto px-4 py-8">
              <Card className="bg-card border-border text-primary-foreground">
                <CardContent className="flex items-center justify-center space-x-4 p-6">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  <p className="text-lg font-medium">Getting business insights...</p>
                </CardContent>
              </Card>
            </div>}
  
            {(!checkingData && dataExists) && <div>
              {/* Key Business Insights */}
              <div className="mb-8">
  
                {/* quick stats */}
                <div>
                  <div className="flex flex-row w-full">
                    <h2 className="text-2xl font-heading font-bold text-foreground mb-6">Quick Stats</h2>
                    <div className="ml-auto mb-6">
                      <Button onClick={reCalculateInsights} className="cursor-pointer w-[200px] bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground font-medium py-3">
                        <Icon icon="lucide:refresh-ccw" className="w-4 h-4 mr-2 text-primary-foreground" /> Recalculate Insights
                      </Button>
                    </div>
                  </div>
  
                  <div className="bg-card rounded-lg border border-border p-6">
                    <ul className="space-y-4">
                      
                      {/* stat */}
                      {data.keyBusinessInsights.quickStats.map((feature,index)=>(
                          <li key={index} className="flex items-center space-x-3">
                              <div className="justify-between items-start py-2 border-b border-muted/30">
                                  <span className="text-lg font-bold mr-2 text-primary">{feature.key}:</span>
                                  <span className="font-bold text-accent">{feature.value}</span>
                              </div>
                          </li>
                      ))}
                    
                    </ul>
                  </div>
                </div>  
              
              </div>
  
              {/* Charts  */}
              {(data.barChart || data.lineChart || data.pieChart || data.donutChart) && <div className="mb-8">
                <h2 className="text-2xl font-heading font-bold text-foreground mb-6">Charts</h2>
                <div className="grid grid-cols-2 gap-5">
  
                {/* pie chart */}
                {data.pieChart && <div className="flex flex-col border border-border rounded-lg shadow-md hover:-translate-y-1 duration-300 hover:shadow-xl bg-card">
                    <div className="text-center font-bold text-xl text-foreground my-2">{data.pieChartData.title}</div>
                    <ChartContainer config={{}} className="w-full h-[300px]">
                      <PieChart width={400} height={400}>
                        <Pie data={data.pieChartData.data} dataKey="value" cx="50%" cy="50%"  fill="#8884d8" labelLine={false} label={renderCustomizedLabel} >
                          {data.pieChartData.data.map((entry, index) => (
                            <Cell key={`cell-${entry.name}`} fill={data.pieChartData.colorCodes[index % data.pieChartData.colorCodes.length] || "#cccccc"} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e0e0e0', color: '#333333' }}/>
                        <Legend/>
                      </PieChart>
                    </ChartContainer>
                  </div>}
                  
                  {/* line chart */}
                  {data.lineChart && <div className="flex flex-col border border-border rounded-lg shadow-md hover:-translate-y-1 duration-300 hover:shadow-xl bg-card">
                    <div className="text-center font-bold text-xl text-foreground my-2">{data.lineChartData.title}</div>
                    <ChartContainer config={{}} className="w-full h-[300px]">
                      <LineChart
                        width={500}
                        height={300}
                        data={data.lineChartData.data}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid  strokeDasharray="3 3" stroke="#e0e0e0" />
                        <XAxis dataKey="name" stroke="#333333" />
                        <YAxis stroke="#333333" />
                        <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e0e0e0', color: '#333333' }}/>
                        <Legend />
                        
                        <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8, fill: '#ffc658', stroke: '#8884d8' }} />
                      </LineChart>
                    </ChartContainer>
                  </div>}
                  
                  {/* bar chart */}
                  {data.barChart && <div className="flex flex-col border border-border rounded-lg shadow-md hover:-translate-y-1 duration-300 hover:shadow-xl bg-card">
                    <div className="text-center font-bold text-xl text-foreground my-2">{data.barChartData.title}</div>
                    <ChartContainer config={{}} className="w-full h-[300px]">
                      <BarChart
                        width={500}
                        height={300}
                        data={data.barChartData.data}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                        <XAxis dataKey="name" stroke="#333333" />
                        <YAxis stroke="#333333" />
                        <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e0e0e0', color: '#333333' }}/>
                        <Legend />
                        <Bar dataKey="value" fill="#8884d8" activeBar={<Rectangle fill="#ffc658" stroke="#8884d8" />} />
                      </BarChart>
                    </ChartContainer>
                  </div>}
                  
                  {/* donut chart */}
                  {data.donutChart && <div className="flex flex-col border border-border rounded-lg shadow-md hover:-translate-y-1 duration-300 hover:shadow-xl bg-card">
                    <div className="text-center font-bold text-xl text-foreground my-2">{data.donutChartData.title}</div>
                    <ChartContainer config={{}} className="w-full h-[300px]">
                      <PieChart>
                        <Pie
                          data={data.donutChartData.data}
                          isAnimationActive={true}
                          innerRadius={80}
                          fill="#8884d8"
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {data.donutChartData.data.map((entry, index) => (
                            <Cell key={`cell-${entry.name}`} fill={data.donutChartData.colorCodes[index % data.donutChartData.colorCodes.length] || "#cccccc"} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e0e0e0', color: '#333333' }}/>
                        <Legend/>
                      </PieChart>
                    </ChartContainer>
                  </div>}
  
                </div>
              </div>}
  
              
              {/* Key Performance metrics */}
              <div className="mb-8">
                <h2 className="text-2xl font-heading font-bold text-foreground mb-6">
                  Key Performance Metrics
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                  
                  {/* metric */}
                  {data.keyPerformanceMetrics.map((feature,index)=>(
                      <Card key={index} className="bg-card text-center border-border">
                          <CardContent className="px-4 justify-items-center">
                              <div className="flex text-primary items-center mb-4 text-4xl font-bold">
                                  {feature.number}
                              </div>
                              <div className="text-2xl font-bold text-foreground mb-1">{feature.title}</div>
                              <div className="text-sm text-muted-foreground">{feature.description}</div>
                          </CardContent>
                      </Card>  
                  ))}  
                </div>
              </div>
  
              {/* primary insights */}
              <div className="mb-6">
                  <h2 className="text-2xl font-heading font-bold text-foreground mb-6">Primary Insights</h2>
                  <div className="bg-card rounded-lg border border-border p-6">
                    <ul className="space-y-4">
                      
                      {/* insight */}
                      {data.keyBusinessInsights.primaryInsights.map((feature, index)=>(
                          <li key={index} className="flex items-start space-x-3">
                              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                                  <CircleCheck  className="text-primary-foreground text-sm" />
                              </div>
                              <h4 className="font-semibold text-foreground">
                                  {feature}
                              </h4>
                          </li>
                      ))}
  
                    </ul>
                  </div>
                </div>
  
              
              {/* busniess recommendations */}
              <div className="mb-8">
                <h2 className="text-2xl font-heading font-bold text-foreground mb-6">
                  Business Recommendations
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* actionalble insights */}
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-4">Actionable Insights</h3>
                    <div className="bg-card rounded-lg border border-border p-6">
                      <ul className="space-y-4">
                        
                        {/* insight */}
                        {data.businessRecommendations.actionableInsights.map((feature,index)=>(
                          <li key={index} className="flex items-start space-x-3">
                              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center mt-1 flex-shrink-0">
                                <Icon icon="mdi:lightbulb" className="text-primary-foreground text-sm" />
                              </div>
                              <div>
                                <Markdown>{feature}</Markdown>
                              </div>
                          </li>
                        ))}
  
                      </ul>
                    </div>
                  </div>
  
                  {/* next steps */}
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-4">Next Steps</h3>
                    <Card className="bg-card border-border">
                      <CardContent className="px-6">
                        <div className="space-y-4">
                          
                          {/* step */}
                          {data.businessRecommendations.nextSteps.map((feature,index)=>(
                              <div key={index} className="flex items-start space-x-3">
                                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center mt-1">
                                      <Footprints className="text-primary-foreground text-xs font-bold p-1"/>
                                  </div>
                                  <div>
                                      <Markdown>{feature}</Markdown>
                                  </div>
                              </div>
                          ))}
  
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>}
  
            
          </div>
        </div>
      );
    }

}

export default DashboardPage;

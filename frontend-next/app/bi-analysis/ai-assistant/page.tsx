"use client";

import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useContext, useEffect, useState } from "react";
import Markdown from 'react-markdown';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { answerQuestion, checkTable, getSmartQuestions } from "@/utilities/axiosRequester";
import { SmartQuestion } from "@/lib/types";
import { crmSmartAnswerData } from "@/lib/constants";
import { AuthContext } from "@/context/AuthContext";
import { authenticatePageUseEffect } from "@/utilities/authenticatePageUseEffect";
import { useRouter } from "next/navigation";
import CheckingUserCard from "@/components/CheckingUserCard";


function AIAssistantPage() {

  const router = useRouter();

  const [checkingData, setCheckingData] = useState(true);
  const [dataExists, setDataExists] = useState(false);
  const [question, setQuestion] = useState("");
  const [dataAnalyzed, setDataAnalyzed] = useState(false);
  const [smartQuestions, setSmartQuestions] = useState<SmartQuestion[]>([]);
  const [smartAnswer, setSmartAnswer] = useState(crmSmartAnswerData);
  const [isAnalysing, setIsAnalysing] = useState(false);

  const {user, isAuthenticated, isLoading} = useContext(AuthContext);

  authenticatePageUseEffect(isAuthenticated, isLoading, router);

  useEffect(()=>{
    const checkData = async ()=>{
        const response = await checkTable();

        setDataExists(response.data.status);

        if(response.data.status){
          const response = await getSmartQuestions();
          setSmartQuestions(response.data);
        }

        setCheckingData(false);
    }

    checkData();
  }, [])

  function onQuestionChange(event : React.ChangeEvent<HTMLInputElement>){
    setQuestion(event.target.value);
  }

  async function askQuestion(){
    setIsAnalysing(true);
    try {
      const response = await answerQuestion(question);
      
      setDataAnalyzed(true);
      setSmartAnswer(response.data);
      
    } finally {
      setIsAnalysing(false);
    }
  }

  if(!isAuthenticated){
    return (
      <CheckingUserCard/>
    )
  }else{
    return (
      <div className="min-h-screen bg-background">
  
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* title */}
          <div className="text-center mb-12">
            <h2 className="font-heading text-4xl font-bold text-foreground mb-4">
              Welcome to Your AI Business Assistant
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get instant insights from your data with intelligent analysis. Ask questions in natural
              language and receive comprehensive business intelligence reports.
            </p>
          </div>
  
          {/* sample questions */}
          { dataExists && 
            <Card className="mb-8 bg-card border-border">
              <CardContent className="px-6 py-8">
                <div className="flex items-center mb-6">
                  <div className="min-w-8 min-h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center mr-3">
                    <Icon icon="ph:lightbulb-bold" className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Smart Question Examples</h3>
                </div>
  
                
  
                {smartQuestions.length > 1 ? 
  
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  
                  {smartQuestions.map((question, index) => (
                    <div key={index} onClick={()=>setQuestion(question.question)} className="h-auto p-4 text-left justify-start border-2 border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                      <div>
                        <div className="font-medium text-foreground mb-1">{question.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {question.question}
                        </div>
                      </div>
                    </div>
                  ))}
                </div> : 
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  
                  <div className="h-auto p-4 text-left justify-start border-2 border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                        <Skeleton count={3} baseColor="hsl(215 28% 17%)" highlightColor="hsl(224 71% 4%)"/>
                  </div>
                  <div className="h-auto p-4 text-left justify-start border-2 border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                        <Skeleton count={3} baseColor="hsl(215 28% 17%)" highlightColor="hsl(224 71% 4%)"/>
                  </div>
                  <div className="h-auto p-4 text-left justify-start border-2 border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                        <Skeleton count={3} baseColor="hsl(215 28% 17%)" highlightColor="hsl(224 71% 4%)"/>
                  </div>
                  <div className="h-auto p-4 text-left justify-start border-2 border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                        <Skeleton count={3} baseColor="hsl(215 28% 17%)" highlightColor="hsl(224 71% 4%)"/>
                  </div>
                  <div className="h-auto p-4 text-left justify-start border-2 border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                        <Skeleton count={3} baseColor="hsl(215 28% 17%)" highlightColor="hsl(224 71% 4%)"/>
                  </div>
                  <div className="h-auto p-4 text-left justify-start border-2 border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                        <Skeleton count={3} baseColor="hsl(215 28% 17%)" highlightColor="hsl(224 71% 4%)"/>
                  </div>
                </div>
              }
  
  
              </CardContent>
            </Card>}
  
          {/* ask ai */}
          {(!dataExists && !checkingData) && <p className="text-center pb-3 text-destructive font-bold">Please upload your data for analysis.</p>}
          <Card className="mb-8 bg-card border-border">
            <CardContent className="px-6 py-6">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center mr-3">
                  <Icon icon="ph:chat-circle-bold" className="w-5 h-5 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Ask Your Question</h3>
              </div>
              <div className="flex max-sm:flex-col gap-4 items-center">
                <Input
                  disabled={!dataExists || isAnalysing}
                  onChange={onQuestionChange}
                  value={question}
                  className="flex-1 h-12 text-base border-2 focus:border-primary transition-colors bg-input"
                  placeholder="Type your business intelligence question here..."
                />
                <Button
                  onClick={askQuestion}
                  disabled={!dataExists || isAnalysing}
                  size="lg"
                  className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 px-8"
                >
                  <Icon icon="ph:paper-plane-right-bold" className="w-5 h-5 mr-2 text-primary-foreground" />
                  {isAnalysing ? "Analyzing..." : "Analyze"}
                </Button>
              </div>
            </CardContent>
          </Card>
  
          
          { (dataExists && dataAnalyzed) && <div>
  
          {/* some analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            
            {/* smart analysis */}
            <Card className="border-2 border-border bg-card">
              <CardContent className="px-6 py-6">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center mr-3">
                    <Icon icon="ph:brain-bold" className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">Smart Analysis</h3>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">AI-Powered Insight</p>
                    <Markdown>
                      {smartAnswer.smartAnalysis.analysis}
                    </Markdown>
                  </div>
                  <div className="flex items-center text-sm text-primary">
                    <Icon icon="ph:check-circle-bold" className="w-4 h-4 mr-2" />
                    {`Analysis completed with ${smartAnswer.smartAnalysis.confidence * 100}% confidence`}
                  </div>
                </div>
              </CardContent>
            </Card>
  
            {/* key findings  */}
            <Card className="border-2 border-border bg-card">
              <CardContent className="px-6 py-6">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center mr-3">
                    <Icon icon="ph:star-bold" className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">Key Findings</h3>
                </div>
                <div className="space-y-3">
                  
                  {/* finding */}
                  {smartAnswer.keyFindings.map((finding, index)=>(
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                      <p className="text-sm text-foreground">
                        {finding}
                      </p>
                    </div>
                  ))}
  
                </div>
              </CardContent>
            </Card>
  
            {/* relevant statistics */}
            {smartAnswer.relevantStatistics.length > 0 && <Card className="border-2 border-border bg-card">
              <CardContent className="px-6 py-6">
                <div className="flex items-center mb-4">
                  <div className="min-w-8 min-h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center mr-3">
                    <Icon icon="ph:chart-line-up-bold" className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">Relevant Statistics</h3>
                </div>
                <div className="space-y-3">
                  
                  {smartAnswer.relevantStatistics.map((feature,index)=>(
                    <div key={index} className="justify-between items-start py-2 border-b border-border">
                      <div className="text-lg font-bold text-primary">{feature.key}</div>
                      <div className="text-sm text-muted-foreground">{feature.value}</div>
                    </div>
                  ))}
  
                </div>
              </CardContent>
            </Card>}
  
            {/* data evidence */}
            <Card className="border-2 border-border bg-card">
              <CardContent className="px-6 py-6">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center mr-3">
                    <Icon icon="ph:database-bold" className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">Data Evidence</h3>
                </div>
                <div className="space-y-3">
                  
                  {smartAnswer.dataEvidence.evidences.map((feature,index)=>(
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                      <div className="flex-1">
                        <span className="text-sm text-foreground">{feature}</span>
                      </div>
                    </div>
                  ))}
  
                  <div className="flex items-start space-x-3">
                    <div className="flex-1">
                      <span className="text-sm font-bold text-foreground">Confidence Level: </span>
                      <span 
                        className={`ml-2 text-sm font-medium ${smartAnswer.dataEvidence.confidence === "high" ? "text-primary" : smartAnswer.dataEvidence.confidence === "low" ? "text-destructive" : "text-secondary"}`}
                      >{smartAnswer.dataEvidence.confidence}</span>
                    </div>
                  </div>
  
                </div>
              </CardContent>
            </Card>
          </div>
  
          {/* actional insights */}
          <Card className="mb-8 border-2 border-border bg-card">
            <CardContent className="px-6 py-6">
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center mr-3">
                  <Icon icon="ph:target-bold" className="w-5 h-5 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Actionable Insights</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  
                {/* insight   */}
                {smartAnswer.actionableInsights.map((feature,index)=>(
                  <div key={index} className="p-4 bg-muted/50 rounded-lg border border-border">
                    <div className="flex items-center mb-3">
                      {/* <Icon icon="ph:trend-up-bold" className="w-5 h-5 text-primary mr-2" /> */}
                      <span className="font-medium text-foreground">{feature.key}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{feature.value}</p>
                  </div>
                ))}
              
              </div>
            </CardContent>
          </Card>
  
          {/* follow up questions */}
          <Card className="bg-card border-border">
            <CardContent className="px-6 py-6">
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center mr-3">
                  <Icon icon="ph:chat-circle-dots-bold" className="w-5 h-5 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Follow-up Questions</h3>
              </div>
              <div className="flex flex-wrap gap-3">
                
                {/* question */}
                {smartAnswer.followUpQuestions.map((feature,index)=>(
                  <div key={index} className="p-2 px-4 border-2 border-border rounded-lg flex items-center space-x-2">
                    <Icon icon="ph:arrow-right-bold" className="min-w-5 min-h-5 text-primary" />
                    <div className="text-sm font-medium text-foreground">{feature}</div>
                  </div>
                ))}
                
              </div>
            </CardContent>
          </Card>
          
          
          </div> }
        
        </div>
      </div>
    );
  }

}

export default AIAssistantPage;

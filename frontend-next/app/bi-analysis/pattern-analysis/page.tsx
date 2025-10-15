"use client";

import {useState, useEffect, useContext} from "react";
import { Icon } from "@iconify/react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Info } from "lucide-react";
import { Loader2 } from "lucide-react";
import { analysePatterns, checkForPatterns, checkTable } from "@/utilities/axiosRequester";
import { crmPatternCardsData, crmPatternsData } from "@/lib/constants";
import { AuthContext } from "@/context/AuthContext";
import { authenticatePageUseEffect } from "@/utilities/authenticatePageUseEffect";
import { useRouter } from "next/navigation";
import CheckingUserCard from "@/components/CheckingUserCard";

function PatternAnalysisPage() {

    const router = useRouter();

    const [checkingData, setCheckingData] = useState(true);
    const [dataExists, setDataExists] = useState(false);
    const [haveTransactions, setHaveTransactions] = useState(false);
    const [foundPattern, setFoundPattern] = useState(false);
    const [issueNotFoundPattern, setIssueNotFoundPattern] = useState("");
    const [cardsData, setCardsData] = useState(crmPatternCardsData);
    const [patterns, setPatterns] = useState(crmPatternsData);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [minSupport, setMinSupport] = useState(0.05);
    const [initialChecking, setInitialChecking] = useState(false);

    const {user, isAuthenticated, isLoading} = useContext(AuthContext);

    authenticatePageUseEffect(isAuthenticated, isLoading, router);

    useEffect(()=>{
        const checkData = async () => {

            const response = await checkTable();

            setDataExists(response.data.status);
            setCheckingData(false);

            const storagePatterns = localStorage.getItem("patterns");
            const storageInitialData = localStorage.getItem("initial");
            
            if(storageInitialData){
              setHaveTransactions(true);
              setCardsData(JSON.parse(storageInitialData));
            }
            
            if(storagePatterns){
              setFoundPattern(true);
              setPatterns(JSON.parse(storagePatterns));
            }
            
            if(response.data.status && (!storagePatterns && !storageInitialData)){
                setInitialChecking(true);
                try{
                    const response = await checkForPatterns();
                    
                    setHaveTransactions(response.data.transactionalPatternsDetected);

                    if(response.data.transactionalPatternsDetected){
                        setCardsData(response.data.data);
                        localStorage.setItem("initial", JSON.stringify(response.data.data));
                    }
                }finally{
                    setInitialChecking(false);
                }

                
            }
        }

        checkData();
    }, [])

    async function onAnalyze(){
        setIsAnalyzing(true);
        localStorage.removeItem("patterns");
        try{
            const response = await analysePatterns(minSupport);

            setFoundPattern(response.data.foundPatterns);
            
            if(response.data.foundPatterns){
                setPatterns(response.data.data);
                localStorage.setItem("patterns", JSON.stringify(response.data.data));
            }else{
                setIssueNotFoundPattern(response.data.issueIfNoPatternsFound);
            }
        }finally{
            setIsAnalyzing(false);
        }
    }

    async function onSliderChange(value: number[]){
         setMinSupport(value[0]);
    }

    if(!isAuthenticated){
      return (
        <CheckingUserCard/>
      )
    }else{
      return (
        <div className="min-h-screen bg-background text-foreground">
          <header className="border-b border-border bg-card/80 backdrop-blur-sm">
            <div className="container mx-auto px-4 py-6">
              <div className="flex items-center justify-center">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-center">
                      <h1 className="text-2xl font-bold text-foreground mb-2">Universal Pattern Analysis</h1>
                      <p className="text-sm text-muted-foreground tracking-wider">{`
                        Unlock strategic insights from your data with Universal Pattern Analysis. 
                        Designed for decision-makers across industries, this tool identifies meaningful 
                        patterns and relationships in transactional and multi-dimensional datasets — revealing 
                        customer behaviors, operational inefficiencies, and growth opportunities. Whether you're 
                        optimizing pricing, forecasting demand, or personalizing experiences, implementing upselling &
                        cross-selling Universal Pattern Analysis turns complex data into competitive advantage.`}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </header>
  
          {(!dataExists && !checkingData) && <p className="mt-5 text-center pb-3 text-destructive font-bold">Please upload your data for analysis.</p>}
  
            {initialChecking && 
                <div className="container mx-auto px-4 py-8">
                  <Card className="bg-card border-border text-primary-foreground">
                    <CardContent className="flex items-center justify-center space-x-4 p-6">
                      <Loader2 className="w-8 h-8 text-primary animate-spin" />
                      <p className="text-lg font-medium">Checking for transactional patterns...</p>
                    </CardContent>
                  </Card>
                </div>
            }
            
            {(!haveTransactions && dataExists && !initialChecking) && <div className="container mx-auto px-4 py-8">
              <div className="grid grid-cols-1 gap-6 mb-8">
                <Card className="bg-destructive/10 border-destructive text-destructive-foreground">
                  <CardContent className="flex items-center space-x-4 p-4">
                    <AlertTriangle className="w-6 h-6 text-destructive flex-shrink-0" />
                    <p className="font-medium text-foreground">
                      No suitable transactional patterns detected in this dataset.
                    </p>
                  </CardContent>
                </Card>
              </div>
              <div className="grid grid-cols-1 gap-6 mb-8">
                <Card className="bg-card border-border text-foreground">
                  <CardContent className="flex items-start space-x-4 p-4">
                    <Info className="w-6 h-6 text-primary flex-shrink-0" />
                    <div>
                      <p className="font-medium mb-2">Pattern Analysis works best with data that has:</p>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Comma-separated values in text fields</li>
                        <li>Multiple items per record</li>
                        <li>Categorical associations</li>
                      </ul>
                      <p className="font-medium mt-4 mb-2">Examples:</p>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>{`Customer purchases: "Product A, Product B, Product C"`}</li>
                        <li>{`Course enrollments: "Course 1, Course 2"`}</li>
                        <li>{`Skills: "Python, SQL, Excel"`}</li>
                        <li>{`Tags: "urgent, important, follow-up"`}</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>}
  
          {(dataExists && haveTransactions)  && <main className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <Card className="lg:col-span-2 bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Icon icon="lucide:settings" className="w-5 h-5 text-primary" />
                    <span>Analysis Configuration</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-6">
                  <div className="space-y-6">
                    <div>
                      <Label className="text-sm font-medium text-foreground mb-3 block">
                        Minimum Support Value
                      </Label>
                      <div className="space-y-3">
                        <Slider onValueChange={onSliderChange} max={0.5} min={0.1} step={0.05} className="w-full" value={[minSupport]} />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>0.1</span>
                          <span className="font-medium text-primary">{minSupport.toFixed(2)} ({(minSupport * 100).toFixed(0)}%)</span>
                          <span>0.5</span>
                        </div>
                      </div>
                    </div>
                    <Button disabled={isAnalyzing} onClick={onAnalyze} className="cursor-pointer w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground font-medium py-3">
                      <Icon icon="lucide:play" className="w-4 h-4 mr-2 text-primary-foreground" />
                      {isAnalyzing ? "Analyzing..." : "Analyze Patterns"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Icon icon="lucide:bar-chart-3" className="w-5 h-5 text-primary" />
                    <span>Dataset Metrics</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg border border-border">
                      <span className="text-sm font-medium text-foreground">Transactions Found</span>
                      <span className="text-lg font-bold text-foreground">{cardsData.transactionsFound}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg border border-border">
                      <span className="text-sm font-medium text-foreground">Avg Items/Transaction</span>
                      <span className="text-lg font-bold text-foreground">{cardsData.avgItemsPerTransaction}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
  
            {(!foundPattern && issueNotFoundPattern.length>0)  && 
                <div className="grid grid-cols-1 gap-6 mb-8">
                <Card className="bg-destructive/10 border-destructive text-destructive-foreground">
                  <CardContent className="flex items-center space-x-4 p-4">
                    <AlertTriangle className="w-6 h-6 text-destructive flex-shrink-0" />
                    <p className="font-medium text-foreground">
                      {issueNotFoundPattern}
                    </p>
                  </CardContent>
                </Card>
              </div>
            }
            
            {foundPattern && <div>
                <div className="grid grid-cols-1 gap-6 mb-8">
                <Card className="bg-card border-border">
                    <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <Icon icon="lucide:trophy" className="w-5 h-5 text-secondary" />
                        <span>Top Association Patterns</span>
                    </CardTitle>
                    </CardHeader>
                    <CardContent className="px-6">
                    <div className="space-y-3">
                        
                        {/* pattern */}
                        {patterns.topAssociationPatterns.map((feature,index)=>(
                            <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border">
                                <div>
                                    <p className="font-medium text-foreground">{feature.whenWeSee} → {feature.weOftenFind}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-muted-foreground">
                                    Confidence: <span className="font-semibold text-primary">{(feature.confidence * 100).toFixed(0)}%</span>
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                    Lift: <span className="font-semibold text-primary">{feature.lift}</span>
                                    </p>
                                </div>
                            </div>
                        ))}
  
                    </div>
                    </CardContent>
                </Card>
                </div>
                <Card className="bg-card border-border">
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                    <Icon icon="lucide:lightbulb" className="w-5 h-5 text-accent" />
                    <span>Business Insights</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center space-x-2">
                        <Icon icon="lucide:search" className="w-4 h-4 text-primary" />
                        <span>Key Findings</span>
                        </h3>
                        <div className="space-y-3">
                        
                        {patterns.businessInsights.keyFindings.map((feature,index)=>(
                            <div key={index} className="p-4 bg-muted/50 rounded-lg border-l-4 border-primary">
                                <p className="text-sm text-foreground">{feature}</p>
                            </div>
                        ))}
  
                        </div>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center space-x-2">
                        <Icon icon="lucide:target" className="w-4 h-4 text-primary" />
                        <span>Recommendations</span>
                        </h3>
                        <div className="space-y-3">
                        {patterns.businessInsights.recommendations.map((feature,index)=>(
                            <div key={index} className="p-4 bg-muted/50 rounded-lg border-l-4 border-secondary">
                                <p className="text-sm text-foreground">{feature}</p>
                            </div>
                        ))}
                        </div>
                    </div>
                    </div>
                </CardContent>
                </Card>
            </div>}
  
  
          </main>}
  
  
        </div>
      );
    }

}

export default PatternAnalysisPage;
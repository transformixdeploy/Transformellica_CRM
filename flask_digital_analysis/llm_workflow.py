"""
LangGraph Workflow for SEO Analysis with Token Monitoring
Orchestrates LLM calls with comprehensive tracking and monitoring
"""

from typing import Dict, List, Any, Optional, TypedDict
from langgraph.graph import StateGraph, END
from langgraph.graph.message import add_messages
from langgraph.checkpoint.memory import MemorySaver
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_anthropic import ChatAnthropic
import asyncio
from datetime import datetime
import json

from token_monitor import TokenMonitor, track_tokens

class AnalysisState(TypedDict):
    """State for the analysis workflow"""
    url: str
    seo_data: Dict[str, Any]
    social_data: List[Dict[str, Any]]
    branding_data: Optional[Dict[str, Any]]
    sentiment_data: Optional[Dict[str, Any]]
    seo_insights: Optional[Dict[str, Any]]
    social_insights: Optional[Dict[str, Any]]
    branding_insights: Optional[Dict[str, Any]]
    sentiment_insights: Optional[Dict[str, Any]]
    comprehensive_report: Optional[Dict[str, Any]]
    token_usage: List[Dict[str, Any]]
    errors: List[str]
    workflow_status: str

class LLMWorkflow:
    """LangGraph workflow for orchestrating LLM calls with token monitoring"""
    
    def __init__(self):
        self.token_monitor = TokenMonitor("seo_analysis_workflow")
        self.memory = MemorySaver()
        self.graph = self._build_graph()
    
    def _build_graph(self) -> StateGraph:
        """Build the LangGraph workflow"""
        workflow = StateGraph(AnalysisState)
        
        # Add nodes
        workflow.add_node("analyze_seo", self._analyze_seo_node)
        workflow.add_node("analyze_social", self._analyze_social_node)
        workflow.add_node("analyze_branding", self._analyze_branding_node)
        workflow.add_node("analyze_sentiment", self._analyze_sentiment_node)
        workflow.add_node("generate_comprehensive", self._generate_comprehensive_node)
        workflow.add_node("finalize_report", self._finalize_report_node)
        
        # Add edges
        workflow.set_entry_point("analyze_seo")
        workflow.add_edge("analyze_seo", "analyze_social")
        workflow.add_edge("analyze_social", "analyze_branding")
        workflow.add_edge("analyze_branding", "analyze_sentiment")
        workflow.add_edge("analyze_sentiment", "generate_comprehensive")
        workflow.add_edge("generate_comprehensive", "finalize_report")
        workflow.add_edge("finalize_report", END)
        
        return workflow.compile(checkpointer=self.memory)
    
    async def _analyze_seo_node(self, state: AnalysisState) -> AnalysisState:
        """Analyze SEO data with token tracking"""
        try:
            seo_data = state.get("seo_data", {})
            if not seo_data:
                state["errors"].append("No SEO data provided")
                return state
            
            # Create prompt for SEO analysis
            prompt = self._create_seo_prompt(seo_data)
            messages = [
                {"role": "system", "content": "You are an expert SEO consultant. Provide actionable, data-driven insights."},
                {"role": "user", "content": prompt}
            ]
            
            # Track the LLM call
            result = await self.token_monitor.track_anthropic_call(
                operation="seo_analysis",
                model="claude-3-5-sonnet-20241022",
                messages=messages,
                max_tokens=5000
            )
            
            # Parse and structure the response
            insights = self._parse_seo_insights(result["response"])
            
            state["seo_insights"] = {
                "url": seo_data.get("url"),
                "generated_at": datetime.now().isoformat(),
                "insights": insights,
                "call_id": result["call_id"],
                "token_usage": result["token_usage"]
            }
            
            # Add to token usage tracking
            state["token_usage"].append({
                "operation": "seo_analysis",
                "call_id": result["call_id"],
                "tokens": result["token_usage"]["total_tokens"],
                "cost": result["token_usage"]["total_cost"]
            })
            
        except Exception as e:
            state["errors"].append(f"SEO analysis failed: {str(e)}")
        
        return state
    
    async def _analyze_social_node(self, state: AnalysisState) -> AnalysisState:
        """Analyze social media data with token tracking"""
        try:
            social_data = state.get("social_data", [])
            if not social_data:
                state["errors"].append("No social data provided")
                return state
            
            # Analyze each social profile
            social_insights = []
            for profile in social_data:
                prompt = self._create_social_prompt(profile)
                messages = [
                    {"role": "system", "content": "You are an expert social media marketing consultant."},
                    {"role": "user", "content": prompt}
                ]
                
                result = await self.token_monitor.track_anthropic_call(
                    operation="social_analysis",
                    model="claude-3-5-sonnet-20241022",
                    messages=messages,
                    max_tokens=3000
                )
                
                insights = self._parse_social_insights(result["response"])
                social_insights.append({
                    "url": profile.get("url"),
                    "platform": profile.get("platform"),
                    "insights": insights,
                    "call_id": result["call_id"],
                    "token_usage": result["token_usage"]
                })
                
                # Track usage
                state["token_usage"].append({
                    "operation": "social_analysis",
                    "call_id": result["call_id"],
                    "tokens": result["token_usage"]["total_tokens"],
                    "cost": result["token_usage"]["total_cost"]
                })
            
            state["social_insights"] = social_insights
            
        except Exception as e:
            state["errors"].append(f"Social analysis failed: {str(e)}")
        
        return state
    
    async def _analyze_branding_node(self, state: AnalysisState) -> AnalysisState:
        """Analyze branding data with token tracking"""
        try:
            branding_data = state.get("branding_data")
            if not branding_data:
                state["errors"].append("No branding data provided")
                return state
            
            prompt = self._create_branding_prompt(branding_data)
            messages = [
                {"role": "system", "content": "You are an expert branding consultant."},
                {"role": "user", "content": prompt}
            ]
            
            result = await self.token_monitor.track_anthropic_call(
                operation="branding_analysis",
                model="claude-3-5-sonnet-20241022",
                messages=messages,
                max_tokens=4000
            )
            
            insights = self._parse_branding_insights(result["response"])
            
            state["branding_insights"] = {
                "insights": insights,
                "call_id": result["call_id"],
                "token_usage": result["token_usage"]
            }
            
            state["token_usage"].append({
                "operation": "branding_analysis",
                "call_id": result["call_id"],
                "tokens": result["token_usage"]["total_tokens"],
                "cost": result["token_usage"]["total_cost"]
            })
            
        except Exception as e:
            state["errors"].append(f"Branding analysis failed: {str(e)}")
        
        return state
    
    async def _analyze_sentiment_node(self, state: AnalysisState) -> AnalysisState:
        """Analyze sentiment data with token tracking"""
        try:
            sentiment_data = state.get("sentiment_data")
            if not sentiment_data:
                state["errors"].append("No sentiment data provided")
                return state
            
            prompt = self._create_sentiment_prompt(sentiment_data)
            messages = [
                {"role": "system", "content": "You are an expert in customer sentiment analysis."},
                {"role": "user", "content": prompt}
            ]
            
            result = await self.token_monitor.track_anthropic_call(
                operation="sentiment_analysis",
                model="claude-3-5-sonnet-20241022",
                messages=messages,
                max_tokens=3000
            )
            
            insights = self._parse_sentiment_insights(result["response"])
            
            state["sentiment_insights"] = {
                "insights": insights,
                "call_id": result["call_id"],
                "token_usage": result["token_usage"]
            }
            
            state["token_usage"].append({
                "operation": "sentiment_analysis",
                "call_id": result["call_id"],
                "tokens": result["token_usage"]["total_tokens"],
                "cost": result["token_usage"]["total_cost"]
            })
            
        except Exception as e:
            state["errors"].append(f"Sentiment analysis failed: {str(e)}")
        
        return state
    
    async def _generate_comprehensive_node(self, state: AnalysisState) -> AnalysisState:
        """Generate comprehensive report with token tracking"""
        try:
            # Collect all insights
            seo_insights = state.get("seo_insights")
            social_insights = state.get("social_insights", [])
            branding_insights = state.get("branding_insights")
            sentiment_insights = state.get("sentiment_insights")
            
            prompt = self._create_comprehensive_prompt(
                seo_insights, social_insights, branding_insights, sentiment_insights
            )
            
            messages = [
                {"role": "system", "content": "You are an expert digital marketing strategist. Create comprehensive reports."},
                {"role": "user", "content": prompt}
            ]
            
            result = await self.token_monitor.track_anthropic_call(
                operation="comprehensive_report",
                model="claude-3-5-sonnet-20241022",
                messages=messages,
                max_tokens=6000
            )
            
            insights = self._parse_comprehensive_insights(result["response"])
            
            state["comprehensive_report"] = {
                "insights": insights,
                "call_id": result["call_id"],
                "token_usage": result["token_usage"],
                "generated_at": datetime.now().isoformat()
            }
            
            state["token_usage"].append({
                "operation": "comprehensive_report",
                "call_id": result["call_id"],
                "tokens": result["token_usage"]["total_tokens"],
                "cost": result["token_usage"]["total_cost"]
            })
            
        except Exception as e:
            state["errors"].append(f"Comprehensive report generation failed: {str(e)}")
        
        return state
    
    async def _finalize_report_node(self, state: AnalysisState) -> AnalysisState:
        """Finalize the report with token usage summary"""
        try:
            # Calculate total usage
            total_tokens = sum(usage["tokens"] for usage in state["token_usage"])
            total_cost = sum(usage["cost"] for usage in state["token_usage"])
            
            # Add summary to comprehensive report
            if state.get("comprehensive_report"):
                state["comprehensive_report"]["token_summary"] = {
                    "total_tokens": total_tokens,
                    "total_cost": total_cost,
                    "total_calls": len(state["token_usage"]),
                    "cost_breakdown": self._get_cost_breakdown(state["token_usage"])
                }
            
            state["workflow_status"] = "completed"
            
        except Exception as e:
            state["errors"].append(f"Report finalization failed: {str(e)}")
            state["workflow_status"] = "failed"
        
        return state
    
    def _create_seo_prompt(self, seo_data: Dict[str, Any]) -> str:
        """Create SEO analysis prompt"""
        return f"""
        Analyze the following SEO data and provide actionable insights:

        Website: {seo_data.get('url')}
        Title: {seo_data.get('title')}
        Meta Description: {seo_data.get('meta_description')}
        Page Speed Score: {seo_data.get('page_speed_score')}
        Mobile Friendly: {seo_data.get('mobile_analysis', {}).get('is_mobile_friendly', 'Unknown')}
        Internal Links: {seo_data.get('internal_links_count', 0)}
        External Links: {seo_data.get('external_links_count', 0)}

        Provide:
        1. Overall SEO health score (1-100)
        2. Top 3 critical issues
        3. Top 5 actionable recommendations
        4. Technical improvements needed
        """
    
    def _create_social_prompt(self, social_data: Dict[str, Any]) -> str:
        """Create social media analysis prompt"""
        profile_data = social_data.get('profile_data', {})
        return f"""
        Analyze this social media profile:

        Platform: {social_data.get('platform')}
        URL: {social_data.get('url')}
        Name: {profile_data.get('name')}
        Bio: {profile_data.get('bio')}
        Followers: {profile_data.get('follower_count')}
        Following: {profile_data.get('following_count')}

        Provide:
        1. Profile optimization score (1-100)
        2. Content strategy recommendations
        3. Engagement improvement suggestions
        4. Growth opportunities
        """
    
    def _create_branding_prompt(self, branding_data: Dict[str, Any]) -> str:
        """Create branding analysis prompt"""
        return f"""
        Analyze the branding data and provide insights:

        Branding Analysis: {branding_data.get('branding_analysis', {})}

        Provide:
        1. Brand consistency score (1-100)
        2. Visual identity strengths and weaknesses
        3. Brand positioning recommendations
        4. Improvement areas
        """
    
    def _create_sentiment_prompt(self, sentiment_data: Dict[str, Any]) -> str:
        """Create sentiment analysis prompt"""
        summary = sentiment_data.get('summary', {})
        return f"""
        Analyze the customer sentiment data:

        Total Reviews: {summary.get('total_reviews', 0)}
        Positive: {summary.get('sentiment_percentages', {}).get('Positive', 0):.1f}%
        Negative: {summary.get('sentiment_percentages', {}).get('Negative', 0):.1f}%
        Average Rating: {summary.get('average_star_rating', 0):.1f}/5

        Provide:
        1. Sentiment health score (1-100)
        2. Key insights about customer satisfaction
        3. Areas for improvement
        4. Actionable recommendations
        """
    
    def _create_comprehensive_prompt(self, seo_insights, social_insights, branding_insights, sentiment_insights) -> str:
        """Create comprehensive report prompt"""
        return f"""
        Create a comprehensive digital marketing report combining all analyses:

        SEO Analysis: {seo_insights}
        Social Media Analysis: {social_insights}
        Branding Analysis: {branding_insights}
        Sentiment Analysis: {sentiment_insights}

        Provide:
        1. Executive Summary
        2. Key Findings
        3. Strategic Recommendations
        4. Priority Actions
        5. Performance Benchmarks
        6. Next Steps
        """
    
    def _parse_seo_insights(self, response: str) -> Dict[str, Any]:
        """Parse SEO insights response"""
        return {
            "summary": response[:200] + "..." if len(response) > 200 else response,
            "full_analysis": response
        }
    
    def _parse_social_insights(self, response: str) -> Dict[str, Any]:
        """Parse social insights response"""
        return {
            "summary": response[:200] + "..." if len(response) > 200 else response,
            "full_analysis": response
        }
    
    def _parse_branding_insights(self, response: str) -> Dict[str, Any]:
        """Parse branding insights response"""
        return {
            "summary": response[:200] + "..." if len(response) > 200 else response,
            "full_analysis": response
        }
    
    def _parse_sentiment_insights(self, response: str) -> Dict[str, Any]:
        """Parse sentiment insights response"""
        return {
            "summary": response[:200] + "..." if len(response) > 200 else response,
            "full_analysis": response
        }
    
    def _parse_comprehensive_insights(self, response: str) -> Dict[str, Any]:
        """Parse comprehensive insights response"""
        return {
            "summary": response[:300] + "..." if len(response) > 300 else response,
            "full_analysis": response
        }
    
    def _get_cost_breakdown(self, token_usage: List[Dict[str, Any]]) -> Dict[str, float]:
        """Get cost breakdown by operation"""
        breakdown = {}
        for usage in token_usage:
            op = usage["operation"]
            breakdown[op] = breakdown.get(op, 0) + usage["cost"]
        return breakdown
    
    async def run_analysis(self, 
                          url: str,
                          seo_data: Dict[str, Any],
                          social_data: List[Dict[str, Any]] = None,
                          branding_data: Dict[str, Any] = None,
                          sentiment_data: Dict[str, Any] = None) -> Dict[str, Any]:
        """Run the complete analysis workflow"""
        
        # Initialize state
        initial_state = AnalysisState(
            url=url,
            seo_data=seo_data,
            social_data=social_data or [],
            branding_data=branding_data,
            sentiment_data=sentiment_data,
            seo_insights=None,
            social_insights=None,
            branding_insights=None,
            sentiment_insights=None,
            comprehensive_report=None,
            token_usage=[],
            errors=[],
            workflow_status="running"
        )
        
        # Run the workflow
        try:
            final_state = await self.graph.ainvoke(initial_state)
            
            # Get usage summary
            usage_summary = self.token_monitor.get_usage_summary()
            
            return {
                "workflow_status": final_state["workflow_status"],
                "results": {
                    "seo_insights": final_state.get("seo_insights"),
                    "social_insights": final_state.get("social_insights"),
                    "branding_insights": final_state.get("branding_insights"),
                    "sentiment_insights": final_state.get("sentiment_insights"),
                    "comprehensive_report": final_state.get("comprehensive_report")
                },
                "token_usage": {
                    "summary": usage_summary,
                    "detailed": final_state.get("token_usage", [])
                },
                "errors": final_state.get("errors", [])
            }
            
        except Exception as e:
            return {
                "workflow_status": "failed",
                "error": str(e),
                "token_usage": self.token_monitor.get_usage_summary()
            }
    
    def get_token_dashboard_data(self) -> Dict[str, Any]:
        """Get data for token usage dashboard"""
        return {
            "usage_summary": self.token_monitor.get_usage_summary(),
            "recent_calls": self.token_monitor.call_history[-20:],
            "cost_trends": self._get_cost_trends(),
            "model_performance": self._get_model_performance()
        }
    
    def _get_cost_trends(self) -> List[Dict[str, Any]]:
        """Get cost trends over time"""
        # Group calls by hour
        hourly_costs = {}
        for call in self.token_monitor.call_history:
            if call.success:
                hour = call.token_usage.timestamp[:13]  # YYYY-MM-DDTHH
                hourly_costs[hour] = hourly_costs.get(hour, 0) + call.token_usage.total_cost
        
        return [{"hour": hour, "cost": cost} for hour, cost in sorted(hourly_costs.items())]
    
    def _get_model_performance(self) -> Dict[str, Any]:
        """Get model performance metrics"""
        model_stats = {}
        for call in self.token_monitor.call_history:
            if call.success:
                model = call.model
                if model not in model_stats:
                    model_stats[model] = {
                        "total_calls": 0,
                        "total_tokens": 0,
                        "total_cost": 0,
                        "avg_duration": 0,
                        "success_rate": 0
                    }
                
                stats = model_stats[model]
                stats["total_calls"] += 1
                stats["total_tokens"] += call.token_usage.total_tokens
                stats["total_cost"] += call.token_usage.total_cost
                stats["avg_duration"] += call.token_usage.duration_ms
        
        # Calculate averages
        for model, stats in model_stats.items():
            if stats["total_calls"] > 0:
                stats["avg_duration"] /= stats["total_calls"]
                stats["success_rate"] = 100  # All successful calls are in this list
        
        return model_stats

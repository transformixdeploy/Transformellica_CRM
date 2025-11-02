import os
import aiohttp
import json
import asyncio  # Add this import
import re
from typing import Dict, List, Optional, Any
from datetime import datetime
import anthropic
import base64
from dotenv import load_dotenv
from token_monitor import token_monitor, track_tokens
class GPTInsightsService:
    """
    AI Integration service for generating AI-powered SEO and marketing insights
    """
    
    def __init__(self):
        # Read from environment only; no hardcoded default
        load_dotenv()
        self.api_key = os.environ.get('ANTHROPIC_API_KEY')  
        
        if not self.api_key:
            print("Warning: No Anthropic API key found. AI insights will use mock data.")
        else:
            # Configure the Anthropic client
            self.client = anthropic.Anthropic(api_key=self.api_key)
            
        # Set the model name
        self.model_name = "claude-sonnet-4-5-20250929"
    
    async def generate_seo_insights(self, seo_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generate AI-powered SEO insights and recommendations
        
        Args:
            seo_data: SEO analysis data from SEOAnalyzer
            
        Returns:
            Dictionary containing GPT-generated insights
        """
        
        if not self.api_key:
            return self._generate_mock_seo_insights(seo_data)
        
        # Prepare prompt for GPT
        prompt = self._create_seo_analysis_prompt(seo_data)
        
        try:
            # Call Anthropic API with token tracking
            response = await self._call_ai_api(prompt, max_tokens=5000, operation="seo_analysis")
            
            # Parse and structure the response
            insights = self._parse_seo_insights(response)
            
            return {
                "url": seo_data.get("url"),
                "generated_at": datetime.now().isoformat(),
                "insights": insights,
                "recommendations": self._extract_recommendations(response),
                "priority_score": self._calculate_priority_score(seo_data),
                "improvement_areas": self._identify_improvement_areas(seo_data)
            }
            
        except Exception as e:
            print(f"Anthropic API error: {str(e)}")
            return self._generate_mock_seo_insights(seo_data)
    
    async def generate_social_insights(self, social_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generate AI-powered social media insights
        
        Args:
            social_data: Social media analysis data
            
        Returns:
            Dictionary containing social media insights
        """
        
        if not self.api_key:
            return self._generate_mock_social_insights(social_data)
        
        prompt = self._create_social_analysis_prompt(social_data)
        
        try:
            response = await self._call_ai_api(prompt, max_tokens=5000, operation="social_analysis")
            
            return {
                "url": social_data.get("url"),
                "platform": social_data.get("platform"),
                "generated_at": datetime.now().isoformat(),
                "insights": self._parse_social_insights(response),
                "content_strategy": self._extract_content_strategy(response),
                "engagement_opportunities": self._identify_engagement_opportunities(social_data),
            }
            
        except Exception as e:
            print(f"Anthropic API error: {str(e)}")
            return self._generate_mock_social_insights(social_data)
    
    async def generate_comprehensive_report(self, seo_data: Dict[str, Any], social_data: List[Dict[str, Any]], branding_data: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        Generate a comprehensive marketing report combining SEO, social media, and branding insights
        
        Args:
            seo_data: SEO analysis results
            social_data: List of social media analysis results
            branding_data: Branding analysis results
            
        Returns:
            Comprehensive marketing insights report
        """
        
        prompt = self._create_comprehensive_report_prompt(seo_data, social_data, branding_data)
        
        try:
            if self.api_key:
                response = await self._call_ai_api(prompt, max_tokens=5000, operation="comprehensive_report")
                comprehensive_insights = self._parse_comprehensive_insights(response)
            else:
                comprehensive_insights = self._generate_mock_comprehensive_insights(branding_data)
            
            return {
                "generated_at": datetime.now().isoformat(),
                "website_url": seo_data.get("url"),
                "social_profiles_analyzed": len(social_data),
                "executive_summary": comprehensive_insights.get("executive_summary"),
                "key_findings": comprehensive_insights.get("key_findings", []),
                "strategic_recommendations": comprehensive_insights.get("strategic_recommendations", []),
                "priority_actions": comprehensive_insights.get("priority_actions", []),
                "performance_benchmarks": self._generate_benchmarks(seo_data, social_data, branding_data),
                "next_steps": comprehensive_insights.get("next_steps", [])
            }
            
        except Exception as e:
            print(f"Error generating comprehensive report: {str(e)}")
            return self._generate_mock_comprehensive_report(seo_data, social_data, branding_data)
    def _get_optimal_max_tokens(self, operation: str) -> int:
        """Return optimal max_tokens based on operation type"""
        token_map = {
            "seo_analysis": 3500,  # Reduced from 5000
            "social_analysis": 3500,  # Reduced from 5000
            "branding_analysis": 3500,  # Reduced from 5000
            "sentiment_analysis": 3500,  # Reduced from 5000
            "comprehensive_report": 3500,  # Reduced from 5000
            "competitive_suggestions": 3500,  # Reduced from 2000
            "ai_analysis": 3500
        }
        return token_map.get(operation, 1500)  
    async def _call_ai_api(self, prompt: str, max_tokens: int = 3500, operation: str = "ai_analysis", cache_system_prompt: bool = True) -> str:
        """
        Call Anthropic Claude API with prompt caching enabled
        
        Prompt caching can reduce costs by 90% for cached input tokens and 10% for cached output tokens.
        Best for: repeated analysis patterns, system prompts, large reference data
        """
        try:
            # Standard system message that can be cached
            system_message = """You are an expert SEO and digital marketing consultant. Provide actionable, data-driven insights and recommendations.

    Analysis Framework:
    - Focus on measurable metrics and KPIs
    - Prioritize recommendations by impact and effort
    - Provide specific, actionable steps
    - Consider cross-platform opportunities
    - Base insights on data patterns"""
            
            # Prepare messages with cache control
            messages = []
            
            # Add system message with cache control if enabled
            if cache_system_prompt:
                messages.append({
                    "role": "system", 
                    "content": system_message,
                    "cache_control": {"type": "ephemeral"}  # Cache this system prompt
                })
            else:
                messages.append({
                    "role": "system", 
                    "content": system_message
                })
            
            # Add user prompt
            messages.append({
                "role": "user", 
                "content": prompt
            })
            
            # Get optimal token allocation
            optimal_tokens = self._get_optimal_max_tokens(operation)
            max_tokens = min(max_tokens, optimal_tokens)
            
            # Map operation to MLflow experiment
            experiment_map = {
                "seo_analysis": "seo_analysis",
                "social_analysis": "social_analysis",
                "branding_analysis": "branding_analysis",
                "sentiment_analysis": "sentiment_analysis",
                "comprehensive_report": "comprehensive_report",
                "ai_analysis": "ai_general"
            }
            experiment_name = experiment_map.get(operation, "ai_general")

            # Track with token monitor
            result = await token_monitor.track_anthropic_call(
                operation=operation,
                model=self.model_name,
                messages=messages,
                max_tokens=max_tokens,
                experiment_name=experiment_name
            )
            
            return result["response"]
        except Exception as e:
            print(f"Anthropic API error: {str(e)}")
            raise Exception(f"Anthropic API error: {str(e)}")
    
    def _create_seo_analysis_prompt(self, seo_data: Dict[str, Any]) -> str:
        """Create prompt for SEO analysis"""
        
        # Extract page speed scores
        page_speed_scores = seo_data.get('page_speed_scores', {})
        performance = page_speed_scores.get('performance', 'N/A')
        accessibility = page_speed_scores.get('accessibility', 'N/A')
        best_practices = page_speed_scores.get('best_practices', 'N/A')
        seo_score = page_speed_scores.get('seo', 'N/A')
        overall = page_speed_scores.get('overall', 'N/A')
        return f"""
        You are Transformellica's Senior SEO and Technical Marketing Consultant. You specialize in on-page and technical SEO, performance optimization, and localized content strategy for SMEs and agencies in MENA. Your purpose is to deliver precise, data-driven, and prioritized insights that content and technical teams can act on immediately.
        You will analyze the following SEO data:

        Website: {seo_data.get('url')}
        HTTPS: {seo_data.get('https')}
        Title: {seo_data.get('title')}
        Meta Description: {seo_data.get('meta_description')}
        H1 Tags: {seo_data.get('headings', {}).get('h1', [])}
        H2 Tags: {seo_data.get('headings', {}).get('h2', [])}
        Missing Alt Tags: {seo_data.get('alt_tags_missing')}

        Page Speed Metrics:
        - Performance: {performance}
        - Accessibility: {accessibility}
        - Best Practices: {best_practices}
        - SEO: {seo_score}
        - Overall: {overall}

        Social Links: {seo_data.get('social_links', [])}
        Open Graph Tags: {seo_data.get('og_tags', {})}
        Your task is to produce a structured, insight-based SEO report following the exact format specified below. Act as a senior consultant from a professional SEO agency - analyze like an auditor, explain like a strategist, and communicate in clear, direct business language.

        ## Analysis Framework

        Before writing your report, evaluate the data systematically:
        - HTTPS implementation and security
        - Title tag optimization (length, keywords, uniqueness)
        - Meta description quality (length, call-to-action, relevance)
        - Heading structure (H1 uniqueness, H2 hierarchy)
        - Image optimization (missing alt tags impact)
        - Page speed metrics and their business impact
        - Social media integration
        - Open Graph implementation

        ## Scoring Methodology

        Calculate the SEO health score (1-100) by weighing:
        - Technical foundations (HTTPS, page speed): 30%
        - On-page optimization (title, meta, headings): 40%
        - User experience factors (accessibility, performance): 20%
        - Social/sharing optimization: 10%

        ## Required Report Format

        Structure your response exactly as follows:

        *SEO INSIGHT REPORT*
        Website: [Extract URL from seo_data]

        *1. SEO HEALTH SCORE:* [score]/100
        - [One-sentence justification based on major strengths/weaknesses]

        *2. TOP 3 CRITICAL ISSUES*
        - 1) [Specific issue] — [Why it matters for rankings/user experience]
        - 2) [Specific issue] — [Why it matters for rankings/user experience]  
        - 3) [Specific issue] — [Why it matters for rankings/user experience]

        *3. TOP 5 ACTIONABLE RECOMMENDATIONS*
        - [Priority Level] [Specific action] — Effort: [Low/Med/High] | Impact: [Low/Med/High] | Expected Outcome: [Measurable result]
        - [Continue for all 5 recommendations]

        *4. CONTENT OPTIMIZATION*
        - [Specific improvements to titles, meta descriptions, H1/H2 tags with exact character counts and keyword suggestions]

        *5. TECHNICAL SEO IMPROVEMENTS*
        - [Prioritized checklist of technical fixes]

        *6. PAGE-SPEED IMPROVEMENTS*
        - [Specific fixes like "defer JavaScript loading," "compress images above 100KB," "enable browser caching"]

        *Summary:* [One sentence with the highest-priority next step]

        ## Quality Standards

        *Always:*
        - Base all insights strictly on the provided data
        - Prioritize recommendations by SEO impact vs. implementation effort
        - Provide specific, measurable outcomes for each recommendation
        - Use professional, implementation-focused language
        - Reference only authoritative sources (Google Search Central, PageSpeed Insights, W3C, Moz, Ahrefs, Semrush) when needed

        *Never:*
        - Invent missing metrics or assume traffic data not provided
        - Promise specific ranking improvements or traffic increases
        - Give vague advice like "improve meta tags" without specifics
        - Use marketing clichés or overly promotional language

        ## Examples of Good vs. Poor Recommendations

        *Good:* "Reduce title tag from 68 to 55 characters to prevent truncation in SERPs — Current: 'Long Business Name | Services | Location | More Keywords' → Recommended: 'Business Name | Key Service in Location'"

        *Poor:* "Optimize title tags for better SEO"

        *Good:* "Compress hero image (currently 2.1MB) to under 200KB using WebP format to improve Largest Contentful Paint by estimated 1.2 seconds"

        *Poor:* "Optimize images for faster loading"

        Focus on delivering actionable insights that small to mid-sized website operators can implement without dedicated SEO engineers. Every recommendation should be testable and verifiable
        """
    
    def _create_social_analysis_prompt(self, social_data: Dict[str, Any]) -> str:
        """Create prompt for social media analysis"""
        
        profile_data = social_data.get('profile_data', {})
        platform = social_data.get('platform', 'unknown')
        
        return f"""
        You are Transformellica's Senior Social Media and Digital Marketing AI Consultant. You specialize in multi-platform analytics, content optimization, and audience behavior across MENA markets. Your purpose is to deliver accurate, data-driven, and platform-specific insights that help brands grow measurable engagement and awareness. You act as a strategic advisor focused on ROI and execution-ready recommendations.
        You will receive social media profile data to analyze:
        Platform: {platform}
        Profile URL: {social_data.get('url')}
        Name: {profile_data.get('name')}
        Bio: {profile_data.get('bio')}
        Followers: {profile_data.get('follower_count')}
        Following: {profile_data.get('following_count')}
        Verified: {profile_data.get('verification_status')}
        Recent Content Themes: {social_data.get('content_analysis', {}).get('content_themes', [])}
        Hashtags Used: {social_data.get('content_analysis', {}).get('hashtags', [])}

        Your task is to analyze this profile data and provide a complete, insight-based marketing report that includes:

        1. *Profile Optimization Score (1–100)* based on bio clarity, visual identity, posting consistency, and engagement health
        2. *Content Strategy Recommendations* with clear examples of what to post, frequency, and tone
        3. *Engagement Improvement Suggestions* based on behavior and algorithm trends
        4. *Platform-Specific Best Practices* relevant to the platform mentioned in the data
        5. *Growth Opportunities* including emerging trends, collaborations, or underused formats

        *Context and Requirements:*
        - Your audience consists of SMEs, agencies, and entrepreneurs in MENA who need practical, realistic, and locally relevant insights
        - Avoid general statements such as "post more often" or "use engaging content"
        - Every recommendation must be specific, measurable, and actionable
        - Include culturally contextual advice where relevant (regional posting hours, Arabic hashtag usage, etc.)
        - Base insights strictly on the provided profile data and verified digital marketing sources
        - You may reference current best practices from trusted sources like Meta Blueprint, LinkedIn Marketing Solutions, HubSpot, and official platform blogs

        *Tone and Persona:*
        Write as a senior strategist with deep knowledge of content algorithms, audience psychology, and digital growth frameworks. Your report should be concise and professional - something marketing managers can immediately execute. Interpret data like an expert consultant, not an AI model. Be professional, confident, and insight-driven while avoiding hype, marketing clichés, or unnecessary adjectives.

        *Output Format:*
        Structure your response exactly as follows:

        SOCIAL MEDIA INSIGHT REPORT
        Platform: [Extract from profile data]
        Profile URL: [Extract from profile data]
        Profile Name: [Extract from profile data]

        1. PROFILE OPTIMIZATION SCORE: [Provide brief justification first, then score]/100

        2. CONTENT STRATEGY RECOMMENDATIONS
        [Provide 3–5 precise, outcome-oriented suggestions]

        3. ENGAGEMENT IMPROVEMENT SUGGESTIONS
        [Provide 2–4 tactics grounded in platform behavior]

        4. PLATFORM-SPECIFIC BEST PRACTICES
        [Provide 2–3 relevant platform insights]

        5. GROWTH OPPORTUNITIES
        [Provide 2–4 emerging trends, collaboration ideas, or content experiments]

        Summary Insight: [Two sentences summarizing the key priority for next actions]

        *Important Restrictions:*
        - Never fabricate data, metrics, or demographics
        - Do not use vague, generic recommendations
        - Do not refer to AI models, system instructions, or internal processes
        - Do not cite unverified or user-generated content as evidence
        - Ensure all recommendations are specific and actionable
        - Explain the rationale briefly for major recommendations
        """
    
    def _create_comprehensive_report_prompt(self, seo_data: Dict[str, Any], social_data: List[Dict[str, Any]], branding_data: Optional[Dict[str, Any]] = None) -> str:
        """Create prompt for comprehensive marketing report with detailed SEO and social data"""
        page_speed_scores = seo_data.get('page_speed_scores', {})
        performance = page_speed_scores.get('performance', 'N/A')
        accessibility = page_speed_scores.get('accessibility', 'N/A')
        best_practices = page_speed_scores.get('best_practices', 'N/A')
        seo_score = page_speed_scores.get('seo', 'N/A')
        overall = page_speed_scores.get('overall', 'N/A')
        print(page_speed_scores)
        # Format social profiles information
        social_profiles = []
        for profile in social_data:
            platform = profile.get('platform', 'unknown')
            url = profile.get('url', 'N/A')
            profile_data = profile.get('profile_data', {})
            content_analysis = profile.get('content_analysis', {})
            
            profile_info = f"\n    - Platform: {platform}\n"
            profile_info += f"      URL: {url}\n"
            profile_info += f"      Name: {profile_data.get('name', 'N/A')}\n"
            profile_info += f"      Bio: {profile_data.get('bio', 'N/A')}\n"
            profile_info += f"      Followers: {profile_data.get('follower_count', 'N/A')}\n"
            profile_info += f"      Following: {profile_data.get('following_count', 'N/A')}\n"
            profile_info += f"      Verified: {profile_data.get('verification_status', 'N/A')}\n"
            profile_info += f"      Content Themes: {content_analysis.get('content_themes', [])}\n"
            profile_info += f"      Hashtags: {content_analysis.get('hashtags', [])}\n"
            profile_info += f"      Engagement Rate: {content_analysis.get('engagement_rate', 'N/A')}\n"
            
            social_profiles.append(profile_info)
        
        # Format headings structure
        headings_structure = ""
        headings = seo_data.get('headings')

        if isinstance(headings, dict):
            for heading_type, heading_list in headings.items():
                if heading_list:
                    headings_structure += f"\n      {heading_type}: {len(heading_list)} headings"
                    for heading in heading_list[:3]:
                        headings_structure += f"\n        - {heading}"
                    if len(heading_list) > 3:
                        headings_structure += f"\n        - ... ({len(heading_list) - 3} more)"
        elif isinstance(headings, list):
            headings_structure += "\n      Headings (list format):"
            for heading in headings[:3]:
                headings_structure += f"\n        - {heading}"
            if len(headings) > 3:
                headings_structure += f"\n        - ... ({len(headings) - 3} more)"
        else:
            headings_structure += "\n      No heading data found."

        # Add branding data if available
        branding_summary = "Not analyzed."
        if branding_data and "branding_analysis" in branding_data:
            branding_summary = branding_data["branding_analysis"].get("executive_summary", "No summary available.")

        # Format schema markup
        schema_markup = ""
        schema_data = seo_data.get('schema_markup')
        if isinstance(schema_data, list):
            schema_markup = "\n      " + "\n      ".join([f"- {schema}" for schema in schema_data])
        elif isinstance(schema_data, dict):
            schema_markup = "\n      " + "\n      ".join([f"- {key}: {value}" for key, value in schema_data.items()])
        elif schema_data:
            schema_markup = f"\n      - {schema_data}"

        # Format Open Graph tags
        og_tags = ""
        og_data = seo_data.get('og_tags')
        if isinstance(og_data, dict):
            og_tags = "\n      " + "\n      ".join([f"- {tag}: {value}" for tag, value in og_data.items() if value])
        elif isinstance(og_data, list):
            og_tags = "\n      " + "\n      ".join([f"- {tag}" for tag in og_data])
        elif og_data:
            og_tags = f"\n      - {og_data}"

        # Format social links
        social_links = ""
        social_links_data = seo_data.get('social_links')
        if isinstance(social_links_data, dict):
            social_links = "\n      " + "\n      ".join([f"- {platform}: {url}" for platform, url in social_links_data.items()])
        elif isinstance(social_links_data, list):
            social_links = "\n      " + "\n      ".join([f"- {link}" for link in social_links_data])
        elif social_links_data:
            social_links = f"\n      - {social_links_data}"

        # Return final prompt
        return f"""
        Create a comprehensive digital marketing analysis report based on the following detailed data:

        WEBSITE SEO DATA:
        - URL: {seo_data.get('url')}
        - Performance: {performance}
        - Accessibility: {accessibility}
        - Best Practices: {best_practices}
        - SEO: {seo_score}
        - Page Speed Score: {overall}        
        - HTTPS Enabled: {seo_data.get('https', False)}
        - Title: {seo_data.get('title', 'N/A')}
        - Title Length: {seo_data.get('title_length', 0)} characters
        - Meta Description: {seo_data.get('meta_description', 'N/A')}
        - Meta Description Length: {seo_data.get('meta_description_length', 0)} characters
        - Canonical URL: {seo_data.get('canonical_url', 'N/A')}
        - Images Count: {seo_data.get('images_count', 0)}
        - Images Missing Alt Tags: {seo_data.get('alt_tags_missing', 0)}
        - Internal Links: {seo_data.get('internal_links', 0)}
        - External Links: {seo_data.get('external_links', 0)}
        - Technical Issues: {self._identify_technical_issues(seo_data)}
        - Content Gaps: (AI should infer this based on headings, etc.)
        - Headings Structure: {headings_structure}
        - Schema Markup: {schema_markup}
        - Open Graph Tags: {og_tags}
        - Social Links on Website: {social_links}

        SOCIAL MEDIA PRESENCE:
        - Platforms: {', '.join([p.get('platform', 'unknown') for p in social_data])}
        - Total Profiles: {len(social_data)}
        - Detailed Profile Information: {''.join(social_profiles)}

        **Branding Analysis Summary**:
        - {branding_summary}

        Please provide a comprehensive marketing report including:
        1.  **Executive Summary**: A high-level overview of the key findings and strategic direction.
        2.  **Key Findings**: Bulleted list of the most important insights from both SEO and social media analysis.
        3.  **Strategic Recommendations**: Prioritized list of strategies based on the analysis.
        4.  **Priority Actions**: Immediate next steps with timeline.
        5.  **Performance Benchmarks**: Quantitative assessment of current performance.
        6.  **Next Steps**: Long-term growth strategy and follow-up actions.
        
        Focus on cross-platform synergies, integrated marketing opportunities, and actionable insights that will improve both SEO performance and social media engagement. Provide specific, data-driven recommendations based on the detailed analysis provided.
        """
        
    def _parse_seo_insights(self, response: str) -> Dict[str, Any]:
        """Parse GPT response for SEO insights"""
        return {
            "summary": response[:200] + "..." if len(response) > 200 else response,
            "full_analysis": response
        }
    
    def _parse_social_insights(self, response: str) -> Dict[str, Any]:
        """Parse GPT response for social insights"""
        return {
            "summary": response[:200] + "..." if len(response) > 200 else response,
            "full_analysis": response
        }
    
    def _parse_comprehensive_insights(self, response: str) -> Dict[str, Any]:
        """Parse comprehensive report response"""
        lines = response.split('\n')
        
        insights = {
            "executive_summary": "",
            "key_findings": [],
            "strategic_recommendations": [],
            "priority_actions": [],
            "next_steps": []
        }
        
        current_section = None
        
        for line in lines:
            line = line.strip()
            if not line:
                continue
                
            if "executive summary" in line.lower():
                current_section = "executive_summary"
            elif "key findings" in line.lower():
                current_section = "key_findings"
            elif "strategic recommendations" in line.lower():
                current_section = "strategic_recommendations"
            elif "priority actions" in line.lower():
                current_section = "priority_actions"
            elif "next steps" in line.lower():
                current_section = "next_steps"
            else:
                if current_section and line:
                    if current_section == "executive_summary":
                        insights[current_section] += line + " "
                    else:
                        insights[current_section].append(line)
        
        return insights
    
    def _extract_recommendations(self, response: str) -> List[str]:
        """Extract recommendations from GPT response"""
        recommendations = []
        lines = response.split('\n')
        
        for line in lines:
            line = line.strip()
            if line.startswith(('•', '-', '*')) or line[0:2].isdigit():
                recommendations.append(line)
        
        return recommendations[:10]  # Limit to top 10
    
    def _calculate_priority_score(self, seo_data: Dict[str, Any]) -> int:
        """Calculate priority score based on SEO issues"""
        score = 100
        
        # Deduct points for various issues
        if not seo_data.get('https'):
            score -= 20
        if not seo_data.get('title'):
            score -= 15
        if not seo_data.get('meta_description'):
            score -= 10
        if seo_data.get('alt_tags_missing', 0) > 5:
            score -= 15
        
        page_speed = seo_data.get('page_speed_score')
        if page_speed and page_speed < 50:
            score -= 20
        elif page_speed and page_speed < 70:
            score -= 10
        
        return max(0, score)
    
    def _calculate_seo_score(self, seo_data: Dict[str, Any]) -> int:
        """Calculate overall SEO score"""
        return self._calculate_priority_score(seo_data)
    
    def _identify_improvement_areas(self, seo_data: Dict[str, Any]) -> List[str]:
        """Identify key improvement areas"""
        areas = []
        
        if not seo_data.get('https'):
            areas.append("HTTPS/SSL Certificate")
        if not seo_data.get('title') or len(seo_data.get('title', '')) < 30:
            areas.append("Title Tag Optimization")
        if not seo_data.get('meta_description'):
            areas.append("Meta Description")
        if seo_data.get('alt_tags_missing', 0) > 0:
            areas.append("Image Alt Tags")
        
        page_speed = seo_data.get('page_speed_score')
        if page_speed and page_speed < 70:
            areas.append("Page Speed Optimization")
        
        if not seo_data.get('social_links'):
            areas.append("Social Media Integration")
        
        return areas
    
    def _identify_technical_issues(self, seo_data: Dict[str, Any]) -> List[str]:
        """Identify technical SEO issues"""
        issues = []
        
        if not seo_data.get('https'):
            issues.append("Missing HTTPS")
        if seo_data.get('alt_tags_missing', 0) > 0:
            issues.append(f"{seo_data.get('alt_tags_missing')} missing alt tags")
        if seo_data.get('page_speed_score', 100) < 60:
            issues.append("Poor page speed performance")
        
        return issues
    
    def _extract_content_strategy(self, response: str) -> List[str]:
        """Extract content strategy suggestions"""
        strategies = []
        lines = response.split('\n')
        
        for line in lines:
            if 'content' in line.lower() and any(word in line.lower() for word in ['strategy', 'recommend', 'suggest']):
                strategies.append(line.strip())
        
        return strategies[:5]
    
    def _identify_engagement_opportunities(self, social_data: Dict[str, Any]) -> List[str]:
        """Identify engagement opportunities"""
        opportunities = []
        
        profile_data = social_data.get('profile_data', {})
        
        if not profile_data.get('bio'):
            opportunities.append("Add compelling bio/description")
        
        if not profile_data.get('verification_status'):
            opportunities.append("Apply for verification badge")
        
        hashtags = social_data.get('content_analysis', {}).get('hashtags', [])
        if len(hashtags) < 5:
            opportunities.append("Increase hashtag usage for better discoverability")
        
        return opportunities
    
    def _create_competitive_analysis_prompt(self, social_data: Dict[str, Any]) -> str:
        """Create prompt for competitive analysis suggestions"""
        profile_data = social_data.get('profile_data', {})
        content_analysis = social_data.get('content_analysis', {})
        platform = social_data.get('platform', 'unknown')
        user_country = social_data.get('user_country', '')
        
        # Create country-specific context
        country_context = ""
        if user_country:
            country_context = f"Target Market/Country: {user_country}\n        "
        
        return f"""
        Based on the following social media profile data, generate specific competitive analysis suggestions:

        Platform: {platform}
        Profile URL: {social_data.get('url')}
        {country_context}Name: {profile_data.get('name')}
        Bio: {profile_data.get('bio')}
        Followers: {profile_data.get('follower_count')}
        Following: {profile_data.get('following_count')}
        Verified: {profile_data.get('verification_status')}
        Content Themes: {content_analysis.get('content_themes', [])}
        Hashtags Used: {content_analysis.get('hashtags', [])}
        Engagement Rate: {content_analysis.get('engagement_rate', 'N/A')*100}

        Generate 4-6 specific, actionable competitive analysis suggestions. Return ONLY a valid JSON object with the following structure (no markdown, no extra text):

        {{
            "suggestions": [
                {{
                    "title": "Clear, actionable title",
                    "priority": "HIGH",
                    "category": "Competitor Research",
                    "specific_action": "Detailed step-by-step action to take",
                    "what_to_track": "Specific metrics and data points to monitor",
                    "expected_impact": "How this will benefit their strategy",
                    "timeline": "1-2 weeks",
                    "tools_needed": "Any tools or resources required"
                }}
            ]
        }}

        IMPORTANT: Return only valid JSON. Do not include markdown code blocks, explanations, or any text outside the JSON object.

        Focus on practical actions tailored to this profile's:
        1. Industry/niche (based on bio and content themes)
        2. Current follower size and engagement level
        3. Platform-specific opportunities
        4. Content strategy gaps that could be filled by studying competitors
        5. Target market/country-specific competitive landscape{f" (focus on {user_country} market)" if user_country else ""}

        Make each suggestion highly specific and actionable, not generic advice.{f" Include competitors and strategies specific to the {user_country} market when applicable." if user_country else ""}
        """
    
    def _repair_json_string(self, json_str: str) -> str:
        """Repair common JSON formatting issues"""
        try:
            # Check if JSON is already valid
            json.loads(json_str)
            return json_str
        except json.JSONDecodeError:
            pass
        
        # Fix unterminated strings
        if json_str.count('"') % 2 != 0:
            # Find the last quote and see if it's part of an unterminated string
            last_quote = json_str.rfind('"')
            if last_quote > 0:
                # Look for the pattern: "key": "value that got cut off
                before_quote = json_str[:last_quote]
                if before_quote.endswith(': '):
                    # This looks like an unterminated value, close it
                    json_str = before_quote + '""'
                else:
                    # Try to find the last complete key-value pair
                    last_complete = json_str.rfind('",', 0, last_quote)
                    if last_complete > 0:
                        json_str = json_str[:last_complete + 1]
                    else:
                        # Close the string
                        json_str = json_str[:last_quote] + '"'
        
        # Ensure proper JSON structure closure
        open_braces = json_str.count('{')
        close_braces = json_str.count('}')
        if open_braces > close_braces:
            json_str += '}' * (open_braces - close_braces)
        
        open_brackets = json_str.count('[')
        close_brackets = json_str.count(']')
        if open_brackets > close_brackets:
            json_str += ']' * (open_brackets - close_brackets)
        
        return json_str
    
    def _extract_competitive_suggestions(self, response: str) -> List[Dict[str, str]]:
        """Extract competitive suggestions from AI JSON response"""
        try:
            # Check if response is empty or None
            if not response or not response.strip():
                print("Empty response received from AI")
                return self._generate_mock_competitive_suggestions({})
            
            # Clean the response more thoroughly
            cleaned_response = response.strip()
            
            # Remove markdown code blocks more robustly
            if '```json' in cleaned_response:
                # Find the start after ```json
                start = cleaned_response.find('```json') + 7
                # Find the closing ```
                end = cleaned_response.find('```', start)
                if end != -1:
                    cleaned_response = cleaned_response[start:end].strip()
                else:
                    # If no closing ```, take everything after ```json
                    cleaned_response = cleaned_response[start:].strip()
            elif cleaned_response.startswith('```'):
                # Handle generic ``` blocks
                start = cleaned_response.find('```') + 3
                end = cleaned_response.find('```', start)
                if end != -1:
                    cleaned_response = cleaned_response[start:end].strip()
                else:
                    # If no closing ```, take everything after ```
                    cleaned_response = cleaned_response[start:].strip()
            
            # Additional cleaning for any remaining markdown artifacts
            cleaned_response = cleaned_response.replace('```json', '').replace('```', '').strip()
            
            # Check if we have any content after cleaning
            if not cleaned_response or len(cleaned_response.strip()) == 0:
                print("No content after cleaning markdown")
                return self._generate_mock_competitive_suggestions({})
            
            # Try to find JSON object in the response
            if '{' in cleaned_response and '}' in cleaned_response:
                start = cleaned_response.find('{')
                # Find the matching closing brace
                brace_count = 0
                end = start
                for i, char in enumerate(cleaned_response[start:], start):
                    if char == '{':
                        brace_count += 1
                    elif char == '}':
                        brace_count -= 1
                        if brace_count == 0:
                            end = i + 1
                            break
                
                if end > start:
                    cleaned_response = cleaned_response[start:end]
            else:
                print("No JSON structure found in response")
                return self._extract_suggestions_fallback(response)
            
            # Fix common JSON issues more aggressively
            # Escape any unescaped quotes within string values
            cleaned_response = re.sub(r'(?<!\\)"(?=[^:,\]}])', r'\\"', cleaned_response)
            # Fix newlines within JSON strings
            cleaned_response = re.sub(r':\s*"([^"]*)\n([^"]*)"', r': "\1 \2"', cleaned_response)
            # Remove problematic characters that break JSON strings
            cleaned_response = re.sub(r'[\x00-\x1f\x7f-\x9f]', ' ', cleaned_response)
            # Fix multiple spaces
            cleaned_response = re.sub(r'\s+', ' ', cleaned_response)
            
            # Debug: Show what we're trying to parse
            print(f"Attempting to parse JSON (length: {len(cleaned_response)}):")
            print(f"First 200 chars: {cleaned_response[:200]}")
            
            # Try a different approach - use a more lenient JSON parser
            try:
                # First attempt with the cleaned response
                data = json.loads(cleaned_response)
                suggestions = data.get('suggestions', [])
            except json.JSONDecodeError as e:
                print(f"First JSON parse failed: {e}")
                # If that fails, try to repair the JSON
                cleaned_response = self._repair_json_string(cleaned_response)
                print(f"Repaired JSON length: {len(cleaned_response)}")
                data = json.loads(cleaned_response)
                suggestions = data.get('suggestions', [])
            
            # Validate and clean suggestions
            validated_suggestions = []
            for suggestion in suggestions[:6]:  # Limit to 6 suggestions
                if isinstance(suggestion, dict) and suggestion.get('title'):
                    # Clean string values by removing problematic characters
                    def clean_string(s):
                        if not isinstance(s, str):
                            return str(s)
                        return re.sub(r'[\x00-\x1f\x7f-\x9f]', ' ', s).strip()
                    
                    # Ensure all required fields exist with defaults
                    validated_suggestion = {
                        'title': clean_string(suggestion.get('title', 'Untitled Suggestion')),
                        'priority': clean_string(suggestion.get('priority', 'MEDIUM')).upper(),
                        'category': clean_string(suggestion.get('category', 'Competitor Research')),
                        'specific_action': clean_string(suggestion.get('specific_action', 'No specific action provided')),
                        'what_to_track': clean_string(suggestion.get('what_to_track', 'Monitor engagement metrics')),
                        'expected_impact': clean_string(suggestion.get('expected_impact', 'Improved competitive positioning')),
                        'timeline': clean_string(suggestion.get('timeline', '2-4 weeks')),
                        'tools_needed': clean_string(suggestion.get('tools_needed', 'Social media analytics tools'))
                    }
                    validated_suggestions.append(validated_suggestion)
            
            # If no valid suggestions were found, use fallback
            if not validated_suggestions:
                print("No valid suggestions found in JSON response")
                return self._extract_suggestions_fallback(response)
            
            return validated_suggestions
            
        except (json.JSONDecodeError, KeyError, TypeError) as e:
            print(f"Error parsing competitive suggestions JSON: {str(e)}")
            print(f"Cleaned response length: {len(cleaned_response) if 'cleaned_response' in locals() else 'N/A'}")
            print(f"Using fallback extraction method...")
            # Fallback to simple text extraction - this is working well!
            fallback_suggestions = self._extract_suggestions_fallback(response)
            if fallback_suggestions:
                print(f"Fallback method successfully extracted {len(fallback_suggestions)} suggestions")
                return fallback_suggestions
            else:
                print("Fallback method failed, using mock suggestions")
                return self._generate_mock_competitive_suggestions(social_data)
    
    def _extract_suggestions_fallback(self, response: str) -> List[Dict[str, str]]:
        """Fallback method to extract suggestions from non-JSON response"""
        suggestions = []
        
        # If the response looks like it has JSON structure but failed to parse,
        # try to extract titles manually
        if '"title"' in response:
            title_matches = re.findall(r'"title":\s*"([^"]+)"', response)
            for i, title in enumerate(title_matches[:6]):
                suggestion = {
                    'title': title,
                    'priority': 'MEDIUM',
                    'category': 'Competitor Research',
                    'specific_action': title,
                    'what_to_track': 'Monitor engagement and reach metrics',
                    'expected_impact': 'Improved competitive positioning',
                    'timeline': '2-4 weeks',
                    'tools_needed': 'Social media analytics tools'
                }
                suggestions.append(suggestion)
        else:
            # Traditional line-by-line parsing
            lines = response.split('\n')
            
            for line in lines:
                line = line.strip()
                # Look for numbered items, bullet points, or lines with competitive keywords
                if (line.startswith(('•', '-', '*')) or 
                    line[0:2].isdigit() or 
                    any(keyword in line.lower() for keyword in ['competitor', 'benchmark', 'analyze', 'study', 'research', 'compare'])):
                    # Clean up the line
                    cleaned_line = line.lstrip('•-*0123456789. ')
                    if len(cleaned_line) > 10:  # Filter out very short lines
                        suggestion = {
                            'title': cleaned_line,
                            'priority': 'MEDIUM',
                            'category': 'Competitor Research',
                            'specific_action': cleaned_line,
                            'what_to_track': 'Monitor engagement and reach metrics',
                            'expected_impact': 'Improved competitive positioning',
                            'timeline': '2-4 weeks',
                            'tools_needed': 'Social media analytics tools'
                        }
                        suggestions.append(suggestion)
        
        # If we still don't have suggestions, return some defaults
        if not suggestions:
            suggestions = self._generate_mock_competitive_suggestions({})
        
        return suggestions[:6]  # Limit to top 6 suggestions
    
    def _generate_mock_competitive_suggestions(self, social_data: Dict[str, Any]) -> List[Dict[str, str]]:
        """Generate mock competitive suggestions when AI is unavailable"""
        platform = social_data.get('platform', 'social media')
        user_country = social_data.get('user_country', '')
        country_suffix = f" in {user_country}" if user_country else ""
        
        return [
            {
                'title': f"Map & Analyze Top 5 {platform.title()} Competitors{country_suffix}",
                'priority': 'HIGH',
                'category': 'Competitor Research',
                'specific_action': f"Create a spreadsheet tracking your top 5 direct competitors on {platform}{country_suffix}. Monitor their posting frequency, content types, engagement rates, and follower growth weekly.",
                'what_to_track': f'Post frequency (aim for 4-5 posts/week), content mix ratio (educational vs. promotional vs. case studies), engagement rates, follower growth{f", local market trends in {user_country}" if user_country else ""}',
                'expected_impact': f'Better understanding of competitive landscape{country_suffix} and identification of content gaps',
                'timeline': '1-2 weeks',
                'tools_needed': 'Spreadsheet software, social media analytics tools'
            },
            {
                'title': "Benchmark Posting Frequency Against Industry Standards",
                'priority': 'MEDIUM',
                'category': 'Posting Schedule',
                'specific_action': "Track competitor posting schedules for 2 weeks and compare to your current frequency. Identify optimal posting times and content consistency patterns.",
                'what_to_track': 'Posts per day/week, optimal posting times, content consistency, audience engagement patterns by time of day',
                'expected_impact': 'Optimized posting schedule for maximum reach and engagement',
                'timeline': '2-3 weeks',
                'tools_needed': 'Social media scheduling tools, analytics platforms'
            },
            {
                'title': "Study Successful Content Formats in Your Space",
                'priority': 'HIGH',
                'category': 'Content Strategy',
                'specific_action': "Analyze top-performing content types and formats from competitors. Document what works best for your industry and create templates.",
                'what_to_track': 'Content types (video, images, carousels), engagement rates, visual styles, caption lengths, hashtag usage',
                'expected_impact': 'Improved content strategy and higher engagement rates',
                'timeline': '1-2 weeks',
                'tools_needed': 'Content analysis tools, competitor monitoring platforms'
            },
            {
                'title': "Identify Trending Hashtags in Your Industry",
                'priority': 'MEDIUM',
                'category': 'Hashtags',
                'specific_action': "Research and compile a list of trending and niche-specific hashtags used by successful competitors. Test different hashtag combinations.",
                'what_to_track': 'Hashtag performance, reach, competition level, trending patterns, which hashtags drive most engagement',
                'expected_impact': 'Increased discoverability and reach through strategic hashtag usage',
                'timeline': '1 week',
                'tools_needed': 'Hashtag research tools, social media analytics'
            },
            {
                'title': "Research Competitor Engagement Strategies",
                'priority': 'MEDIUM',
                'category': 'Engagement',
                'specific_action': "Monitor when and how competitors engage with their audience. Document their response strategies and community management approaches.",
                'what_to_track': 'Response times, engagement tactics, community management approaches, audience interaction quality',
                'expected_impact': 'Enhanced audience engagement and stronger community building',
                'timeline': '2-4 weeks',
                'tools_needed': 'Social media monitoring tools, engagement tracking software'
            },
            {
                'title': "Compare Content Themes with Successful Competitors",
                'priority': 'LOW',
                'category': 'Brand Positioning',
                'specific_action': "Analyze the content themes and messaging strategies of top competitors to identify differentiation opportunities and unique positioning.",
                'what_to_track': 'Content themes, messaging tone, brand positioning, unique value propositions, audience response to different themes',
                'expected_impact': 'Clearer brand differentiation and unique positioning in the market',
                'timeline': '2-3 weeks',
                'tools_needed': 'Content analysis tools, brand monitoring platforms'
            }
        ]
    
    # async def _generate_competitive_suggestions(self, social_data: Dict[str, Any]) -> List[Dict[str, str]]:
    #     """Generate AI-powered competitive analysis suggestions"""
    #     if not self.api_key:
    #         print("No API key available, using mock competitive suggestions")
    #         return self._generate_mock_competitive_suggestions(social_data)
        
    #     prompt = self._create_competitive_analysis_prompt(social_data)
        
    #     try:
    #         print("Calling AI API for competitive suggestions...")
    #         response = await self._call_ai_api(prompt, max_tokens=2000)
    #         print(f"AI API response length: {len(response) if response else 0}")
            
    #         if not response:
    #             print("Empty response from AI API, using mock suggestions")
    #             return self._generate_mock_competitive_suggestions(social_data)
            
    #         suggestions = self._extract_competitive_suggestions(response)
    #         print(f"Extracted {len(suggestions)} competitive suggestions")
    #         return suggestions
            
    #     except Exception as e:
    #         print(f"Anthropic API error in competitive suggestions: {str(e)}")
    #         return self._generate_mock_competitive_suggestions(social_data)
    
    def format_competitive_suggestions_for_display(self, suggestions: List[Dict[str, str]]) -> str:
        """Format competitive suggestions for better display"""
        if not suggestions:
            return "No competitive suggestions available."
        
        formatted_output = "## 🎯 Competitive Analysis Strategy\n\n"
        
        # Group by priority
        high_priority = [s for s in suggestions if s.get('priority', '').upper() == 'HIGH']
        medium_priority = [s for s in suggestions if s.get('priority', '').upper() == 'MEDIUM']
        low_priority = [s for s in suggestions if s.get('priority', '').upper() == 'LOW']
        
        priority_groups = [
            ("🔴 HIGH PRIORITY", high_priority),
            ("🟡 MEDIUM PRIORITY", medium_priority),
            ("🟢 LOW PRIORITY", low_priority)
        ]
        
        for priority_label, group in priority_groups:
            if group:
                formatted_output += f"### {priority_label}\n\n"
                
                for i, suggestion in enumerate(group, 1):
                    formatted_output += f"**{i}. {suggestion.get('title', 'Untitled Suggestion')}**\n"
                    formatted_output += f"*Category: {suggestion.get('category', 'General')}*\n\n"
                    
                    formatted_output += f"**🎯 Specific Action:** {suggestion.get('specific_action', 'No action specified')}\n\n"
                    formatted_output += f"**📊 What to Track:** {suggestion.get('what_to_track', 'No tracking specified')}\n\n"
                    formatted_output += f"**💡 Expected Impact:** {suggestion.get('expected_impact', 'No impact specified')}\n\n"
                    formatted_output += f"**⏰ Timeline:** {suggestion.get('timeline', 'No timeline specified')}\n\n"
                    formatted_output += f"**🛠️ Tools Needed:** {suggestion.get('tools_needed', 'No tools specified')}\n\n"
                    
                    formatted_output += "---\n\n"
        
        return formatted_output
    
    def get_competitive_suggestions_summary(self, suggestions: List[Dict[str, str]]) -> Dict[str, Any]:
        """Get a summary of competitive suggestions"""
        if not suggestions:
            return {"total": 0, "by_priority": {}, "by_category": {}}
        
        # Count by priority
        priority_counts = {}
        for suggestion in suggestions:
            priority = suggestion.get('priority', 'MEDIUM').upper()
            priority_counts[priority] = priority_counts.get(priority, 0) + 1
        
        # Count by category
        category_counts = {}
        for suggestion in suggestions:
            category = suggestion.get('category', 'General')
            category_counts[category] = category_counts.get(category, 0) + 1
        
        return {
            "total": len(suggestions),
            "by_priority": priority_counts,
            "by_category": category_counts,
            "average_timeline": self._calculate_average_timeline(suggestions)
        }
    
    def _calculate_average_timeline(self, suggestions: List[Dict[str, str]]) -> str:
        """Calculate average timeline from suggestions"""
        timelines = []
        for suggestion in suggestions:
            timeline = suggestion.get('timeline', '2-4 weeks')
            # Extract numbers from timeline (e.g., "1-2 weeks" -> [1, 2])
            numbers = re.findall(r'\d+', timeline)
            if numbers:
                avg = sum(int(n) for n in numbers) / len(numbers)
                timelines.append(avg)
        
        if timelines:
            overall_avg = sum(timelines) / len(timelines)
            return f"{overall_avg:.0f} weeks average"
        return "2-3 weeks average"
    
    def convert_competitive_suggestions_to_strings(self, suggestions: List[Dict[str, str]]) -> List[str]:
        """Convert structured competitive suggestions to simple strings for frontend compatibility"""
        if not suggestions:
            return []
        
        converted_suggestions = []
        for suggestion in suggestions:
            if isinstance(suggestion, dict):
                # Just use the title as it's already descriptive and actionable
                title = suggestion.get('title', 'Competitive Analysis Suggestion')
                converted_suggestions.append(title)
            elif isinstance(suggestion, str):
                # Already a string, keep as is
                converted_suggestions.append(suggestion)
        
        return converted_suggestions
    
    def _generate_benchmarks(self, seo_data: Dict[str, Any], social_data: List[Dict[str, Any]], branding_data: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Generate performance benchmarks"""
        page_speed_scores = seo_data.get('page_speed_scores', {})
        seo_score = page_speed_scores.get('seo', 'N/A')
        overall = page_speed_scores.get('overall', 'N/A')

        branding_score = "N/A"
        if branding_data and "branding_analysis" in branding_data:
            scores = [item.get("score", 0) for item in branding_data["branding_analysis"].get("scorecard", [])]
            if scores:
                branding_score = f"{sum(scores) / len(scores):.1f}/10"

        return {
            "seo_score": seo_score,
            "page_speed":overall,
            "social_presence": len(social_data),
            "technical_health": "Good" if seo_data.get('https') and seo_data.get('title') else "Needs Improvement",
            "branding_consistency": branding_score
        }
    
    # Mock data generators for when GPT API is not available
    def _generate_mock_seo_insights(self, seo_data: Dict[str, Any]) -> Dict[str, Any]:
        """Generate mock SEO insights when GPT API is unavailable"""
        return {
            "url": seo_data.get("url"),
            "generated_at": datetime.now().isoformat(),
            "insights": {
                "summary": "Mock SEO analysis: Your website shows good fundamental SEO structure with opportunities for improvement in page speed and meta descriptions.",
                "full_analysis": "This is a mock analysis. Connect Anthropic API for detailed insights."
            },
            "recommendations": [
                "Optimize page loading speed for better user experience",
                "Add meta descriptions to improve search engine visibility",
                "Implement proper image alt tags for accessibility",
                "Consider adding structured data markup"
            ],
            "priority_score": self._calculate_priority_score(seo_data),
            "improvement_areas": self._identify_improvement_areas(seo_data)
        }
    
    def _generate_mock_social_insights(self, social_data: Dict[str, Any]) -> Dict[str, Any]:
        """Generate mock social media insights"""
        return {
            "url": social_data.get("url"),
            "platform": social_data.get("platform"),
            "generated_at": datetime.now().isoformat(),
            "insights": {
                "summary": "Mock social analysis: Profile shows potential for increased engagement through consistent posting and community interaction.",
                "full_analysis": "This is a mock analysis. Connect Anthropic API for detailed insights."
            },
            "content_strategy": [
                "Post consistently 3-5 times per week",
                "Use platform-specific hashtags",
                "Engage with your community regularly",
                "Share behind-the-scenes content"
            ],
            "engagement_opportunities": self._identify_engagement_opportunities(social_data),
            "competitive_analysis": self._generate_mock_competitive_suggestions(social_data)
        }
    
    def _generate_mock_comprehensive_insights(self, branding_data: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Generate mock comprehensive insights"""
        summary = "Your digital presence shows strong potential with opportunities for growth through improved SEO optimization and enhanced social media engagement."
        if branding_data:
            summary += " Branding is a key area for improvement."

        return {
            "executive_summary": summary,
            "key_findings": [
                "Website has solid technical foundation but needs speed optimization",
                "Social media presence exists but could benefit from more consistent posting",
                "Brand messaging is consistent across platforms",
                "There's untapped potential for cross-platform content promotion"
            ],
            "strategic_recommendations": [
                "Implement comprehensive SEO optimization strategy",
                "Develop content calendar for social media consistency",
                "Create integrated marketing campaigns across platforms",
                "Focus on community building and engagement"
            ],
            "priority_actions": [
                "Fix technical SEO issues immediately",
                "Optimize page loading speed",
                "Create weekly content posting schedule",
                "Set up social media monitoring and analytics"
            ],
            "next_steps": [
                "Conduct competitor analysis",
                "Set up tracking and measurement systems",
                "Plan quarterly marketing campaigns",
                "Review and optimize monthly performance"
            ]
        }
    
    def _generate_mock_comprehensive_report(self, seo_data: Dict[str, Any], social_data: List[Dict[str, Any]], branding_data: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Generate mock comprehensive report"""
        insights = self._generate_mock_comprehensive_insights(branding_data)
        return {
            "generated_at": datetime.now().isoformat(),
            "website_url": seo_data.get("url"),
            "social_profiles_analyzed": len(social_data),
            **insights,
            "performance_benchmarks": self._generate_benchmarks(seo_data, social_data, branding_data),
        }

    async def generate_branding_insights(self, screenshots: List[Dict[str, Any]], branding_profile: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        Generate AI-powered branding insights from screenshots.
        
        Args:
            screenshots: A list of dictionaries, where each dictionary contains a URL and a base64-encoded screenshot.
            branding_profile: Optional company branding profile with logo and colors for comparison.
            
        Returns:
            A dictionary containing the branding analysis.
        """
        if not self.api_key:
            return self._generate_mock_branding_insights()

        prompt = self._create_branding_analysis_prompt(branding_profile)
        
        try:
            # Prepare content with text prompt and images for Claude
            content = [{"type": "text", "text": prompt}]
            for item in screenshots:
                image_format = item.get("format", "png")
                media_type = f"image/{image_format}"
                content.append({
                    "type": "image",
                    "source": {
                        "type": "base64",
                        "media_type": media_type,
                        "data": item["screenshot"]
                    }
                })

            # Route through token monitor so MLflow logs under branding_analysis
            tm_result = await token_monitor.track_anthropic_call(
                operation="branding_analysis",
                model=self.model_name,
                messages=[
                    {"role": "system", "content": "You are an expert in branding and visual design. Analyze the provided screenshots and provide comprehensive brand audit insights."},
                    {"role": "user", "content": content}
                ],
                max_tokens=5000,
                experiment_name="branding_analysis"
            )

            insights = self._parse_branding_insights(tm_result["response"])
            return insights

        except Exception as e:
            print(f"Anthropic API error during branding analysis: {str(e)}")
            return self._generate_mock_branding_insights()

    def _create_branding_analysis_prompt(self, branding_profile: Optional[Dict[str, Any]] = None) -> str:
        """Creates a prompt for the branding analysis LLM using the new structured format."""
        
        base_prompt = """You are Transformellica's Senior Brand Identity and Visual Design Consultant. You specialize in evaluating digital brand presence across websites and social media using evidence-based design, UX, and marketing principles. Your goal is to deliver clear, actionable, and data-informed brand audit insights that help businesses improve consistency, clarity, and trust.

    You will be analyzing brand data to produce a structured brand audit in JSON format. Here is the brand data you need to analyze:

    <brand_data>
    {BRAND_DATA_PLACEHOLDER}
    </brand_data>

    Your task is to analyze the provided screenshots, visual captures, and associated data from the company's online presence. Base your analysis strictly on the visual evidence and text provided in the brand data.

    You must produce a JSON audit with the following exact structure and sections:

    **executive_summary** – A concise overview of overall brand health and strategic direction

    **overall_brand_impression** containing:
    - strengths – Bullet list of positive elements (clarity, tone, design unity)
    - room_for_improvement – Bullet list of issues (inconsistency, low contrast, weak identity)

    **messaging_and_content_style** containing:
    - content – Assessment of tone, clarity, and alignment with target audience
    - recommendations – 2-4 clear, actionable steps to refine messaging

    **visual_branding_elements** containing:
    - color_palette with:
    - analysis – Description of color use and brand emotion conveyed
    - recommendations – Specific improvements for palette balance and accessibility
    - typography with:
    - analysis – Font choices, hierarchy effectiveness, and readability assessment
    - recommendations – Suggestions for better hierarchy or font pairing

    **highlights_and_stories** (include only if social media data is present) containing:
    - analysis – Assessment of icon and label clarity
    - recommendations – Specific optimization ideas

    **grid_strategy** (include only if social media data is present) containing:
    - analysis – Evaluation of layout coherence and storytelling flow
    - recommendations – Specific layout or rhythm improvements

    **scorecard** – Array of objects, each containing "area" and "score" keys, where score is out of 10

    ## Context and Requirements

    Your analysis serves small to mid-size companies and agencies requiring professional brand audits to guide redesigns or consistency improvements. All recommendations must be:
    - Specific and realistic
    - Immediately applicable without major rebranding
    - Consider accessibility, clarity, emotional tone, and cultural relevance

    When analyzing, evaluate based on established design principles from authoritative sources like Nielsen Norman Group, W3C Accessibility Guidelines (WCAG 2.2), Google Material Design, and major brand style-guide repositories.

    ## Professional Standards

    Act as a senior brand consultant combining creative judgment with business reasoning. Use clear, professional language that designers, marketers, and executives can understand. Avoid subjective adjectives like "beautiful" or "modern" unless supported by concrete design principles. Each observation must link to a concrete impact on perception, usability, or consistency.

    ## Critical Guidelines

    **Always:**
    - Base insights only on the provided visuals and text in the brand data
    - Use neutral, evidence-based language
    - Mention clearly when an element cannot be evaluated due to limited visual data
    - Reference established design principles when making recommendations

    **Never:**
    - Invent unseen visuals, colors, or typography details
    - Add speculative data or internal company assumptions
    - Include opinions not grounded in observed evidence
    - Output any text outside the required JSON structure

    ## Output Format

    Return your response as a valid JSON object only. Do not include any commentary, explanations, or text outside the JSON structure. The JSON must match the exact structure specified above."""

        # Add branding profile context if available
        if branding_profile:
            profile_context = "\n\n## OFFICIAL BRANDING PROFILE FOR COMPARISON\n\n"
            profile_context += "The company has provided their official branding profile. Compare the analyzed screenshots against these official brand standards:\n\n"
            
            if branding_profile.get('logo'):
                logo_info = branding_profile['logo']
                profile_context += f"**Official Logo:**\n"
                profile_context += f"- Filename: {logo_info.get('filename', 'Uploaded logo')}\n"
                profile_context += f"- Size: {logo_info.get('size', 'Unknown size')}\n\n"
            
            if branding_profile.get('colors'):
                colors = branding_profile['colors']
                profile_context += f"**Official Brand Colors:**\n"
                profile_context += f"- Dominant Color: {colors.get('dominant', 'Not specified')}\n"
                if colors.get('palette'):
                    profile_context += f"- Color Palette: {', '.join(colors.get('palette', []))}\n"
                profile_context += "\n"
            
            profile_context += """**Comparison Requirements:**

    When conducting your analysis, you MUST:
    1. Verify if the website/social media uses the official brand colors consistently
    2. Check if the logo appears correctly and matches the official version provided
    3. Assess whether visual elements align with the established brand identity
    4. In your recommendations, specifically address any deviations from the official branding
    5. Note any inconsistencies between the official brand profile and what's displayed in the screenshots
    6. Provide actionable steps to better align the digital presence with the official brand standards

    Base all color palette analysis on comparison with the official colors listed above. If colors in the screenshots deviate from the official palette, this should be explicitly noted in the "room_for_improvement" section and addressed in the color_palette recommendations."""
            
            return base_prompt + profile_context
        
        return base_prompt

    def _generate_mock_branding_insights(self) -> Dict[str, Any]:
        """
        Generates mock data for branding analysis, structured like the user's example.
        """
        return {
            "executive_summary": "This is a mock executive summary for the brand audit of Seayou Camp. The analysis reveals a friendly and adventure-oriented brand identity, but there are significant inconsistencies in visual branding and content strategy that need to be addressed.",
            "overall_brand_impression": {
                "strengths": [
                    "Friendly, family-oriented logo & tone",
                    "Real moments, community & adventure are well-represented"
                ],
                "room_for_improvement": [
                    "Lack of cohesive color, typography & layout",
                    "Fluctuating visual tone & style across posts",
                    "No clear brand guidelines seem to be followed"
                ]
            },
            "messaging_and_content_style": {
                "content": "The messaging is generally positive and family-friendly, but lacks a consistent tone of voice. There's an opportunity to introduce thematic series to structure content.",
                "recommendations": [
                    "Develop a consistent brand voice (e.g., adventurous, educational, friendly).",
                    "Introduce thematic content series (e.g., 'Tip Tuesday', 'Family Fridays').",
                    "For Arabic typography, ensure text is legible and consistently styled, using text blocks or overlays where necessary."
                ]
            },
            "visual_branding_elements": {
                "color_palette": {
                    "analysis": "Too many uncoordinated colors are used. A clear brand color system is missing.",
                    "recommendations": [
                        "Create a brand color system with 3-5 main colors and 2 accent colors.",
                        "Apply a visual rhythm (e.g., photo, graphic, reel pattern) for consistent post framing."
                    ]
                },
                "typography": {
                    "analysis": "Inconsistent fonts, sizes, and readability across posts.",
                    "recommendations": [
                        "Choose 1-2 primary fonts and standardize hierarchy (headings, body text) across all posts.",
                        "Design branded reel cover templates to use every time for a cohesive look."
                    ]
                }
            },
            "highlights_and_stories": {
                "analysis": "Good use of icons, but they are not consistently branded.",
                "recommendations": [
                    "Use branded designs with descriptive labels for all highlights.",
                    "Rename highlights clearly (e.g., 'Booking' to 'Activities')."
                ]
            },
            "grid_strategy": {
                "analysis": "The feed lacks a clear structure, with a random mix of reels, posts, and graphics.",
                "recommendations": [
                    "Use branded design templates for a more structured and visually appealing feed.",
                    "Plan the grid layout to create a better flow and visual narrative."
                ]
            },
            "scorecard": [
                {"area": "Visual Consistency", "score": 5},
                {"area": "Brand Identity Clarity", "score": 6},
                {"area": "Content Strategy", "score": 7},
                {"area": "Reel Presentation", "score": 5},
                {"area": "User Experience (UX)", "score": 6}
            ]
        }

    def _parse_branding_insights(self, response: str) -> Dict[str, Any]:
        """
        Parses the JSON response from the branding analysis LLM.
        """
        try:
            # The response might be wrapped in markdown JSON
            cleaned_response = response.strip().replace("```json", "").replace("```", "")
            return json.loads(cleaned_response)
        except json.JSONDecodeError:
            print("Error: Failed to decode JSON from branding analysis response.")
            # Fallback to returning the raw text in a structured way
            return {"executive_summary": "Could not parse the analysis.", "raw_response": response}

    async def generate_sentiment_insights(self, sentiment_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generate AI-powered insights for sentiment analysis
        
        Args:
            sentiment_data: Dictionary containing sentiment analysis data and summary
            
        Returns:
            Dictionary with AI insights for sentiment analysis
        """
        if not self.api_key:
            return self._generate_mock_sentiment_insights(sentiment_data)
        
        prompt = self._create_sentiment_analysis_prompt(sentiment_data)
        
        try:
            response = await self._call_ai_api(prompt, max_tokens=5000)
            
            return {
                "generated_at": datetime.now().isoformat(),
                "insights": self._parse_sentiment_insights(response),
                "recommendations": self._extract_sentiment_recommendations(response),
                "action_items": self._extract_sentiment_action_items(response)
            }
            
        except Exception as e:
            print(f"Anthropic API error: {str(e)}")
            return self._generate_mock_sentiment_insights(sentiment_data)

    def _create_sentiment_analysis_prompt(self, sentiment_data: Dict[str, Any]) -> str:
        """Create prompt for sentiment analysis insights"""
        
        summary = sentiment_data.get("summary", {})
        sample_reviews = sentiment_data.get("sample_reviews", [])
        sentiment_distribution = summary.get("sentiment_percentages", {})
        avg_star_rating = summary.get("average_star_rating", 0)
        
        # Format sample reviews
        reviews_text = ""
        for i, review in enumerate(sample_reviews[:5]):
            reviews_text += f"\n{i+1}. Rating: {review.get('Star Rating', 'N/A')}/5\n"
            reviews_text += f"   Sentiment: {review.get('Sentiment', 'N/A')}\n"
            reviews_text += f"   Text: {review.get('Review Text', 'N/A')[:100]}...\n"
        
        return f"""
        You are Transformellica's Senior Business Insights and Sentiment Analysis Consultant. You specialize in multilingual customer sentiment analysis, topic extraction, and satisfaction analytics. Your purpose is to deliver concise, data-driven insights that help improve customer experience, retention, and brand perception.
        You will be analyzing sentiment data for SMEs, service providers, and agencies who need actionable business improvements rather than linguistic analysis. All findings must link sentiment to operational or marketing impact.
        Here is the sentiment dataset to analyze:
        - Total Reviews: {summary.get('total_reviews', 0)}
        - Positive: {sentiment_distribution.get('Positive', 0):.1f}%
        - Negative: {sentiment_distribution.get('Negative', 0):.1f}%
        - Neutral: {sentiment_distribution.get('Neutral', 0):.1f}%
        - Average Star Rating: {avg_star_rating:.1f}/5
        - Average Sentiment Polarity: {summary.get('average_polarity', 0):.2f}
        - Average Subjectivity: {summary.get('average_subjectivity', 0):.2f}

        SAMPLE REVIEWS:
        {reviews_text}
        Your task is to generate a structured business report with actionable insights based strictly on the provided sentiment data. Before writing your final report, use your scratchpad to analyze the data and identify key patterns.

        <scratchpad>
        Analyze the sentiment data to identify:
        - Overall sentiment health based on the distribution and ratings
        - Key patterns in positive and negative feedback
        - Specific issues mentioned in negative reviews
        - Strengths highlighted in positive reviews
        - Actionable areas for improvement
        - Calculate a sentiment health score (1-100) based on the metrics provided
        </scratchpad>

        Write your analysis in the following exact format:

        <report>
        CUSTOMER SENTIMENT INSIGHT REPORT

        1. SENTIMENT HEALTH SCORE: [score]/100
        - [Provide clear rationale for the score based on the data]

        2. CUSTOMER SATISFACTION INSIGHTS
        - [Summary of overall sentiment trends and key emotions based on the data]

        3. TOP 3 AREAS FOR IMPROVEMENT
        - [Issue 1] — [impact] — [recommended corrective action]
        - [Issue 2] — [impact] — [recommended corrective action]  
        - [Issue 3] — [impact] — [recommended corrective action]

        4. POSITIVE ASPECTS TO LEVERAGE
        - [List 2-3 strengths or themes with promotional potential from positive reviews]

        5. CUSTOMER EXPERIENCE RECOMMENDATIONS
        - [3-5 specific actions tied to product, service, or communication based on the data]

        6. ACTION ITEMS FOR COMMON COMPLAINTS
        - [Short list of quick wins based on recurring negative feedback patterns]

        7. STRATEGIES TO INCREASE POSITIVE SENTIMENT
        - [Targeted retention or engagement ideas based on what drives positive reviews]

        Summary: [One line highlighting the highest-impact change to prioritize based on your analysis]
        </report>

        Important guidelines:
        - Base all insights strictly on the provided dataset
        - Be analytical, objective, and business-focused
        - Avoid emotional language or generic statements
        - Support each recommendation with clear reasoning from observed patterns
        - Mention if data is limited or sample size is small
        - Prioritize actionable items with measurable outcomes
        - Never fabricate review content or infer data not provided
        - Be specific rather than vague (avoid phrases like "customers are unhappy")
        - Focus on practical actions for management and marketing teams
        """

    def _parse_sentiment_insights(self, response: str) -> Dict[str, Any]:
        """Parse GPT response for sentiment insights"""
        return {
            "summary": response[:300] + "..." if len(response) > 300 else response,
            "full_analysis": response
        }

    def _extract_sentiment_recommendations(self, response: str) -> List[str]:
        """Extract recommendations from sentiment analysis response"""
        recommendations = []
        lines = response.split('\n')
        
        for line in lines:
            line = line.strip()
            if line.startswith(('•', '-', '*')) or line[0:2].isdigit():
                recommendations.append(line)
        
        return recommendations[:8]  # Limit to top 8

    def _extract_sentiment_action_items(self, response: str) -> List[str]:
        """Extract action items from sentiment analysis response"""
        action_items = []
        lines = response.split('\n')
        
        for line in lines:
            line = line.strip()
            if any(keyword in line.lower() for keyword in ['action', 'implement', 'address', 'fix', 'improve']):
                action_items.append(line)
        
        return action_items[:5]  # Limit to top 5

    def _generate_mock_sentiment_insights(self, sentiment_data: Dict[str, Any]) -> Dict[str, Any]:
        """Generate mock sentiment insights when GPT API is unavailable"""
        summary = sentiment_data.get("summary", {})
        sentiment_distribution = summary.get("sentiment_percentages", {})
        
        return {
            "generated_at": datetime.now().isoformat(),
            "insights": {
                "summary": f"Mock sentiment analysis: Customer sentiment shows {sentiment_distribution.get('Positive', 0):.1f}% positive feedback with opportunities for improvement in customer experience.",
                "full_analysis": "This is a mock analysis. Connect Anthropic API for detailed sentiment insights."
            },
            "recommendations": [
                "Monitor customer feedback regularly to identify trends",
                "Address negative reviews promptly and professionally",
                "Leverage positive reviews for marketing and testimonials",
                "Implement customer satisfaction surveys",
                "Train staff on customer service best practices"
            ],
            "action_items": [
                "Set up automated review monitoring system",
                "Create response templates for common complaints",
                "Develop customer feedback collection process",
                "Implement customer service training program"
            ]
        }
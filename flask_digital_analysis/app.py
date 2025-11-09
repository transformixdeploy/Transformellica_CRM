import os
from flask import Flask, request, jsonify,Response
from typing import Any, Dict
import asyncio
import base64
import io
from PIL import Image
from datetime import datetime
from seo_analyzer import SEOAnalyzer
from gpt_insights_service import GPTInsightsService
from helpers import is_valid_url, validate_url
from sentiment_analyzer import SentimentAnalyzer
from social_analyzer import SocialAnalyzer
from branding_analyzer import BrandingAnalyzer
from colorthief import ColorThief
from dotenv import load_dotenv
from flask_cors import CORS
import json
app = Flask(__name__)
load_dotenv()
CORS(app, resources={r"/*": {"origins": ["https://app.thetransformix.com"]}})

@app.post("/ai/website-swot-analysis")
def website_swot_analysis():
    try:
        body = request.get_json(force=True, silent=True) or {}

        website_url = (body.get("website_url") or "").strip()
        if not website_url:
            return jsonify({"error": "website_url is required"}), 400

        website_url = validate_url(website_url)
        if not is_valid_url(website_url):
            return jsonify({"error": "Invalid website_url. Must include http(s) scheme and domain."}), 400
        print(f"website analysis started at:{datetime.now()}")
        def stream_response():
            analyzer = SEOAnalyzer()
            gpt_service = GPTInsightsService()
            async def run_analysis(url: str):
                seo_result = await analyzer.analyze_website(url)
                
                # Chunk 1: Performance Card (Page Speed Score, Internal Links, External Links)
                performance_data = {
                    "type": "performance",
                    "pageSpeedScore": seo_result.get("page_speed_score") or seo_result.get("page_speed_scores", {}).get("overall", 0) or 0,
                    "internalLinks": seo_result.get("internal_links", 0) or 0,
                    "externalLinks": seo_result.get("external_links", 0) or 0,
                }
                yield "data: "+json.dumps(performance_data)+'\n\n'
                
                # Chunk 2: Page Details Card (Title, Meta Description, HTTPS, Canonical URL)
                title = seo_result.get("title") or ""
                meta_description = seo_result.get("meta_description") or ""
                page_details = {
                    "type": "pageDetails",
                    "pageInfo": {
                        "title": title,
                        "titleLength": seo_result.get("title_length", len(title) if title else 0) or 0,
                        "metaDescription": meta_description,
                        "metaDescriptionLength": seo_result.get("meta_description_length", len(meta_description) if meta_description else 0) or 0,
                        "https": bool(seo_result.get("https", False)),
                        "canonicalUrl": seo_result.get("canonical_url") or "",
                    }
                }
                yield "data: "+json.dumps(page_details)+'\n\n'
                
                # Chunk 3: Open Graph Tags
                og_tags = seo_result.get("og_tags", {}) or {}
                open_graph_data = {
                    "type": "openGraph",
                    "openGraphTags": {
                        "title": og_tags.get("og:title") or "",
                        "description": og_tags.get("og:description") or "",
                        "url": og_tags.get("og:url") or "",
                        "type": og_tags.get("og:type") or "",
                        "siteName": og_tags.get("og:site_name") or "",
                    }
                }
                yield "data: "+json.dumps(open_graph_data)+'\n\n'
                
                # Chunk 4: Social Links
                social_links_data = {
                    "type": "socialLinks",
                    "socialLinks": seo_result.get("social_links", []) or [],
                }
                yield "data: "+json.dumps(social_links_data)+'\n\n'
                
                # Chunk 5: Content Overview (Images, Headings)
                headings = seo_result.get("headings", {}) or {}
                def get_heading_list(tag: str):
                    values = headings.get(tag, []) or []
                    return [str(v) for v in values]
                
                content_overview = {
                    "type": "contentOverview",
                    "contentInfo": {
                        "imagesCount": seo_result.get("images_count", 0) or 0,
                        "imagesMissingAltTage": seo_result.get("alt_tags_missing", 0) or 0,
                    },
                    "headingStructure": {
                        "h1Tages": get_heading_list("h1"),
                        "h2Tages": get_heading_list("h2"),
                        "h3Tages": get_heading_list("h3"),
                        "h4Tages": get_heading_list("h4"),
                        "h5Tages": get_heading_list("h5"),
                        "h6Tages": get_heading_list("h6"),
                    },
                    "schemaMarkup": seo_result.get("schema_markup", []) or [],
                }
                yield "data: "+json.dumps(content_overview)+'\n\n'
                
                # Chunk 6: Full Website Analysis (AI Response)
                gpt_result = await gpt_service.generate_seo_insights(seo_result)
                ai_analysis = {
                    "type": "aiAnalysis",
                    "summary": (gpt_result or {}).get("insights", {}).get("summary", ""),
                    "fullSocialAnalysis": (gpt_result or {}).get("insights", {}).get("full_analysis", ""),
                }
                yield "data: "+json.dumps(ai_analysis)+'\n\n'
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            try:
                async def run_and_yield():
                    async for chunk in run_analysis(website_url):
                        yield chunk

                agen = run_and_yield()

                while True:
                    try:
                        chunk = loop.run_until_complete(agen.__anext__())
                        yield chunk
                    except StopAsyncIteration:
                        break
            finally:
                loop.close()

        return Response(stream_response(), mimetype="text/event-stream")

    except Exception as e:
        return jsonify({"error": f"Failed to process request: {str(e)}"}), 500

@app.post("/ai/social-swot-analysis")
def social_swot_analysis():
    try:
        body = request.get_json(force=True, silent=True) or {}

        instagram_link = (body.get("instagram_link") or "").strip()
        country = (body.get("country") or "").strip()
        
        if not instagram_link:
            return jsonify({"error": "instagram_link is required"}), 400

        if not is_valid_url(instagram_link):
            instagram_link = validate_url(instagram_link)
            if not is_valid_url(instagram_link):
                return jsonify({"error": "Invalid instagram_link. Must include http(s) scheme and domain."}), 400
        def stream_response():
            analyzer = SocialAnalyzer()
            gpt_service = GPTInsightsService()
            async def run_social(url: str, user_country: str = ""):
                social_result = await analyzer.analyze_social_url(url)
                social_result['user_country'] = user_country
                platform = social_result.get("platform", "Social")
                profile = social_result.get("profile_data", {}) or {}
                content = social_result.get("content_analysis", {}) or {}
                detailed = social_result.get("detailed_data", {}) or {}
                
                # Chunk 1: Analysis Title
                profile_name = profile.get("name", "") or profile.get("full_name", "")
                title_data = {
                    "type": "title",
                    "analysisTitle": f"{platform} Analysis for {profile_name}",
                }
                yield "data: "+json.dumps(title_data)+'\n\n'
                
                # Chunk 2: Main Metrics (Followers, Following, Engagement Rate)
                main_metrics = {
                    "type": "mainMetrics",
                    "followers": profile.get("follower_count", 0) or 0,
                    "following": profile.get("following_count", 0) or 0,
                    "engagementRate": content.get("engagement_rate", 0) or 0,
                }
                yield "data: "+json.dumps(main_metrics)+'\n\n'
                
                # Chunk 3: Profile Information (Basic Info)
                profile_info = {
                    "type": "profileInfo",
                    "profileInfo": {
                        "basicInfo": {
                            "name": profile_name,
                            "bio": profile.get("bio", "") or "",
                            "verified": bool(profile.get("verification_status", False)),
                            "private": bool(profile.get("is_private", False)),
                            "website": profile.get("external_url", "") or "",
                        }
                    }
                }
                yield "data: "+json.dumps(profile_info)+'\n\n'
                
                # Chunk 4: Additional Metrics (Posts, Likes, Comments, Engagement)
                posts_count = (
                    detailed.get("posts_count", 0)
                    or detailed.get("content_analysis", {}).get("posts_count", 0)
                    or content.get("post_count_scanned", 0)
                    or 0
                )
                engagement = detailed.get("engagement", {}) or {}
                avg_likes = engagement.get("avg_likes", 0) or content.get("avg_likes", 0) or 0
                avg_comments = engagement.get("avg_comments", 0) or content.get("avg_comments", 0) or 0
                engagement_per_post = engagement.get("engagement_per_post", 0) or 0
                if not engagement_per_post and (avg_likes or avg_comments):
                    engagement_per_post = float(avg_likes) + float(avg_comments)
                
                additional_metrics = {
                    "type": "additionalMetrics",
                    "profileInfo": {
                        "additionalMetrics": {
                            "postsCount": posts_count or 0,
                            "averageLikes": float(avg_likes or 0),
                            "averageComments": float(avg_comments or 0) or 0,
                            "EngagementPerPost": float(engagement_per_post or 0),
                        }
                    }
                }
                yield "data: "+json.dumps(additional_metrics)+'\n\n'
                
                # Chunk 5: Top Hashtags
                top_hashtags_map = detailed.get("content_analysis", {}).get("top_hashtags", {}) or {}
                if not top_hashtags_map:
                    posts = detailed.get("posts") or detailed.get("content_analysis", {}).get("recent_posts") or []
                    if isinstance(posts, list) and posts:
                        freq = {}
                        for p in posts:
                            for tag in (p.get("hashtags") or []):
                                if not isinstance(tag, str):
                                    continue
                                freq[tag] = freq.get(tag, 0) + 1
                        top_hashtags_map = freq
                    if not top_hashtags_map:
                        tags_list = None
                        if isinstance(content.get("top_hashtags"), list):
                            tags_list = content.get("top_hashtags")
                        elif isinstance(content.get("hashtags"), list):
                            tags_list = content.get("hashtags")
                        if tags_list:
                            top_hashtags_map = {tag: 1 for tag in tags_list}
                top_hashtags = [{"tag": tag, "frequency": freq} for tag, freq in top_hashtags_map.items()]
                
                hashtags_data = {
                    "type": "topHashtags",
                    "topHashTags": top_hashtags,
                }
                yield "data: "+json.dumps(hashtags_data)+'\n\n'
                
                # Chunk 6: Full Social Analysis (AI Response)
                gpt_result = await gpt_service.generate_social_insights(social_result)
                insights = (gpt_result or {}).get("insights", {})
                ai_analysis = {
                    "type": "aiAnalysis",
                    "fullSocialAnalysis": insights.get("full_analysis", ""),
                }
                yield "data: "+json.dumps(ai_analysis)+'\n\n'
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            try:
                async def run_and_yield():
                    async for chunk in run_social(instagram_link, country):
                        yield chunk

                agen = run_and_yield()

                while True:
                    try:
                        chunk = loop.run_until_complete(agen.__anext__())
                        yield chunk
                    except StopAsyncIteration:
                        break
            finally:
                loop.close()

        return Response(stream_response(), mimetype="text/event-stream")

    except Exception as e:
        return jsonify({"error": f"Failed to process request: {str(e)}"}), 500

@app.post("/ai/branding-audit")
def branding_audit():
    try:
        website_url = (request.form.get("website_url") or "").strip()
        instagram_link = (request.form.get("instagram_link") or "").strip()
        logo_file = request.files.get("logoUpload")

        urls = []
        if website_url and is_valid_url(validate_url(website_url)):
            urls.append(validate_url(website_url))
        if instagram_link and is_valid_url(validate_url(instagram_link)):
            urls.append(validate_url(instagram_link))

        if not urls:
            return jsonify({"error": "Provide at least one valid URL in website_url or instagram_link"}), 400

        def stream_response():
            branding_profile = None
            logo_image_b64 = None
            dominant_hex = ""
            palette_hex = []
            if logo_file:
                try:
                    img_bytes = logo_file.read()
                    logo_image_b64 = base64.b64encode(img_bytes).decode("utf-8")

                    color_thief = ColorThief(io.BytesIO(img_bytes))
                    dom = color_thief.get_color(quality=1)
                    pal = color_thief.get_palette(color_count=6, quality=1) or []

                    def rgb_to_hex(rgb):
                        return '#{:02x}{:02x}{:02x}'.format(rgb[0], rgb[1], rgb[2])

                    dominant_hex = rgb_to_hex(dom)
                    palette_hex = [rgb_to_hex(c) for c in pal]

                    branding_profile = {
                        "logo": {"image": logo_image_b64, "filename": logo_file.filename},
                        "colors": {"dominant": dominant_hex, "palette": palette_hex},
                    }
                except Exception:
                    pass

            # Chunk 1: Logo Image and Brand Colors (available immediately)
            logo_colors_data = {
                "type": "logoAndColors",
                "logoImage": {"data": logo_image_b64 or "", "mimeType": "image/png" if logo_image_b64 else ""},
                "brandColors": {
                    "dominanColor": dominant_hex,
                    "colors": palette_hex,
                },
            }
            yield "data: "+json.dumps(logo_colors_data) + '\n\n'

            analyzer = BrandingAnalyzer()

            async def run_branding():
                return await analyzer.analyze_branding(urls, branding_profile)

            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            try:
                result = loop.run_until_complete(run_branding())
            finally:
                loop.close()

            if not result or "branding_analysis" not in result:
                yield "data: "+json.dumps({"type": "error", "error": "Branding analysis failed"}) + '\n\n'
                return

            analysis = result.get("branding_analysis", {}) or {}

            # Chunk 2: Screenshots (Website and Instagram)
            website_img_b64 = ""
            insta_img_b64 = ""
            for s in result.get("screenshots", []):
                u = s.get("url", "")
                if website_url and website_url in u:
                    website_img_b64 = s.get("screenshot", "")
                if instagram_link and instagram_link in u:
                    insta_img_b64 = s.get("screenshot", "")

            screenshots_data = {
                "type": "screenshots",
                "websiteImage": {"data": website_img_b64, "mimeType": "image/png"} if website_img_b64 else {"data": "", "mimeType": ""},
                "instaImage": {"data": insta_img_b64, "mimeType": "image/png"} if insta_img_b64 else {"data": "", "mimeType": ""},
            }
            yield "data: "+json.dumps(screenshots_data) + '\n\n'

            # Chunk 3: Executive Summary
            executive_summary_data = {
                "type": "executiveSummary",
                "executiveSummary": analysis.get("executive_summary", ""),
            }
            yield "data: "+json.dumps(executive_summary_data) + '\n\n'

            # Chunk 4: Overall Brand Identity & First Impression
            brand_identity_data = {
                "type": "brandIdentity",
                "overallBrandIdentity_firstImpression": {
                    "strengths": analysis.get("overall_brand_impression", {}).get("strengths", []),
                    "roomForImprovement": analysis.get("overall_brand_impression", {}).get("room_for_improvement", []),
                },
            }
            yield "data: "+json.dumps(brand_identity_data) + '\n\n'

            # Chunk 5: Visual Branding Elements (Color Palette & Typography)
            visual_branding_data = {
                "type": "visualBranding",
                "visualBrandingElements": {
                    "colorPalette": {
                        "analysis": analysis.get("visual_branding_elements", {}).get("color_palette", {}).get("analysis", ""),
                        "recommendations": analysis.get("visual_branding_elements", {}).get("color_palette", {}).get("recommendations", []),
                    },
                    "typography": {
                        "analysis": analysis.get("visual_branding_elements", {}).get("typography", {}).get("analysis", ""),
                        "recommendations": analysis.get("visual_branding_elements", {}).get("typography", {}).get("recommendations", []),
                    },
                },
            }
            yield "data: "+json.dumps(visual_branding_data) + '\n\n'

            # Chunk 6: Messaging & Content Style
            messaging_data = {
                "type": "messaging",
                "messaging_content_style": {
                    "content": analysis.get("messaging_and_content_style", {}).get("content", ""),
                    "recommendations": analysis.get("messaging_and_content_style", {}).get("recommendations", []),
                },
            }
            yield "data: "+json.dumps(messaging_data) + '\n\n'

            # Chunk 7: Highlights & Stories
            highlights_data = {
                "type": "highlights",
                "highlights_stories": {
                    "analysis": analysis.get("highlights_and_stories", {}).get("analysis", ""),
                    "recommendations": analysis.get("highlights_and_stories", {}).get("recommendations", []),
                },
            }
            yield "data: "+json.dumps(highlights_data) + '\n\n'

            # Chunk 8: Grid Strategy
            grid_strategy_data = {
                "type": "gridStrategy",
                "gridStrategy": {
                    "analysis": analysis.get("grid_strategy", {}).get("analysis", ""),
                    "recommendations": analysis.get("grid_strategy", {}).get("recommendations", []),
                },
            }
            yield "data: "+json.dumps(grid_strategy_data) + '\n\n'

            # Chunk 9: Score Card
            scores_data = {
                "type": "scores",
                "scores": [
                    {"title": item.get("area", ""), "score": item.get("score", 0)}
                    for item in (analysis.get("scorecard", []) or [])
                ],
            }
            yield "data: "+json.dumps(scores_data) + '\n\n'

        return Response(stream_response(), mimetype="text/event-stream")

    except Exception as e:
        return jsonify({"error": f"Failed to process request: {str(e)}"}), 500
@app.post("/ai/customer-sentiment-analysis")
def customer_sentiment_analysis():
    try:
        body = request.get_json(force=True, silent=True) or {}

        industry = (body.get("industry_field") or "").strip()
        country = (body.get("country") or "").strip()

        if not industry or not country:
            return jsonify({"error": "industry_field and country are required"}), 400

        MAX_COMPETITORS = 5
        REVIEWS_PER_COMPETITOR = 100

        def stream_response():
            analyzer = SentimentAnalyzer()

            async def run_competitor_analysis() -> Dict[str, Any]:
                return await analyzer.analyze_competitors_sentiment(
                    industry=industry,
                    region=country,
                    max_competitors=MAX_COMPETITORS,
                    reviews_per_competitor=REVIEWS_PER_COMPETITOR,
                )

            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            try:
                analysis_results = loop.run_until_complete(run_competitor_analysis())
            finally:
                loop.close()

            competitor_results = analysis_results.get("competitor_results", [])
            combined = analysis_results.get("combined_analysis", {})
            combined_summary = combined.get("combined_summary", {})
            
            # Chunk 1: Analysis Title
            title_data = {
                "type": "title",
                "analysisTitle": f"{industry.title()} Industry Analysis - {country}",
            }
            yield "data: "+json.dumps(title_data) + '\n\n'
            
            # Chunk 2: Main Metrics (Competitors Analyzed, Total Reviews, Avg Google Rating)
            total_competitors = combined.get("total_competitors_analyzed", len(competitor_results)) or 0
            total_reviews = combined.get("total_reviews_analyzed", 0) or 0
            avg_rating = round(sum([(r.get("competitor_info", {}).get("rating", 0) or 0) for r in competitor_results]) / max(len(competitor_results), 1), 2) if competitor_results else 0
            
            main_metrics = {
                "type": "mainMetrics",
                "competitorsAnalyzedNumber": total_competitors,
                "totalReview": total_reviews,
                "avgGoogleRating": avg_rating,
            }
            yield "data: "+json.dumps(main_metrics) + '\n\n'
            
            # Chunk 3: Competitors Analyzed List
            competitors_analyzed_list = []
            for result in competitor_results:
                comp = result.get("competitor_info", {})
                summary = result.get("sentiment_summary", {})
                pct = summary.get("sentiment_percentages", {})
                competitors_analyzed_list.append({
                    "name": comp.get("name", ""),
                    "googleRating": comp.get("rating", 0) or 0,
                    "reviewsAnalyzed": result.get("total_reviews_analyzed", 0) or 0,
                    "positivePercentage": pct.get("Positive", 0) or 0,
                    "negativePercentage": pct.get("Negative", 0) or 0,
                    "avgSentiment": summary.get("average_polarity", 0) or 0,
                })
            
            competitors_data = {
                "type": "competitorsAnalyzed",
                "competitorsAnalyzed": competitors_analyzed_list,
            }
            yield "data: "+json.dumps(competitors_data) + '\n\n'
            
            # Chunk 4: Pie Chart Data
            pie = {
                "type": "pieChart",
                "pieChart": {
                    "title": f"{industry.title()} sentiment distribution in {country}",
                    "positive": combined_summary.get("sentiment_percentages", {}).get("Positive", 0) or 0,
                    "negative": combined_summary.get("sentiment_percentages", {}).get("Negative", 0) or 0,
                    "neutral": combined_summary.get("sentiment_percentages", {}).get("Neutral", 0) or 0,
                }
            }
            yield "data: "+json.dumps(pie) + '\n\n'
            
            # Chunk 5: Competitor Sentiment Comparison Chart
            sentiment_chart = []
            for result in competitor_results:
                comp = result.get("competitor_info", {})
                summary = result.get("sentiment_summary", {})
                pct = summary.get("sentiment_percentages", {})
                sentiment_chart.append({
                    "name": comp.get("name", ""),
                    "negative": pct.get("Negative", 0) or 0,
                    "positive": pct.get("Positive", 0) or 0,
                    "neutral": pct.get("Neutral", 0) or 0,
                })
            
            sentiment_comparison = {
                "type": "sentimentComparisonChart",
                "competitorSentimentComparisonChart": sentiment_chart,
            }
            yield "data: "+json.dumps(sentiment_comparison) + '\n\n'
            
            # Chunk 6: Rating vs Sentiment Chart
            rating_vs_sentiment = []
            for result in competitor_results:
                comp = result.get("competitor_info", {})
                summary = result.get("sentiment_summary", {})
                rating_vs_sentiment.append({
                    "googleRating": comp.get("rating", 0) or 0,
                    "averageSentiment": summary.get("average_polarity", 0) or 0,
                    "competitorName": comp.get("name", ""),
                })
            
            rating_sentiment_chart = {
                "type": "ratingSentimentChart",
                "competitorRating_averageSentiment_chart": rating_vs_sentiment,
            }
            yield "data: "+json.dumps(rating_sentiment_chart) + '\n\n'
            
            # Chunk 7: Reviews Analyzed Per Competitor
            reviews_per_comp_list = []
            for result in competitor_results:
                comp = result.get("competitor_info", {})
                reviews_per_comp_list.append({
                    "name": comp.get("name", ""),
                    "reviews": result.get("total_reviews_analyzed", 0) or 0,
                })
            
            reviews_per_competitor = {
                "type": "reviewsPerCompetitor",
                "reviewsAnalyzedPerCompetitor": reviews_per_comp_list,
            }
            yield "data: "+json.dumps(reviews_per_competitor) + '\n\n'
            
            # Chunk 8: Competitors Details (AI Insights)
            competitors_details = []
            for result in competitor_results:
                comp = result.get("competitor_info", {})
                ai_insights = result.get("ai_insights", {}) or {}
                insights_obj = ai_insights.get("insights", {}) or {}
                ai_full = insights_obj.get("full_analysis") or ai_insights.get("full_analysis") or ""
                ai_summary = insights_obj.get("summary") or ai_insights.get("summary", "") or ""
                ai_text = ai_full or ai_summary or ""
                competitors_details.append({
                    "address": comp.get("address", "") or "",
                    "googleMaps": comp.get("google_maps_url", "") or "",
                    "aiInsights": ai_text,
                })
            
            competitors_details_data = {
                "type": "competitorsDetails",
                "competitorsDetails": competitors_details,
            }
            yield "data: "+json.dumps(competitors_details_data) + '\n\n'

        return Response(stream_response(), mimetype="text/event-stream")

    except Exception as e:
        return jsonify({"error": f"Failed to process request: {str(e)}"}), 500

@app.post("/ai/social-analysis-tiktok")
def social_analysis_tiktok():
    try:
        body = request.get_json(force=True, silent=True) or {}

        tiktok_link = (body.get("tiktok_link") or body.get("url") or "").strip()
        country = (body.get("country") or "").strip()

        if not tiktok_link:
            return jsonify({"error": "tiktok_link (or url) is required"}), 400

        if not is_valid_url(tiktok_link):
            tiktok_link = validate_url(tiktok_link)
            if not is_valid_url(tiktok_link):
                return jsonify({"error": "Invalid tiktok_link. Must include http(s) scheme and domain."}), 400
        def stream_response():
            analyzer = SocialAnalyzer()
            gpt_service = GPTInsightsService()
            async def run_tiktok(url: str, user_country: str = ""):
                social_result = await analyzer.analyze_social_url(url)
                platform = social_result.get("platform", "")
                if platform != "TikTok":
                    yield "data: "+json.dumps({
                        "type": "error",
                        "error": "Provided URL is not a TikTok profile",
                        "platform": platform,
                        "url": url
                    }) + '\n\n'
                    return

                social_result['user_country'] = user_country
                profile = social_result.get("profile_data", {}) or {}
                content = social_result.get("content_analysis", {}) or {}
                detailed = social_result.get("detailed_data", {}) or {}
                
                # Chunk 1: Analysis Title
                profile_name = profile.get("name", "") or profile.get("full_name", "")
                title_data = {
                    "type": "title",
                    "analysisTitle": f"{platform} Analysis for {profile_name}",
                }
                yield "data: "+json.dumps(title_data)+'\n\n'
                
                # Chunk 2: Main Metrics (Followers, Following, Engagement Rate)
                main_metrics = {
                    "type": "mainMetrics",
                    "followers": profile.get("follower_count", 0) or 0,
                    "following": profile.get("following_count", 0) or 0,
                    "engagementRate": content.get("engagement_rate", 0) or 0,
                }
                yield "data: "+json.dumps(main_metrics)+'\n\n'
                
                # Chunk 3: Profile Information (Basic Info)
                profile_info = {
                    "type": "profileInfo",
                    "profileInfo": {
                        "basicInfo": {
                            "name": profile_name,
                            "bio": profile.get("bio", "") or "",
                            "verified": bool(profile.get("verification_status", False)),
                            "private": bool(profile.get("is_private", False)),
                            "website": profile.get("external_url", "") or "",
                        }
                    }
                }
                yield "data: "+json.dumps(profile_info)+'\n\n'
                
                # Chunk 4: Additional Metrics (Posts, Likes, Comments, Engagement)
                posts_count = (
                    detailed.get("posts_count", 0)
                    or detailed.get("content_analysis", {}).get("posts_count", 0)
                    or content.get("post_count_scanned", 0)
                    or 0
                )
                engagement = detailed.get("engagement", {}) or {}
                avg_likes = engagement.get("avg_likes", 0) or content.get("avg_likes", 0) or 0
                avg_comments = engagement.get("avg_comments", 0) or content.get("avg_comments", 0) or 0
                engagement_per_post = engagement.get("engagement_per_post", 0) or 0
                if not engagement_per_post and (avg_likes or avg_comments):
                    engagement_per_post = float(avg_likes) + float(avg_comments)
                
                additional_metrics = {
                    "type": "additionalMetrics",
                    "profileInfo": {
                        "additionalMetrics": {
                            "postsCount": posts_count or 0,
                            "averageLikes": float(avg_likes or 0),
                            "averageComments": float(avg_comments or 0),
                            "EngagementPerPost": float(engagement_per_post or 0),
                        }
                    }
                }
                yield "data: "+json.dumps(additional_metrics)+'\n\n'
                
                # Chunk 5: Top Hashtags
                top_hashtags_map = detailed.get("content_analysis", {}).get("top_hashtags", {}) or {}
                if not top_hashtags_map:
                    posts = detailed.get("posts") or detailed.get("content_analysis", {}).get("recent_posts") or []
                    if isinstance(posts, list) and posts:
                        freq = {}
                        for p in posts:
                            for tag in (p.get("hashtags") or []):
                                if not isinstance(tag, str):
                                    continue
                                freq[tag] = freq.get(tag, 0) + 1
                        top_hashtags_map = freq
                    if not top_hashtags_map:
                        tags_list = None
                        if isinstance(content.get("top_hashtags"), list):
                            tags_list = content.get("top_hashtags")
                        elif isinstance(content.get("hashtags"), list):
                            tags_list = content.get("hashtags")
                        if tags_list:
                            top_hashtags_map = {tag: 1 for tag in tags_list}
                top_hashtags = [{"tag": tag, "frequency": freq} for tag, freq in top_hashtags_map.items()]
                
                hashtags_data = {
                    "type": "topHashtags",
                    "topHashTags": top_hashtags,
                }
                yield "data: "+json.dumps(hashtags_data)+'\n\n'
                
                # Chunk 6: Full Social Analysis (AI Response)
                gpt_result = await gpt_service.generate_social_insights(social_result)
                insights = (gpt_result or {}).get("insights", {})
                ai_analysis = {
                    "type": "aiAnalysis",
                    "fullSocialAnalysis": insights.get("full_analysis", ""),
                }
                yield "data: "+json.dumps(ai_analysis)+'\n\n'
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            try:
                async def run_and_yield():
                    async for chunk in run_tiktok(tiktok_link, country):
                        yield chunk

                agen = run_and_yield()

                while True:
                    try:
                        chunk = loop.run_until_complete(agen.__anext__())
                        yield chunk
                    except StopAsyncIteration:
                        break
            finally:
                loop.close()

        return Response(stream_response(), mimetype="text/event-stream")

    except Exception as e:
        return jsonify({"error": f"Failed to process request: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=os.getenv("PORT"), debug=True, use_reloader=False)
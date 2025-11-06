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
            paylod= {
                "pageSpeedScore": 0,
                "internalLinks": 0,
                "externalLinks": 0,
                "contentInfo": {
                    "imagesCount": 0,
                    "imagesMissingAltTage": 0,
                },
                "pageInfo": {
                    "title": "",
                    "titleLength": 0,
                    "metaDescription": "",
                    "metaDescriptionLength": 0,
                    "https": False,
                    "canonicalUrl": "",
                },
                "headingStructure": {
                    "h1Tages": "",
                    "h2Tages":"",
                    "h4Tages": "",
                    "h5Tages": "",
                    "h6Tages": "",
                },
                "schemaMarkup": [],
                "socialLinks": [],
                "openGraphTags": {},
                "summary": "",
                "fullSocialAnalysis": "",
            }
            analyzer = SEOAnalyzer()
            gpt_service = GPTInsightsService()
            async def run_analysis(url: str):
                seo_result = await analyzer.analyze_website(url)
                paylod["pageSpeedScore"]= seo_result.get("page_speed_score") or seo_result.get("page_speed_scores", {}).get("overall", 0) or 0
                paylod["internalLinks"]= seo_result.get("internal_links", 0) or 0
                paylod["externalLinks"]= seo_result.get("external_links", 0) or 0
                paylod["contentInfo"]["imagesCount"]= seo_result.get("images_count", 0) or 0
                paylod["contentInfo"]["imagesMissingAltTage"]= seo_result.get("alt_tags_missing", 0) or 0
                paylod["pageInfo"]["title"]= seo_result.get("title") or ""
                paylod["pageInfo"]["titleLength"]= seo_result.get("title_length", len(paylod["pageInfo"]["title"]) if paylod["pageInfo"]["title"] else 0) or 0
                paylod["pageInfo"]["metaDescription"]= seo_result.get("meta_description") or ""
                paylod["pageInfo"]["metaDescriptionLength"]= seo_result.get("meta_description_length", len(paylod["pageInfo"]["metaDescription"]) if paylod["pageInfo"]["metaDescription"] else 0) or 0
                paylod["pageInfo"]["https"]= bool(seo_result.get("https", False))
                paylod["pageInfo"]["canonicalUrl"]= seo_result.get("canonical_url") or ""
                headings = seo_result.get("headings", {}) or {}
                def get_heading_list(tag: str):
                    values = headings.get(tag, []) or []
                    return [str(v) for v in values]
                paylod["headingStructure"]["h1Tages"]= get_heading_list("h1")
                paylod["headingStructure"]["h2Tages"]= get_heading_list("h2")
                paylod["headingStructure"]["h3Tages"]= get_heading_list("h3")
                paylod["headingStructure"]["h4Tages"]= get_heading_list("h4")
                paylod["headingStructure"]["h5Tages"]= get_heading_list("h5")
                paylod["headingStructure"]["h6Tages"]= get_heading_list("h6")
                paylod["schemaMarkup"]= seo_result.get("schema_markup", []) or []
                paylod["socialLinks"]= seo_result.get("social_links", []) or []
                og_tags = seo_result.get("og_tags", {}) or {}
                open_graph_tags = {
                    "title": og_tags.get("og:title") or "",
                    "description": og_tags.get("og:description") or "",
                    "url": og_tags.get("og:url") or "",
                    "type": og_tags.get("og:type") or "",
                    "siteName": og_tags.get("og:site_name") or "",
                }
                paylod["openGraphTags"]= open_graph_tags
                yield "data: "+json.dumps(paylod)+'\n'
                gpt_result = await gpt_service.generate_seo_insights(seo_result)
                paylod["summary"]= (gpt_result or {}).get("insights", {}).get("summary", "")
                paylod["fullSocialAnalysis"]= (gpt_result or {}).get("insights", {}).get("full_analysis", "")
                yield "data: "+json.dumps(paylod)+'\n'
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
            payload = {
                    "analysisTitle":"",
                    "followers":  0,
                    "following":  0,
                    "engagementRate": 0,
                    "profileInfo": {
                        "basicInfo": {
                            "name": "",
                            "bio":  "",
                            "verified":False,
                            "private": False,
                            "website": "",
                        },
                        "additionalMetrics": {
                            "postsCount":0,
                            "averageLikes": 0,
                            "averageComments":0,
                            "EngagementPerPost":0,
                        },
                    },
                    "topHashTags": [],
                    "fullSocialAnalysis": "",
                }
            analyzer = SocialAnalyzer()
            gpt_service = GPTInsightsService()
            async def run_social(url: str, user_country: str = ""):
                social_result = await analyzer.analyze_social_url(url)
                social_result['user_country'] = user_country
                platform = social_result.get("platform", "Social")
                profile = social_result.get("profile_data", {}) or {}
                content = social_result.get("content_analysis", {}) or {}
                detailed = social_result.get("detailed_data", {}) or {}
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
                payload['analysisTitle']=f"{platform} Analysis for  { profile.get("name", "") or profile.get("full_name", "")}"
                payload['followers']=profile.get("follower_count", 0) or 0
                payload['following']=profile.get("following_count", 0) or 0
                payload['engagementRate']=(content.get("engagement_rate", 0) or 0)
                payload['profileInfo']['basicInfo']['name']=profile.get("name", "") or profile.get("full_name", "")
                payload['profileInfo']['basicInfo']['bio']=profile.get("bio", "") or ""
                payload['profileInfo']['basicInfo']['verified']=bool(profile.get("verification_status", False))
                payload['profileInfo']['basicInfo']['private']=bool(profile.get("is_private", False))
                payload['profileInfo']['basicInfo']['website']=profile.get("external_url", "") or ""
                payload['profileInfo']['additionalMetrics']['postsCount']=posts_count or 0
                payload['profileInfo']['additionalMetrics']['averageLikes']=float(avg_likes or 0)
                payload['profileInfo']['additionalMetrics']['averageComments']=float(avg_comments or 0) or 0
                payload['profileInfo']['additionalMetrics']['EngagementPerPost']=float(engagement_per_post or 0)
                payload['topHashTags']=top_hashtags
                yield "data: "+json.dumps(payload)+'\n\n'
                gpt_result = await gpt_service.generate_social_insights(social_result)
                insights = (gpt_result or {}).get("insights", {})
                payload['fullSocialAnalysis']=insights.get("full_analysis", "")
                yield "data: "+json.dumps(payload)+'\n\n'
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

            analyzer = BrandingAnalyzer()

            async def run_branding():
                return await analyzer.analyze_branding(urls, branding_profile)
            initial_payload = {
                "brandColors": {
                    "dominanColor": dominant_hex,
                    "colors": palette_hex,
                },
                "executiveSummary": "",
                "overallBrandIdentity_firstImpression": {
                    "strengths": [],
                    "roomForImprovement": [],
                },
                "visualBrandingElements": {
                    "colorPalette": {
                        "analysis": "",
                        "recommendations": [],
                    },
                    "typography": {
                        "analysis": "",
                        "recommendations": [],
                    },
                },
                "messaging_content_style": {
                    "content": "",
                    "recommendations": [],
                },
                "highlights_stories": {
                    "analysis": "",
                    "recommendations": [],
                },
                "gridStrategy": {
                    "analysis": "",
                    "recommendations": [],
                },
                "scores": [],
                "websiteImage": {"data": "", "mimeType": ""},
                "instaImage": {"data": "", "mimeType": ""},
                "logoImage": {"data": logo_image_b64 or "", "mimeType": "image/png" if logo_image_b64 else ""},
            }
            yield "data: "+json.dumps(initial_payload) + '\n\n'

            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            try:
                result = loop.run_until_complete(run_branding())
            finally:
                loop.close()

            if not result or "branding_analysis" not in result:
                yield "data: "+json.dumps({"error": "Branding analysis failed"}) + '\n\n'
                return

            analysis = result.get("branding_analysis", {}) or {}

            website_img_b64 = ""
            insta_img_b64 = ""
            for s in result.get("screenshots", []):
                u = s.get("url", "")
                if website_url and website_url in u:
                    website_img_b64 = s.get("screenshot", "")
                if instagram_link and instagram_link in u:
                    insta_img_b64 = s.get("screenshot", "")

            final_payload = {
                "brandColors": {
                    "dominanColor": dominant_hex,
                    "colors": palette_hex,
                },
                "executiveSummary": analysis.get("executive_summary", ""),
                "overallBrandIdentity_firstImpression": {
                    "strengths": analysis.get("overall_brand_impression", {}).get("strengths", []),
                    "roomForImprovement": analysis.get("overall_brand_impression", {}).get("room_for_improvement", []),
                },
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
                "messaging_content_style": {
                    "content": analysis.get("messaging_and_content_style", {}).get("content", ""),
                    "recommendations": analysis.get("messaging_and_content_style", {}).get("recommendations", []),
                },
                "highlights_stories": {
                    "analysis": analysis.get("highlights_and_stories", {}).get("analysis", ""),
                    "recommendations": analysis.get("highlights_and_stories", {}).get("recommendations", []),
                },
                "gridStrategy": {
                    "analysis": analysis.get("grid_strategy", {}).get("analysis", ""),
                    "recommendations": analysis.get("grid_strategy", {}).get("recommendations", []),
                },
                "scores": [
                    {"title": item.get("area", ""), "score": item.get("score", 0)}
                    for item in (analysis.get("scorecard", []) or [])
                ],
                "websiteImage": {"data": website_img_b64, "mimeType": "image/png"} if website_img_b64 else {"data": "", "mimeType": ""},
                "instaImage": {"data": insta_img_b64, "mimeType": "image/png"} if insta_img_b64 else {"data": "", "mimeType": ""},
                "logoImage": {"data": logo_image_b64 or "", "mimeType": "image/png" if logo_image_b64 else ""},
            }
            yield "data: "+json.dumps(final_payload) + '\n\n'

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

            initial_payload = {
                "analysisTitle": f"{industry.title()} Industry Analysis - {country}",
                "competitorsAnalyzedNumber": 0,
                "totalReview": 0,
                "avgGoogleRating": 0,
                "competitorsAnalyzed": [],
                "competitorsDetails": [],
                "competitorSentimentComparisonChart": [],
                "competitorRating_averageSentiment_chart": [],
                "pieChart": {
                    "title": f"{industry.title()} sentiment distribution in {country}",
                    "positive": 0,
                    "negative": 0,
                    "neutral": 0,
                },
                "reviewsAnalyzedPerCompetitor": [],
            }
            yield "data: "+json.dumps(initial_payload) + '\n\n'

            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            try:
                analysis_results = loop.run_until_complete(run_competitor_analysis())
            finally:
                loop.close()

            competitor_results = analysis_results.get("competitor_results", [])
            combined = analysis_results.get("combined_analysis", {})
            combined_summary = combined.get("combined_summary", {})

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

            rating_vs_sentiment = []
            for result in competitor_results:
                comp = result.get("competitor_info", {})
                summary = result.get("sentiment_summary", {})
                rating_vs_sentiment.append({
                    "googleRating": comp.get("rating", 0) or 0,
                    "averageSentiment": summary.get("average_polarity", 0) or 0,
                    "competitorName": comp.get("name", ""),
                })

            pie = {
                "title": f"{industry.title()} sentiment distribution in {country}",
                "positive": combined_summary.get("sentiment_percentages", {}).get("Positive", 0) or 0,
                "negative": combined_summary.get("sentiment_percentages", {}).get("Negative", 0) or 0,
                "neutral": combined_summary.get("sentiment_percentages", {}).get("Neutral", 0) or 0,
            }

            reviews_per_comp_list = []
            for result in competitor_results:
                comp = result.get("competitor_info", {})
                reviews_per_comp_list.append({
                    "name": comp.get("name", ""),
                    "reviews": result.get("total_reviews_analyzed", 0) or 0,
                })

            final_payload = {
                "analysisTitle": f"{industry.title()} Industry Analysis - {country}",
                "competitorsAnalyzedNumber": combined.get("total_competitors_analyzed", len(competitor_results)) or 0,
                "totalReview": combined.get("total_reviews_analyzed", 0) or 0,
                "avgGoogleRating": round(sum([(r.get("competitor_info", {}).get("rating", 0) or 0) for r in competitor_results]) / max(len(competitor_results), 1), 2) if competitor_results else 0,
                "competitorsAnalyzed": competitors_analyzed_list,
                "competitorsDetails": competitors_details,
                "competitorSentimentComparisonChart": sentiment_chart,
                "competitorRating_averageSentiment_chart": rating_vs_sentiment,
                "pieChart": pie,
                "reviewsAnalyzedPerCompetitor": reviews_per_comp_list,
            }

            yield "data: "+json.dumps(final_payload) + '\n\n'

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
            payload = {
                "analysisTitle": "",
                "followers":0,
                "following":0,
                "engagementRate":0,
                "profileInfo": {
                    "basicInfo": {
                        "name":"",
                        "bio":"",
                        "verified": False,
                        "private": False,
                        "website":"",
                    },
                    "additionalMetrics": {
                        "postsCount":0,
                        "averageLikes":0,
                        "averageComments":0,
                        "EngagementPerPost":0,
                    },
                },
                "topHashTags": [],
                "fullSocialAnalysis":"",
            }
            analyzer = SocialAnalyzer()
            gpt_service = GPTInsightsService()
            async def run_tiktok(url: str, user_country: str = ""):
                social_result = await analyzer.analyze_social_url(url)
                platform = social_result.get("platform", "")
                if platform != "TikTok":
                    yield "data: "+json.dumps({
                        "error": "Provided URL is not a TikTok profile",
                        "platform": platform,
                        "url": url
                    }) + '\n\n'
                    return

                social_result['user_country'] = user_country
                profile = social_result.get("profile_data", {}) or {}
                content = social_result.get("content_analysis", {}) or {}
                detailed = social_result.get("detailed_data", {}) or {}
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
                payload['analysisTitle']=f"{platform} Analysis for  { profile.get("name", "") or profile.get("full_name", "")}"
                payload['followers']=profile.get("follower_count", 0) or 0
                payload['following']=profile.get("following_count", 0) or 0
                payload['engagementRate']=(content.get("engagement_rate", 0) or 0)
                payload['profileInfo']['basicInfo']['name']=profile.get("name", "") or profile.get("full_name", "")
                payload['profileInfo']['basicInfo']['bio']=profile.get("bio", "") or ""
                payload['profileInfo']['basicInfo']['verified']=bool(profile.get("verification_status", False))
                payload['profileInfo']['basicInfo']['private']=bool(profile.get("is_private", False))
                payload['profileInfo']['basicInfo']['website']=profile.get("external_url", "") or ""
                payload['profileInfo']['additionalMetrics']['postsCount']=posts_count or 0
                payload['profileInfo']['additionalMetrics']['averageLikes']=float(avg_likes or 0)
                payload['profileInfo']['additionalMetrics']['averageComments']=float(avg_comments or 0)
                payload['profileInfo']['additionalMetrics']['EngagementPerPost']=float(engagement_per_post or 0)
                payload['topHashTags']=top_hashtags
                yield "data: "+json.dumps(payload)+'\n\n'
                gpt_result = await gpt_service.generate_social_insights(social_result)
                insights = (gpt_result or {}).get("insights", {})
                payload['fullSocialAnalysis']=insights.get("full_analysis", "")
                yield "data: "+json.dumps(payload)+'\n\n'
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


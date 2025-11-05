import instaloader
import pandas as pd
from datetime import datetime
from typing import Dict, Any, Optional
import os
import json
import aiohttp
import asyncio
from bs4 import BeautifulSoup

class InstagramAnalyzer:

    
    def __init__(self):
        self.loader = instaloader.Instaloader()
        self.session_loaded = False
        
        self._load_session()
    
    def _load_session(self):
        try:
            session_cookies = {}
            env_cookies = {
                "csrftoken": os.getenv("SESSION_COOKIES_CSRF_TOKEN"),
                "sessionid": os.getenv("SESSION_COOKIES_SESSION_ID"),
                "ds_user_id": os.getenv("SESSION_COOKIES_DS_USER_ID"),
                "mid": os.getenv("SESSION_COOKIES_M_ID"),
                "ig_did": os.getenv("SESSION_COOKIES_IG_DID")
            }
            
            if all(env_cookies.values()):
                session_cookies = env_cookies
                username = os.getenv("INSTAGRAM_USERNAME", "default_user")
            else:
                config_file = "instagram_config.json"
                if os.path.exists(config_file):
                    with open(config_file, 'r') as f:
                        config = json.load(f)
                        session_cookies = config.get("session_cookies", {})
                        username = config.get("username", "default_user")
                else:
                    print("No Instagram session configuration found. Using public-only mode.")
                    return
            
            if session_cookies:
                self.loader.load_session(username, session_cookies)
                self.session_loaded = True
                print("Instagram session loaded successfully")
            else:
                print("No valid Instagram session cookies found. Using public-only mode.")
                
        except Exception as e:
            print(f"Failed to load Instagram session: {str(e)}")
            print("Falling back to public-only mode")
            self.session_loaded = False
    
    async def analyze_profile(self, username: str) -> Dict[str, Any]:

        
        if self.session_loaded:
            try:
                return await self._analyze_with_session(username)
            except Exception as e:
                print(f"Authenticated analysis failed: {str(e)}. Trying public analysis...")
        
        try:
            return await self._analyze_public_profile(username)
        except Exception as e:
            return {
                "error": f"Failed to analyze Instagram profile: {str(e)}",
                "username": username,
                "success": False,
                "fallback_used": True
            }
    
    async def _analyze_with_session(self, username: str) -> Dict[str, Any]:
        
        profile = instaloader.Profile.from_username(self.loader.context, username)
        
        posts_data = []
        hashtags = []
        
        for post in profile.get_posts():
            posts_data.append({
                'date': post.date.isoformat(),
                'likes': post.likes,
                'comments': post.comments,
                'hashtags': list(post.caption_hashtags),
                'caption': post.caption[:200] if post.caption else None,
                'url': post.url,
                'is_video': post.is_video
            })
            if len(posts_data) > 40:
                break
            hashtags.extend(post.caption_hashtags)

        total_followers = profile.followers
        total_following = profile.followees
        total_posts = profile.mediacount
        
        if posts_data:
            avg_likes = sum(post['likes'] for post in posts_data) / len(posts_data)
            avg_comments = sum(post['comments'] for post in posts_data) / len(posts_data)
            engagement_per_post = avg_likes + avg_comments
            engagement_rate = (engagement_per_post / total_followers)  if total_followers > 0 else 0
        else:
            avg_likes = 0
            avg_comments = 0
            engagement_per_post = 0
            engagement_rate = 0
        
        hashtag_counts = {}
        for tag in hashtags:
            if tag in hashtag_counts:
                hashtag_counts[tag] += 1
            else:
                hashtag_counts[tag] = 1
        
        top_hashtags = sorted(hashtag_counts.items(), key=lambda x: x[1], reverse=True)[:10]
        
        return {
            "username": username,
            "full_name": profile.full_name,
            "biography": profile.biography,
            "followers": total_followers,
            "following": total_following,
            "posts_count": total_posts,
            "is_private": profile.is_private,
            "is_verified": profile.is_verified,
            "external_url": profile.external_url,
            "engagement": {
                "avg_likes": avg_likes,
                "avg_comments": avg_comments,
                "engagement_per_post": engagement_per_post,
                "engagement_rate": engagement_rate
            },
            "content_analysis": {
                "posts_analyzed": len(posts_data),
                "top_hashtags": dict(top_hashtags),
                "has_videos": any(post['is_video'] for post in posts_data),
                "recent_posts": posts_data[:5]
            },
            "success": True,
            "method": "authenticated"
        }
    
    async def _analyze_public_profile(self, username: str) -> Dict[str, Any]:
        
        url = f"https://www.instagram.com/{username}/"
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate',
            'Connection': 'keep-alive',
        }
        
        try:
            async with aiohttp.ClientSession(headers=headers) as session:
                async with session.get(url) as response:
                    if response.status != 200:
                        raise Exception(f"HTTP {response.status}: Unable to fetch profile")
                    
                    html = await response.text()
                    soup = BeautifulSoup(html, 'html.parser')
                    
                    profile_data = self._extract_public_profile_data(soup, username)
                    
                    return {
                        "username": username,
                        "full_name": profile_data.get("full_name", username),
                        "biography": profile_data.get("biography", ""),
                        "followers": profile_data.get("followers", 0),
                        "following": profile_data.get("following", 0),
                        "posts_count": profile_data.get("posts_count", 0),
                        "is_private": profile_data.get("is_private", False),
                        "is_verified": profile_data.get("is_verified", False),
                        "external_url": profile_data.get("external_url"),
                        "engagement": {
                            "avg_likes": 0,
                            "avg_comments": 0,
                            "engagement_per_post": 0,
                            "engagement_rate": 0
                        },
                        "content_analysis": {
                            "posts_analyzed": 0,
                            "top_hashtags": {},
                            "has_videos": False,
                            "recent_posts": []
                        },
                        "success": True,
                        "method": "public_scraping",
                        "note": "Limited data available from public scraping. For detailed analysis, Instagram authentication is required."
                    }
                    
        except Exception as e:
            raise Exception(f"Public profile analysis failed: {str(e)}")
    
    def _extract_public_profile_data(self, soup: BeautifulSoup, username: str) -> Dict[str, Any]:
        
        profile_data = {
            "full_name": username,
            "biography": "",
            "followers": 0,
            "following": 0,
            "posts_count": 0,
            "is_private": False,
            "is_verified": False,
            "external_url": None
        }
        
        try:
            scripts = soup.find_all('script', type='application/ld+json')
            for script in scripts:
                try:
                    data = json.loads(script.string)
                    if isinstance(data, dict) and data.get('@type') == 'Person':
                        profile_data["full_name"] = data.get('name', username)
                        profile_data["biography"] = data.get('description', '')
                        break
                except:
                    continue
            
            meta_tags = {
                'og:title': 'full_name',
                'og:description': 'biography',
                'og:url': 'external_url'
            }
            
            for meta_prop, data_key in meta_tags.items():
                meta_tag = soup.find('meta', property=meta_prop)
                if meta_tag and meta_tag.get('content'):
                    if data_key == 'external_url' and meta_tag.get('content') != f"https://www.instagram.com/{username}/":
                        profile_data[data_key] = meta_tag.get('content')
                    elif data_key != 'external_url':
                        profile_data[data_key] = meta_tag.get('content')
            
            if "This Account is Private" in soup.get_text() or "This account is private" in soup.get_text():
                profile_data["is_private"] = True
            
            if soup.find('span', {'aria-label': 'Verified'}):
                profile_data["is_verified"] = True
                
        except Exception as e:
            print(f"Error extracting public profile data: {str(e)}")
        
        return profile_data
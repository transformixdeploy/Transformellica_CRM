from gpt_insights_service import GPTInsightsService
import base64
import asyncio
import platform
import os
import json
from selenium import webdriver
from selenium.webdriver.chrome.options import Options as ChromeOptions
from selenium.webdriver.chrome.service import Service as ChromeService
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
import time
from selenium.webdriver.common.keys import Keys
from PIL import Image
import io

class BrandingAnalyzer:

    
    def __init__(self):
        self.gpt_insights = GPTInsightsService()

    def take_screenshot(self, url: str) -> bytes:
        try:
            chrome_options = ChromeOptions()
            chrome_options.add_argument("--headless")  
            chrome_options.add_argument("--no-sandbox")
            chrome_options.add_argument("--disable-dev-shm-usage")
            chrome_options.add_argument("--disable-gpu")
            chrome_options.add_argument("--window-size=1920,1080")
            chrome_options.add_argument("--disable-blink-features=AutomationControlled")
            chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
            chrome_options.add_experimental_option('useAutomationExtension', False)
            chrome_options.add_argument("--disable-web-security")
            chrome_options.add_argument("--allow-running-insecure-content")
            
            service = ChromeService(ChromeDriverManager().install())
            driver = webdriver.Chrome(service=service, options=chrome_options)
            
            try:
                if "instagram.com" in url.lower():
                    try:
                        session_cookies = {
                            "csrftoken": os.getenv("INSTAGRAM_CSRFTOKEN"),
                            "sessionid": os.getenv("INSTAGRAM_SESSIONID"),
                            "ds_user_id": os.getenv("INSTAGRAM_DS_USER_ID"),
                            "mid": os.getenv("INSTAGRAM_MID"),
                            "ig_did": os.getenv("INSTAGRAM_IG_DID"),
                        }
                        if not all(session_cookies.values()):
                            config_path = os.path.join(os.getcwd(), "instagram_config.json")
                            if os.path.exists(config_path):
                                with open(config_path, "r") as f:
                                    cfg = json.load(f)
                                    session_cookies = cfg.get("session_cookies", session_cookies) or session_cookies

                        driver.get("https://www.instagram.com/")
                        if session_cookies and all(session_cookies.get(k) for k in ["csrftoken", "sessionid", "ds_user_id", "mid", "ig_did"]):
                            for name, value in session_cookies.items():
                                try:
                                    driver.add_cookie({
                                        "name": name,
                                        "value": value,
                                        "domain": ".instagram.com",
                                        "path": "/",
                                        "secure": True,
                                    })
                                except Exception:
                                    pass
                            driver.refresh()
                    except Exception:
                        pass

                driver.get(url)
                
                WebDriverWait(driver, 15).until(
                    EC.presence_of_element_located((By.TAG_NAME, "body"))
                )
                
                time.sleep(3)

                if "instagram.com" in url.lower():
                    try:
                        close_button_selector = "svg[aria-label='Close']"
                        close_button = WebDriverWait(driver, 10).until(
                            EC.element_to_be_clickable((By.CSS_SELECTOR, close_button_selector))
                        )
                        print("Found Instagram login popup close button. Clicking...")
                        close_button.click()
                        print("Successfully closed Instagram login popup.")
                        time.sleep(2) 
                    except Exception:
                        print("Could not find or click the Instagram login popup close button. Trying with Escape key.")
                        try:
                            driver.find_element(By.TAG_NAME, 'body').send_keys(Keys.ESCAPE)
                            print("Attempted to close popup with Escape key.")
                            time.sleep(2) 
                        except Exception:
                             print("Failed to close popup with Escape key. Proceeding with screenshot.")

                driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
                time.sleep(2) 
                driver.execute_script("window.scrollTo(0, 0);")
                time.sleep(1)
                
                page_rect = driver.execute_cdp_cmd('Page.getLayoutMetrics', {})
                screenshot_config = {
                    'captureBeyondViewport': True,
                    'format': 'png',
                    'clip': {
                        'width': page_rect['contentSize']['width'],
                        'height': page_rect['contentSize']['height'],
                        'x': 0,
                        'y': 0,
                        'scale': 1
                    }
                }
                result = driver.execute_cdp_cmd('Page.captureScreenshot', screenshot_config)
                screenshot_bytes = base64.b64decode(result['data'])

                image_format = "png"  
                try:
                    print(f"🔍 [SIZE TRACE] Original screenshot size: {len(screenshot_bytes):,} bytes")
                    img = Image.open(io.BytesIO(screenshot_bytes))
                    width, height = img.size
                    print(f"🔍 [SIZE TRACE] Original dimensions: {width}x{height} pixels")
                    max_dim = max(width, height)
                    if max_dim > 8000:
                        scale = 8000.0 / float(max_dim)
                        new_size = (max(1, int(width * scale)), max(1, int(height * scale)))
                        print(f"🔍 [SIZE TRACE] Scaling down from {width}x{height} to {new_size[0]}x{new_size[1]} (scale: {scale:.3f})")
                        img = img.resize(new_size, Image.LANCZOS)
                        out_buf = io.BytesIO()
                        img.save(out_buf, format='PNG')
                        screenshot_bytes = out_buf.getvalue()
                        print(f"🔍 [SIZE TRACE] After dimension scaling: {len(screenshot_bytes):,} bytes")
                    
                    MAX_BYTES = 5 * 1024 * 1024
                    TARGET = int(MAX_BYTES * 0.75) - 8192 
                    print(f"🔍 [SIZE TRACE] Target size: {TARGET:,} bytes (75% of 5MB - 8KB safety margin for base64 overhead)")
                    
                    if len(screenshot_bytes) > TARGET:
                        print(f"🔍 [SIZE TRACE] Size exceeds target, starting compression...")
                        if img.mode not in ("RGB", "L"):
                            print(f"🔍 [SIZE TRACE] Converting from {img.mode} to RGB")
                            img = img.convert("RGB")

                        def encode_jpeg(image: Image.Image, q: int) -> bytes:
                            buf = io.BytesIO()
                            image.save(
                                buf,
                                format='JPEG',
                                quality=q,
                                optimize=True,
                                progressive=True,
                                subsampling=2,
                            )
                            return buf.getvalue()

                        w, h = img.size
                        md = max(w, h)
                        if md > 4000:
                            s = 4000.0 / float(md)
                            new_w, new_h = max(1, int(w * s)), max(1, int(h * s))
                            print(f"🔍 [SIZE TRACE] Pre-clamping from {w}x{h} to {new_w}x{new_h} (scale: {s:.3f})")
                            img = img.resize((new_w, new_h), Image.LANCZOS)

                        quality = 85
                        data = encode_jpeg(img, quality)
                        print(f"🔍 [SIZE TRACE] Initial JPEG (q={quality}): {len(data):,} bytes")
                        attempts = 0
                        while len(data) > TARGET and attempts < 25:
                            if quality > 45:
                                quality = max(45, quality - 7)
                                print(f"🔍 [SIZE TRACE] Attempt {attempts+1}: Reducing quality to {quality}")
                            else:
                                nw = max(1, int(img.size[0] * 0.85))
                                nh = max(1, int(img.size[1] * 0.85))
                                print(f"🔍 [SIZE TRACE] Attempt {attempts+1}: Scaling down from {img.size[0]}x{img.size[1]} to {nw}x{nh}")
                                img = img.resize((nw, nh), Image.LANCZOS)
                                quality = min(70, quality + 5)
                                print(f"🔍 [SIZE TRACE] Attempt {attempts+1}: Quality bumped to {quality} after downscale")
                            data = encode_jpeg(img, quality)
                            print(f"🔍 [SIZE TRACE] Attempt {attempts+1} result: {len(data):,} bytes (target: {TARGET:,})")
                            attempts += 1

                        if len(data) > TARGET:
                            cw = max(1, int(img.size[0] * 0.8))
                            ch = max(1, int(img.size[1] * 0.8))
                            left = max(0, (img.size[0] - cw) // 2)
                            top = max(0, (img.size[1] - ch) // 2)
                            print(f"🔍 [SIZE TRACE] Final fallback: center-cropping from {img.size[0]}x{img.size[1]} to {cw}x{ch}")
                            img = img.crop((left, top, left + cw, top + ch))
                            data = encode_jpeg(img, min(65, quality))
                            print(f"🔍 [SIZE TRACE] Final fallback result: {len(data):,} bytes")

                        screenshot_bytes = data
                        image_format = "jpeg" 
                        print(f"🔍 [SIZE TRACE] Final compressed size: {len(screenshot_bytes):,} bytes")
                    else:
                        print(f"🔍 [SIZE TRACE] Size already within target, no compression needed")
                except Exception as e:
                    print(f"🔍 [SIZE TRACE] Error during image processing: {e}")
                    pass
                
                if len(screenshot_bytes) < 1000: 
                    print(f"Warning: Screenshot for {url} seems too small ({len(screenshot_bytes)} bytes)")
                
                return screenshot_bytes, image_format
                
            finally:
                driver.quit()
                
        except Exception as e:
            print(f"Error taking screenshot of {url}: {str(e)}")
            return b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x02\x00\x00\x00\x90wS\xde\x00\x00\x00\tpHYs\x00\x00\x0b\x13\x00\x00\x0b\x13\x01\x00\x9a\x9c\x18\x00\x00\x00\x07tIME\x07\xe6\x06\x16\x0e\x1c\x0c\xc8\xc8\xc8\x00\x00\x00\x0cIDATx\x9cc```\x00\x00\x00\x04\x00\x01\xf5\xf7\xd0\xc4\x00\x00\x00\x00IEND\xaeB`\x82', "png"

    async def analyze_branding(self, urls: list[str], branding_profile=None):

        screenshots = []
        for url in urls:
            try:
                screenshot_bytes, image_format = self.take_screenshot(url)
                screenshot_base64 = base64.b64encode(screenshot_bytes).decode('utf-8')
                print(f"🔍 [SIZE TRACE] Base64 encoded size: {len(screenshot_base64):,} characters")
                print(f"🔍 [SIZE TRACE] Base64 size in bytes: {len(screenshot_base64.encode('utf-8')):,} bytes")
                print(f"🔍 [SIZE TRACE] Image format: {image_format}")
                
                screenshots.append({
                    "url": url,
                    "screenshot": screenshot_base64,
                    "format": image_format
                })
            except Exception as e:
                print(f"Failed to process {url}: {str(e)}")
                continue
        
        if not screenshots:
            return {"error": "Failed to capture any screenshots"}
        
        branding_analysis = await self.gpt_insights.generate_branding_insights(screenshots, branding_profile)
        
        return {
            "urls_analyzed": [s["url"] for s in screenshots],
            "screenshots": screenshots,
            "branding_analysis": branding_analysis,
            "company_branding_profile": branding_profile
        }
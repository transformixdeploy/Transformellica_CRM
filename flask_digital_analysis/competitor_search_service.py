import asyncio
import aiohttp
import json
import re
from typing import Dict, List, Optional, Any
from datetime import datetime
import logging
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException
from webdriver_manager.chrome import ChromeDriverManager
import time
import os

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

class CompetitorSearchService:
    
    def __init__(self):
        pass        
    def setup_browser(self):
        try:
            options = Options()
            options.add_argument("--headless")
            options.add_argument("--no-sandbox")
            options.add_argument("--disable-dev-shm-usage")
            options.add_argument("--disable-gpu")
            options.add_argument("--window-size=1920,1080")
            options.add_argument("--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36")
            options.add_argument("--disable-blink-features=AutomationControlled")
            options.add_experimental_option("excludeSwitches", ["enable-automation"])
            options.add_experimental_option('useAutomationExtension', False)
            
            try:
                from selenium.webdriver.chrome.service import Service
                service = Service(ChromeDriverManager().install())
                driver = webdriver.Chrome(service=service, options=options)
                driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
                driver.implicitly_wait(10)
                logging.info("Successfully initialized Chrome WebDriver")
                return driver
            except Exception as chrome_error:
                logging.warning(f"Chrome WebDriver failed: {chrome_error}")
                logging.info("Falling back to Edge WebDriver...")
                return self._setup_edge_fallback()
                
        except Exception as e:
            logging.error(f"Failed to setup browser: {str(e)}")
            raise Exception(f"WebDriver setup failed: {str(e)}")
    
    def _setup_edge_fallback(self):
        try:
            from selenium.webdriver.edge.options import Options as EdgeOptions
            options = EdgeOptions()
            options.add_argument("--headless")
            options.add_argument("--no-sandbox")
            options.add_argument("--disable-dev-shm-usage")
            options.add_argument("--disable-gpu")
            options.add_argument("--window-size=1920,1080")
            options.add_argument("--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
            
            driver = webdriver.Edge(options=options)
            driver.implicitly_wait(10)
            return driver
        except Exception as e:
            raise Exception(f"Both Chrome and Edge WebDriver failed: {str(e)}")
    
    async def search_competitors(self, industry: str, region: str, max_results: int = 10) -> List[Dict[str, Any]]:

        search_query = f"{industry} in {region}"
        competitors = []
        
        driver = None
        try:
            driver = self.setup_browser()
            competitors = await self._search_google_maps(driver, search_query, max_results)
            
        except Exception as e:
            logging.error(f"Error searching competitors: {str(e)}")
            raise Exception(f"Competitor search failed: {str(e)}")
        finally:
            if driver:
                driver.quit()
        
        return competitors
    
    async def _search_google_maps(self, driver, search_query: str, max_results: int) -> List[Dict[str, Any]]:
        competitors = []
        
        try:
            search_url = f"https://www.google.com/maps/search/{search_query.replace(' ', '+')}"
            logging.info(f"Navigating to: {search_url}")
            driver.get(search_url)
            
            wait = WebDriverWait(driver, 20)
            
            selectors_to_try = [
                "[data-value='Directions']",
                "[role='main']",
                ".Nv2PK",
                ".lI9IFe",
                "[jsaction*='pane.rating']",
                ".section-result"
            ]
            
            element_found = False
            for selector in selectors_to_try:
                try:
                    wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, selector)))
                    logging.info(f"Found results using selector: {selector}")
                    element_found = True
                    break
                except TimeoutException:
                    continue
            
            if not element_found:
                logging.warning("Could not find Google Maps results with any selector")
                competitors = await self._extract_competitor_data(driver, max_results)
                return competitors
            
            await self._scroll_to_load_results(driver, max_results)
            
            competitors = await self._extract_competitor_data(driver, max_results)
            
        except TimeoutException:
            logging.warning("Timeout waiting for Google Maps results")
        except Exception as e:
            logging.error(f"Error during Google Maps search: {str(e)}")
        
        return competitors
    
    async def _scroll_to_load_results(self, driver, max_results: int):
        try:
            results_container = driver.find_element(By.CSS_SELECTOR, "[role='main']")
            
            for i in range(max_results // 5):
                driver.execute_script("arguments[0].scrollTop = arguments[0].scrollTop + 1000", results_container)
                await asyncio.sleep(1)
                
        except Exception as e:
            logging.warning(f"Error scrolling for more results: {str(e)}")
    
    async def _extract_competitor_data(self, driver, max_results: int) -> List[Dict[str, Any]]:
        competitors = []
        
        try:
            main=WebDriverWait(driver, 30).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, "[role='main']"))
            )

            logging.info(main.get_attribute('outerHTML'))

            logging.info("Main results container loaded")
            inner_html = main.get_attribute("innerHTML")
            print(inner_html)

            selectors_to_try = [
                "[data-result-index]",
                ".Nv2PK",
                ".lI9IFe", 
                ".section-result",
                "[role='article']",
                ".VkpGBb"
            ]
            
            result_items = []
            items = WebDriverWait(driver,10).until(
                        EC.presence_of_all_elements_located((By.CSS_SELECTOR,"div.Nv2PK.tH5CWc.THOPZb"))
                    )
                    
            if items:
                result_items = items
                logging.info(f"Found {len(items)} result items using selector:")
            if not result_items:
                logging.warning("No result items found with any selector")
                return competitors
            
            for i, item in enumerate(result_items[:max_results]):
                try:
                    competitor_data = await self._extract_single_competitor(driver, item, i)
                    
                    if not competitor_data:
                        competitor_data = self._extract_from_list_item(item, i)
                    
                    if competitor_data:
                        competitors.append(competitor_data)
                        logging.info(f"Extracted competitor {i+1}: {competitor_data.get('name', 'Unknown')}")
                    else:
                        logging.warning(f"Could not extract data for competitor {i+1}")
                        
                except Exception as e:
                    logging.warning(f"Error extracting competitor {i}: {str(e)}")
                    continue
                    
        except Exception as e:
            logging.error(f"Error extracting competitor data: {str(e)}")
        
        logging.info(f"Total competitors extracted: {len(competitors)}")
        return competitors
    
    async def _extract_single_competitor(self, driver, item, index: int) -> Optional[Dict[str, Any]]:
        try:
            try:
                item.click()
                await asyncio.sleep(3)
            except Exception:
                logging.warning("Could not click on result item, trying to extract from list view")
            
            name_selectors = [
                "h1[data-attrid='title']",
                "h1",
                ".x3AX1-LfntMc-header-title-title",
                ".SPZz6b h1",
            "[data-attrid='title']",
            "a.hfpxzc", 
            "[role='article'] a.hfpxzc"
            ]
            
            name = ""
            for selector in name_selectors:
                candidate = self._safe_extract_text(driver, selector)
                candidate = self._sanitize_business_name(candidate)
                if candidate:
                    name = candidate
                    break
            
            if not name:
                name = self._sanitize_business_name(self._safe_extract_text(item, ".fontHeadlineSmall"))
                if not name:
                    name = self._sanitize_business_name(self._safe_extract_text(item, "h3"))
                if not name:
                    name = f"Business {index + 1}"
            
            rating_selectors = [
                "[jsaction*='pane.rating.moreReviews']",
                ".fontDisplayLarge",
                ".section-star-display",
                "[data-attrid='star']"
            ]
            
            rating = 0.0
            review_count = 0
            
            for selector in rating_selectors:
                rating_text = self._safe_extract_text(driver, selector)
                if rating_text:
                    rating = self._extract_rating_number(rating_text)
                    review_count = self._extract_review_count(rating_text)
                    if rating > 0:
                        break
            
            address_selectors = [
                "[data-item-id='address']",
                ".Io6YTe",
                ".LrzXr",
                "[data-attrid='kc:/location/location:address']"
            ]
            
            address = ""
            for selector in address_selectors:
                address = self._safe_extract_text(driver, selector)
                if address:
                    break
            
            phone_selectors = [
                "[data-item-id*='phone']",
                "[data-attrid='kc:/business/phone']",
                ".fontBodyMedium[data-value*='+']"
            ]
            
            phone = ""
            for selector in phone_selectors:
                phone = self._safe_extract_text(driver, selector)
                if phone:
                    break
            
            current_url = driver.current_url
            
            place_id = self._extract_place_id(current_url)
            
            competitor_data = {
                "name": name.strip(),
                "rating": rating,
                "review_count": review_count,
                "address": address.strip(),
                "phone": phone.strip(),
                "google_maps_url": current_url,
                "place_id": place_id,
                "index": index + 1
            }
            
            if competitor_data["name"] and competitor_data["name"] != f"Business {index + 1}":
                return competitor_data
            else:
                logging.warning(f"Skipping competitor {index + 1} - no valid name found")
                return None
            
        except Exception as e:
            logging.warning(f"Error extracting competitor data: {str(e)}")
            return None
    
    def _safe_extract_text(self, element_or_driver, selector: str) -> str:
        try:
            element = element_or_driver.find_element(By.CSS_SELECTOR, selector)
            return element.text.strip()
        except (NoSuchElementException, TimeoutException):
            return ""

    def _sanitize_business_name(self, raw_name: str) -> str:
        if not raw_name:
            return ""
        name = raw_name.strip()
        invalid_names = {"النتائج", "النتايج", "نتائج", "Results", "RESULTS"}
        if name in invalid_names:
            return ""
        if len(name) <= 2:
            return ""
        return name
    
    def _extract_from_list_item(self, item, index: int) -> Optional[Dict[str, Any]]:
        try:
            name_selectors = [
            "a.hfpxzc",
            "[role='article'] a.hfpxzc",
                ".fontHeadlineSmall",
                "h3",
                ".section-result-title",
                ".fontBodyMedium",
                ".fontHeadlineSmall"
            ]
            
            name = ""
            for selector in name_selectors:
                candidate = self._safe_extract_text(item, selector)
                candidate = self._sanitize_business_name(candidate)
                if candidate:
                    name = candidate
                    break
            
            if not name:
                name = f"Business {index + 1}"
            
            rating_selectors = [
                ".section-star-display",
                ".fontCaption",
                "[aria-label*='stars']",
                ".section-rating"
            ]
            
            rating = 0.0
            review_count = 0
            
            for selector in rating_selectors:
                rating_text = self._safe_extract_text(item, selector)
                if rating_text:
                    rating = self._extract_rating_number(rating_text)
                    review_count = self._extract_review_count(rating_text)
                    if rating > 0:
                        break
            
            address_selectors = [
                ".section-result-location",
                ".fontBodyMedium",
                ".section-result-details"
            ]
            
            address = ""
            for selector in address_selectors:
                address = self._safe_extract_text(item, selector)
                if address and "rating" not in address.lower() and "star" not in address.lower():
                    break
            
            place_url = f"https://www.google.com/maps/search/{name.replace(' ', '+')}"
            
            competitor_data = {
                "name": name.strip(),
                "rating": rating,
                "review_count": review_count,
                "address": address.strip(),
                "phone": "",
                "google_maps_url": place_url,
                "place_id": "",
                "index": index + 1
            }
            
            return competitor_data
            
        except Exception as e:
            logging.warning(f"Error extracting from list item: {str(e)}")
            return None
    
    def _extract_rating_number(self, rating_text: str) -> float:
        if not rating_text:
            return 0.0
        
        match = re.search(r'^(\d+\.?\d*)', rating_text)
        if match:
            return float(match.group(1))
        return 0.0
    
    def _extract_review_count(self, review_text: str) -> int:
        if not review_text:
            return 0
        
        match = re.search(r'\(?(\d+)\s*reviews?\)?', review_text, re.IGNORECASE)
        if match:
            return int(match.group(1))
        return 0
    
    def _extract_place_id(self, url: str) -> str:

        patterns = [
            r'/place/[^/]+/@[^/]+/(\d+),',
            r'!3d[^!]*!4d[^!]*!16s([^!]+)',
            r'place_id=([^&]+)'
        ]
        
        for pattern in patterns:
            match = re.search(pattern, url)
            if match:
                return match.group(1)
        
        return ""
    
    async def get_google_reviews_url(self, competitor_data: Dict[str, Any]) -> Optional[str]:

        google_maps_url = competitor_data.get("google_maps_url")
        if not google_maps_url:
            return None
        
        if "/place/" in google_maps_url:
            if "/reviews" not in google_maps_url:
                reviews_url = google_maps_url.rstrip('/') + "/reviews"
                return reviews_url
        
        return google_maps_url
    
    async def search_and_get_reviews_urls(self, industry: str, region: str, max_competitors: int = 10) -> List[Dict[str, Any]]:

        competitors = await self.search_competitors(industry, region, max_competitors)
        
        competitors_with_reviews = []
        for competitor in competitors:
            reviews_url = await self.get_google_reviews_url(competitor)
            if reviews_url:
                competitor["reviews_url"] = reviews_url
                competitors_with_reviews.append(competitor)
        
        return competitors_with_reviews

if __name__ == "__main__":
    async def test_competitor_search():
        service = CompetitorSearchService()
        
        try:
            competitors = await service.search_and_get_reviews_urls(
                industry="diving",
                region="Saudi Arabia",
                max_competitors=5
            )
            
            print(f"Found {len(competitors)} competitors:")
            for i, competitor in enumerate(competitors, 1):
                print(f"{i}. {competitor['name']}")
                print(f"   Rating: {competitor['rating']}/5 ({competitor['review_count']} reviews)")
                print(f"   Address: {competitor['address']}")
                print(f"   Reviews URL: {competitor.get('reviews_url', 'N/A')}")
                print()
                
        except Exception as e:
            print(f"Error: {str(e)}")
    
    asyncio.run(test_competitor_search())
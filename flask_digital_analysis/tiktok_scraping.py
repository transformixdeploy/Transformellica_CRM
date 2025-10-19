from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys
from selenium.webdriver import ActionChains
from selenium.common.exceptions import TimeoutException, StaleElementReferenceException
import re, time, urllib.parse, os, json

def to_western_digits(s: str) -> str:
    arabic_map  = str.maketrans("٠١٢٣٤٥٦٧٨٩", "0123456789")
    persian_map = str.maketrans("۰۱۲۳۴۵۶۷۸۹", "0123456789")
    return s.translate(arabic_map).translate(persian_map)

def parse_count(s: str) -> int | None:
    if not s:
        return None
    s = to_western_digits(s.strip().upper())
    s = s.replace(",", "").replace(" ", "")
    m = re.match(r"^(\d+(?:\.\d+)?)([KMB])?$", s)
    if m:
        num = float(m.group(1))
        suf = m.group(2)
        if suf == "K": num *= 1_000
        elif suf == "M": num *= 1_000_000
        elif suf == "B": num *= 1_000_000_000
        return int(num)
    try:
        return int(s)
    except Exception:
        return None

def get_text(wait, candidates):
    for by, sel in candidates:
        try:
            el = wait.until(EC.visibility_of_element_located((by, sel)))
            txt = el.text.strip()
            if txt:
                return txt
        except Exception:
            pass
    return ""

def _parse_cookie_string(cookie_str: str):
    cookies = []
    for part in cookie_str.split(';'):
        if '=' in part:
            name, value = part.split('=', 1)
            name = name.strip(); value = value.strip()
            if name:
                cookies.append({"name": name, "value": value, "domain": ".tiktok.com", "path": "/"})
    return cookies

def load_tiktok_cookies():

    raw = os.environ.get("TIKTOK_COOKIES", "").strip()
    if raw:
        try:
            data = json.loads(raw)
            if isinstance(data, dict) and "cookies" in data:
                return list(data.get("cookies") or [])
            if isinstance(data, list):
                return data
        except Exception:
            return _parse_cookie_string(raw)

    try:
        if os.path.exists("tiktok_config.json"):
            with open("tiktok_config.json", "r", encoding="utf-8") as f:
                cfg = json.load(f)
                if isinstance(cfg, dict):
                    cookies = cfg.get("cookies") or cfg.get("session_cookies") or []
                    if isinstance(cookies, dict):
                        cookie_str = "; ".join([f"{k}={v}" for k, v in cookies.items()])
                        return _parse_cookie_string(cookie_str)
                    if isinstance(cookies, str):
                        return _parse_cookie_string(cookies)
                    if isinstance(cookies, list):
                        return cookies
    except Exception:
        pass

    return []

def ensure_post_grid(wait):
    return wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, '[data-e2e="user-post-item-list"]')))

def scroll_grid_and_collect_links(driver, wait, limit=None, max_scrolls=800, idle_rounds=12):

    container = ensure_post_grid(wait)

    try:
        latest_btn = driver.find_element(By.XPATH, '//button[contains(@class,"button") and normalize-space(.)="Latest"]')
        driver.execute_script("arguments[0].click();", latest_btn)
        time.sleep(0.2)
    except Exception:
        pass
    links = set()
    last_count = -1
    last_scroll_h = -1
    stagnant_cycles = 0

    actions = ActionChains(driver)
    for _ in range(max_scrolls):
        items = container.find_elements(By.CSS_SELECTOR, 'div[id^="column-item-video-container-"]')
        for item in items:
            try:
                anchors = item.find_elements(By.CSS_SELECTOR, 'a[href*="/video/"], a[href*="/photo/"]')
                for a in anchors:
                    href = a.get_attribute("href")
                    if href and ("/video/" in href or "/photo/" in href):
                        links.add(href.split("?")[0])
            except Exception:
                continue

        if limit and len(links) >= limit:
            break


        try:
            driver.execute_script("arguments[0].scrollTop = arguments[0].scrollTop + arguments[0].clientHeight;", container)
        except Exception:
            pass
        try:
            actions.move_to_element(container).click(container).send_keys(Keys.END).perform()
        except Exception:
            pass
        time.sleep(0.8)

        try:
            scroll_h = driver.execute_script("return arguments[0].scrollHeight;", container)
        except Exception:
            scroll_h = last_scroll_h
        if len(links) == last_count and (scroll_h == last_scroll_h):
            stagnant_cycles += 1
        else:
            stagnant_cycles = 0
            last_count = len(links)
            last_scroll_h = scroll_h

        if stagnant_cycles >= idle_rounds:
            break

    if (not limit) or len(links) < limit:
        try:
            body = driver.find_element(By.TAG_NAME, 'body')
            for _ in range(6):
                body.send_keys(Keys.END)
                time.sleep(0.6)
                items = container.find_elements(By.CSS_SELECTOR, 'div[id^="column-item-video-container-"]')
                for item in items:
                    try:
                        anchors = item.find_elements(By.CSS_SELECTOR, 'a[href*="/video/"], a[href*="/photo/"]')
                        for a in anchors:
                            href = a.get_attribute("href")
                            if href and ("/video/" in href or "/photo/" in href):
                                links.add(href.split("?")[0])
                    except Exception:
                        continue
        except Exception:
            pass

    return list(links)

def scrape_video_page(driver, url, wait, timeout=25):
    import re, time, urllib.parse
    from selenium.webdriver.common.by import By
    from selenium.webdriver.support import expected_conditions as EC
    from selenium.common.exceptions import TimeoutException

    driver.execute_script("window.open(arguments[0], '_blank');", url)
    driver.switch_to.window(driver.window_handles[-1])

    def scroll_into_view(el):
        try:
            driver.execute_script("arguments[0].scrollIntoView({block:'center'});", el)
            time.sleep(0.15)
        except Exception:
            pass

    try:
        caption_text, hashtags = "", []
        caption_el = None
        for by, sel in [
            (By.CSS_SELECTOR, '[data-e2e="browse-video-desc"]'),
            (By.XPATH, '//*[@data-e2e="browse-video-desc"]'),
            (By.XPATH, '(//div[contains(@class,"DivMainContent")]//p)[1]'),
            (By.XPATH, '(//div[contains(@class,"DivWrapper")]//p)[1]')
        ]:
            try:
                caption_el = WebDriverWait(driver, timeout).until(
                    EC.presence_of_element_located((by, sel))
                ); break
            except TimeoutException:
                continue

        if caption_el:
            scroll_into_view(caption_el)
            try:
                caption_text = (caption_el.text or "").strip()
                tag_container = caption_el
            except Exception:
                caption_text = ""
                tag_container = caption_el
            # hashtags
            try:
                tag_els = tag_container.find_elements(By.XPATH, './/a[contains(@href, "/tag/")]')
                for t in tag_els:
                    txt = (t.text or "").strip()
                    if txt.startswith("#"):
                        hashtags.append(txt)
                    else:
                        href = t.get_attribute("href") or ""
                        if "/tag/" in href:
                            tag = urllib.parse.urlparse(href).path.split("/tag/")[1].strip("/")
                            if tag: hashtags.append("#"+tag)
            except Exception:
                pass

        like_txt = ""
        comment_txt = ""

        for by, sel in [
            (By.CSS_SELECTOR, 'strong[data-e2e="like-count"]'),
            (By.XPATH, '//strong[@data-e2e="like-count"]'),
        ]:
            try:
                el = WebDriverWait(driver, 6).until(EC.presence_of_element_located((by, sel)))
                scroll_into_view(el); like_txt = (el.text or "").strip()
                if like_txt: break
            except TimeoutException:
                pass

        for by, sel in [
            (By.CSS_SELECTOR, 'strong[data-e2e="comment-count"]'),
            (By.XPATH, '//strong[@data-e2e="comment-count"]'),
        ]:
            try:
                el = WebDriverWait(driver, 6).until(EC.presence_of_element_located((by, sel)))
                scroll_into_view(el); comment_txt = (el.text or "").strip()
                if comment_txt: break
            except TimeoutException:
                pass

        if not like_txt:
            try:
                btn = driver.find_element(By.XPATH, '//button[.//span[@data-e2e="like-icon"] or .//span[contains(@data-e2e,"browse-like-icon")]]')
                scroll_into_view(btn)
                aria = (btn.get_attribute("aria-label") or "")
                m = re.search(r'([\d\s,\.KMB]+)\s+Like', aria, re.I)
                if m: like_txt = m.group(1)
            except Exception: pass

        if not comment_txt:
            try:
                btn = driver.find_element(By.XPATH, '//button[.//span[@data-e2e="comment-icon"] or .//span[contains(@data-e2e,"browse-comment-icon")]]')
                scroll_into_view(btn)
                aria = (btn.get_attribute("aria-label") or "")
                m = re.search(r'([\d\s,\.KMB]+)\s+Comment', aria, re.I)
                if m: comment_txt = m.group(1)
            except Exception: pass

        if not like_txt:
            try:
                el = driver.find_element(By.XPATH, '//button[.//span[contains(@data-e2e,"like")]]//strong')
                scroll_into_view(el); like_txt = (el.text or "").strip()
            except Exception: pass
        if not comment_txt:
            try:
                el = driver.find_element(By.XPATH, '//button[.//span[contains(@data-e2e,"comment")]]//strong')
                scroll_into_view(el); comment_txt = (el.text or "").strip()
            except Exception: pass

        return {
            "url": url,
            "caption": caption_text,
            "hashtags": list(dict.fromkeys(hashtags)),
            "likes": parse_count(like_txt),
            "comments": parse_count(comment_txt),
            "raw_text": {"likes": like_txt or "", "comments": comment_txt or ""}
        }

    finally:
        driver.close()
        driver.switch_to.window(driver.window_handles[0])



def scrape_profile_and_posts(username: str, *, headless: bool = False, max_posts: int | None = 12):
    profile_url = f"https://www.tiktok.com/@{username}"

    opts = webdriver.ChromeOptions()
    if headless:
        opts.add_argument("--headless=new")
    opts.add_argument("--disable-blink-features=AutomationControlled")
    opts.add_argument("--start-maximized")
    opts.add_argument("--no-sandbox")
    opts.add_argument(
        "--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36"
    )
    user_data_dir = os.environ.get("TIKTOK_USER_DATA_DIR", "").strip()
    if user_data_dir:
        opts.add_argument(f"--user-data-dir={user_data_dir}")

    driver = webdriver.Chrome(options=opts)
    wait = WebDriverWait(driver, 30)

    try:
        driver.get("https://www.tiktok.com/")
        cookies = load_tiktok_cookies()
        for ck in cookies:
            try:
                cookie_payload = {k: v for k, v in ck.items() if k in {"name","value","domain","path","expiry","secure","httpOnly"}}
                if "domain" not in cookie_payload:
                    cookie_payload["domain"] = ".tiktok.com"
                if "path" not in cookie_payload:
                    cookie_payload["path"] = "/"
                driver.add_cookie(cookie_payload)
            except Exception:
                continue

        driver.get(profile_url)

        for sel in [
            (By.CSS_SELECTOR, 'button[data-e2e="privacy-center-accept"]'),
            (By.XPATH, '//button[contains(., "Accept")]'),
        ]:
            try:
                WebDriverWait(driver, 5).until(EC.element_to_be_clickable(sel)).click()
                break
            except Exception:
                pass

        name = get_text(wait, [
            (By.CSS_SELECTOR, '[data-e2e="user-title"] h1'),
            (By.CSS_SELECTOR, 'h1[data-e2e="user-title"]'),
            (By.CSS_SELECTOR, '[data-e2e="user-title"]'),
        ])
        following_txt = get_text(wait, [
            (By.CSS_SELECTOR, '[data-e2e="following-count"]'),
            (By.XPATH, '//*[@data-e2e="following-count"]'),
        ])
        followers_txt = get_text(wait, [
            (By.CSS_SELECTOR, '[data-e2e="followers-count"]'),
            (By.XPATH, '//*[@data-e2e="followers-count"]'),
        ])
        likes_txt = get_text(wait, [
            (By.CSS_SELECTOR, '[data-e2e="likes-count"]'),
            (By.XPATH, '//*[@data-e2e="likes-count"]'),
        ])
        bio = get_text(wait, [
            (By.CSS_SELECTOR, '[data-e2e="user-bio"]'),
            (By.XPATH, '//*[@data-e2e="user-bio"]'),
        ])

        links = scroll_grid_and_collect_links(driver, wait, limit=max_posts)
        posts = []
        for i, link in enumerate(links, start=1):
            try:
                posts.append(scrape_video_page(driver, link, wait))
            except Exception as e:
                posts.append({"url": link, "error": str(e)})
            time.sleep(0.8)
        return {
            "profile": {
                "username": username,
                "name": name,
                "following": parse_count(following_txt),
                "followers": parse_count(followers_txt),
                "likes_total": parse_count(likes_txt),
                "bio": bio,
            },
            "post_count_scanned": len(posts),
            "posts": posts
        }

    finally:
        time.sleep(1)
        driver.quit()

if __name__ == "__main__":
    data = scrape_profile_and_posts("thetransformix", headless=True, max_posts=100)    
    from pprint import pprint
    pprint(data)
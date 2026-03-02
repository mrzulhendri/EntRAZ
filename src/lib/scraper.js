import axios from "axios";
import * as cheerio from "cheerio";

/**
 * RAZ Scraper Engine
 * Support for Video, Comic, and Music scraping based on selectors.
 */
export async function scrapeContent(url, selectors) {
    try {
        const { data } = await axios.get(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            }
        });

        const $ = cheerio.load(data);
        const results = [];

        // Assuming selectors.container is the main repeat element
        $(selectors.container).each((i, el) => {
            const item = {};

            if (selectors.title) item.title = $(el).find(selectors.title).text().trim();
            if (selectors.link) item.link = $(el).find(selectors.link).attr("href");
            if (selectors.thumbnail) item.thumbnail = $(el).find(selectors.thumbnail).attr("src") || $(el).find(selectors.thumbnail).attr("data-src");
            if (selectors.description) item.description = $(el).find(selectors.description).text().trim();

            // Relative URL fix
            if (item.link && !item.link.startsWith("http")) {
                const base = new URL(url).origin;
                item.link = base + item.link;
            }

            if (item.title) results.push(item);
        });

        return results;
    } catch (error) {
        console.error(`Scraping failed for ${url}:`, error.message);
        return [];
    }
}

/**
 * extractMediaSource - Advanced scraper to find actual video/m3u8 links inside a page
 */
export async function extractMediaSource(url, videoSelector) {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        // Attempt to find <source>, <video>, or scripts with .m3u8
        let source = $(videoSelector).attr("src") || $(videoSelector).find("source").attr("src");

        if (!source) {
            // Look into scripts for m3u8 patterns
            const scriptContent = $("script").text();
            const m3u8Match = scriptContent.match(/https?:\/\/[^"']+\.m3u8[^"']*/);
            if (m3u8Match) source = m3u8Match[0];
        }

        return source;
    } catch (error) {
        return null;
    }
}

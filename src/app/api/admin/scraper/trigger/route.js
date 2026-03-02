import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { scrapeContent } from "@/lib/scraper";

export async function POST(request) {
    try {
        const { scraperId } = await request.json();

        // 1. Fetch scraper config from Supabase
        const { data: scraper, error } = await supabase
            .from("scrapers")
            .select("*")
            .eq("id", scraperId)
            .single();

        if (error || !scraper) {
            return NextResponse.json({ error: "Scraper not found" }, { status: 404 });
        }

        // 2. Run scraping logic
        const results = await scrapeContent(scraper.target_url, scraper.selectors);

        // 3. Process results (In a real app, you would upsert these into 'contents' table)
        // For now, we return the counts

        await supabase
            .from("scrapers")
            .update({ last_run: new Date().toISOString() })
            .eq("id", scraperId);

        return NextResponse.json({
            message: `Scraped ${results.length} items from ${scraper.name}`,
            items: results.slice(0, 5) // Return sample
        });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

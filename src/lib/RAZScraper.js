/**
 * ============================================================
 * RAZScraper.js - Web Scraper Engine untuk EntRAZ
 * ============================================================
 * Terakhir diperbarui: 2026-02-17
 * Versi: 1.0.0
 * 
 * Deskripsi:
 * Engine web scraper yang menggunakan Cheerio untuk
 * mengambil metadata konten dari berbagai sumber website.
 * Mendukung scraping judul, deskripsi, thumbnail, episode,
 * chapter, dan informasi lainnya.
 * 
 * Catatan: Scraper TIDAK men-download file video/gambar.
 * Konten tetap di-stream dari sumber aslinya.
 * ============================================================
 */

import axios from 'axios';
import * as cheerio from 'cheerio';

/**
 * RAZScraper - Kelas utama untuk web scraping
 */
class RAZScraper {
    /**
     * constructor - Inisialisasi scraper
     * @param {string} url - URL sumber yang akan di-scrape
     */
    constructor(url) {
        this.url = url;
        this.baseUrl = new URL(url).origin;
        this.$ = null; // Instance Cheerio
        this.html = '';
    }

    /**
     * fetch - Mengambil HTML dari URL sumber
     * Menggunakan headers browser untuk menghindari blocking
     * @returns {RAZScraper} this (untuk chaining)
     */
    async fetch() {
        try {
            const response = await axios.get(this.url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.5',
                    'Accept-Encoding': 'gzip, deflate',
                    'Connection': 'keep-alive',
                },
                timeout: 15000, // Timeout 15 detik
                maxRedirects: 5,
            });

            this.html = response.data;
            this.$ = cheerio.load(this.html);
            return this;
        } catch (error) {
            throw new Error(`Gagal mengambil data dari URL: ${error.message}`);
        }
    }

    /**
     * resolveUrl - Mengubah URL relatif menjadi absolut
     * @param {string} url - URL yang mungkin relatif
     * @returns {string} URL absolut
     */
    resolveUrl(url) {
        if (!url) return '';
        if (url.startsWith('http://') || url.startsWith('https://')) return url;
        if (url.startsWith('//')) return 'https:' + url;
        if (url.startsWith('/')) return this.baseUrl + url;
        return this.baseUrl + '/' + url;
    }

    /**
     * extractMetadata - Mengambil metadata umum dari halaman
     * Mencoba berbagai selector yang umum digunakan website
     * @returns {Object} Metadata konten
     */
    extractMetadata() {
        const $ = this.$;
        if (!$) throw new Error('Halaman belum di-fetch. Panggil fetch() terlebih dahulu.');

        // Ambil judul - coba berbagai selector
        const title =
            $('h1.entry-title').text().trim() ||
            $('h1.title').text().trim() ||
            $('h1').first().text().trim() ||
            $('meta[property="og:title"]').attr('content') ||
            $('title').text().trim() ||
            '';

        // Ambil deskripsi/sinopsis
        const description =
            $('div.entry-content p').first().text().trim() ||
            $('div.sinopsis p').text().trim() ||
            $('div.synopsis p').text().trim() ||
            $('div.description p').text().trim() ||
            $('meta[property="og:description"]').attr('content') ||
            $('meta[name="description"]').attr('content') ||
            '';

        // Ambil gambar cover/thumbnail
        const coverImage =
            this.resolveUrl($('div.thumb img').attr('src')) ||
            this.resolveUrl($('img.wp-post-image').attr('src')) ||
            this.resolveUrl($('div.cover img').attr('src')) ||
            this.resolveUrl($('meta[property="og:image"]').attr('content')) ||
            '';

        // Ambil genre
        const genres = [];
        $('span.genre a, div.genre a, a[rel="tag"], .genres a').each((_, el) => {
            const genre = $(el).text().trim();
            if (genre && !genres.includes(genre)) {
                genres.push(genre);
            }
        });

        // Ambil rating
        const rating =
            parseFloat($('div.rating strong').text()) ||
            parseFloat($('span.rating').text()) ||
            parseFloat($('div.score').text()) ||
            0;

        // Ambil status
        const statusText = $('span.status, div.status, td:contains("Status")').text().toLowerCase();
        let status = 'ongoing';
        if (statusText.includes('completed') || statusText.includes('tamat') || statusText.includes('end')) {
            status = 'completed';
        } else if (statusText.includes('hiatus')) {
            status = 'hiatus';
        }

        // Ambil tahun rilis
        const yearMatch = $('span.year, div.year, time.year').text().match(/\d{4}/);
        const year = yearMatch ? parseInt(yearMatch[0]) : null;

        // Ambil author/penulis
        const author =
            $('span.author a').text().trim() ||
            $('div.author').text().replace('Author:', '').trim() ||
            '';

        return {
            title,
            description: description.substring(0, 2000), // Batasi panjang deskripsi
            cover_image: coverImage,
            genres,
            rating: Math.min(rating, 10), // Pastikan tidak lebih dari 10
            status,
            year,
            author,
            source_url: this.url,
        };
    }

    /**
     * extractEpisodes - Mengambil daftar episode dari halaman
     * Mencari link episode dalam berbagai format umum
     * @returns {Array} Daftar episode dengan nomor, judul, dan URL
     */
    extractEpisodes() {
        const $ = this.$;
        if (!$) throw new Error('Halaman belum di-fetch. Panggil fetch() terlebih dahulu.');

        const episodes = [];

        // Coba berbagai selector untuk daftar episode
        const episodeSelectors = [
            'div.episodelist ul li a',
            'ul.episodios li a',
            'div.eplister ul li a',
            'div.episodes-list a',
            'ul.episode-list li a',
            'div.ep-list a',
            'ul.list-episode li a',
        ];

        for (const selector of episodeSelectors) {
            $(selector).each((index, el) => {
                const link = $(el).attr('href');
                const text = $(el).text().trim();

                // Coba ekstrak nomor episode dari teks
                const epMatch = text.match(/(?:ep|episode|eps)[\s.-]*(\d+)/i) ||
                    text.match(/(\d+)/);
                const epNumber = epMatch ? parseInt(epMatch[1]) : index + 1;

                if (link) {
                    episodes.push({
                        episode_number: epNumber,
                        title: text,
                        video_url: this.resolveUrl(link),
                    });
                }
            });

            if (episodes.length > 0) break; // Berhenti jika sudah menemukan episode
        }

        return episodes;
    }

    /**
     * extractChapters - Mengambil daftar chapter dari halaman
     * Untuk konten komik/manga/manwa
     * @returns {Array} Daftar chapter dengan nomor, judul, dan URL
     */
    extractChapters() {
        const $ = this.$;
        if (!$) throw new Error('Halaman belum di-fetch. Panggil fetch() terlebih dahulu.');

        const chapters = [];

        // Coba berbagai selector untuk daftar chapter
        const chapterSelectors = [
            'div.chapterlist ul li a',
            'ul.chapter-list li a',
            'div.chapters ul li a',
            'div.listing-chapters_wrap a',
            'ul.main li a',
            'div.chapter-list a',
        ];

        for (const selector of chapterSelectors) {
            $(selector).each((index, el) => {
                const link = $(el).attr('href');
                const text = $(el).text().trim();

                // Coba ekstrak nomor chapter dari teks
                const chMatch = text.match(/(?:ch|chapter|chap)[\s.-]*(\d+[\.\d]*)/i) ||
                    text.match(/(\d+[\.\d]*)/);
                const chNumber = chMatch ? parseFloat(chMatch[1]) : index + 1;

                if (link) {
                    chapters.push({
                        chapter_number: chNumber,
                        title: text,
                        url: this.resolveUrl(link),
                    });
                }
            });

            if (chapters.length > 0) break;
        }

        return chapters;
    }

    /**
     * extractChapterImages - Mengambil daftar gambar dari halaman chapter
     * Untuk membaca komik/manga/manwa
     * @param {string} chapterUrl - URL halaman chapter
     * @returns {Array} Daftar URL gambar
     */
    async extractChapterImages(chapterUrl) {
        const response = await axios.get(chapterUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Referer': this.baseUrl,
            },
            timeout: 15000,
        });

        const $ch = cheerio.load(response.data);
        const images = [];

        // Coba berbagai selector untuk gambar chapter
        const imgSelectors = [
            'div.reading-content img',
            'div#readerarea img',
            'div.chapter-content img',
            'div.page-break img',
            'div.container-chapter-reader img',
            'div.reading-area img',
        ];

        for (const selector of imgSelectors) {
            $ch(selector).each((_, el) => {
                const src = $ch(el).attr('src') || $ch(el).attr('data-src') || $ch(el).attr('data-lazy-src');
                if (src && !src.includes('logo') && !src.includes('icon')) {
                    images.push(this.resolveUrl(src.trim()));
                }
            });

            if (images.length > 0) break;
        }

        return images;
    }

    /**
     * extractVideoUrl - Mengambil URL video dari halaman episode
     * Mencari iframe embed atau direct video URL
     * @param {string} episodeUrl - URL halaman episode
     * @returns {string} URL video (embed iframe src atau direct URL)
     */
    async extractVideoUrl(episodeUrl) {
        const response = await axios.get(episodeUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Referer': this.baseUrl,
            },
            timeout: 15000,
        });

        const $ep = cheerio.load(response.data);

        // Coba cari iframe video
        const iframeSrc =
            $ep('iframe[src*="embed"]').attr('src') ||
            $ep('iframe[src*="player"]').attr('src') ||
            $ep('iframe[src*="video"]').attr('src') ||
            $ep('iframe').first().attr('src') ||
            '';

        if (iframeSrc) return this.resolveUrl(iframeSrc);

        // Coba cari direct video source
        const videoSrc =
            $ep('video source').attr('src') ||
            $ep('video').attr('src') ||
            '';

        if (videoSrc) return this.resolveUrl(videoSrc);

        // Coba cari dari script (banyak player menyimpan URL di JavaScript)
        const scripts = $ep('script').toArray();
        for (const script of scripts) {
            const scriptContent = $ep(script).html() || '';
            // Cari pola URL video umum
            const urlMatch = scriptContent.match(/(?:file|source|src|url|video_url)\s*[:=]\s*['"](https?:\/\/[^'"]+\.(?:mp4|m3u8|mkv))['"]/i);
            if (urlMatch) return urlMatch[1];
        }

        return episodeUrl; // Fallback: gunakan URL episode itu sendiri
    }

    /**
     * checkLinkStatus - Memeriksa apakah sebuah URL masih aktif
     * @param {string} url - URL yang akan diperiksa
     * @returns {Object} { status, statusCode, responseTime }
     */
    static async checkLinkStatus(url) {
        const startTime = Date.now();
        try {
            const response = await axios.head(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                },
                timeout: 10000,
                maxRedirects: 5,
                validateStatus: (status) => status < 500, // Terima semua selain 5xx
            });

            const responseTime = Date.now() - startTime;
            const statusCode = response.status;

            if (statusCode >= 200 && statusCode < 400) {
                return { status: 'active', statusCode, responseTime };
            } else if (statusCode === 404) {
                return { status: 'offline', statusCode, responseTime };
            } else {
                return { status: 'error', statusCode, responseTime };
            }
        } catch (error) {
            return {
                status: 'offline',
                statusCode: 0,
                responseTime: Date.now() - startTime,
                error: error.message
            };
        }
    }

    /**
     * preview - Fungsi utama untuk preview konten dari URL
     * Mengambil semua informasi yang tersedia
     * @returns {Object} Preview data lengkap
     */
    async preview() {
        await this.fetch();

        const metadata = this.extractMetadata();
        const episodes = this.extractEpisodes();
        const chapters = this.extractChapters();

        // Tentukan tipe konten berdasarkan data yang ditemukan
        let suggestedType = 'movie';
        if (chapters.length > 0) {
            suggestedType = 'comic'; // Bisa diubah ke manga/manwa oleh user
        } else if (episodes.length > 1) {
            suggestedType = 'anime'; // Bisa diubah ke donghua/series oleh user
        }

        return {
            ...metadata,
            suggested_type: suggestedType,
            episodes,
            chapters,
            episodes_count: episodes.length,
            chapters_count: chapters.length,
        };
    }
}

export default RAZScraper;

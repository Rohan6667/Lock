const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

async function start() {
    const browser = await puppeteer.launch({ 
        headless: "new", 
        args: ['--no-sandbox', '--disable-setuid-sandbox'] 
    });
    const page = await browser.newPage();
    
    // Stealth Headers - Site ko lagega ki ye real Chrome browser hai
    await page.setExtraHTTPHeaders({
        'Accept-Language': 'en-US,en;q=0.9'
    });

    try {
        console.log("Navigating to: " + process.env.TARGET_URL);
        await page.goto(process.env.TARGET_URL, { waitUntil: 'networkidle2', timeout: 60000 });

        // 1. First Click: Isko delay ke saath handle karo
        await new Promise(r => setTimeout(r, 3000));
        await page.evaluate(() => {
            const btn = document.querySelector('.btn-primary') || document.querySelector('button');
            if(btn) btn.click();
        });

        // 2. Timer Handling: 8 seconds + 2 seconds buffer
        console.log("Waiting for timer...");
        await new Promise(r => setTimeout(r, 10000));

        // 3. Final Step: Button ko locate karke force click
        console.log("Locating final button...");
        await page.evaluate(() => {
            // Shortener sites aksar button ko 'disabled' rakhti hain, hum use 'enabled' karenge
            const btn = document.querySelector('#btn-main') || document.querySelector('.get-link');
            if(btn) {
                btn.removeAttribute('disabled');
                btn.click();
            }
        });

        await new Promise(r => setTimeout(r, 5000));
        console.log("Redirected URL: " + page.url());

    } catch (e) {
        console.error("Bot Blocked / Error: " + e.message);
    } finally {
        await browser.close();
    }
}
start();

hereconst puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin());

async function start() {
    // Random sleep takriban 0 se 10 minute ka delay (GitHub detection se bachne ke liye)
    const randomStartDelay = Math.floor(Math.random() * 600000);
    await new Promise(r => setTimeout(r, randomStartDelay));

    const browser = await puppeteer.launch({
        args: [
            '--no-sandbox',
            '--disable-blink-features=AutomationControlled', // Yeh crucial hai
            '--window-size=1920,1080'
        ]
    });

    const page = await browser.newPage();
    // Real-world user agent
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36');

    try {
        await page.goto(process.env.TARGET_URL, { waitUntil: 'networkidle2' });
        
        // Random Scrolling
        for(let i=0; i<3; i++) {
            await page.evaluate(() => window.scrollBy(0, window.innerHeight));
            await new Promise(r => setTimeout(r, 2000 + Math.random() * 3000));
        }

        // Click action...
    } catch(e) { console.log("Done"); }
    finally { await browser.close(); }
}
start();

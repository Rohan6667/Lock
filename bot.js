const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

async function start() {
    const browser = await puppeteer.launch({ 
        headless: "new", 
        args: ['--no-sandbox', '--disable-setuid-sandbox'] 
    });
    const page = await browser.newPage();
    
    // Step: Helper function to click buttons by text
    const clickButtonByText = async (text) => {
        console.log(`[LOG] Searching for: ${text}`);
        const [btn] = await page.$x(`//a[contains(text(), '${text}')] | //button[contains(text(), '${text}')]`);
        if (btn) {
            await btn.click();
            console.log(`[SUCCESS] Clicked: ${text}`);
            return true;
        }
        return false;
    };

    try {
        await page.goto(process.env.TARGET_URL, { waitUntil: 'domcontentloaded' });
        
        // --- CYCLE 1 ---
        await new Promise(r => setTimeout(r, 3000));
        await clickButtonByText("I am not a robot");
        await new Promise(r => setTimeout(r, 2000));
        await clickButtonByText("Click 2x");
        await new Promise(r => setTimeout(r, 2000));
        await clickButtonByText("Download Link");

        // --- CYCLE 2 (Repeat) ---
        await new Promise(r => setTimeout(r, 4000));
        await clickButtonByText("I am not a robot");
        await new Promise(r => setTimeout(r, 2000));
        await clickButtonByText("Click 2x");
        await new Promise(r => setTimeout(r, 2000));
        await clickButtonByText("Download Link");

        // --- FINAL TIMER & GET LINK ---
        console.log("[LOG] Waiting for 8s final timer...");
        await new Promise(r => setTimeout(r, 9000));
        
        await page.evaluate(() => {
            const btn = document.querySelector('#btn-main'); // Tumhari site ke hisab se selector
            if(btn) btn.click();
        });

        await new Promise(r => setTimeout(r, 5000));
        console.log("Final Destination URL: " + page.url());

    } catch (e) {
        console.error("Bot Failed at: " + e.message);
    } finally {
        await browser.close();
    }
}
start();

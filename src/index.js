const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: false,
  });
  const page = await browser.newPage();

  await page.goto('https://shop.join-eby.com/products/bourbon-only-bra');
  // await page.screenshot({ path: 'example.png'})
  // Set screen size
  await page.setViewport({
    width: 390,
    height: 840
  });

  // Wait for the element with id 'current_bra_size_selected' to load and get its text content
  await page.waitForSelector('#current_bra_size_selected');
  let braSizeText = await page.$eval('#current_bra_size_selected', el => el.textContent);

  // Extract "SDD" and "(32 DD)" from the string
  let [sdd, size] = braSizeText.split(' ');

  await page.click('.select-dropdown.dropdown-trigger'); // replace with your selector

  // 2. Select a variant size XS.
  await page.waitForSelector('ul.dropdown-content.select-dropdown li:nth-child(2)');
  await page.click('ul.dropdown-content.select-dropdown li:nth-child(2)');

  // 2. Select a variant size XS.
  await page.evaluate(() => {
    let cupSizeSelector = Array.from(document.querySelectorAll('.select-dropdown.dropdown-trigger'));
    cupSizeSelector[1].click(); // click the second element


    let cupSizeLetter = Array.from(document.querySelectorAll('.dropdown-content.select-dropdown li'));
    cupSizeLetter[9].click(); // click the second element
  })

  await page.click('#AddToCartText');

  await page.evaluate(() => {
    window.scrollBy({
      top: -100, // could be negative value
      left: 0,
      behavior: 'smooth'
    });
  });

  await page.waitForTimeout(5000);

  await page.click('.eby-mobile-nav .cart-link.jsDrawerOpenRight')

  let variantCartSelText = await page.$eval('.variant-cart-sel.inline', el => el.textContent);
  console.assert(variantCartSelText.includes(sdd), 'The variant-cart-sel inline element does not contain the expected text.');

  let ebyPropText = await page.$eval('.ebyprop.inline', el => el.textContent);
  console.assert(ebyPropText.includes(size), 'The ebyprop inline element does not contain the expected text.');

  // await browser.close();
})();
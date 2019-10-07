const puppeteer = require('puppeteer')

const scrapeContents = async () => {
  const browser = await puppeteer.launch({headless: true})
  const page = await browser.newPage()

  await page.goto('https://stackexchange.com/leagues/1/week/stackoverflow', {waitUntil: 'networkidle2'})

  await page.screenshot({path: 'rating-page.png'})

  // execute code in the DOM
  const data = await page.evaluate(() => {
    const nodes = Array.from(document.querySelectorAll('div[class="statsBox statsBoxWider"]'))

    const reputations = nodes
      .filter(e => e.innerHTML.includes('total reputation'))
      .map(e => e.children[0].innerHTML)

    return reputations
  })

  await browser.close()

  console.log(data)

  //return data;
}

scrapeContents()
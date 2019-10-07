const puppeteer = require('puppeteer')

// This is where we'll put the code to get around the tests.
const preparePageForTests = async (page) => {
  // Pass the User-Agent Test.
  const userAgent = 'Mozilla/5.0 (X11; Linux x86_64)' + 
    'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.39 Safari/537.36';
    
  await page.setUserAgent(userAgent);
}

const scrapeContents = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 100
  })
  const page = await browser.newPage()
  //await preparePageForTests(page);

  await page.goto('https://www.facebook.com/login')

  // login page
  /**
   * Login to the Facebook
   */
  //await page.screenshot({path: '1.png'})

  await page.type('[name=email]', 'kxiang168@gmail.com')

  await page.type('[name=pass]', 'cykx#fb#0801')

  //await page.screenshot({path: '2.png'})

  await page.click('[type=submit]')

  // social page
  /*
  await page.waitFor(5000)

  await page.goto(`https://www.facebook.com/${username}`)
  */
  
  //await page.goto(`https://www.facebook.com/${username}`)

  await page.waitForSelector('div[class="_4299"]', {
    visible: true
  })

  await page.waitFor(5000)

  //await page.screenshot({path: '3.png'})

  // execute code in the DOM
  /**
   * Search for the post with most reactions
   */
  const data = await page.evaluate(() => {
    const mostReacted = Array.from(document.querySelectorAll('div[class="_78bu"]'))
      .map(e => {
        const element = e.getElementsByClassName('_81hb')[0]
        if (element !== null && element !== undefined) {
          const innerHTML = element.innerHTML
          if (innerHTML.includes('K')) {
            return parseFloat(innerHTML.slice(0, innerHTML.indexOf('K'))) * 1000 // parseFloat(innerHTML.slice(0, -1)) * 1000
          }
          return parseFloat(innerHTML)
        } else 
          return 0
      })
      .reduce((x, y) => x > y ? x : y)

    /**
     * Filter the array to get the HTMLElement of the most reacted post
     */
    const most = Array.from(document.querySelectorAll('div[class="_78bu"]')).filter(e => {
      const element = e.getElementsByClassName('_81hb')[0]
      if(element !== null && element !== undefined) {
        const innerHTML = element.innerHTML
        if (innerHTML.includes('K')) {
          return parseFloat(innerHTML.slice(0, innerHTML.indexOf('K'))) * 1000 === mostReacted
        }
        return parseFloat(innerHTML) === mostReacted
      } else
        return 0
    })

    /**
     * Like the most reacted post
     */
    most[0].getElementsByClassName('_6a-y _3l2t  _18vj')[0].click()

    most[0].getElementsByClassName('_666h  _18vj _18vk _42ft')[0].click()

    
    //document.querySelectorAll('div[role="textbox"]')[0].getElementsByTagName('br')[0].innerHTML = "Bravo!!!"

    return mostReacted
  })

  await page.reload()

  await page.waitFor('br[data-text="true"]', {
    visible: true
  })

  await page.focus('br[data-text="true"]')
  await page.type('br[data-text="true"]' ,'Bravo!!!')
  await page.keyboard.press('Enter')
  
  await page.focus('a[class="_5afe"]')
  await page.click('a[class="_5afe"]')
  await page.focus('a[class="_42ft _4jy0 _4jy4 _517h _51sy"]')
  await page.click('a[class="_42ft _4jy0 _4jy4 _517h _51sy"]')
  await page.waitFor('a[class="_42ft _42fu _4-s1 _2agf _4o_4 _p _42gx"]')
  await page.focus('a[class="_42ft _42fu _4-s1 _2agf _4o_4 _p _42gx"]')
  await page.click('a[class="_42ft _42fu _4-s1 _2agf _4o_4 _p _42gx"]')
  await page.waitFor('a[class="_54nc"]')
  await page.focus('a[class="_54nc')
  await page.click('a[class="_54nc"]')
  
  await browser.close()

  console.log(data)

  //return data;
}

scrapeContents()
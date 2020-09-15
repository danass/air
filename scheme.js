const puppeteer = require('puppeteer');
const {config} = require('./config')
const fs = require('fs');


let db = {
    scheme: [],
}


function script() {
    return _.mapValues(application.tablesById, table =>
      _.set(
        _.omit(table, ['sampleRows']),
        'columns',
        _.map(table.columns, item =>
          _.set(item, 'foreignTable', _.get(item, 'foreignTable.id'))
        )
      )
    );
  }
  
  function getUrl(baseId) {
    return `https://airtable.com/login?continue=/${baseId}/api/docs`;
  }
  
async function getScheme({ base_name, email, password, headless }) {
    const browser = await puppeteer.launch({ headless });
    const page = await browser.newPage();
  
    await page.goto(getUrl(base_name));
    await page.waitForSelector('#sign-in-form-fields-root > div > label > div');
    console.log('Entering Username and Password into login form...');
    await page.type(
      '#sign-in-form-fields-root > div > label > input[name="email"]',
      email
    );
    await page.type(
      '#sign-in-form-fields-root > div > label > input[name="password"]',
      password
    );
    console.log('Submitting...');
    await page.click(
      '#sign-in-form-fields-root > div > label > input[type="submit"]'
    );
  
    await page.waitForSelector('.docs > .languageTabs > .tab');
    console.log('Scraping scheme from API page...');
    const result = await page.evaluate(script);
    await browser.close();
    console.log('Finished!');
    return await result;
  };

async function listTables(conf) {
  return await getScheme(conf).then(async r => {
  let results = []
  for (id of Object.keys(r)) {
    results.push(r[id].name)
  }
  db.scheme[conf.name] =  results 
  fs.writeFileSync(process.cwd() + '\\data\\scheme\\' + conf.name + ".json", JSON.stringify(results, null, 2), (err) => { 
    if (err) console.log(err); 
    else { 
        console.log("File written successfully\n"); 
    } 
  })
  return results
}).catch(e => console.error(e))
}

function getSchemeLocal(conf) {
  try {
  return JSON.parse(fs.readFileSync(process.cwd() + '\\data\\scheme\\' + conf.name + '.json'))
  }
  catch(e) {
    // console.error(e) 
    return []}
}


// at startup, create scheme
const  writeScheme = async _ => {
    console.log("start")
    
    config.map(async res => {
        return await listTables(res)
    })
    console.log("finish")
}


module.exports = {
    db:db,
    writeScheme:writeScheme,

}

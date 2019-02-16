const request = require('request')
const rp = require('request-promise')
const cheerio = require('cheerio')
const $ = require('cheerio')
const fs = require('fs')
//const url = 'https://www.relaischateaux.com/fr/france/bussiere-cote-d-or-la-bussiere-sur-ouche';
//const url = 'https://www.relaischateaux.com/fr/france/annedebretagne-loire-atlantique-la-plaine-sur-mer'
//const url = 'https://www.relaischateaux.com/fr/france/assiette-champenoise-champagne-ardenne-tinqueux'
//const url = 'https://www.relaischateaux.com/fr/france/crocodile-bas-rhin'


function createJsonURL(){
    request('https://www.relaischateaux.com/fr/site-map/etablissements', (error, response, html) => {
        if(!error && response.statusCode == 200){
            const $ = cheerio.load(html)
            $('#countryF').first().remove()
            const destinationResults = $('#countryF').html()
            const url = 
            {
                links: destinationResults.split('"').filter(word => word.includes("https://www.relaischateaux.com/fr/france"))
            }
            let data = JSON.stringify(url)
            fs.writeFileSync('url.json', data)
        }
    })
}

//createJsonURL()

function getURL(){
    const file = fs.readFileSync('url.json')
    const url = JSON.parse(file)
    return url
}

const url = getURL()


const getDataFromUrl = function(url){
    return rp(url)
        .then(function(html){
            let rest0 = null, rest1 = null
            if($('.jsSecondNavSub',html).find("li").first().find("a").text() != '')
                    {
                        rest0 = $('.jsSecondNavSub', html).find("li").first().find("a").text().trim()
                        if($('.jsSecondNavSub',html).find("li").next().find("a").text() != '')
                        {
                            rest1 = $('.jsSecondNavSub',html).find("li").next().find("a").text().trim()
                        }
                    }
            else
            {
                rest0 = $('.rc-popinQualitelis-header',html).find("h1").text().trim()
            }
            let data = {
                name: $('.rc-popinQualitelis-heading', html).text().trim(),
                url: url,
                price: $('.price', html).text().trim(),
                city: $('[itemprop="addressLocality"]', html).first().text().trim(),
                citation: $('.citationMsg', html).text().trim().trim(),
                desc: $('.propertyDesc', html).find('.richTextMargin').text().trim(),
                rest: [{name: rest0, star: null},{name: rest1, star: null}]                 
            }
            return data
        })
        .catch(function(err){
            //handle error
        })
}

async function getHotelJSON(){
    let result = []
    for(let i = 0; i < 2; i++)
    {
        console.log('Process : ' + (i+1) + '/' + url.links.length)
        await getDataFromUrl(url.links[i]).then(value => {
            result.push(value)
        })
    }
    let data = JSON.stringify(result)
    fs.writeFileSync('hotelsv2.json', data)
}

getHotelJSON()
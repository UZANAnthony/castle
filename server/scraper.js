const request = require('request')
const rp = require('request-promise')
const cheerio = require('cheerio')
const $ = require('cheerio')
const fs = require('fs')
const fetch = require("node-fetch")

async function createJsonURL(){
    let res = await fetch('https://www.relaischateaux.com/fr/site-map/etablissements')
    res = await res.text()
    const $ = cheerio.load(res)
    $('#countryF').first().remove()
    const destinationResults = $('#countryF').html()
    let link = destinationResults.split('"').filter(word => word.includes("https://www.relaischateaux.com/fr/france"))
    return link
}

const getDataFromUrl = async function(url){
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
                rest: [{name: rest0, michelinurl: null, star: null},{name: rest1, michelinurl: null, star: null}]                 
            }
            return data
        })
        .catch(function(err){
            //handle error
        })
}

//console.log(getDataFromUrl("https://www.relaischateaux.com/fr/france/bussiere-cote-d-or-la-bussiere-sur-ouche"))

async function getHotels (){
    let url = await createJsonURL();
    //console.log(url)
    let result = []
    for(let i = 0; i < url.length; i++)
    {
        console.log('Process : ' + (i+1) + '/' + url.length)
        result.push(await getDataFromUrl(url[i]))
    }
    return result
}


function removeRest(hotels){
    let res = []
    for(let i = 0; i < hotels.length; i++){
        if(hotels[i].rest[0].name != ""){
            res.push(hotels[i])
        }
    }
    return res
}


async function michelin(hotels){
    let result = []
    for (let i = 0; i < hotels.length; i++) {
        if(hotels[i].rest[1].name != null){
            result.push(fetch("https://restaurant.michelin.fr/index.php?q=search/autocomplete/" + encodeURI(hotels[i].rest[0].name)))
            result.push(fetch("https://restaurant.michelin.fr/index.php?q=search/autocomplete/" + encodeURI(hotels[i].rest[1].name)))
        }
        else{
            result.push(fetch("https://restaurant.michelin.fr/index.php?q=search/autocomplete/" + encodeURI(hotels[i].rest[0].name)))
            result.push(fetch("https://restaurant.michelin.fr/index.php?q=search/autocomplete/" + encodeURI(hotels[i].rest[0].name)))
        }
    }
    for (let i = 0; i < result.length; i++) {
        var response = await result[i]
        response = await response.json()
        response = await JSON.stringify(response)
        if (response.includes("poi")) {
            response = await JSON.parse(response)
            let keys = Object.keys(response)
            let key = null
            for (let w = keys.length - 1; w != -1; w--) {
                if (keys[w] != "poi-all" && keys[w].includes("poi")) {
                    key = keys[w]
                }
            }
            if (key != null) {
                response = response[key].split('"')[1]
                hotels[Math.trunc(i/2)].rest[i%2].michelinurl = "https://restaurant.michelin.fr" + response
            }
        }
    }
    return hotels
}

async function countMichelinStars(hotels) {
    let res = []
    for (let i = 0; i < hotels.length * 2; i++) {
        if(hotels[Math.trunc(i/2)].rest[i%2].michelinurl != null){
            res.push(fetch(hotels[Math.trunc(i/2)].rest[i%2].michelinurl))
        }
        else{
            res.push(0)
        }
    }
    let star = 0
    for (let i = 0; i < hotels.length * 2; i++) {
        if(res[i] != 0){
            var response = await res[i]
            response = await response.text()
            star = 0
            if (response.includes("icon-cotation1etoile")) {
                star = 1
            }
            else if (response.includes("icon-cotation2etoiles")) {
                star = 2
            }
            else if (response.includes("icon-cotation3etoiles")) {
                star = 3
            }
            hotels[Math.trunc(i/2)].rest[i%2].star = star
        }
        
    }
    return hotels
}

async function scrapping(){
    let hotels = await getHotels()
    //hotels =  removeRest(hotels)
    hotels = await michelin(hotels)
    hotels = await countMichelinStars(hotels)
    let data = JSON.stringify(hotels, null, 2)
    fs.writeFileSync('hotels.json', data)
}

scrapping()
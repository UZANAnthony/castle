const rp = require('request-promise');
const $ = require('cheerio');
const url = 'https://www.relaischateaux.com/fr/france/bussiere-cote-d-or-la-bussiere-sur-ouche';


const parse = function(url){
    return rp(url)
        .then(function(html) {
            return{
                name: $('.rc-popinQualitelis-heading', html).text(),
                price: $('.price', html).text(),
                restaurants: $('.jsSecondNavSub',html).children().text(),
                //restaurants: $("h3[itemprop = 'name']").text(),
                //restaurants: $('#tabRestaurant816 > div > div.row.hotelTabsHeader > div:nth-child(1) > div.hotelTabsHeaderTitle > h3', html).text(),
            };
        })
        .catch(function(err) {
            //handle error
        });
}

parse(url).then(function(hotel){
    console.log(hotel);
})
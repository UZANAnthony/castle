const rp = require('request-promise');
const $ = require('cheerio');
const url = 'https://www.relaischateaux.com/fr/france/bussiere-cote-d-or-la-bussiere-sur-ouche';

rp(url)
  .then(function(html) {
    console.log($('.rc-popinQualitelis-heading', html).text());
    console.log($('.price', html).text());
    console.log($('.jsSecondNavSub',html).children().text());

  })
  .catch(function(err) {
    //handle error
  });
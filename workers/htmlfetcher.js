// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
var archive = require('../helpers/archive-helpers.js');

fetchHTML = function() {
  //declare an empty array
  var newUrls = [];
  //read list -> array
  archive.readListOfUrls(function(urls) {
   //for each url in the array, check the archived list to see if it exists
    urls.forEach((url) => {
  //if it doesn't exist, push url into the empty array
      archive.isUrlArchived(url, (exists) => {
        if (!exists) {
          newUrls.push(url);
        }
      });
    });
    //download urls from new array
    archive.downloadUrls(newUrls);
  });
};

fetchHTML();
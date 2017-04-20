var path = require('path');
var archive = require('../helpers/archive-helpers');
var request = require('request');
var helpers = require('./http-helpers.js');
var fs = require('fs');

exports.handleRequest = function (req, res) {

  // if data at url is archived
    // return archived data
  // otherwise
    // return index.html
    
    var hasArchive;

  if (req.method === 'GET') {
    var hasArchive = archive.isUrlArchived(req.url, function(exists) {
      if (exists) {
        hasArchive = true;
      } else {
        hasArchive = false;
      }
    });
    console.log('hasArchive', hasArchive)
    if (hasArchive) {
        res.writeHead(200, helpers.headers);
        res.end(archive.paths.archivedSites + '/' + req.url);
    } else {
      var data = fs.readFile(archive.paths.siteAssets + '/index.html', 'utf8', function(error, data) {
        if (error) {
          console.error(error);
        }
        res.writeHead(200, helpers.headers);
        res.end(data);
      }); 
    }
  } 
};




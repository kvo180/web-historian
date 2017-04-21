var path = require('path');
var archive = require('../helpers/archive-helpers');
var request = require('request');
var helpers = require('./http-helpers.js');
var fs = require('fs');

exports.handleRequest = function (req, res) {
  
  // if GET request
    // if url contains only '/'
      // return content of index.html to render page

    // if url is archived
      // return archived content
    // if url is NOT archived
      // return 404 page not found

  // if POST request
    // if url in list
      // if url is archived
        // show archived content
      // if url is NOT archived
        // show loading html file
    // if url NOT in list
      // add to list

  console.log(req.method);

  if (req.method === 'GET') {
    // return content of index.html to render page
    if (req.url === '/') {
      console.log('serving up index.html');
      helpers.serveAssets(res, archive.paths.siteAssets + '/index.html', (data) => {
        res.writeHead(200, helpers.headers);
        res.end(data);
      });
    } else {
      archive.isUrlArchived(req.url, (isArchived) => {
        if (isArchived) {
          // show archived content
          console.log('showing archived content');
          helpers.serveAssets(res, archive.paths.archivedSites + '/' + req.url, (data) => {
            res.writeHead(200, helpers.headers);
            res.end(data);
          });
        } else {
          // return 404 page not found
          res.writeHead(404, helpers.headers);
          res.end();
        }
      });
    }

  } else if (req.method === 'POST') {
    var body = '';
    var url = '';

    req.on('data', function(data) {
      body += data;
    });

    req.on('end', function() {
      url = body.split('=')[1];

      archive.isUrlInList(url, (inList) => {
        if (inList) {
          archive.isUrlArchived(url, (isArchived) => {
            if (isArchived) {
              // show archived content
              helpers.serveAssets(res, archive.paths.archivedSites + '/' + url, (data) => {
                res.writeHead(200, helpers.headers);
                res.end(data);
              });
            } else {
              archive.readListOfUrls(function(urls) {
                archive.downloadUrls(urls);
              });

              // show loading HTML file
              helpers.serveAssets(res, archive.paths.siteAssets + '/loading.html', function(data) {
                res.writeHead(200, helpers.headers);
                res.end(data);
              });
            }
          });
        } else {
           // add to list
          console.log('not in list');
          archive.addUrlToList(url + '\n', () => {
            archive.readListOfUrls(function(urls) {
              archive.downloadUrls(urls);
            });
          });      
          helpers.serveAssets(res, archive.paths.siteAssets + '/loading.html', function(data) {
            res.writeHead(302, helpers.headers);
            res.end(data);
          });
        }
      });
    });
  } 
};




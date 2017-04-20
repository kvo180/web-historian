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
          res.writeHead(200, helpers.headers);
          res.end(archive.paths.archivedSites + '/' + req.url);
        } else {
          // return 404 page not found
          res.writeHead(404, helpers.headers);
          res.end();
        }
      });
    }

  } else if (req.method === 'POST') {
    archive.isUrlInList(req.url, (inList) => {
      if (inList) {
        archive.isUrlArchived(req.url, (isArchived) => {
          if (isArchived) {
            // show archived content
            res.writeHead(200, helpers.headers);
            res.end(archive.paths.archivedSites + '/' + req.url);
          } else {
            // show loading HTML file
          }
        });
      } else {
        // add to list
      }
    });
  } 
};




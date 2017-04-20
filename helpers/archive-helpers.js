var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var http = require('http');
var request = require('request');
/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback) {
  fs.readFile(exports.paths.list, 'utf8', function(error, data) {
    if (error) {
      console.error(error);
    }
    callback(data.split('\n'));
  });
};

exports.isUrlInList = function(url, callback) {
  exports.readListOfUrls(function(data) {
    // if (data.includes(url)) {
    //   callback(true);
    // } else {
    //   callback(false);
    // }

    // this is much cleaner:
    callback(data.includes(url));
  });
};

exports.addUrlToList = function(url, callback) {
  // this should be 'appendFile' instead of 'writeFile', which will overwrite the file every time
  fs.appendFile(exports.paths.list, url, function(err) {
    if (err) {
      console.error(err);
    }
    callback();
  });
};

exports.isUrlArchived = function(url, callback) {
  fs.exists(exports.paths.archivedSites + '/' + url, function(exists) {
    callback(exists);
  });
};

exports.downloadUrls = function(urls) {
  urls.forEach(function(url) {
    request('http://' + url, function(error, response, body) {
      if (error) {
        console.error(error);
      }
      fs.writeFile(exports.paths.archivedSites + '/' + url, body, () => {});
    });
  });
};




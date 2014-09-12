'use strict';

var request = require('request');
var cfg = require('../../config');
var fs = require('fs');
var config = require('meanio').loadConfig();
exports.save = function(req, res, gfs) {


  gfs.files.findOne({
    filename: 'theme.css'
  }, function(err, file) {

    if (err) return res.send(500, 'Error updating theme');
    console.log(file);
    // Id of the current theme file
    var _id = (file ? file._id : null);
    console.log(_id);
    // Creating write stream
    var writestream = gfs.createWriteStream({
      filename: 'theme.css'
    });

    //Retrieving theme from source

    request(req.query.theme).pipe(writestream);
    console.log(req.query.theme);
    // Remove old theme file

    writestream.on('close', function(file) {

      res.send('saved');

      if (_id && file.filename === 'theme.css') {
        gfs.files.remove({
          _id: _id
        }, function(err) {
          console.log(err);
        });
      }
    });

    writestream.on('error', function(file) {

      res.send(500, 'error updating theme');

    });

  });

};

exports.defaultTheme = function(req, res, gfs) {

  gfs.files.findOne({
    filename: 'theme.css'
  }, function(err, file) {

    if (err) return res.send(500, 'Error updating theme');

    // Id of the current theme file
    var _id = (file ? file._id : null);

    if (_id && file.filename === 'theme.css') {
      gfs.files.remove({
        _id: _id
      }, function(err) {
        res.send('saved');
        console.log(err);
      });
    }
  });
};

exports.myCustomThemeLoad = function(req, resp) {
  resp.json(cfg);
};

exports.customCssUpdate = function(req, resp) {
  var fileName = config.root + '/' + req.query.fileName;
  var outputFile = config.root + '/base/common.css';
  var output = fileName;
  fs.exists(fileName, function(exists) {
    if (exists) {
      fs.stat(fileName, function(error, stats) {
        fs.open(fileName, 'r', function(error, fd) {
          var buffer = new Buffer(stats.size);
          fs.read(fd, buffer, 0, buffer.length, null, function(error, bytesRead, buffer) {
            output = buffer.toString('utf8', 0, buffer.length);
            fs.close(fd);
            var stream = fs.createWriteStream(outputFile);
            stream.once('open', function(fd) {
              stream.write(output);
              stream.end();
              resp.send('Done');
            });
          });
        });
      });
    }
  });

};

exports.set_current_theme = function(req, resp) {
  var outputFile = config.root + '/default_theme.js';
  var output = req.query.theme_name;
  var stream = fs.createWriteStream(outputFile);
  stream.once('open', function(fd) {
    stream.write("'use strict';\n\n");
    stream.write("exports.current_theme = {\n");
    stream.write("   'name' : '" + output + "'\n");
    stream.write('};\n');
    stream.end();
    resp.send('Done');
  });

};

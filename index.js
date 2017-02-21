var fs = require('fs');
var mkdirp = require('mkdirp');
var randomstring = require('randomstring');
var uuidV4 = require('uuid/v4');
var queue = require('async/queue');

var nbFiles      = 10000;
var nbDotsInFile = 100000;
var writeConcurrency = 2;

var statsNbFiles = 0;
var dotsData = randomstring.generate(nbDotsInFile);

var q = queue(function(task, callback) {
  mkdirp(task.filePath, function (err) {
    if (err) throw err;
    fs.writeFile(task.filePath + '/' + task.fileName, dotsData, (err) => {
      if (err) throw err;
      callback();
    });
  });
}, writeConcurrency);
q.drain = function () {
  console.log('all items have been processed');
};


for (var fileIdx = 0; fileIdx < nbFiles ; fileIdx++) {
  var fileName = uuidV4();
  var filePath = __dirname + '/tmp/' + fileName[0] + '/' + fileName[1] + '/' + fileName[2];
    q.push({ fileName: fileName, filePath: filePath }, function (err) {
    statsNbFiles++;
    if (statsNbFiles % 100 == 0) {
      console.log(statsNbFiles + ' created!');
    }
  });
}

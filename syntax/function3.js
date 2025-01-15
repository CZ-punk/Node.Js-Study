console.log('A');

var fs = require('fs');

// var result = fs.readFileSync('syntax/sample.txt', 'utf8');
// 동기

// 비동기
fs.readFile('syntax/sample.txt', 'utf8', function(err, data) {
    console.log(data);    
});






console.log('C');
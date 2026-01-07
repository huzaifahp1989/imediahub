const http = require('http');
http.get('http://localhost:3003', (res) => {
  console.log(`StatusCode: ${res.statusCode}`);
  res.resume();
}).on('error', (e) => {
  console.error(`Got error: ${e.message}`);
});

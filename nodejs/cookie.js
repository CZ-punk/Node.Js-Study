var http = require('http');
var cookie = require('cookie');


http.createServer((req, res) => {

    console.log(req.headers.cookie);
    var cookies = {};
    if (req.headers.cookie !== undefined) {
        cookies = cookie.parse(req.headers.cookie);
        
    }
    
    console.log(cookies.yummy_cookie); 
    console.log(cookies.tasty_cookie);

    res.writeHead(200, {
        'Set-Cookie': [
            'yummy_cookie=choco', 
            'tasty_cookie=strawberry',
            `Permenent=cookies; Max-age=${60 * 60 * 24 * 30}`,
            'Secure=Secure; Secure',
            'HttpOnly=HttpOnly; HttpOnly',
            'Path=Path; Path=/cookie',
            'Domain=Domain; o2.org'
        ]
    })
    res.end('cookie!');
}).listen(3000);
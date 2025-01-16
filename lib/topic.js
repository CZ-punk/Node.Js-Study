var db = require('./db');
var template = require('./template');
var url = require('url');
var qs = require('querystring');
var sanitizeHtml = require('sanitize-html');

exports.home = function(request, response) {

    db.query('select * from topic', function(err, topics) {
        var title = 'Welcome';
        var description = 'Hello, Node.js!';
        var list = template.list(topics);      
        var html = template.html(
          title, 
          list, 
          `<h2>${sanitizeHtml(title)}</h2>
          ${sanitizeHtml(description)}`, 
          `<a href="/create">create</a>`
        );
      
        response.writeHead(200);
        response.end(html);
      });
}

exports.page = function(request, response) {

    var _url = request.url;
    var queryData = url.parse(_url, true).query;

    db.query('select * from topic', function(err, topics) {
        if (err) throw err;
        db.query('select * from topic left join author on author.id = topic.author_id where topic.id = ?', [queryData.id], function(err2, topic) {
          if (err2) throw err2;
        
          var title = topic[0].title;
          var description = topic[0].description;
          var list = template.list(topics);
          var html = template.html(
            title, 
            list,
            `<h2>${sanitizeHtml(title)}</h2>
            ${sanitizeHtml(description)}
            <p>by ${sanitizeHtml(topic[0].name)}</p>`, 
            `<a href="/create">create</a> 
              <a href="/update?id=${queryData.id}">update</a> 
              <form action="/delete_process" method="post">
              <input type="hidden" name="id" value="${queryData.id}">
              <input type="submit" value="delete">
            </form>`  
          )
          response.writeHead(200);
          response.end(html);
      });
    });
}

exports.create = function(request, response) {
    db.query('select * from topic', function(err, topics) {
        if (err) throw err;
        db.query('select * from author', function(err2, authors) {
          var title = 'WEB - create';
          var list = template.list(topics);        
          var authorList = template.authorSelector(authors);
          var html = template.html(
            sanitizeHtml(title), 
            list,
            `<form action="/create_process" method="post">
              <p><input type="text" name="title" placeholder="title"></p>
              <p><textarea name="description" placeholder="description"></textarea></p>
              <p>${authorList}</p>
              <p><input type="submit"></p>
            </form>`,
            ''
          );
          response.writeHead(200);
          response.end(html);
        })
    });
}

exports.create_process = function(request, response) {
    var body = '';
      request.on('data', function(data) {
        body += data;
      });

      request.on('end', function() {
        var post = qs.parse(body);
        
        db.query('insert into topic (title, description, created, author_id) values (?, ?, NOW(), ?)',
          [post.title, post.description, post.author], 
          function(err, data) {
            if (err) throw err;
            
            response.writeHead(302, {Location: `/?id=${data.insertId}`});
            response.end();
          }
        )
      });
}

exports.update = function(request, response) {
    var _url = request.url;
    var queryData = url.parse(_url, true).query;

    db.query('SELECT * FROM topic', function(error, topics){
        if(error) throw error;
        db.query(`SELECT * FROM topic WHERE id=?`,[queryData.id], function(error2, topic){
          if(error2) throw error2;
          db.query('SELECT * FROM author', function(error3, authors){
            if (error3) throw error3;

            var list = template.list(topics);
            var html = template.html(topic[0].title, list,
              `
              <form action="/update_process" method="post">
                <input type="hidden" name="id" value="${topic[0].id}">
                <p><input type="text" name="title" placeholder="title" value="${sanitizeHtml(topic[0].title)}"></p>
                <p><textarea name="description" placeholder="description">${sanitizeHtml(topic[0].description)}</textarea></p>
                <p>
                  ${template.authorSelector(authors, topic[0].author_id)}
                </p>
                <p>
                  <input type="submit">
                </p>
              </form>
              `,
              `<a href="/create">create</a> <a href="/update?id=${topic[0].id}">update</a>`
            );
            response.writeHead(200);
            response.end(html);
          });
           
        });
      });
}

exports.update_process = function(request, response) {
    var body = '';
      request.on('data', function(data) {
        body += data;
      });

      request.on('end', function() {
        var post = qs.parse(body);

        db.query('update topic set title=?, description=?, author_id=? where id=?', 
          [post.title, post.description, post.author, post.id], 
          function(err, data) {
            response.writeHead(302, {Location: `/?id=${post.id}`});
            response.end();
        });
      });

}

exports.delete_process = function(request, response) {
    var body = '';
      request.on('data', function(data) {
        body += data;
    });

    request.on('end', function() {
    var post = qs.parse(body);

    db.query('delete from topic where id = ?', [post.id], function(err, data) {
        if (err) throw err;
        response.writeHead(302, {Location: `/`});
        response.end();
        })
    });
}
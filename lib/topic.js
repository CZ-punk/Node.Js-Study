const { promisify } = require('util');
const db = require('./db');
const queryAsync = promisify(db.query).bind(db);
var template = require('./template');
var sanitizeHtml = require('sanitize-html');

function AuthenticationOwner(req, res) {
  if (!req.user) return false;
  return true;
}

function authStatusUI(req, res) {
  var authStatusUI = undefined;
  if (AuthenticationOwner(req, res)) 
    authStatusUI = 
      `
      ${req.user.nickname} |
       <a href="/auth/logout">logout</a>
      `;

  return authStatusUI;
}

exports.home = async function(req, res) {
  try {
    const topics = await queryAsync('select * from topic');
    const title = 'Welcome';
    const description = 'Hello, Node.js!';
    const list = template.list(topics);  
    const html = template.html(
      title,
      list,
      `
      <h2>${sanitizeHtml(title)}</h2>
      ${sanitizeHtml(description)}
      <img src="/images/test.jpg" style="width:300px; display:block; margin-top:10px;">
      `, 
      `<a href="/topic/create">create</a>`,
      authStatusUI(req, res)
    );

    res.status(200).send(html);
  } catch (err) {
    console.error(`Error fetching: ${err}`);
    res.status(500).send('Internal Server Error');
  }
}

exports.login = async (req, res) => {
  try {
    const topics = await queryAsync('select * from topic');
    const title = 'Login';
    const list = template.list(topics);  
    const html = template.html(
      title,
      list,
      `
      <form action="/auth/login_process" method="post">
        <p><input type="text" name="email" placeholder="email"></p>
        <p><input type="password" name="password" placeholder="password"></p>
        <p><input type="submit" value="login"></p>
      </form>
      `, 
      `<a href="/topic/create">create</a>`
    );

    res.status(200).send(html);
  } catch (err) {
    console.error(`Error fetching: ${err}`);
    res.status(500).send('Internal Server Error');
  }
}

// exports.login_process = async (req, res) => {
//   var { email, password } = req.body;
//   if (email === authData.email && password === authData.password) {
//     req.session.is_logined = true;
//     req.session.nickname = authData.nickname;
//     req.session.save(() => {
//       res.redirect('/');
//     });
//   } else {
//     res.send('who?');
//   }
// }

exports.logout = async (req, res) => {
  console.log('logout\n', req);
  req.logout();
  req.session.destroy((err) => {
    res.redirect('/');
  });
}

exports.page = async function(req, res) {
  try {
    const [topics, topic] = await Promise.all([
    queryAsync('select * from topic'),
    queryAsync('select topic.id as topic_id, topic.*, author.* from topic left join author on author.id = topic.author_id where topic.id = ?', [req.params.topicId])
    ]);

    const title = topic[0].title;
    const description = topic[0].description;
    const list = template.list(topics);
    const html = template.html(
      title,
      list,
      `<h2>${sanitizeHtml(title)}</h2>
      ${sanitizeHtml(description)}
      <p>by ${sanitizeHtml(topic[0].name)}</p>`, 
      `<a href="/topic/create">create</a> 
       <a href="/topic/update/${topic[0].topic_id}">update</a> 
      <form action="/topic/delete/${topic[0].topic_id}" method="post">
        <input type="hidden" name="id" value="${topic[0].topic_id}">
        <input type="submit" value="delete">
      </form>`,
      authStatusUI(req, res)
    );

    res.status(200).send(html);
  } catch (err) {
    console.error(`Error fetching: ${err}`);
    res.status(500).send('Internal Server Error');
  }
}

exports.create = async function(req, res) {
  if (!AuthenticationOwner(req, res)) {
    res.end('Login Required!');
    return;
  }

  try {
    const [topics, authors] = await Promise.all([
      queryAsync('select * from topic'),
      queryAsync('select * from author')
    ]);

    var title = 'WEB - create';
    var list = template.list(topics);        
    var authorList = template.authorSelector(authors);
    var html = template.html(
      title, 
      list,
      `<form action="/topic/create_process" method="post">
        <p><input type="text" name="title" placeholder="title"></p>
        <p><textarea name="description" placeholder="description"></textarea></p>
        <p>${authorList}</p>
        <p><input type="submit"></p>
      </form>`,
      '',
      authStatusUI(req, res)
    );

    res.status(200).send(html);
  } catch (err) {
    
    console.error(`Error fetching: ${err}`);
    res.status(500).send('Internal Server Error');
  }
}

exports.create_process = async function(req, res) {
  const { title, description, author } = req.body;
  try {
    const data = await queryAsync(
      'insert into topic (title, description, created, author_id) values (?, ?, NOW(), ?)', 
      [title, description, author]
    );
    
    res.redirect(`/topic/${data.insertId}`);
  } catch (err) {
    console.error(`Error fetching: ${err}`);
    res.status(500).send('Internal Server Error');
  }
}

exports.update = async function(req, res, next) {
  if (!AuthenticationOwner(req, res)) {
    res.end('Login Required!');
    return;
  }

  try {
    const [topics, topic, authors] = await Promise.all([
      queryAsync('select * from topic'),
      queryAsync('select * from topic where id=?', req.params.topicId),
      queryAsync('select * from author')
    ]);

    console.log(`topic: ${topic}`);

    if (!topic || topic.length === 0) return next(new Error('400: not found topic by id'));

    const list = template.list(topics);
    const html = template.html(
      topic[0].title,
      list,
      `
      <form action="/topic/update_process" method="post">
        <input type="hidden" name="id" value="${topic[0].id}">
        <p><input type="text" name="title" placeholder="title" value="${sanitizeHtml(topic[0].title)}"></p>
        <p><textarea name="description" placeholder="description">${sanitizeHtml(topic[0].description)}</textarea></p>
        <p>${template.authorSelector(authors, topic[0].author_id)}</p>
        <p><input type="submit"></p>
      </form>
      `,
      `<a href="/create">create</a> <a href="/topic/update/${topic[0].id}">update</a>`,
      authStatusUI(req, res)
    )

    res.status(200).send(html);
  } catch (err) {
    console.error(`Error fetching: ${err}`);
    res.status(500).send('Internal Server Error');
  }
}

exports.update_process = async function(req, res) {
  try {
    const { id, title, description, author } = req.body;
    const data = await queryAsync(
      'update topic set title=?, description=?, author_id=? where id=?', 
      [title, description, author, id]
    );

    res.redirect(`/topic/${id}`);
  } catch (err) {
    console.error(`Error fetching: ${err}`);
    res.status(500).send('Internal Server Error');
  }
}

exports.delete_process = async function(req, res) {
  if (!AuthenticationOwner(req, res)) {
    res.end('Login Required!');
    return;
  }

  try {
    const { id } = req.body;
    const data = await queryAsync(
      'delete from topic where id = ?', 
      [id]
    );

    res.redirect(`/`);
  } catch (err) {
    console.error(`Error fetching: ${err}`);
    res.status(500).send('Internal Server Error');
  }
}
var sanitaizeHtml = require('sanitize-html');

module.exports = {

    html: function(title, list, body, control, authStatusUI = '<a href="/auth/login">login</a>') {
      return   `
      <!doctype html>
      <html>
      <head>
        <title>WEB1 - ${sanitaizeHtml(title)}</title>
        <meta charset="utf-8">
      </head>
      <body>
        ${authStatusUI}
        <h1><a href="/">WEB</a></h1>
        <a href="/author">Author</a>
        ${list}
        ${control}
        ${body}
      </body>
      </html>
      `;
    },
  
    list: function(topics) {
      var list = '<ul>';
      var i = 0;
      while (i < topics.length) {
        list += `<li><a href="/topic/${topics[i].id}">${sanitaizeHtml(topics[i].title)}</a></li>`;
        i++;
      }
      list += '</ul>';
      return list;
    },

    authorSelector: function(authors, author_id) {
      var tag = '';
      var i = 0;
      while (i < authors.length) {
        var selected = '';
        if (author_id === authors[i].id) selected = ' selected';

        tag += `<option value="${authors[i].id}" ${selected}>${sanitaizeHtml(authors[i].name)}</option>`
        i++;
      }
      return `
        <select name="author">
          ${tag}
        </select>
      `;
    },

    authorTable: function(authors) {
      i = 0;
      var tag = '<table>';
      while (i < authors.length) {
          tag += `<tr>
                  <td>${sanitaizeHtml(authors[i].name)}</td>
                  <td>${sanitaizeHtml(authors[i].profile)}</td>
                  <td><a href="/author/update?id=${authors[i].id}">update</a></td>
                  <td>
                    <form action="/author/delete_process" method="post">
                    <p><input type="hidden" name="id" value="${authors[i].id}"></p> 
                    <p><input type="submit" value="delete"><p>
                    </form>
                  </td>
                  </tr>`;
          i++;
      }
      tag += "</table>";
      return tag;
    }

    
}

// 2가지 exports 방법 존재

// var template = {
//   html: function(title, list, body, control) {
//     return   `
//     <!doctype html>
//     <html>
//     <head>
//       <title>WEB1 - ${title}</title>
//       <meta charset="utf-8">
//     </head>
//     <body>
//       <h1><a href="/">WEB</a></h1>
//       ${list}
//       ${control}
//       ${body}
//     </body>
//     </html>
//     `;
//   },
//   list: function(fileList) {
//     var list = '<ul>';
//     var i = 0;
//     while (i < fileList.length) {
//       list += `<li><a href="/?id=${fileList[i]}">${fileList[i]}</a></li>`;
//       i++;
//     }
//     list += '</ul>';
//     return list;
//   }
// }
// module.exports = 'template';
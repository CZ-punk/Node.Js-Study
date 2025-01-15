module.exports = {

    html: function(title, list, body, control) {
      return   `
      <!doctype html>
      <html>
      <head>
        <title>WEB1 - ${title}</title>
        <meta charset="utf-8">
      </head>
      <body>
        <h1><a href="/">WEB</a></h1>
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
        list += `<li><a href="/?id=${topics[i].id}">${topics[i].title}</a></li>`;
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
        if (author_id === authors[i].id) {
          selected = ' selected';
        }
        tag += `<option value="${authors[i].id}" ${selected}>${authors[i].name}</option>`
        i++;
      }
      return `
        <select name="author">
          ${tag}
        </select>
      `;
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
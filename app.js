const http = require('http');
const fs = require('fs');
const path = require('path');
const mysql2 = require('mysql2');
const nl2br  = require('nl2br');
const htmlspecialchars = require('htmlspecialchars');

const connection = mysql2.createConnection({
    host: "127.0.0.1",
    user: "root",
    database: "imgbrd",
    password: "120398"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});

const httpServer = http.createServer((req, res) => {
    console.log('req: '+req.url);
}).listen(8000, () => {
    console.log('server is in 8000');
});

httpServer.on('request', (req, res) => {
    if (req.method === "POST") {
        let body = "";
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            let params
            try {
                params = JSON.parse(body)
            } catch (err) {
                console.log('ERROR');
            }
            if (params !== undefined) {
                if (params.type === 0) {
                    connection.promise().query("INSERT INTO imgbrd.posts (user_name, post_name, msg)VALUES ( ? , ? , ? );", [params.user_name, params.post_name, htmlspecialchars(params.msg)])
                        .then(result => {
                            res.end(JSON.stringify(result[0].insertId));
                            console.log("Msg is added!");
                        })
                        .catch(err => {
                            res.end(JSON.stringify("Unpredictable error with DB"))
                            console.log(err)
                        })
                }
                else if (params.type === 1) {
                    connection.promise().query("SELECT COUNT(*) AS num FROM imgbrd.posts;")
                        .then(result1 => {
                            const queue = "SELECT * FROM imgbrd.posts ORDER BY id DESC";
                            connection.query(queue, '', function (err, results) {
                                if (err) console.log(err);
                                else {
                                    let newest = {
                                        "id": [],
                                        'post_name': [],
                                        'user_name': [],
                                        'msg': []
                                    }
                                    for (let i = 0; i < result1[0][0].num; i++) {
                                        newest.id.push(results[i].id)
                                        newest.post_name.push(results[i].post_name);
                                        newest.user_name.push(results[i].user_name);
                                        newest.msg.push(nl2br(results[i].msg));
                                        fs.access('./static/posts/' + results[i].id + '.html', (err) => {
                                            if (err) {
                                                fs.writeFile('./static/posts/' + results[i].id + '.html', '<!doctype html>\n' +
                                                    '<html lang="en">\n' +
                                                    '<head>\n' +
                                                    '    <meta charset="utf-8">\n' +
                                                    '    <meta http-equiv="X-UA-Compatible" content="IE=edge">\n' +
                                                    '    <meta name="viewport" content="width=device-width, initial-scale=1">\n' +
                                                    '    <link rel="shortcut icon" href="../img/favicon.ico" type="image/x-icon">\n' +
                                                    '    <link href="../css/mui.css" rel="stylesheet" type="text/css" />\n' +
                                                    '    <link href="../css/style.css" rel="stylesheet"/>\n' +
                                                    '    <script defer src="../js/mui.js"></script>\n' +
                                                    '    <title>Имиджборд!</title>\n' +
                                                    '</head>\n' +
                                                    '<body>\n' +
                                                    '<div id="main">' +
                                                    '<button onclick="document.location.href = \'/post_a_comment\'" class="mui-btn mui-btn--fab mui-btn--accent floating_btn" id="new_post">+</button>' +
                                                    '    <div id="sidebar">\n' +
                                                    '        <div class="mui--text-white mui--text-display1 mui--align-vertical">\n' +
                                                    '            <a id=\'main_page\' href="/" style="color: #FFFFFF">Imgboard</a>\n' +
                                                    '            <br>\n' +
                                                    '            <small class="author">by Llargoz</small>\n' +
                                                    '        </div>\n' +
                                                    '    </div>\n' +
                                                    '    <div id="content" class="mui-container-fluid">\n' +
                                                    '        <div class="mui-row">\n' +
                                                    '            <div class="mui-col-sm-10 mui-col-sm-offset-1">\n' +
                                                    '                <br>\n' +
                                                    '                <h1>' + results[i].post_name + '</h1>\n' +
                                                    '                <div class=\\"mui--text-black-54\\">Автор: ' + results[i].user_name + '</div>\n' +
                                                    '                <div class="mui-divider"></div>\n' +
                                                    '                <br>\n' +
                                                    '                <div>' + nl2br(results[i].msg) + '</div>\n' +
                                                    '                <br>\n' +
                                                    '                <div class="mui-divider"></div>\n' +
                                                    '                <h3>Комментарии:</h3>\n' +
                                                    '                <script src="../js/post_page.js"></script>\n' +
                                                    '                <script defer>createHTML()</script>\n' +
                                                    '            </div>\n' +
                                                    '        </div>\n' +
                                                    '    </div>' +
                                                    '</div>' +
                                                    '</body>\n' +
                                                    '</html>', err => {
                                                    if (err) console.log(err);
                                                });
                                                let sql = 'CREATE TABLE if not exists imgbrd.' + results[i].id + ' (\n' +
                                                    '  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,\n' +
                                                    '  `name` VARCHAR(16) NOT NULL,\n' +
                                                    '  `comment` VARCHAR(280) NOT NULL,\n' +
                                                    '  PRIMARY KEY (`id`));';
                                                console.log(sql);
                                                connection.query(sql, function (err, results) {
                                                    if (err) console.log(err);
                                                    else console.log("Table has been created");
                                                });
                                            }
                                            else {
                                                console.log('File already exists');
                                            }
                                        });
                                    }
                                    res.end(JSON.stringify(newest));
                                }
                            });
                        })
                        .catch(err => {
                            console.log(err);
                            res.end(JSON.stringify("ERROR"));
                        })
                }
                else if (params.type === 2) {
                    let db_name = params.page;
                    console.log(params.page.slice(params.page.lastIndexOf('/') + 1));
                    connection.promise().query("INSERT INTO imgbrd." + db_name + "(name, comment)VALUES ( ? , ? );", [params.name, htmlspecialchars(params.comment)])
                        .then(result => {
                            res.end(JSON.stringify(result[0].insertId));
                            console.log("Msg is added!");
                        })
                        .catch(err => {
                            res.end(JSON.stringify("Unpredictable error with DB"))
                            console.log(err)
                        })
                }
                else if (params.type === 3) {
                    let db_name = params.page.slice(params.page.lastIndexOf('/') + 1)
                    connection.promise().query("SELECT COUNT(*) AS num FROM imgbrd." + db_name + ";")
                        .then(result2 => {
                            const queue = "SELECT * FROM imgbrd." + db_name + " ORDER BY id DESC";
                            connection.query(queue, '', function (err, results) {
                                if (err) console.log(err);
                                else {
                                    let newest1 = {
                                        "page": [],
                                        "commentator": [],
                                        "comment": []
                                    }
                                    for (let i = 0; i < result2[0][0].num; i++) {
                                        newest1.commentator.push(results[i].name)
                                        newest1.comment.push(nl2br(results[i].comment));
                                    }
                                    newest1.page.push(db_name);
                                    res.end(JSON.stringify(newest1));
                                }
                            });
                        })
                        .catch(err => {
                            console.log(err)
                            res.end(JSON.stringify("ERROR"))
                        })
                }
            }
        })
    }
    else if (req.url === '/') {
        sendRes('index.html', 'text/html', res);
    }
    else if (req.url === '/new_post') {
        sendRes('new_post.html', 'text/html', res);
    }
    else if (req.url === '/post_a_comment') {
        sendRes('post_a_comment.html', 'text/html', res);
    }
    else if (req.url.slice(0,7) === '/posts/') {
        sendRes(req.url + '.html', 'text/html', res);
    }
    else {
        sendRes(req.url, getContentType(req.url), res);
    }
});

function sendRes(url, contentType, res) {
    let file = path.join(__dirname+'/static/', url);
    fs.readFile(file, (err, content) => {
        if (err) {
            res.writeHead(404);
            res.write('File is not found');
            res.end();
            console.log('error 404 '+file);
        }
        else {
            res.writeHead(200, {'Content-Type': contentType});
            res.write(content);
            res.end();
            console.log('res 200 '+file);
        }
    })
}

function getContentType(url) {
    switch (path.extname(url)) {
        case ".html":
            return "text/html";
        case ".css":
            return "text/css";
        case ".js":
            return "text/javascript";
        case ".json":
            return "text/json";
        default:
            return "text/octet-stream";
    }
}

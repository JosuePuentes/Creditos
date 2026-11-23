const http = require("http");
const fs = require("fs");
const path = require("path");

const root = __dirname;
const port = Number(process.env.PORT) || 3000;
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".gif": "image/gif",
  ".ico": "image/x-icon"
};

function send(res, status, body, type) {
  res.writeHead(status, { "Content-Type": type || "text/plain; charset=utf-8" });
  res.end(body);
}

const server = http.createServer(function (req, res) {
  const urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
  let filePath = path.normalize(path.join(root, urlPath));
  if (filePath !== root && !filePath.startsWith(root + path.sep)) {
    send(res, 403, "No permitido");
    return;
  }
  fs.stat(filePath, function (err, stat) {
    if (!err && stat.isDirectory()) filePath = path.join(filePath, "index.html");
    fs.readFile(filePath, function (readErr, data) {
      if (readErr) {
        send(res, 404, "No encontrado");
        return;
      }
      send(res, 200, data, types[path.extname(filePath).toLowerCase()] || "application/octet-stream");
    });
  });
});

server.listen(port, function () {
  console.log("Creditos escuchando en el puerto " + port);
});

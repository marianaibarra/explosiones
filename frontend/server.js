const { createReadStream } = require("fs");
const { createServer } = require("http");
const path = require("path");

const { PORT = 8000 } = process.env;
const HOST = "localhost";

const HTML_CONTENT_TYPE = "text/html";
const CSS_CONTENT_TYPE = "text/css";
const JS_CONTENT_TYPE = "text/javascript";
const IMAGE_CONTENT_TYPE = "image/png";

const PUBLIC_FOLDER = path.join(__dirname, "public");

const requestListener = (req, res) => {
  const { url } = req;
  let statusCode = 200;
  let contentType = HTML_CONTENT_TYPE;
  let stream;

  if (url === "/") {
    stream = createReadStream(`${PUBLIC_FOLDER}/index.html`);
  } else if (url.match(".css$")) {
    // para los archivos CSS
    contentType = CSS_CONTENT_TYPE;
    stream = createReadStream(`${PUBLIC_FOLDER}${url}`);
  } else if (url.match(".js$")) {
    // para los archivos JavaScript
    contentType = JS_CONTENT_TYPE;
    stream = createReadStream(`${PUBLIC_FOLDER}${url}`);
  } else if (url.match(".png$")) {
    // para los archivos JavaScript
    contentType = IMAGE_CONTENT_TYPE;
    stream = createReadStream(`${PUBLIC_FOLDER}${url}`);
  } else {
    // si llegamos aquí, es un 404
    statusCode = 404;
  }

  res.writeHead(statusCode, { "Content-Type": contentType });
  // si tenemos un stream, lo enviamos a la respuesta
  if (stream) stream.pipe(res);
  // si no, devolvemos un string diciendo que no hemos encontrado nada
  else return res.end("Not found");
};

const server = createServer(requestListener);

server.listen(PORT, HOST, () => {
  console.log(`Running at http://${HOST}:${PORT}`);
});

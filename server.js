const http = require('http');
const commands = require('./cmd');

const port = process.env.PORT || 9102;

const createServer = () =>
  http
    .createServer(async (req, res) => {
      const [_, command, ...args] = req.url.split('/');
      console.log('received:', command);
      let result = null;
      if (command && commands[command]) {
        try {
          result = await commands[command](...args);
        } catch (err) {
          if (err.status) {
            res.writeHead(err.status, { 'Content-Type': 'text/html' });
          }
          if (err.message) {
            res.write(err.message);
          }
          res.end();
        }
      }

      if (result) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(JSON.stringify(result));
      } else {
        res.writeHead(404, { 'Content-Type': 'text/html' });
      }

      res.end();
    })
    .listen(port);

module.exports = createServer;

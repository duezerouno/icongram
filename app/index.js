const express = require('express');
const logger = require('morgan');
const path = require('path');
const app = express();
const env = process.env;

global.production = env.NODE_ENV == 'production';
const isDev = !global.production;
app.locals.modules = path.join(__dirname, '..', 'node_modules');

app.use((req, res, n) => {
  app.locals.host = `${req.protocol}://${req.get('host')}`
  app.locals.originalUrl = `${app.locals.host}${req.originalUrl}`
  n()
})

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.disable('x-powered-by');
app.use(express.static('app/public'))

app.use(logger(global.production ? 'combined' : 'dev'));

app.get('/', function(request, reply) {
  reply.render('home', {
    title: 'Home',
    content: ``
  });
});

app.use('/entypo', require('./icons/entypo'));
app.use('/feather', require('./icons/feather'));
app.use('/fontawesome', require('./icons/font-awesome'));
app.use('/material', require('./icons/material'));
app.use('/octicons', require('./icons/octicons'));
app.use('/simple', require('./icons/simple'));

app.use(function(err, req, res, next) {
  console.error('[ERROR]', new Date().toISOString(), isDev ? err.stack : err.message);

  if (err.error) {
    res.status(err.code).json(err);
  } else {
    var e = {
      code: err.code || -1,
      error: true,
      message: isDev ? err.message : 'Something went wrong!'
    };
    if (isDev) e.stack = err.stack;
    res.json(e);
  }
});


function createApp() {
  // app.listen(env.NODE_PORT || 3000, env.NODE_IP || '0.0.0.0', function() {
  //   console.log(`Application worker ${process.pid} started...`);
  // });
  return app;
}

module.exports = createApp

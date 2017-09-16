const router = require('express').Router();
const request = require('axios');
const makeIcon = require('../utils').makeIcon;
const SOURCE = 'https://cdn.rawgit.com/simple-icons/simple-icons/develop';
let icons = [];

async function getIcons() {
  await request(SOURCE + '/_data/simple-icons.json')
    .then(function(res) {
      console.log('Got simple icons...');
      icons = res.data.icons.filter(
        i => (i.slug = i.title.toLowerCase().replace(/[^a-z0-9]/gim, ''))
      );
    })
    .catch(function(err) {
      console.error(SOURCE + '/_data/simple-icons.json', err);
    });
}

router.get('/', function(req, reply) {
  reply.locals.originalUrl = `${req.app.locals.host}${req.originalUrl}`
  reply.locals.source = 'https://github.com/simple-icons/simple-icons'
  reply.render('iconlist', {
    title: 'Simple Icons',
    icons: icons.filter(i => (i.name = i.slug))
  });
});

router.get('/json', function(req, reply) {
  reply.json(icons);
});

router.get('/:icon.svg', function(req, reply, next) {
  if (!icons.length) getIcons();

  const objIcon = icons.find(i => i.slug == req.params.icon);
  const colored = typeof req.query.colored != 'undefined';

  req.query.color = colored ? objIcon.hex : req.query.color;

  if (!objIcon) reply.status(404).send('Icon Not Found');
  request(SOURCE + `/icons/${objIcon.slug}.svg`)
    .then(rawIcon => {
      makeIcon(rawIcon.data, req.query)
        .then(res => reply.type('image/svg+xml').send(res))
        .catch(err => {
          console.error(err);
          next(err);
        });
    })
    .catch(function(err) {
      console.error(err);
    });
});

getIcons();

module.exports = router;

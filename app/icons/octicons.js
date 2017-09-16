const router = require('express').Router();
const icons = require('octicons/build/data.json');
const octicons = require('octicons');
const fs = require('fs');
const path = require('path');
const makeIcon = require('../utils').makeIcon;

router.get('/', function(req, reply) {
  reply.locals.source = 'https://octicons.github.com'
  reply.render('iconlist', {
    title: 'Octicons',
    icons: Object.keys(icons).map(name => {
      return {
        name,
        ...icons[name]
      };
    })
  });
});

router.get('/json', function(req, reply) {
  reply.json(
    Object.keys(icons).map(name => {
      return {
        name,
        ...icons[name]
      };
    })
  );
});

router.get('/:icon.svg', function(req, reply, next) {
  const isIcon = icons[req.params.icon];

  if (!isIcon) return reply.status(404).send('Icon Not Found');
  const ico = require.resolve(`octicons/build/svg/${req.params.icon}.svg`);
  const rawIcon = fs.readFileSync(ico, 'utf8');

  makeIcon(rawIcon, req.query)
    .then(res => reply.type('image/svg+xml').send(res))
    .catch(err => {
      console.error(err);
      next(err);
    });
});

module.exports = router;

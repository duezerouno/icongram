const router = require('express').Router();
const icons = require('mdi-svg/meta.json');
const fs = require('fs');
const path = require('path');
const makeIcon = require('../utils').makeIcon;

icons.forEach(icon => {
  const ico = fs.readFileSync(require.resolve(`mdi-svg/svg/${icon.name}.svg`), 'utf8');
  icon.icon = ico;
})

router.get('/', function(req, reply) {
  reply.locals.source = 'https://materialdesignicons.com'
  reply.render('iconlist', { title: 'Material Design', icons: icons });
});

router.get('/json', function(req, reply) {
  reply.json(icons);
});

router.get('/:icon.svg', function(req, reply, next) {
  const objIcon = icons.filter(i => i.name == req.params.icon)[0];

  if (!objIcon) return reply.status(404).send('Icon Not Found');
  const ico = require.resolve(`mdi-svg/svg/${req.params.icon}.svg`);

  // console.log('Served icon', ico);
  const rawIcon = fs.readFileSync(ico, 'utf8');

  makeIcon(rawIcon, req.query)
    .then(res => reply.type('image/svg+xml').send(res))
    .catch(err => {
      console.error(err);
      next(err);
    });

  // reply.send({
  //   obj: objSvg,
  //   raw: rawIcon,
  //   svg: res
  // })
  // reply.type('image/svg+xml').send(res)
});

module.exports = router;

const express = require('express');
const router = express.Router();
const fIcons = require('feather-icons');
const icons = fIcons.icons;

const makeIcon = require('../utils').makeIcon;

router.get('/', function(req, reply) {
  reply.locals.source = 'https://feathericons.com'
  reply.render('iconlist', {
    title: 'Feather Icons',
    icons: Object.keys(icons).map(name => {
      return {
        name,
        icon: fIcons.toSvg(name)
      }
    })
  });
});

router.get('/json', function(req, reply) {
  reply.json(Object.keys(icons).map(name => {
    return {
      name,
      icon: fIcons.toSvg(name)
    }
  }));
});

router.get('/:icon.svg', function(req, reply, next) {
  const isIcon = fIcons.icons[req.params.icon];
  const color = /^[0-9A-F]{6}$/i.test(req.query.color)
    ? '#' + req.query.color
    : '';
  const size = req.query.size && parseInt(req.query.size);

  if (!isIcon) reply.status(404).send('Icon Not Found');
  // console.log('Served icon', req.params.icon);
  const rawIcon = fIcons.toSvg(req.params.icon);

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
  // reply.type('image/svg+xml').send(res);
});

module.exports = router;

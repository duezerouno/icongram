const router = require('express').Router();
const entypo = require('entypo');
const fs = require('fs');
const path = require('path');
const utils = require('../utils');
let icons = [];

utils
  .xml2js(entypo())
  .then(objSvg => {
    icons = objSvg.svg.symbol.map(s => {
      const options = Object.assign(objSvg.svg.$, s.$, {
        width: 20,
        height: 20
      });
      delete s.$;
      delete objSvg.svg.$.style;
      return {
        name: options.id.split('entypo-')[1],
        icon: utils.builder.buildObject({
          svg: {
            g: s,
            $: options
          }
        })
      };
    });
  })
  .catch(e => console.log(e));

router.get('/', function(req, reply) {
  reply.locals.source = 'http://www.entypo.com/'
  reply.render('iconlist', { title: 'Entypo', icons });
});

router.get('/json', function(req, reply) {
  reply.json(icons);
});

router.get('/:icon.svg', function(req, reply, next) {
  const ico = icons.find(i => i.name == req.params.icon);

  console.log(ico);
  if (!ico) return reply.status(404).send('Icon Not Found');

  console.log('Served icon', ico.name);
  const rawIcon = ico.icon;

  utils
    .makeIcon(rawIcon, req.query)
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

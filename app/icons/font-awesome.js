const router = require('express').Router();
const fs = require('fs');
const makeIcon = require('../utils').makeIcon;
let icons = [];

router.get('/', function(req, reply) {
  reply.locals.source = 'http://fontawesome.io';
  reply.render('iconlist', { title: 'Font Awesome', icons: icons });
});

router.get('/json', function(req, reply) {
  reply.json(icons);
});

router.get('/:icon.svg', function(req, reply, next) {
  const objIcon = icons.filter(i => i.name == req.params.icon)[0];

  if (!objIcon) return reply.status(404).send('Icon Not Found');
  const ico = require.resolve(
    `font-awesome-svg-png/black/svg/${req.params.icon}.svg`
  );

  const rawIcon = fs.readFileSync(ico, 'utf8');

  makeIcon(rawIcon, req.query)
    .then(res => reply.type('image/svg+xml').send(res))
    .catch(err => {
      console.error(err);
      next(err);
    });
});

var LESS_FILE = require.resolve('font-awesome/less/variables.less');

var LESS_VARIABLE_REGEX = /@fa-var-([\w-]+):\s*"\\([0-9a-f]+)";/g;

function parseIconListFromLess(lines) {
  lines = lines.toString();
  var match, result = [];
  while ((match = LESS_VARIABLE_REGEX.exec(lines))) {
    const ico = fs.readFileSync(
      require.resolve(`font-awesome-svg-png/black/svg/${match[1]}.svg`),
      'utf8'
    );
    result.push({
      name: match[1],
      unicodeHex: match[2],
      icon: ico.split('\n')[1]
    });
  }
  console.log('Done reading from font-awesome');
  return result;
}

fs.readFile(LESS_FILE, (err, data) => {
  if (err) throw err;
  icons = parseIconListFromLess(data);
});

module.exports = router;

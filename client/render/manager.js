const Router = require('koa-router');
const moment = require('moment');
const got = require('got');
const router = new Router();
const render = require('../../util/render.js');
const types = require('../util/message-types.js').all;

router.get('/', async function (ctx, next) {
  const homedata = await got('http://www.ftchinese.com/index.php/jsapi/publish/home', {
      json: true
    })
    .then(res => {
      return res.body;
    });
    
  const items = homedata.sections.filter(section => {
    return (section.lists && section.lists.length > 0 && section.name === 'Cover');
  })[0].lists[0].items;

  items.forEach(item => {
    item.date = moment.unix(item.timeStamp).utcOffset('+08:00').format();
  });

  ctx.body = await render('home.html', {
    env: ctx.state.env,
    types,
    items: items
  });
});

module.exports = router;
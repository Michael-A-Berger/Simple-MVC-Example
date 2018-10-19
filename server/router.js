const controllers = require('./controllers');

const router = (app) => {
  app.get('/page1', controllers.page1);
  app.get('/page2', controllers.page2);
  app.get('/page3', controllers.page3);
  app.get('/page4', controllers.page4);
  app.get('/getCatName', controllers.getCatName);
  app.get('/findByName', controllers.searchCatName);

  app.get('/', controllers.index);

  app.get('/*', controllers.notFound);

  app.post('/setCatName', controllers.setCatName);
  app.post('/addDog', controllers.addDog);

  app.post('/updateLastCat', controllers.updateLastCat);
  app.post('/searchUpdateDog', controllers.searchUpdateDog);
};

// export the router function
module.exports = router;

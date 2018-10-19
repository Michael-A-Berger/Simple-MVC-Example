// pull in our models. This will automatically load the index.js from that folder
const models = require('../models');

const Cat = models.Cat.CatModel;
const Dog = models.Dog.DogModel;

// default fake data so that we have something to work with until we make a real Cat
const defaultCatData = {
  name: 'unknown',
  bedsOwned: 0,
};

// object for us to keep track of the last Cat we made and dynamically update it sometimes
let lastAddedCat = new Cat(defaultCatData);

// formatDogJSON()
const formatDogJSON = dogObj => ({
  name: dogObj.name,
  age: dogObj.age,
  breed: dogObj.breed,
});

// hostIndex()
const hostIndex = (req, res) => {
  res.render('index', {
    currentName: lastAddedCat.name,
    title: 'Home',
    pageName: 'Home Page',
  });
};

// readAllCats()
const readAllCats = (req, res, callback) => {
  Cat.find(callback);
};

// readCat()
const readCat = (req, res) => {
  const name1 = req.query.name;

  const callback = (err, doc) => {
    if (err) {
      return res.json({ err });
    }

    return res.json(doc);
  };

  Cat.findByName(name1, callback);
};

// readAllDogs()
const readAllDogs = (rq, rp, callback) => {
  Dog.find(callback);
};

// readDog()
const readDog = (rq, rp) => {
  const nameToSearch = rq.query.name;

  const callback = (err, doc) => {
    if (err) {
      return rp.json(err);
    }

    return rp.json(doc);
  };

  Dog.findByName(nameToSearch, callback);
};

// hostPage1()
const hostPage1 = (req, res) => {
  const callback = (err, docs) => {
    if (err) {
      return res.json({ err }); // if error, return it
    }

    return res.render('page1', { cats: docs });
  };

  readAllCats(req, res, callback);
};

// hostPage2()
const hostPage2 = (req, res) => {
  res.render('page2');
};

// hostPage3()
const hostPage3 = (req, res) => {
  res.render('page3');
};

// hostPage4()
const hostPage4 = (rq, rp) => {
  const callback = (err, docs) => {
    if (err) {
      return rp.json({ err });
    }

    return rp.render('page4', { dogs: docs });
  };

  readAllDogs(rq, rp, callback);
};

// getCatName()
const getCatName = (req, res) => {
  res.json({ name: lastAddedCat.name });
};

// setCatName()
const setCatName = (req, res) => {
  if (!req.body.firstname || !req.body.lastname || !req.body.beds) {
    return res.status(400).json({ error: 'firstname,lastname and beds are all required' });
  }

  const name = `${req.body.firstname} ${req.body.lastname}`;

  // dummy JSON to insert into database
  const catData = {
    name,
    bedsOwned: req.body.beds,
  };

  const newCat = new Cat(catData);

  const savePromise = newCat.save();

  savePromise.then(() => {
    lastAddedCat = newCat;
    res.json({ name: lastAddedCat.name, beds: lastAddedCat.bedsOwned });
  });

  savePromise.catch(err => res.json({ err }));

  return res;
};

// addDog()
const addDog = (rq, rp) => {
  if (!rq.body.name || !rq.body.age || !rq.body.breed) {
    return rp.status(400).json({ error: 'Properties [ name ], [ age ], and [ breed ] are all required' });
  }

  const dogData = {
    name: rq.body.name,
    age: rq.body.age,
    breed: rq.body.breed,
  };

  const newDog = Dog(dogData);

  const savePromise = newDog.save();

  savePromise.then(() => {
    rp.json(formatDogJSON(newDog));
  });

  savePromise.catch(err => rp.json({ err }));

  return rp;
};

// searchCatName()
const searchCatName = (req, res) => {
  if (!req.query.name) {
    return res.json({ error: 'Name is required to perform a search' });
  }

  return Cat.findByName(req.query.name, (err, doc) => {
    if (err) {
      return res.json({ err }); // if error, return it
    }

    if (!doc) {
      return res.json({ error: 'No cats found' });
    }

    return res.json({ name: doc.name, beds: doc.bedsOwned });
  });
};

// updateLastCat()
const updateLastCat = (req, res) => {
  lastAddedCat.bedsOwned++;

  const savePromise = lastAddedCat.save();

  savePromise.then(() => res.json({ name: lastAddedCat.name, beds: lastAddedCat.bedsOwned }));

  savePromise.catch(err => res.json({ err }));
};

// searchUpdateDog()
const searchUpdateDog = (rq, rp) => {
  if (!rq.body.name) {
    return rp.json({ error: 'Name is required to update a dog\'s age' });
  }

  return Dog.findByName(rq.body.name, (err, doc) => {
    if (err) {
      return rp.json({ err });
    }

    if (!doc) {
      return rp.json({ error: `No dog with the name "${rq.boy.name}" was found` });
    }

    // Updating the dog's age
    const retrievedDog = doc;
    retrievedDog.age++;

    const savePromise = retrievedDog.save();
    // savePromise.then(() => rp.json(formatDogJSON(doc)));
    savePromise.catch(err2 => rp.json({ err2 }));
    return savePromise.then(() => rp.json(formatDogJSON(doc)));
  });
};

// notFound()
const notFound = (req, res) => {
  res.status(404).render('notFound', {
    page: req.url,
  });
};

// Module Exports
module.exports = {
  index: hostIndex,
  page1: hostPage1,
  page2: hostPage2,
  page3: hostPage3,
  page4: hostPage4,
  readCat,
  readDog,
  getCatName,
  setCatName,
  addDog,
  updateLastCat,
  searchCatName,
  searchUpdateDog,
  notFound,
};

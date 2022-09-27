const express = require('express');
const router = express.Router();
const axios = require('axios');
const model = require('./database/model');

// Get comments from db
// Expects from req.query:
// search - Youtube search query from which to retrieve comments from the db
// Works on partial matches i.e. 'zoo' will match for 'my day at the zoo' searches
router.get('/comments', (req, res) => {
  // console.log(req.query)
  model.getComments(req.query.search)
    .then((results) => {
      // console.log(results);
      if (!results.length) {
        res.sendStatus(404);
        return;
      }
      let comments = [];
      for (let result of results) {
        comments.push(result.text);
      }
      res.status(200).send({comments});
    })
    .catch((error) => {
      console.log(error);
      res.sendStatus(404);
    });
});

// Get top comments for a search query from YT API, save to db
// Expects from req.body:
// search - Youtube search query from which to retrieve comments from the API
// TODO: Take a multi step approach
// First submit the query to youtube API, get list of results
// From that list of results, get the top comments
// Save the top comments by url and search query
// Results will be returned by search query
router.post('/comments', (req, res) => {
  // console.log(req.body);
  // axios.get(`${process.env.API_URL}`, {
  //   headers: {
  //     AUTH: process.env.API_AUTH
  //   }
  // })
  model.saveComments(
    [ // DEBUG - Using test data
      {
        username: 'ryan',
        text: 'hello',
        url: 'test.com',
        search: req.body.search
      },
      {
        username: 'ryan',
        text: 'goodbye',
        url: 'test.net',
        search: req.body.search
      }
    ]
  )
    .then((results) => {
      console.log(results);
      res.sendStatus(201);
    })
    .catch((error) => {
      console.log(error);
      res.sendStatus(400);
    });
});

module.exports = router;

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
// TODO: Add language filter on comment results
router.post('/comments', (req, res) => {
  // console.log(req.body);
  // Search API for videos by query
  axios.get(`${process.env.API_URL}/search`, {
    params: {
      part: [
        'id'
      ],
      maxResults: 25,
      order: 'relevance',
      q: req.body.search
    },
    headers: {
      Authorization: `Bearer ${process.env.API_AUTH}`,
      Accept: 'application/json'
    }
  })
    .then((results) => {
      // Get videos from yt API by search query
      let commentPromises = [];
      for (let item of results.items) {
        commentPromises.push(
          axios.get(`${process.env.API_URL}/commentThreads`, {
            params: {
              part: [
                'snippet'
              ],
              moderationStatus: 'published',
              order: 'relevance',
              searchTerms: req.body.search, // TODO: May take this out, get all comments for videos relevant to the query
              videoId: item.id.videoId
            },
            headers: {
              Authorization: `Bearer ${process.env.API_AUTH}`,
              Accept: 'application/json'
            }
          })
        );
      }
      return Promise.all(commentPromises);
    })
    .then((promiseResults) => {
      let comments = [];
      for (let commentResults of promiseResults) {
        for (let item of commentResults.items) {
          comments.push(
            {
              commentId: item.id,
              username: item.snippet.topLevelComment.snippet.authorDisplayName,
              userId: item.snippet.topLevelComment.snippet.authorChannelId.value,
              text: item.snippet.topLevelComment.snippet.textOriginal,
              likeCount: item.snippet.topLevelComment.snippet.likeCount,
              videoId: item.snippet.topLevelComment.snippet.videoId,
              search: req.body.search
            }
          )
        }
      }
      return model.saveComments(comments);
    })
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

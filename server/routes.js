const express = require('express');
const router = express.Router();
const axios = require('axios');
const model = require('./database/model');

// Get comments from db
// Expects from req.query:
// search - Youtube search query from which to retrieve comments from the db
// Works on partial matches i.e. 'zoo' will match for 'my day at the zoo' searches
router.get('/comments', (req, res) => {
  model.getCommentsBySearchPartial(req.query.search, req.query.likeCount)
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
      part: 'id',
      maxResults: 50,
      order: 'relevance',
      q: req.body.search,
      key: process.env.API_TOKEN
    }
  })
    .then((videoResults) => {
      // Get videos from yt API by search query
      let commentPromises = [];
      for (let item of videoResults.data.items) {
        commentPromises.push(
          // Get relevant comments from videos
          axios.get(`${process.env.API_URL}/commentThreads`, {
            params: {
              part: 'snippet',
              moderationStatus: 'published',
              order: 'relevance',
              maxResults: 100,
              // searchTerms: req.body.search, // TODO: May take this out, get all comments for videos relevant to the query
              videoId: item.id.videoId,
              key: process.env.API_TOKEN
            }
          })
          .catch((error) => {
            // console.log(error.data);
          })
        );
      }
      return Promise.all(commentPromises);
    })
    .then((promiseResults) => {
      let comments = [];
      for (let commentResults of promiseResults) {
        if (commentResults && commentResults.data) {
          for (let item of commentResults.data.items) {
            comments.push(
              {
                commentId: item.id,
                username: item.snippet.topLevelComment.snippet.authorDisplayName,
                userId: item.snippet.topLevelComment.snippet.authorChannelId ? item.snippet.topLevelComment.snippet.authorChannelId.value : 'N/A',
                text: item.snippet.topLevelComment.snippet.textOriginal,
                likeCount: item.snippet.topLevelComment.snippet.likeCount,
                videoId: item.snippet.topLevelComment.snippet.videoId,
                search: req.body.search
              }
            )
          }
        }
      }
      return model.saveComments(comments);
    })
    .then((results) => {
      // console.log(results);
      res.sendStatus(201);
    })
    .catch((error) => {
      console.log(error);
      res.sendStatus(400);
    });
});

router.get('/searches', (req, res) => {
  model.getAllSearches()
    .then((results) => {
      if (!results.length) {
        res.sendStatus(404);
        return;
      }
      let searches = [];
      for (let result of results) {
        searches.push(result);
      }
      res.status(200).send({searches});
    })
    .catch((error) => {
      console.log(error);
      res.sendStatus(404);
    });
});

module.exports = router;

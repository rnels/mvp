import axios, { AxiosResponse } from 'axios';
import express from 'express';
import * as model from './database/model';
import { IComment } from './interfaces';

const router = express.Router();

let apiTokens: string[] = [
  process.env.API_TOKEN1,
  process.env.API_TOKEN2,
  process.env.API_TOKEN3
]

let tokenIndex: number = 0;

const tryApi = function(req: any, res, depth: number=0) {
  if (depth === apiTokens.length) {
    res.status(500).send('Youtube API has reached its limit');
    return;
  }
  axios.get(`${process.env.API_URL}/search`, {
    params: {
      part: 'id',
      maxResults: 25,
      order: 'relevance',
      q: req.body.search,
      key: apiTokens[tokenIndex]
    }
  })
    .then((videoResults: AxiosResponse) => {
      // Get videos from yt API by search query
      let commentPromises: any[] = [];
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
              key: apiTokens[tokenIndex]
            }
          })
          .catch((error) => {
            // console.log(error.data);
          })
        );
      }
      return Promise.all(commentPromises);
    })
    .then((promiseResults: any[]) => {
      let comments: IComment[] = [];
      for (let commentResults of promiseResults) {
        if (commentResults && commentResults.data) {
          for (let item of commentResults.data.items) {
            comments.push(
              {
                _id: item.id,
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
    .then((result: any[]) => {
      res.sendStatus(201);
    })
    .catch((error) => { // TODO: Can I catch different errors based on the type of response object? That would be sweet
      if (error.response && error.response.status === 403) {
        let token: string = '';
        let cycles: number = 1;
        while (token === '' && cycles < apiTokens.length) {
          cycles++;
          if (tokenIndex < apiTokens.length - 1) {
            tokenIndex += 1;
          } else {
            tokenIndex = 0;
          }
          token = apiTokens[tokenIndex];
          console.log('Switching tokens');
        }
        tryApi(req, res, depth + 1); // Call itself recursively if 403, rather than send 400
      } else {
        console.log(error.response);
        res.sendStatus(500);
      }
    });
}

// Get comments from db
// Expects from req.query:
// search - Youtube search query from which to retrieve comments from the db
// Works on partial matches i.e. 'zoo' will match for 'my day at the zoo' searches
router.get('/comments', (req: any, res) => {
  let search: string = req.query.search;
  let likeCount: number = req.query.likeCount;
  model.getCommentsBySearchPartial(search, likeCount)
    .then((results: IComment[]) => {
      if (!results.length) {
        res.sendStatus(404);
        return;
      }
      let comments: string[] = [];
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
router.post('/comments', (req: any, res) => {
  // console.log(req.body);
  // Search API for videos by query
  let search: string = req.body.search.toLowerCase();
  model.doesSearchExist(search)
    .then((response: IComment) => {
      if (response) { // If this search has been done already, don't bother contacting the API
        res.sendStatus(201);
        return;
      }
      tryApi(req, res);
    })
    .catch((error) => res.sendStatus(500));

});

router.get('/searches', (req: any, res) => {
  model.getAllSearches()
    .then((searches: string[]) => {
      if (!searches.length) {
        res.sendStatus(404);
        return;
      }
      res.status(200).send({searches});
    })
    .catch((error) => {
      console.log(error);
      res.sendStatus(404);
    });
});

export default router;

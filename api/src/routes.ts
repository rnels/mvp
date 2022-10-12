import axios, { AxiosError, AxiosResponse } from 'axios';
import express, { Request, Response } from 'express';
import * as model from './database/model';
import { Comment, TypedRequestQuery, TypedRequestBody, GetCommentsParams } from './types';

let apiTokens: any[] = [
  process.env.API_TOKEN1,
  process.env.API_TOKEN2,
  process.env.API_TOKEN3
];

let tokenIndex = 0;

const router = express.Router();

const tryApi = function(req: Request, res: Response, depth=0) {
  if (depth === apiTokens.length) {
    res.status(500).send({message: 'Unable to retrieve comments from YouTube'});
    console.log(`
      Summary: All API tokens are presumed to be spent up or invalid\n
      Method: ${req.method}\n
      Path: ${req.path}\n
      Body: ${req.body}
    `);
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
      // Get videos from YouTube API by search query
      let commentPromises = [];
      for (let item of videoResults.data.items) {
        commentPromises.push(
          // Get most relevant comments from returned videos
          axios.get(`${process.env.API_URL}/commentThreads`, {
            params: {
              part: 'snippet',
              moderationStatus: 'published',
              order: 'relevance',
              maxResults: 100,
              videoId: item.id.videoId,
              key: apiTokens[tokenIndex]
            }
          })
            .catch((error: any) => null)
        );
      }
      return Promise.all(commentPromises);
    })
    .then((responsePromises: (AxiosResponse|null)[]) => {
      let comments: Comment[] = [];
      for (let response of responsePromises) {
        if (response !== null) {
          for (let comment of response.data.items) {
            let snippet = comment.snippet.topLevelComment.snippet;
            comments.push(
              {
                _id: comment.id,
                username: snippet.authorDisplayName,
                userId: snippet.authorChannelId ? snippet.authorChannelId.value : 'N/A',
                text: snippet.textOriginal,
                likeCount: snippet.likeCount,
                videoId: snippet.videoId,
                search: req.body.search
              }
            )
          }
        }
      }
      if (!comments.length) {
        res.status(400).send({message: `Couldn't retrieve comments for search "${req.body.search}"`});
        return;
      }
      model.saveComments(comments)
        .then(() => res.status(201).send({message: 'Search created'}))
        .catch((error: any) => {
          console.log(`
            Summary: Error saving comments to database\n
            Method: ${req.method}\n
            Path: ${req.path}\n
            Body: ${req.body}\n
            Error: ${error}
          `);
          res.sendStatus(500);
        });
    })
    .catch((error: any) => {
      if (
          error instanceof AxiosError &&
          error.response &&
          [403, 400].includes(error.response.status)
        ) {
        let token = '';
        let cycles = 1;
        while (token === '' && cycles < apiTokens.length) {
          if (tokenIndex < apiTokens.length - 1) { tokenIndex += 1; }
          else { tokenIndex = 0; }
          token = apiTokens[tokenIndex];
          cycles++;
          console.log('Presumed API token error, switching tokens');
        }
        tryApi(req, res, depth + 1); // Call itself recursively if 403, rather than send 500
      } else {
        console.log(`
          Summary: Non-API token related error\n
          Method: ${req.method}\n
          Path: ${req.path}\n
          Body: ${req.body}\n
          Error: ${error}
        `);
        res.sendStatus(500);
      }
    })
}

// Get comments from db
// Expects from req.query:
  // search - Youtube search query from which to retrieve comments from the db
  // likeCount (optional) - Minimum number of likes a comment must receive to be returned in the query
// Works on partial matches i.e. 'zoo' will match for 'my day at the zoo' searches
// TypedRequestQuery is there solely for TS exercise
// router.get('/comments', (req: TypedRequestQuery<GetCommentsParams>, res) => {
router.get('/comments', (req, res) => {
  if (!req.query.search) {
    res.status(400).send({message: 'Missing required request query "search"'});
    return;
  }
  model.getCommentsBySearchPartial(req.query.search as string, parseInt(req.query.likeCount as string) || -1)
    .then((results: Comment[]) => {
      if (!results.length) {
        res.status(404).send({message: `No comments match the given search "${req.query.search}"`});
        return;
      }
      let comments = results.map((result) => result.text);
      res.status(200).send({comments});
    })
    .catch((error: any) => {
      console.log(`
        Summary: Error retrieving comments by search from database\n
        Method: ${req.method}\n
        Path: ${req.path}\n
        Query: ${req.query}\n
        Error: ${error}
      `);
      res.sendStatus(500);
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
// router.post('/comments', (req: TypedRequestBody<{ search: string }>, res: Response) => {
router.post('/comments', (req, res) => {
  // console.log(req.body);
  // Search YouTube API for videos based on provided search in req.body
  if (!req.body.search || typeof req.body.search !== 'string') {
    res.status(400).send({message: 'Missing required property "search" in request body'});
    return;
  }
  req.body.search = req.body.search.toLowerCase();
  model.doesSearchExist(req.body.search)
    .then((response) => {
      if (response) { // If this search has been done already, don't bother contacting the API
        res.status(201).send({message: 'Search has been done previously'}); // TODO(?): Technically should be a redirect code?
        return;
      }
      tryApi(req, res);
    })
    .catch((error: any) => {
      console.log(`
        Summary: Error checking existence of search in database\n
        Method: ${req.method}\n
        Path: ${req.path}\n
        Body: ${req.body}\n
        Error: ${error}
      `);
      res.sendStatus(500);
    });

});

router.get('/searches', (req, res) => {
  model.getAllSearches()
    .then((searches: string[]) => res.status(200).send({searches}))
    .catch((error: any) => {
      console.log(`
        Summary: Error retrieving searches from database\n
        Method: ${req.method}\n
        Path: ${req.path}\n
        Error: ${error}
      `);
      res.status(404).send({message: 'Unable to retrieve search list'});
    });
});

export default router;

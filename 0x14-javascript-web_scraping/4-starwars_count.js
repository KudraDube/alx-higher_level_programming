#!/usr/bin/node
const request = require('request');

const apiEndpoint = process.argv[2];
const characterId = process.argv[3];

request(apiEndpoint, function (error, response, body) {
  if (error) {
    console.error(error);
  } else if (response.statusCode === 200) {
    let movies = JSON.parse(body).results;
    let countedCharacters = new Set();
    let count = 0;
    for (let movieIndex in movies) {
      let movie = movies[movieIndex];
      if (!movie.characters) {
        console.warn(`Warning: movie ${movie.title} is missing characters property`);
        continue;
      }
      for (let characterUrlIndex in movie.characters) {
        let characterUrl = movie.characters[characterUrlIndex];
        let characterIdMatch = characterUrl.match(/\/(\d+)\/$/);
        if (!characterIdMatch) {
          console.warn(`Warning: invalid character URL ${characterUrl}`);
          continue;
        }
        let id = parseInt(characterIdMatch[1]);
        if (id === characterId && !countedCharacters.has(id)) {
          count++;
          countedCharacters.add(id);
        }
      }
    }
    console.log(count);
  } else {
    console.log(`Error: API returned status code ${response.statusCode}`);
  }
});

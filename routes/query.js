var mysql = require('mysql');
var mysqlPassword = require('../credentials.js');
var connection = mysql.createConnection({host: 'tropeDB.c9xyq9acorss.us-east-2.rds.amazonaws.com', user: 'tvtrop', password: mysqlPassword, database: 'tvtrop'});

var express = require('express');
var router = express.Router();

connection.connect();

var topRatedTropesQuery = `
    SELECT *
    FROM
    (SELECT trope.tropeT AS trope,
            count(imdb.Title) AS counts,
            std(imdb.imdbRating) AS stdevs,
            AVG(imdb.imdbRating) AS avgs,
            AVG(NULLIF(imdb.Metascore,0)) AS meta
     FROM trope
     LEFT JOIN imdb ON trope.imdb = imdb.imdbID
     WHERE imdb.Metascore !='N/A'
     GROUP BY trope.tropeT
     ORDER BY AVG(imdb.imdbRating) DESC) AS T
    WHERE counts > 60
    ORDER BY meta DESC
    LIMIT 6
`

router.get('/', function(req, res, next) {
  connection.query(topRatedTropesQuery, function(error, results, fields) {
    if (error)
      throw error;

    //  res.send(results);
    res.render('topTropes', {tropes: results});
  });

});

module.exports = router;

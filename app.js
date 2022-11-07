const express = require("express");
const {open} = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const app = express();
app.use(express.json());
const dbPath = path.join(__dirname, "moviesData.db");
let db = null;
const initalizeDBAndServer = async () => {
    try{
        db = await open({
            filename:dbPath,
            driver:sqlite3.Database,
        });
        app.listen(3000, () =>{
            console.log("server is running at http://localhost:3000");
        });
        catch(e){
            console.log(`DB Error: ${e.message}`);
            process.exit(1);
        }
    }
}
initalizeDBAndServer();

const dbObjectToResponseObject = (dbObject) => {
    return {
        movieName: dbObject.movie_name,
        directorId: dbObject.director_id,
        leadActor: dbObject.lead_Actor,
        movieId: dbObject.movie_id,
    }

}
app.get("/movies/", async (request, response) => {
    getMoviesName = `SELECT * FROM  movie WHERE movie_name;`;

    const movieArray = await db.all(getMoviesName);
    response.send(movieArray);
})

app.post("/movies/", async (request, response) => {
    postNewMovie = `INSERT INTO movie (director_id, movie_name, lead_actor) 
    VALUES ( ${directorId}, '${movieName}', '${leadActor}');`;
    const movieDetails = await db.run(postNewMovie);
    response.send("Movie Successfully Added");
})

app.get("/movies/:movieId/", async (request, response) => {
    const { movieId } = request.params;
    getMoviesId = `SELECT * FROM  movie WHERE movie_id = ${movieId};`;

    const movieIds = await db.all(getMoviesId);
    response.send(movieIds);
})

app.put("/movies/:movieId/", async (request, response) => {
    const { directorId, movieName, leadActor} = request.body;
    const  {movieId } = request.params;
    const updateMovieQuery = `UPDATE movie SET movie_id = '${directorId}',
    ${movieName}, '${leadActor}' WHERE player_id = ${movieId};`;
    await db.run(updateMovieQuery);
    response.send("Movie Details updated";)
})

app.delete("/movies/:movieId", async (request, response) =>{
    const { movieId } = request.params;
    const deleteMovieQuery = `DELETE FROM movie WHERE movie_id = ${movieId};`;
    await db.run(deleteMovieQuery);
    response.send("Movie Removed");
});


const dbObjectToResponseObjects = (dbObjects) => {
    return {
        directorId: dbObjects.director_id,
        directorName: dbObjects.director_name,
    }

}

app.get("/directors/", async (request, response) => {
    getdirectorName = `SELECT * FROM  director WHERE director_name;`;

    const directorArray = await db.all(getdirectorName);
    response.send(directorArray);
})

app.get("/directors/:directorId/movies", async (request, response) => {
    getdirectorMovie = `SELECT * FROM  director WHERE movie_name;`;

    const directorMovieName = await db.get(getdirectorMovie);
    response.send(directorMovieName);
})
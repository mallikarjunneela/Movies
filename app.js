const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const databasePath = path.join(__dirname, "moviesData.db");

const app = express();

app.use(express.json());

let database = null;

const initializeDbAndServer = async () => {
    try {
        database = await open({
            fileName: databasePath,
            driver: sqlite3.Database,            
        });
        app.listen(3000, () =>(
            console.log("Server is Running at http://localhost:3000/");
        );
    }
    catch(error) {
        console.log(`DB Error: ${error.message}`);
        process.exit(1);
    }
};

initializeDbAndServer();

const dbObjectToResponseObject = (dbObject) => {
    return {
        movieId: dbObject.movie_id,
        directorId: dbObject.director_id,
        movieName: dbObject.movie_name,
        leadActor: dbObject.lead_Actor,
    };
};

const convertDirectorDbObject = (dbObject) => {
    return {
        directorId: dbObject.director_id,
        directorName: dbObject.director_name,
    };

};

app.get("/movies/", async (request, response) => {
    getMoviesName = `SELECT movie_name FROM  movie;`;

    const movieArray = await database.all(getMoviesName);
    response.send(movieArray.map((eachMovie) => ({ movieName: eachMovie.movie_name}))
    );
});

app.post("/movies/", async (request, response) => {
    const { directorId, movieName, leadActor} = request.body;

    postNewMovie = `INSERT INTO movie (director_id, movie_name, lead_actor) 
    VALUES ( ${directorId}, '${movieName}', '${leadActor}');`;
    
    await database.run(postNewMovie);
    response.send("Movie Successfully Added");
})

app.get("/movies/:movieId/", async (request, response) => {
    const { movieId } = request.params;
    getMoviesId = `SELECT * FROM  movie WHERE movie_id = ${movieId};`;

    const movieIds = await database.get(getMoviesId);
    response.send(convertDirectorDbObject(movieIds));
});

app.put("/movies/:movieId/", async (request, response) => {
    const { directorId, movieName, leadActor} = request.body;
    const  { movieId } = request.params;
    const updateMovieQuery = `UPDATE movie SET movie_id = ${directorId},
    '${movieName}', '${leadActor}' WHERE player_id = ${movieId};`;
    await db.run(updateMovieQuery);
    response.send("Movie Details updated";)
});

app.delete("/movies/:movieId/", async (request, response) =>{
    const { movieId } = request.params;
    const deleteMovieQuery = `DELETE FROM movie WHERE movie_id = ${movieId};`;
    await db.run(deleteMovieQuery);
    response.send("Movie Removed");
});


app.get("/directors/", async (request, response) => {
    getDirectorName = `SELECT * FROM director;`;

    const directorArray = await database.all(getDirectorName);
    response.send(directorArray.map((eachDirector) => convertDirectorDbObject(eachDirector)
    )
    );
});

app.get("/directors/:directorId/movies/", async (request, response) => {
    const { directorId } = request.params;
    getDirectorMovie = `SELECT movie_name FROM movie WHERE director_id = '${directorId}';`;

    const directorMovieName = await database.all(getDirectorMovie);
    response.send(directorMovieName.map((eachMovie) => ({movieName: eachMovie.movie_name }))
    );
});

module.exports = app;

const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const databasePath = path.join(__dirname, "cricketTeam.db");

const app = express();
app.use(express.json());

let database = null;

const initializeDbAndServer = async () => {
    try{
        database = await open({
            fileName: databasePath,
            driver: sqlite3.Database,
        });

        app.listen(3000, () => 
            console.log("Server is Running at http://localhost:3000/players/");
        );
    }
        catch(error) {
            console.log(`DB Error: ${error.message}`);
            process.exit(1); 

    }
};
    initializeDbAndServer();

    const convertDbObjetToResponse = (dbObject) => {
        return {
            playerId: dbObject.player_id,
            playerName:dbObject.player_name,
            jerseyNumber:dbObject.jerseyNumber,
            role: dbObject.role,
        };
    };

    app.get("/players/", async (request, response) => {
        const getPlayersQuery = `SELECT * FROM cricket_team;`;
        const playersArray = await database.all(getPlayersQuery)
        response.send(playersArray.map((eachPlayer) => convertDbObjetToResponse(eachPlayer)
        )
        );
    });

    app.get("/players/:playerId", async (request, response) => {
        const { playerId } = request.params;
        const getPlayerId = `SELECT * FROM cricket_team WHERE player_id = ${playerId};`;
        const player = await database.get(getPlayerId)
        response.send(convertDbObjetToResponse(player));
    });

    app.post("/players/", async (request, response) => {
        const {playerName, jerseyNumber, role} = request.body;
        const postPlayerId = `INSERT INTO cricket_team (player_name, jersey_number,role)
        VALUES ('${playerName}', ${jerseyNumber}, '${role}');`;
        const player = await database.run(postPlayerId);
        response.send("Player Added to Team");
    });

    app.put("/player/:playerId", async (request, response) => {
        const {playerName, jerseyNumber, role} = request.body;
        const {playerId} = request.params;
        const updatePlayerQuery = `UPDATE cricket_team SET player_name = '${playerName}',
        ${jerseyNumber}, '${role}' WHERE player_id = ${playerId}`;
        await database.run(updatePlayerQuery);
        response.send("Player Details Updated");
    });

    app.delete("players/:playerId", async (request, response) => {
        const  playerId } = request.params;
        const deletePlayerQuery = `DELETE  FROM cricket_team WHERE player_id = ${playerId};`;
        await database.run(deletePlayerQuery);
        response.send("Removed");
    })

    module.exports = app;

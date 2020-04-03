const mysql = require("mysql");
const inquirer = require("inquirer");
const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Mickey19",
  database: "playlist_db",
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  inquirer
    .prompt([
      {
        name: "startingAction",
        type: "list",
        message: "Welcome to the playlist! What would you like to do?",
        choices: ["See current playlist", "Add a new song to the playlist"],
      },
    ])
    .then(({ startingAction }) => {
      console.log(startingAction);
      if (startingAction === "See current playlist") {
        // READ FROM THE DATABASE
        viewPlaylist();
        quit();
      } else if (startingAction === "Add a new song to the playlist") {
        addNewSong();
      }
    });
});

const viewPlaylist = () => {
  connection.query("SELECT * FROM songs", (err, data) => {
    if (err) throw err;
    for (let i = 0; i < data.length; i++) {
      console.log(`
                Title: ${data[i].title}
                Artist: ${data[i].artist}
                Genre: ${data[i].genre}
                `);
    }
  });
};

const quit = () => {
  connection.end();
};

const addNewSong = () => {
  // CREATE A NEW SONG IN THE DATABASE
  inquirer
    .prompt([
      {
        name: "title",
        type: "input",
        message: "Enter new song title.",
      },
      {
        name: "artist",
        type: "input",
        message: "Enter new song artist.",
      },
      {
        name: "genre",
        type: "input",
        message: "Enter new song genre.",
      },
    ])
    .then((newSong) => {
      console.log(newSong);
      connection.query(
        "INSERT INTO songs SET ?",
        {
          artist: newSong.artist,
          title: newSong.title,
          genre: newSong.genre,
        },
        (err, data) => {
          if (err) throw err;
          console.log(data);
          console.log("New Song Added");
          viewPlaylist();
          quit();
        }
      );
    });
};

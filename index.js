/*
Project: Full-Stack Developer Challenge to display Pokemon Data
Author: Clyde Shelton Bangera
Date: May 3 2022
*/

const express = require("express");
const pokedex = require("./data/pokemon.json-master/pokedex.json");
const poketypes = require("./data/pokemon.json-master/types.json");

const PORT = 3030; //port for express to listen

const app = express();

app.listen(PORT, (e) => {
  if (e) {
    console.log(e);
    //Handle Error
  } else {
    console.log(`Server Started on localhost: ${PORT}`);
  }
});

app.get("/getpoketypes", (_, res) => {
  //Get list of valid Pokemon types.
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.send({
    success: true,
    data: poketypes,
  });
});

app.get("/getpokedata/:type", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  //Get paginated pokemon data by type
  console.log(req.query);
  console.log(req.params);
  let responseData = {
    success: true,
    message: "",
    data: {},
  };

  if (
    !(
      (
        req.params.type &&
        typeof req.params.type === "string" &&
        req.params.type.length >= 3 &&
        poketypes.some((ele) => ele.english === req.params.type)
      ) //Check if request type is a valid type
      //Datatype, length, and validity checks for type
    )
  ) {
    return res.send({
      ...responseData,
      success: false,
      message: "Type is missing or invalid",
    });
  }
  const type = req.params.type;
  const startIndex = Number(req.query?.start ?? 0); //Extract starting index from query params. If not present, default to 0
  const endIndex = startIndex + Number(req.query?.count ?? 10); //Extract count from query params. If not present, default to 10

  if (isNaN(startIndex)) startIndex = 0;
  if (isNaN(endIndex)) endIndex = startIndex + 10;
  //if either of the indexes are NaN, resort to default safe values

  const pokeDataByType = pokedex.filter((ele) => ele.type.includes(type)); //Filter pokemons by type
  const processedPokeData = [];

  for (let i = startIndex; i < endIndex && i < pokeDataByType.length; i++) {
    //Pagination
    processedPokeData.push(pokeDataByType[i]);
  }

  responseData.data.maxCount = pokeDataByType.length;
  responseData.data.pokemonList = processedPokeData;
  responseData.success = true;
  return res.send(responseData);
});

app.use("/thumb", express.static("./data/pokemon.json-master/thumbnails"));
app.use("/image", express.static("./data/pokemon.json-master/images"));

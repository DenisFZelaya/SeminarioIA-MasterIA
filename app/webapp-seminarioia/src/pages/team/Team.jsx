import React from "react";
import MovieLinks from "./../../data/urls/id_links.json";
import MoviesCover from "./../../data/urls/id_cover.json";
import Links from "./../../data/links.json";
import Movies from "./../../data/movies_all.json";

export default function Team() {
  var moviesAndCover = [];
  MovieLinks?.map((item) => {
    // Agregar el cover al registro
    var findCover = MoviesCover.find((c) => c.movieId === item.Id);

    // Id imbd
    var imdbId = item?.imdbLink
      ?.replace("http://www.imdb.com/title/tt", "")
      .replace("/?ref_=fn_al_tt_1", "");

    // Obtner el imdbId LOCAL Y el movideId Local
    var link = Links.find((c) => c.imdbId === imdbId);

    if (link) {
      // Encontrar la pelicula
      var movieFound = Movies.find((c) => c.movieId === link?.movieId);

      var movie = {
        movieId: movieFound?.movieId,
        title: movieFound?.title,
        genres: movieFound?.genres,
        id: item.Id,
        cover: findCover?.cover,
        imdb: imdbId,
      };

      moviesAndCover.push(movie);
    }
  });

  console.log(moviesAndCover);

  return <div>Team</div>;
}

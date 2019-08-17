import React, { useState, useEffect, useContext } from "react";
import Slider from "react-animated-slider";
import "react-animated-slider/build/horizontal.css";
import "../../css/slider-animations.css";

import { GenreContext } from "../../contexts/GenreContext";
import { ConfigContext } from "../../contexts/ConfigContext";

import Axios from "axios";

const Header = () => {
  const [nowPlaying, setNowPlaying] = useState([]);
  const [loading, setLoading] = useState(true);

  const { images } = useContext(ConfigContext);
  const { genres } = useContext(GenreContext);

  useEffect(() => {
    Axios.get("/.netlify/functions/now_playing").then(res => {
      // fetch the first five movies
      setNowPlaying(res.data.results.slice(0, 5));
      setLoading(false);
    });
  }, []);

  const path = images.secure_base_url;
  const imageSize = images.backdrop_sizes[2];

  if (loading) {
    return false;
  }
  return (
    <header>
      <Slider
        autoplay={3500}
        previousButton=""
        nextButton=""
      >
        {nowPlaying.map(movie => (
          <div
            key={movie.id}
            className="slider-item"
            style={{
              background: `linear-gradient(0deg, rgba(0,0,0,.9), rgba(0,0,0,.5)), url(${path}${imageSize}${
                movie.backdrop_path
              }) no-repeat center top / cover`
            }}
          >
            <header>
              <span>Now Playing</span>
              <h2>{movie.title}</h2>
              <ul className="genre-list">
                {movie.genre_ids
                  .map(movieGenre => genres.filter(genre => genre.id === movieGenre).map(genre => genre.name))
                  .reduce((prev, next) => prev.concat(next))
                  .slice(0, 3)
                  .map((genre, index) => (
                    <li key={index}>{genre}</li>
                  ))}
              </ul>
            </header>
          </div>
        ))}
      </Slider>
    </header>
  );
};

export default Header;

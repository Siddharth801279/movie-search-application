import React, { useEffect, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import axios from "axios";

export default function MovieApp() {
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("release_date.desc");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMovies = async () => {
      if (!searchQuery.trim()) {
        setMovies([]); // Clear movies if search query is empty
        return;
      }

      setLoading(true);
      try {
        const response = await axios.get("https://www.omdbapi.com/", {
          params: {
            apikey: "cc1087f6",
            s: searchQuery,
            type: "movie",
          },
        });

        let results = response.data.Search || []; //returns array of movie 

        // Sorting Logic Manually 
        if (sortBy === "release_date.desc") {
          results.sort((a, b) => parseInt(b.Year) - parseInt(a.Year));
        } else if (sortBy === "release_date.asc") {
          results.sort((a, b) => parseInt(a.Year) - parseInt(b.Year));
        }

        setMovies(results);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setLoading(false);
    };

    fetchMovies();
  }, [searchQuery, sortBy, selectedGenre]);

  return (
    <div className="container">
      <h1>Movie Search Application</h1>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search Movies..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <button className="search-button">
          <AiOutlineSearch />
        </button>
      </div>

      {/* Filters */}
      <div className="filters">
        <label htmlFor="sort-by">Sort By:</label>
        <select id="sort-by" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="release_date.desc">Release Date Descending</option>
          <option value="release_date.asc">Release Date Ascending</option>
        </select>

        <label htmlFor="genre">Genre:</label>
        <select id="genre" value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value)}>
          <option value="">All Genres</option>
          <option value="Action">Action</option>
          <option value="Comedy">Comedy</option>
          <option value="Drama">Drama</option>
          <option value="Horror">Horror</option>
          <option value="Romance">Romance</option>
          <option value="Sci-Fi">Sci-Fi</option>
        </select>
      </div>

      {/* Movie List */}
      {loading ? (
        <p>Loading movies...</p>
      ) : (
        <div className="movie-grid">
          {movies.length > 0 ? (
            movies.map((movie) => (
              <div className="movie-card" key={movie.imdbID}>
                <img src={movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/200"} alt={movie.Title} />
                <h2>{movie.Title}</h2>
                <p>{movie.Year}</p>
              </div>
            ))
          ) : (
            <p>No movies found. Try searching for another title.</p>
          )}
        </div>
      )}
    </div>
  );
}

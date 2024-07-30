import { Children, useEffect, useRef, useState } from "react";
import StarRating from "./starRating";
import { useMovie } from "./useMovies";
import { useLocalStorage } from "./useLocalStorage";
import { useKey } from "./useKey";

const KEY = `f84fc31d`;
export default function App() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const { movies, isLoading, error } = useMovie(query);

  function handleSelectMovie(id) {
    setSelectedId((beforId) => (beforId === id ? null : id));
  }
  function handleCloseSelected() {
    setSelectedId(null);
  }
  function handleAddWatch(movie) {
    setWatched((watches) => [...watches, movie]);
    // localStorage.setItem("watched", JSON.stringify([...watches, movie]));
  }
  function handleDeleteWatche(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  const [watched, setWatched] = useLocalStorage([], "watched");

  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>
      <Main>
        {/* <Box>{isLoading ? <Loader /> : <Movielist movies={movies} />}</Box> */}
        <Box>
          {!error && !isLoading && (
            <Movielist movies={movies} onSelected={handleSelectMovie} />
          )}
          {isLoading && <Loader />}
          {error && <ErrorMesaage message={error} />}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onClose={handleCloseSelected}
              onAddWatch={handleAddWatch}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummery watched={watched} />
              <WatchedList
                watched={watched}
                onDeleteWatched={handleDeleteWatche}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

function ErrorMesaage({ message }) {
  return (
    <p className="error">
      <span>❌</span>
      {message}
    </p>
  );
}

function Loader() {
  return <p className="loader">LOADING...</p>;
}

function NavBar({ children }) {
  return (
    <nav className="nav-bar">
      <Logo />
      {children}
    </nav>
  );
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

function Search({ query, setQuery }) {
  const inputEl = useRef(null);
  useKey("Enter", function () {
    if (document.activeElement === inputEl.current) return;
    inputEl.current.focus();
    setQuery("");
  });

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputEl}
    />
  );
}

function NumResults({ movies }) {
  return (
    <p className="num-results">
      Found <strong> {movies.length} </strong> results
    </p>
  );
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}

function Movie({ movie, onSelected }) {
  return (
    <li onClick={() => onSelected(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3 style={{ cursor: "pointer" }}>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}
function Movielist({ movies, onSelected }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie movie={movie} key={movie.imdbID} onSelected={onSelected} />
      ))}
    </ul>
  );
}

function MovieDetails({ selectedId, onClose, onAddWatch, watched }) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState("");

  const ratingRef = useRef(0);

  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);
  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating;
  // const [avg, setAvg] = useState(0);
  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: realeased,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  function handleWatch() {
    const newItem = {
      poster,
      title,
      year,
      imdbRating: Number(imdbRating),
      imdbID: selectedId,
      runtime: Number(runtime.split(" ").at(0)),
      userRating,
      ratingRef: ratingRef.current,
    };

    onAddWatch(newItem);
    onClose();
  }

  useEffect(
    function () {
      if (userRating) ratingRef.current += 1;
    },
    [userRating]
  );

  useEffect(
    function () {
      async function getMovieDatails() {
        setIsLoading(true);
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
        );
        const data = await res.json();
        setMovie(data);
        setIsLoading(false);
      }
      getMovieDatails();
    },
    [selectedId]
  );

  useEffect(
    function () {
      if (!title) return;
      document.title = `MOVIE | ${title}`;
      return function () {
        document.title = `USE A POPCORN `;
      };
    },
    [title]
  );

  useKey("Escape", onClose);

  /* const [top, setTop] = useState(imdbRating > 8);
  useEffect(
    function () {
      setTop(imdbRating > 8);
    },
    [imdbRating]
  );
  const top = imdbRating > 8;*/

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header className="">
            <button className="btn-back" onClick={onClose}>
              &larr;
            </button>
            <img src={poster} alt={`poster of ${movie} movie `} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {realeased} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐</span>
                {imdbRating} IMDb rating
              </p>
            </div>
          </header>
          {/* {avg} */}
          <section>
            {!isWatched ? (
              <div className="rating">
                <StarRating
                  maxRating={10}
                  size={"24"}
                  onSetRating={setUserRating}
                />
                {userRating > 0 && (
                  <button className="btn-add" onClick={handleWatch}>
                    + Add to list
                  </button>
                )}
              </div>
            ) : (
              <p>
                <em>you rated with movie {watchedUserRating} ⭐</em>
              </p>
            )}
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}

// function WatchBox() {
//   const [watched, setWatched] = useState(tempWatchedData);
//   const [isOpen2, setIsOpen2] = useState(true);

//   return (
//     <div className="box">
//       <button
//         className="btn-toggle"
//         onClick={() => setIsOpen2((open) => !open)}
//       >
//         {isOpen2 ? "–" : "+"}
//       </button>
//       {isOpen2 && (
//         <>
//           <WatchedSummery watched={watched} />
//           <WatchedList watched={watched} />
//         </>
//       )}
//     </div>
//   );
// }

function WatchedSummery({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}
function WatchedList({ watched, onDeleteWatched }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <Watch
          movie={movie}
          key={movie.imdbID}
          onDeleteWatched={onDeleteWatched}
        />
      ))}
    </ul>
  );
}
function Watch({ movie, onDeleteWatched }) {
  return (
    <li>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
        <button
          className="btn-delete"
          onClick={() => onDeleteWatched(movie.imdbID)}
        >
          X
        </button>
      </div>
    </li>
  );
}

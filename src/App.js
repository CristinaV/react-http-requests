import React, {useState, useEffect, useCallback} from 'react';

import MoviesList from './components/MoviesList';
import './App.css';
import AddMovie from "./components/AddMovie";

function App() {
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // function fetchMoviesHandler() {
    //   fetch('https://swapi.dev/api/films').then(response => {
    //       return response.json();
    //   }).then((data)=> {
    //       const transformedMolvies = data.results.map(movieData => {
    //           return {
    //               id: movieData.episode_id,
    //               title: movieData.title,
    //               openingText: movieData.opening_crawl,
    //               releaseDate: movieData.release_date
    //           }
    //       })
    //       setMovies(transformedMolvies);
    //   }).catch();
    // }

    // You can get rid of the then chain if you use async await on the fetch
    const fetchMoviesHandler = useCallback(async () => {
        // async function fetchMoviesHandler() {
        setIsLoading(true);
        setError(null);

        try {
            // https://swapi.dev/api/films
            const response = await fetch('https://react-http-42cd6-default-rtdb.europe-west1.firebasedatabase.app/movie.json');

            // needed because fetch api does not treat error status codes as real errors
            // will not throw a technical error if we get back error status code
            if (!response.ok) {
                throw new Error('Something went wrong!');
            }

            const data = await response.json();

            const loadedMovies = [];
            for(const key in data) {
                loadedMovies.push({
                    id: key,
                    title: data[key].title,
                    openingText: data[key].openingText,
                    releaseDate: data[key].releaseDate
                })
            }
            setMovies(loadedMovies);

            // const transformedMovies = data.results
                // .map(movieData => {
                // return {
                //     id: movieData.episode_id,
                //     title: movieData.title,
                //     openingText: movieData.opening_crawl,
                //     releaseDate: movieData.release_date
                // }
            // })
            // setMovies(transformedMovies);
        } catch (error) {
            setError(error.message);
        }
        setIsLoading(false);
    }, []);

    // if we leave [] on useEffect it will be executed only once at initialization
    // if we have a dependency between [], the useEffect will change when that parameter changes
    useEffect(() => {
        fetchMoviesHandler();
    }, [fetchMoviesHandler])

    async function addMovieHandler(movie) {
        console.log('movie', movie);
        const response = await fetch('https://react-http-42cd6-default-rtdb.europe-west1.firebasedatabase.app/movie.json',
            {
                method: 'POST',
                body: JSON.stringify(movie),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        const data = await response.json();
        console.log('data', data);
    }

    let content = <p>Found no movies.</p>

    if (movies.length > 0) {
        content = <MoviesList movies={movies}/>
    }

    if (error) {
        content = <p>{error}</p>
    }

    if (isLoading) {
        content = <p>Loading...</p>
    }

    return (
        <React.Fragment>
            <section>
                <AddMovie onAddMovie={addMovieHandler}></AddMovie>
            </section>
            <section>
                <button onClick={fetchMoviesHandler}>Fetch Movies</button>
            </section>
            <section>
                {/*{!isLoading && movies.length > 0 && <MoviesList movies={movies}/>}*/}
                {/*{!isLoading && movies.length === 0 && !error && <p>Found no movies.</p>}*/}
                {/*{isLoading && <p>Loading...</p>}*/}
                {/*{!isLoading && error && <p>{error}</p>}*/}
                {content}
            </section>
        </React.Fragment>
    );
}

export default App;

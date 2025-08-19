import {useState, useEffect} from 'react';
import {MovieCard, Search, Spinner} from "./components";
import {useDebounce}  from 'react-use'
import {getTrendingMovies, updateSearchCount} from "./appwrite.js";


const API_BASE_URL='https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
    method: 'GET' ,
    headers: {
        accept:'application/json',
        Authorization: `Bearer ${API_KEY}`
    }

}
const App = () => {
    const [debounceSearchTerm, setDebounceSearchTerm] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const [trendingMovies, setTrendingMovies] = useState([]);
    const [isTrendingLoading, setIsTrendingLoading] = useState(false);
    const [trendingError, setTrendingError] = useState('');

    const [movieList, setMovieList] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);


    useDebounce(() => setDebounceSearchTerm(searchTerm), 700, [searchTerm])

    const fetchMovies = async (query = '') =>{
        setIsLoading(true);
        setErrorMessage('');

        try {
            const endpoint = query
                ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
                : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
            const response = await fetch(endpoint, API_OPTIONS);

            if (!response.ok) {
                throw new Error('Could not find movie data');
            }

            const data = await response.json();
            console.log('movies', data);

            if(data.Response === 'False'){
                setErrorMessage(data.error || 'Failed to fetch movies');
                setMovieList([]);
                return;
            }

            setMovieList(data.results || []);

            if (query && data.results.length > 0) {
               await  updateSearchCount(query, data.results[0]);
            }


        } catch (error) {
            console.log(`Error fetching movies:${error}`);
            setErrorMessage('Error fetching movies. Please try again later')

        } finally {
            setIsLoading(false);
        }
    }
    const loadTrendingMovies = async () => {
        setIsTrendingLoading(true);
        setTrendingError('');

        try {
            const movies = await getTrendingMovies();
            setTrendingMovies(movies);

        } catch (e) {
            console.error(`Error fetching trending movies:${e}`);
            setTrendingError('No trending movies found');
        } finally {
            setIsTrendingLoading(false);
        }
    }

    useEffect(() => {
        fetchMovies(debounceSearchTerm);
    }, [debounceSearchTerm]);

    useEffect(() => {
        loadTrendingMovies();
    }, []);

    return (
        <main>
            <div className="pattern"/>
            <div className="wrapper ">
                <header>
                    <img src="/hero-img.png" alt='hero-banner' />
                    <h1>Find the <span className='text-gradient'> Movies
                    </span>You'll Enjoy Without the Hassle </h1>
                    <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
                </header>
                <section className='trending'>
                    <h2 className='mb-5'>Trending Movies</h2>
                    {isTrendingLoading ? (
                        <Spinner />
                    ): trendingError ? (
                        <p className='text-red-500'>{trendingError}</p>
                    ): trendingMovies.length > 0 ? (
                        <ul>
                            {trendingMovies.map((movie, index) => (
                                <li key={movie.$id}>
                                    <p>{index + 1}</p>
                                    <img src={movie.poster_url} alt={movie.title}/>
                                </li>
                            ))}
                        </ul>
                    ): (
                        <p>No trending movies ATM</p>
                    )}
                </section>



              <section className='all-movies'>
                  <h2 className='mt-5'>All Movies</h2>
                  {  isLoading ? (
                      <Spinner />
                  ) : errorMessage ? (
                      <p className='text-red-500'>{errorMessage}</p>
                  ) : (
                      <ul>
                          {  movieList.map(movie => (
                              <MovieCard key={movie.id} movie={movie}/>
                          ))}
                      </ul>
                  )

                  }
              </section>
            </div>

        </main>
    )
}
export default App

import React from 'react';
import { useState, } from 'react';
import { useEffect } from 'react';
import Papa from 'papaparse';
import test from './fixedMovies.csv';
import './App.css';

const API_KEY = process.env.REACT_APP_API_KEY;
const API_URL = `http://www.omdbapi.com/?apikey=${API_KEY}`;


const App = () => {
  const [movieList, setmovieList] = useState([]);
  const [currentMovie, setCurrentMovie] = useState({});
  const [nextMovie, setNextMovie] = useState({});
  const [score, setScore] = useState(0);

  useEffect(() => {
    Papa.parse(test, {
      download: true,
      header: true,
      complete: function (input) {
        const records = input.data;
        setmovieList(records);
        if (records.length === 0) {
          return;
        }
  
        const randomMovie1 = records[Math.floor(Math.random() * records.length)];
        const randomMovie2 = records[Math.floor(Math.random() * records.length)];
        const fetchData = async () => {
          const response1 = await fetch(`${API_URL}&t=${randomMovie1.title}`);
          const response2 = await fetch(`${API_URL}&t=${randomMovie2.title}`);
          const data1 = await response1.json();
          const data2 = await response2.json();
          setCurrentMovie(data1);
          setNextMovie(data2);
        };
    
        fetchData();
      }
    });
  }, []);

  const handleHigherClick = () => {
    if (parseFloat(currentMovie.imdbRating) <= parseFloat(nextMovie.imdbRating)) {
      setScore(score + 1);
      setCurrentMovie(nextMovie);
    } else {
      alert('Game over! Your score was ' + score);
    }
  };

  const handleLowerClick = () => {
    if (parseFloat(currentMovie.imdbRating) >= parseFloat(nextMovie.imdbRating)) {
      setScore(score + 1);
      setCurrentMovie(nextMovie);
    } else {
      alert('Game over! Your score was ' + score);
    }
  };

  useEffect(() => {
    if (movieList.length === 0) {
      return;
    }
  
    const fetchData = async () => {
      const randomMovie = movieList[Math.floor(Math.random() * movieList.length)];
      const response = await fetch(`${API_URL}&t=${randomMovie.title}`);
      const data = await response.json();
      if (data.response==="False"){
        return fetchData();
      }
      setNextMovie(data);
    };
  
    fetchData();
  }, [movieList, currentMovie]);

  return (
    <div className="App">
      <div className="container">
        
        <div className="movie-title">
          <h2>{currentMovie.Title} ({currentMovie.Year})</h2>
          <p>IMDb Rating: {currentMovie.imdbRating}</p>
        </div>
        <div className="vs">vs</div>
        <div className="buttons">
        <div className="movie-title">
          <h2>{nextMovie.Title} ({nextMovie.Year})</h2>
          <p>IMDb Rating: {nextMovie.imdbRating}</p>
        </div>
      <div >
        <button onClick={handleHigherClick}>Higher</button>
      <button onClick={handleLowerClick}>Lower</button>
      </div>
      </div>
      </div>
      <div className='score-bar'>
      <p>Score: {score}</p>
      </div>
    </div>
  );
  
};

export default App;
import { useState } from 'react';
import './App.css';
import Gameboard from './components/Gameboard/Gameboard';
import Header from './components/Header/Header';
import { shuffleDeck } from './utils/shuffleDeck';
import { useQuery } from 'react-query';
import axios from 'axios';
import { useEffect } from 'react';
import Gameover from './components/Gameover/Gameover';

function App() {
  const { isLoading, error, data } = useQuery('mortys', () =>
    axios('https://rickandmortyapi.com/api/character/?name=morty&status=alive')
  );
  const [deck, setDeck] = useState([]);
  const [picks, setPicks] = useState([]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    setDeck(data?.data.results);
  }, [data]);

  const playRound = (id) => {
    setDeck((prevState) => shuffleDeck(prevState));
    if (picks.includes(id)) return gameOver();
    setPicks(picks.concat(id));
    setScore((prevState) => prevState + 1);
  };

  const gameOver = () => {
    setScore(0);
    setPicks([]);
    if (score > highScore) setHighScore(score);
    return setPlaying(false);
  };

  if (error) return <h1>{error.message}</h1>;

  return (
    <div className="App">
      <Header score={score} highScore={highScore} />
      {playing ? (
        isLoading ? (
          <div>Loading...</div>
        ) : (
          <Gameboard data={deck} playRound={playRound} />
        )
      ) : (
        <Gameover setPlaying={setPlaying} />
      )}
    </div>
  );
}

export default App;

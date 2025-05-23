import { useState, useEffect } from 'react';
import './App.css';
import type { GameState, Board } from './logic';
import { createGame, isValidMove } from './logic';

function App() {
  const [size, setSize] = useState<4 | 9>(4);
  const [game, setGame] = useState<GameState | null>(null);
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const key = `sudoku-${size}`; // sudoku-4 or sudoku-9
    const saved = localStorage.getItem(key);
  
    if (saved) {
      const parsed = JSON.parse(saved);
      setGame(parsed); // Load stored board of selected size
    } else {
      const newGame = createGame(size);
      setGame(newGame);
      localStorage.setItem(key, JSON.stringify(newGame));
    }
  }, [size]);
  


  const handleSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = parseInt(e.target.value) as 4 | 9;
    setSize(newSize);
  };  

  const handleNewGame = () => {
    const newGame = createGame(size);
    setGame(newGame);
    localStorage.setItem(`sudoku-${size}`, JSON.stringify(newGame));
    setSelected(null);
    setError(false);
  };
  
  

  const handleReset = () => {
    if (!game) return;
    const newBoard = game.board.map((row, r) =>
      row.map((cell, c) => (game.fixed[r][c] ? cell : 0))
    );
    setGame({ ...game, board: newBoard });
    setSelected(null);
    setError(false);
  };
  

  const handleCellClick = (r: number, c: number) => {
    if (game?.fixed[r][c]) return;
    setSelected([r, c]);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!selected || !game) return;
    const num = parseInt(e.key);
    if (isNaN(num)) return;

    const [r, c] = selected;
    if (game.fixed[r][c]) return;

    if (isValidMove(game.board, r, c, num)) {
      const newBoard = game.board.map(row => [...row]);
      newBoard[r][c] = num;
      setGame({ ...game, board: newBoard });
      setError(false);
    } else {
      setError(true);
    }
  };

  if (!game) return <div className="App">Loading...</div>;

  return (
    <div className="App" onKeyDown={handleKeyPress} tabIndex={0}>
      <h1>Sudoku Game</h1>

      <label>
        Board size:{' '}
        <select value={size} onChange={handleSizeChange}>
          <option value={4}>4x4</option>
          <option value={9}>9x9</option>
        </select>
      </label>

      <div className="buttons">
        <button onClick={handleNewGame}>New Game</button>
        <button onClick={handleReset}>Reset</button>
      </div>

      <div
        className="board"
        style={{
          gridTemplateColumns: `repeat(${size}, 50px)`,
          gridTemplateRows: `repeat(${size}, 50px)`
        }}
      >
        {game.board.map((row, r) =>
          row.map((val, c) => {
            const isSelected = selected?.[0] === r && selected?.[1] === c;
            const isFixed = game.fixed[r][c];
            return (
              <div
                key={`${r}-${c}`}
                className={`cell ${isSelected ? 'selected' : ''} ${isFixed ? 'fixed' : ''}`}
                onClick={() => handleCellClick(r, c)}
              >
                {val !== 0 ? val : ''}
              </div>
            );
          })
        )}
      </div>

      {error && <div style={{ color: 'red', marginTop: '10px' }}>❌ Invalid move</div>}
    </div>
  );
}

export default App;

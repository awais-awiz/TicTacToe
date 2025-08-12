import React, { useState, useEffect } from 'react';
import './Game.css'
const initialBoard = Array(9).fill(null);

const Game = () => {

  const [board, setBoard] = useState(initialBoard);
  const [playerSymbol, setPlayerSymbol] = useState(null); // 'X' or 'O'
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [winner, setWinner] = useState(null);
  const [mode, setMode] = useState(null); // "ai" or "2p"
  const [winningLine, setWinningLine] = useState([]);
  const [score, setScore] = useState({ X: 0, O: 0 });
  const [drawCount, setDrawCount] = useState(0);

  const aiSymbol = playerSymbol === 'X' ? 'O' : 'X';

  const winningCombinations = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6],
  ];

  const checkWinner = (b) => {
    for (let [first, second, third] of winningCombinations) {
      if (b[first] && b[first] === b[second] && b[first] === b[third]) {
        return { winner: b[first], line: [first, second, third] };
      }
    }
    if (b.every(cell => cell !== null)) {
      return { winner: 'Draw', line: [] };
    }
    return null;
  };

  const handleClick = (i) => {
    if (board[i] || winner || (mode === 'ai' && !isPlayerTurn) || (mode === 'ai' && !playerSymbol)) return;

    const newBoard = [...board];
    const symbolToPlace = mode === '2p'? (isPlayerTurn ? 'X' : 'O'): playerSymbol;

    newBoard[i] = symbolToPlace;
    setBoard(newBoard);

    if (mode === '2p')  setIsPlayerTurn(!isPlayerTurn);
    else    setIsPlayerTurn(false);
    
  };

  const minimax = (b, isMaximizing, alpha = -Infinity, beta = Infinity) => {
    const result = checkWinner(b);
    if (result && result.winner === playerSymbol) return { score: -1 };
    if (result && result.winner === aiSymbol) return { score: 1 };
    if (result && result.winner === 'Draw') return { score: 0 };

    let best = { score: isMaximizing ? -Infinity : Infinity };

    for (let i = 0; i < 9; i++) {
      if (!b[i]) {
        b[i] = isMaximizing ? aiSymbol : playerSymbol;
        const evalScore = minimax(b, !isMaximizing, alpha, beta).score;
        b[i] = null;

        if (isMaximizing) {
          if (evalScore > best.score) best = { score: evalScore, index: i };
          alpha = Math.max(alpha, evalScore);
        } else {
          if (evalScore < best.score) best = { score: evalScore, index: i };
          beta = Math.min(beta, evalScore);
        }

        if (beta <= alpha) break;
      }
    }

    return best;
  };

  useEffect(() => {
    const result = checkWinner(board);
    if (result) {
      setWinner(result.winner);
      setWinningLine(result.line);
      if (result.winner === 'Draw') {
        setDrawCount(prev => prev + 1);
      } else {
        setScore(prev => ({ ...prev, [result.winner]: prev[result.winner] + 1 }));
      }
      return;
    }

    if (mode !== 'ai') return;

    if (playerSymbol && !isPlayerTurn) {
      const newBoard = [...board];

      let bestMove;
      if (newBoard[4] == null) bestMove = 4;
      else bestMove = minimax(newBoard, true).index;

      newBoard[bestMove] = aiSymbol;

      setTimeout(() => {
        setBoard(newBoard);
        const newResult = checkWinner(newBoard);
        if (newResult) {
          setWinner(newResult.winner);
          setWinningLine(newResult.line);
        }
        else setIsPlayerTurn(true);
      }, 800);
    }
  }, [board, isPlayerTurn, playerSymbol, mode]);

  const againGame = () => {
    setBoard(initialBoard);
    setIsPlayerTurn(true);
    setWinner(null);
    setWinningLine([]);
  };
  const resetGame = () =>
  {
    setBoard(initialBoard);
    setIsPlayerTurn(true); 
    setWinner(null);
    setWinningLine([]);
    setScore({ X: 0, O: 0 });
    setDrawCount(0);
  }


  const handleBack = () => {
    if (playerSymbol) {
      setPlayerSymbol(null);
    } else {
      setMode(null);
    }
    setBoard(initialBoard);
    setWinner(null);
    setWinningLine([]);
    setIsPlayerTurn(true);
    setScore({ X: 0, O: 0 });
    setDrawCount(0);
  };

  return (
<div className='gaming'>

            
            <div className="Back">
              <button onClick={handleBack} className='top-button'><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#8E6DF7"><path d="M400-80 0-480l400-400 61 61.67L122.67-480 461-141.67 400-80Z"/></svg></button>
              <button onClick={resetGame} className='top-button'><svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="#8E6DF7"><path d="M481.33-158.67q-132 0-226.33-94-94.33-94-94.33-226V-511L86-436.33 41.33-481 194-633.67 346.67-481 302-436.33 227.33-511v32.33q0 104.67 74.5 179 74.5 74.34 179.5 74.34 28 0 53.67-5.34 25.67-5.33 49-16L632.67-198q-36.67 20.67-74.34 30-37.66 9.33-77 9.33ZM766.67-325 614-477.67 659.33-523l74 74v-29.67q0-104.66-74.5-179Q584.33-732 479.33-732q-28 0-53.66 5.67-25.67 5.66-49 15L328-760q36.67-20.67 74.33-29.67 37.67-9 77-9 132 0 226.34 94 94.33 94 94.33 226v31l74.67-74.66 44.66 44.66L766.67-325Z"/></svg></button>
            </div>
            <h1><span className="purple">Tic </span><span className="pink">Tac </span><span className='green'>Toe</span> </h1>

            {!mode && (
            <div className="setup">
                <h2>Select Game Mode</h2>
                <button onClick={() => setMode('ai')}>Player vs AI</button>
                <button onClick={() => setMode('2p')}>2 Players</button>
            </div>
            )}

            {mode === 'ai' && !playerSymbol && (
            <div className="setup">
                <h2>Choose your symbol</h2>
                <button onClick={() => setPlayerSymbol('X')}>Play as X</button>
                <button onClick={() => setPlayerSymbol('O')}>Play as O</button>
            </div>
            )}

            {playerSymbol || mode === '2p' ? 
            (
            <div className='game-box'>
               <div className="board">
                    {board.map((val, idx) => (
                      <div  key={idx} 
                      className={`cell ${val ? 'disabled' : ''} ${val === 'X' ? 'x' : val === 'O' ? 'o' : ''} ${winningLine.includes(idx) ? 'winner' : ''}`}onClick={() => handleClick(idx)}>
                        {val}
                      </div>
                    ))}
                </div>

                <div className="scoreboard">
                  {mode === 'ai' ?
                    (<p><strong>Score:</strong> 
                        <span className={playerSymbol === 'X' ? 'player-x' : 'player-o'}> You: {score[playerSymbol]}</span> &nbsp;•&nbsp;
                        <span className={aiSymbol === 'X' ? 'player-x' : 'player-o'}> AI: {score[aiSymbol]}</span>  &nbsp;•&nbsp;
                        <span className="draw"> Draws: {drawCount}</span>
                      </p>
                    ) : (<p><strong>Score :   </strong><span className="player-x"> X: {score.X}</span> &nbsp;•&nbsp; <span className="player-o"> O: {score.O}</span> &nbsp;•&nbsp; <span className="draw"> Draws: {drawCount}</span></p>)
                  }
                </div>

                 <div className= {`status   ${winner==='Draw' ? 'draw': (winner==='X' ?'player-x': 'player-o')}`}>
                    {winner ? ( winner === 'Draw' ? "It's a draw!" : `${winner} wins!`) :
                      mode === '2p' ? ( <span className={isPlayerTurn ? 'player-x' : 'player-o'}> Player {isPlayerTurn ? 'X' : 'O'}'s Turn  </span>) :
                      
       /*Ai mode  */  isPlayerTurn  ? ( <span className={playerSymbol === 'X' ? 'player-x' : 'player-o'}> Your Turn ({playerSymbol})</span>) : 
                      (<span className={aiSymbol === 'X' ? 'player-x' : 'player-o'}> AI's Turn ({aiSymbol})  </span>)
                    }
                  </div>

                <button className="playagain-btn" onClick={againGame}>Play Again </button>
            </div>
            ) : null}
</div>

  )
}

export default Game
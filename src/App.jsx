import { useState, useCallback, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import Confetti from "react-confetti";

function App() {
  const [isExploding, setIsExploding] = useState(false);

  const celebrate = useCallback(() => {
    setIsExploding(true);
    setTimeout(() => setIsExploding(false), 5000); // Stop after 3 seconds
  }, []);

  const [board, setBoard] = useState([
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ]);

  const [currentPlayer, setCurrentPlayer] = useState("X");
  const [winner, setWinner] = useState(null);
  const [count, setCount] = useState(0);
  const [paitern, setPatern] = useState([]);
  const winAudioRef = useRef(null); 
  const drawAudioRef = useRef(null); 

  const checkWinner = () => {
    // Check rows
    for (let i = 0; i < 3; i++) {
      if (
        board[i][0] === board[i][1] &&
        board[i][1] === board[i][2] &&
        board[i][0] !== null
      ) {
        setPatern([[`${i}0`], [`${i}1`], [`${i}2`]]);
        return board[i][0]; // Return the winner (X or O)
      }
    }

    // Check columns
    for (let i = 0; i < 3; i++) {
      if (
        board[0][i] === board[1][i] &&
        board[1][i] === board[2][i] &&
        board[0][i] !== null
      ) {
        setPatern([[`0${i}`], [`1${i}`], [`2${i}`]]);
        return board[0][i]; // Return the winner (X or O)
      }
    }

    // Check diagonals
    if (
      board[0][0] === board[1][1] &&
      board[1][1] === board[2][2] &&
      board[0][0] !== null
    ) {
      setPatern([[`00`], [`11`], [`22`]]);

      return board[0][0]; // Return the winner (X or O)
    }
    if (
      board[0][2] === board[1][1] &&
      board[1][1] === board[2][0] &&
      board[0][2] !== null
    ) {
      setPatern([[`02`], [`11`], [`20`]]);
      return board[0][2]; // Return the winner (X or O)
    }

    // No winner
    return null;
  };

  const handleClick = (row, col) => {
    if (winner != null) {
      console.log("Game finished");
      return;
    }
    if (board[row][col] == "X" || board[row][col] == "O") {
      console.log("Cell already placed");
      return;
    }

    board[row][col] = currentPlayer;
    setCount(count + 1);

    // if (checkWinner()) {
    //   setWinner(checkWinner());
    //   celebrate();
    //   console.log("winner is ", winner);
    //   return;
    // }

    let w = null;
    if (count >= 4) {
      w = checkWinner();
    }
    if (w) {
      setWinner(w);
      celebrate();
      winAudioRef.current.play(); // Play the sound
      console.log("winner is ", w);
      return;
    }

    if (count == 8) {
      drawAudioRef.current.play();
      console.log("It is a draw !");
      return;
    }

    setCurrentPlayer((prev) => {
      if (prev == "X") {
        return "O";
      }
      return "X";
    });
  };

  const setClasses = (row, col) => {
    if (board[row][col] == "X" || board[row][col] == "O") {
      return " cursor-not-allowed";
    } else {
      return "cursor-cell";
    }
  };
  const renderCell = (row, col) => {
    let currentCell = `${row}${col}`;
    let hasCurrentCell = paitern.some((innerArr) =>
      innerArr.includes(currentCell)
    );
    return (
      <div
        className={`cell inline-block 
         ${
           winner &&
           hasCurrentCell &&
           "font-bold bg-green-600 hover:bg-green-600"
         } 
        ${setClasses(row, col)}`}
        onClick={() => handleClick(row, col)}
        key={uuidv4()}
      >
        {board[row][col]}
      </div>
    );
  };

  const reset = () => {
    setBoard([
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ]);
    setCurrentPlayer("X");
    setWinner(null);
    setCount(0);
  };

  return (
    <>
      <div className="w-screen gap-5 flex justify-center items-center flex-col">
        <h1 className="text-6xl text-orange-600 font-bold  title">
          Tic-Tac-Toe
        </h1>

        <p className="text-3xl">{winner && `${winner} Wins 🎉`}</p>
        <p className="text-3xl">{winner == null && count < 9 && `${currentPlayer}'s Turn`}</p>
        <p className="text-3xl">{winner == null && count >= 9 && "it's a Draw 🤝"}</p>

        <div className="board flex justify-center flex-col items-center">
          {board.map((row, rowIndex) => (
            <div key={uuidv4()} className="row">
              {row.map((cell, cellIndex) => renderCell(rowIndex, cellIndex))}
            </div>
          ))}
        </div>

        <button onClick={reset}>Reset Game</button>
        <audio ref={winAudioRef} src="/win.mp3" />
        <audio ref={drawAudioRef} src="/draw.mp3" />
      </div>

      {/* for celebration  */}
      {isExploding && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          numberOfPieces={200}
          gravity={0.6} // Increase gravity (default is 0.1)
          initialVelocityY={40} // Increase initial y velocity (default is 0)
          wind={0.05} // Add some wind for horizontal movement
        />
      )}
    </>
  );
}

export default App;

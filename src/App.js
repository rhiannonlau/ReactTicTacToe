// a component: a piece of reusable code that represents part of a ui
// export: makes the function accessible outside of this file
// default: marks it as the main function for other files using this code
//
// BASE CODE AT START OF TUTORIAL
// export default function Square() {
//     // <button>: a JSX element
//     return <button className="square">X</button>; // return can only return one JSX element. use div or <> to wrap multiple elements into one to be returned
// }

// INTERMITTENT STEP: USING PROPS
// props allow us to pass values, which are received using <Square value="1" />
//
// make Square a reusable component
// function Square({ value }) { // value is a prop
//     function handleClick() {
//         console.log('clicked!'); // on windows, use ctrl shift j to view the console
//     }

//     return (
//         <button
//             className="square"
//             onClick={handleClick}
//         >
//             {value}
//         </button>
//     );
//     // return (<button className="square" onClick={handleClick}>{value}</button>);
// }

// INTERMITTENT STEP: USING STATES
// states let the component "remember" things
import { useState } from 'react';
//
// function Square() {
//     const [value, setValue] = useState(null); // value stores the value, setValue is a func that is used to change value, useState(null) sets the initial value to null

//     function handleClick() {
//         console.log('clicked!'); // on windows, use ctrl shift j to view the console
//         setValue('X'); // when you call a set function in a component, the child components are automatically updated. in this case, each Square has its own child state
//     }

//     return (
//         <button
//             className="square"
//             onClick={handleClick}
//         >
//             {value}
//         </button>
//     );
//     // return (<button className="square" onClick={handleClick}>{value}</button>);
// }

function Square({ value, onSquareClick }) {
    return (
        <button
            className="square"
            onClick={onSquareClick}
        >
            {value}
        </button>
    );
}

function Board({xIsNext, squares, onPlay }) {
    // const [xIsNext, setXIsNext] = useState(true); // turn tracking

    // to collect data from multiple children or have two child components communicate, declare the shared state in their parent instead
    // i.e. in this case, use the parent Board to collect data from the nine child Squares
    // then pass the data back down to the child via props
    // const [squares, setSquares] = useState(Array(9).fill(null)); // each entry is the value of a corresponding Square
    // KEY: WHEN THE SQUARES STATE IS UPDATED, BOARD AND ALL ITS CHILDREN RE-RENDER
    // Array(9).fill(null) creates an array with nine null elems
    // useState() declares a squares state var thats initially set to that array

    function handleClick(i) {
        if (squares[i] || calculateWinner(squares)) { // check if the square is not empty or a winner has been found and return early
            return;
        }

        const nextSquares = squares.slice(); // creates a copy of the squares array with slice() (immutability)
        
        if (xIsNext) {
            nextSquares[i] = "X";// updates nextSquares to add X to the index/square
        } else {
            nextSquares[i] = "O";
        }

        // setSquares(nextSquares);
        // setXIsNext(!xIsNext);

        onPlay(nextSquares);

        // benefits of immutability:
            // version control: provides the ability to undo/redo actions by keeping previous versions of the data intact
            // performance: prevents parts of the data that were not changed from re-rendering
    }

    const winner = calculateWinner(squares);
    let status;
    if (winner) {
        status = 'Winner: ' + winner;
    } else {
        status = 'Next player: ' + (xIsNext ? 'X' : 'O');
    }

    // in return, using onSquareClick={handleClick(0)} won't work because handleClick is part of the rendering of Board
    // calling handleClick(0) will call setSquares which will alter the state, causing it to re-render, which then runs handleClick(0) again, and it infinitely loops
    // handleClick without (0) worked (when handleClick was defined without (i)) because it was passed as a prop, not being called

    // => is an arrow function: a shorter way to define functions
    // when the suqare is clicked, the code after the arrow will run, calling handleClick(0)
    // this is a better way of fixing the previous issue
    // the more brute force way would've been to create a function handleFirstSquareClick that calls handleClick(0), handleSecondSquareClick to call handleClick(1), and so on

    return (
        <>
            <div className="status">{status}</div>
            <div className="board-row">
                <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
                <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
                <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
            </div>
            <div className="board-row">
                <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
                <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
                <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
            </div>
            <div className="board-row">
                <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
                <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
                <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
            </div>
        </>
    );
}

export default function Game() {
    // const [xIsNext, setXIsNext] = useState(true); // turn tracking
    const [history, setHistory] = useState([Array(9).fill(null)]); // track board history
    const [currentMove, setCurrentMove] = useState(0); // keep track of which step the user is viewing
    const xIsNext = currentMove % 2 === 0; // remove the redundant state from three lines up by setting x to true if the number that currentMove is changing to is even
    // const currentSquares = history[history.length - 1]; // to render the squares for the current move
    const currentSquares = history[currentMove]; // render the selected move, instead of always the last one

    function handlePlay(nextSquares) { // called by board to update game
        // setHistory([...history, nextSquares]); // creates a new array that contains all the items in history, followed by nextSquares
        
        // update handlePlay so that it only keeps the portion of history up to the move we're jumping to
        const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1); // update to the latest history entry


        // setXIsNext(!xIsNext);
    }

    function jumpTo(nextMove) {
        setCurrentMove(nextMove);
        // setXIsNext(nextMove % 2 === 0);
    }

    // map transforms one array into another
    // e.g. [1, 2, 3].map((x) => x * 2) makes [2, 4, 6]
    const moves = history.map((squares, move) => {
        let description;
        if (move > 0) {
            description = 'Go to move #' + move;
        } else {
            description = 'Go to game start';
        }

        // lists SHOULD HAVE keys to track components
        // if the list has a key that didn't exist, React makes a new component
        // if the list doesn't have a key that it did before, React gets rid of it
        // if a key has been moved or updated, React acts accordingly
        return (
            <li key={move}>
                <button onClick={() => jumpTo(move)}>{description}</button>
            </li>
        );
    });

    return (
        <div className="game">
            <div className="game-board">
                <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
            </div>
            <div className="game-info">
                <ol>{moves}</ol>
            </div>
        </div>
    );
}

function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];

      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }

    return null;
  }
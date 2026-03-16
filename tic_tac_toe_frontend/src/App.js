import React, { useMemo, useState } from "react";
import "./App.css";

/**
 * Returns the winner info for the given board.
 * @param {Array<"X"|"O"|null>} squares - A 9-length array representing the board.
 * @returns {{ winner: "X"|"O"|null, line: number[]|null }} Winner and winning line indices (if any).
 */
function calculateWinner(squares) {
  const lines = [
    // Rows
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    // Columns
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    // Diagonals
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const [a, b, c] of lines) {
    const v = squares[a];
    if (v && v === squares[b] && v === squares[c]) {
      return { winner: v, line: [a, b, c] };
    }
  }
  return { winner: null, line: null };
}

/**
 * @param {Array<"X"|"O"|null>} squares
 * @returns {boolean}
 */
function isBoardFull(squares) {
  return squares.every((v) => v !== null);
}

// PUBLIC_INTERFACE
function App() {
  /** @type {[Array<"X"|"O"|null>, Function]} */
  const [squares, setSquares] = useState(() => Array(9).fill(null));
  /** @type {["X"|"O", Function]} */
  const [nextPlayer, setNextPlayer] = useState("X");

  const { winner, line } = useMemo(() => calculateWinner(squares), [squares]);
  const isDraw = !winner && isBoardFull(squares);

  const statusText = useMemo(() => {
    if (winner) return `Winner: ${winner}`;
    if (isDraw) return "Draw game";
    return `Turn: ${nextPlayer}`;
  }, [winner, isDraw, nextPlayer]);

  // PUBLIC_INTERFACE
  function handleSquareClick(index) {
    // Do not allow moves after game ends or on occupied squares
    if (winner || isDraw || squares[index] !== null) return;

    setSquares((prev) => {
      const next = prev.slice();
      next[index] = nextPlayer;
      return next;
    });
    setNextPlayer((p) => (p === "X" ? "O" : "X"));
  }

  // PUBLIC_INTERFACE
  function restartGame() {
    setSquares(Array(9).fill(null));
    setNextPlayer("X");
  }

  const showRestart = winner || isDraw;

  return (
    <div className="App">
      <main className="ttt-shell">
        <header className="ttt-header">
          <div className="ttt-titleBlock">
            <h1 className="ttt-title">Tic Tac Toe</h1>
            <p className="ttt-subtitle">Two-player • Same device</p>
          </div>

          <div className="ttt-status" role="status" aria-live="polite">
            <span
              className={[
                "ttt-statusPill",
                winner ? "is-winner" : "",
                isDraw ? "is-draw" : "",
              ].join(" ")}
            >
              {statusText}
            </span>
          </div>
        </header>

        <section className="ttt-card" aria-label="Game board">
          <div className="ttt-board" role="grid" aria-label="Tic Tac Toe board">
            {squares.map((value, idx) => {
              const isWinningSquare = Boolean(line && line.includes(idx));
              const isDisabled = Boolean(winner || isDraw || value !== null);

              return (
                <button
                  key={idx}
                  type="button"
                  className={[
                    "ttt-square",
                    value ? `is-${value}` : "",
                    isWinningSquare ? "is-winning" : "",
                  ].join(" ")}
                  onClick={() => handleSquareClick(idx)}
                  disabled={isDisabled}
                  role="gridcell"
                  aria-label={`Square ${idx + 1}${value ? `: ${value}` : ""}`}
                >
                  <span className="ttt-mark" aria-hidden="true">
                    {value ?? ""}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="ttt-controls" aria-label="Game controls">
            <button type="button" className="ttt-btn" onClick={restartGame}>
              {showRestart ? "New game" : "Restart"}
            </button>

            <div className="ttt-hint" aria-label="Help">
              <span className="ttt-hintKey">Tip:</span> First to align 3 marks
              wins.
            </div>
          </div>
        </section>

        <footer className="ttt-footer">
          <div className="ttt-legend" aria-label="Player legend">
            <span className="ttt-legendItem">
              <span className="ttt-dot is-x" aria-hidden="true" /> X
            </span>
            <span className="ttt-legendItem">
              <span className="ttt-dot is-o" aria-hidden="true" /> O
            </span>
            {line ? (
              <span className="ttt-legendItem">
                <span className="ttt-dot is-win" aria-hidden="true" /> winning
                line highlighted
              </span>
            ) : null}
          </div>
        </footer>
      </main>
    </div>
  );
}

export default App;

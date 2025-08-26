window.addEventListener("load", () => {
  // Build 8x8 board
  const chess_frame = document.querySelector(".container");
  for (let ri = 0; ri < 8; ri++) {
    const tr = document.createElement("tr");
    for (let ci = 0; ci < 8; ci++) {
      const td = document.createElement("td");
      td.setAttribute("data-index", `${ri}-${ci}`);
      td.classList.add("box");
      if ((ri + ci) % 2 === 0) td.classList.add("white");
      else td.classList.add("black");
      tr.appendChild(td);
    }
    chess_frame.appendChild(tr);
  }

  // Piece sets (as <span> to match your CSS)
  const White_coins = [
    '<span>♖</span>', '<span>♘</span>', '<span>♗</span>', '<span>♕</span>',
    '<span>♔</span>', '<span>♗</span>', '<span>♘</span>', '<span>♖</span>'
  ];
  const White_pawns = Array(8).fill('<span>♙</span>');
  const Black_coins = [
    '<span>♜</span>', '<span>♞</span>', '<span>♝</span>', '<span>♛</span>',
    '<span>♚</span>', '<span>♝</span>', '<span>♞</span>', '<span>♜</span>'
  ];
  const Black_pawns = Array(8).fill('<span>♟</span>');

  // COLUMN-WISE initial placement:
  // Columns 0–1: White (coins then pawns by row)
  // Columns 6–7: Black (pawns then coins by row)
  document.querySelectorAll("[data-index]").forEach((cell) => {
    const [row, col] = cell.dataset.index.split("-").map(Number);
    if (col === 0) cell.innerHTML = White_coins[row];
    else if (col === 1) cell.innerHTML = White_pawns[row];
    else if (col === 6) cell.innerHTML = Black_pawns[row];
    else if (col === 7) cell.innerHTML = Black_coins[row];
  });

  // --- Turn handling & selection/highlighting ---
  let selectedCell = null;
  let turn = "white"; // White starts

  const cells = document.querySelectorAll(".container tr td");

  cells.forEach((cell) => {
    cell.addEventListener("click", () => {
      // If nothing selected yet, try selecting own piece
      if (!selectedCell) {
        if (cell.textContent && isOwnPiece(cell.textContent.trim(), turn)) {
          selectedCell = cell;
          highlightSelected(selectedCell, true);

          // Show legal targets
          const from = idx(cell);
          const board = getBoard();
          const piece = board[from[0]][from[1]];
          const moves = enumerateLegalTargets(board, from, piece, turn);
          moves.forEach(([r, c]) => markMoveHint(r, c));
        }
        return;
      }

      // If clicked same square, cancel selection
      if (selectedCell === cell) {
        highlightSelected(selectedCell, false);
        clearMoveHints();
        selectedCell = null;
        return;
      }

      // Attempt a move
        const from = idx(selectedCell);
        const to = idx(cell);
        const board = getBoard();
        const piece = board[from[0]][from[1]];

        // Prevent capturing own piece
        if (board[to[0]][to[1]] && isOwnPiece(board[to[0]][to[1]], turn)) {
          alert("You cannot capture your own piece!");
          return;
        }

        if (!isValidMoveColWise(piece, board, from, to)) {
          alert("Invalid move!");
          return;
        }

        // --- Move piece on board ---
        applyMove({ from, to });

        // Clear selection & hints
        highlightSelected(selectedCell, false);
        clearMoveHints();
        selectedCell = null;

        // Now check AFTER placing the coin
        const opponent = turn === "white" ? "black" : "white";

        if (isCheckmate(opponent)) {
          alert(`Checkmate! ${turn} wins!`);
          // freeze game by removing click events
          cells.forEach(c => c.replaceWith(c.cloneNode(true)));
          return;
        } else if (isCheck(opponent)) {
          alert(`${opponent} is in Check!`);
        }

        // Switch turn finally
        turn = opponent;
        console.log("Turn:", turn);

    });
  });

  // ---------- Helpers ----------

  function idx(cell) {
    return cell.dataset.index.split("-").map(Number);
  }

  function getBoard() {
    const board = [];
    for (let r = 0; r < 8; r++) {
      const row = [];
      for (let c = 0; c < 8; c++) {
        const cell = document.querySelector(`[data-index="${r}-${c}"]`);
        row.push(cell.textContent.trim() || null);
      }
      board.push(row);
    }
    return board;
  }

  function applyMove(move) {
    const [fr, fc] = move.from;
    const [tr, tc] = move.to;
    const fromCell = document.querySelector(`[data-index="${fr}-${fc}"]`);
    const toCell = document.querySelector(`[data-index="${tr}-${tc}"]`);
    if (!fromCell || !toCell) return;
    toCell.innerHTML = fromCell.innerHTML;
    fromCell.innerHTML = "";
  }

  function isWhitePiece(p) {
    return ["♖", "♘", "♗", "♕", "♔", "♙"].includes(p);
  }
  function isBlackPiece(p) {
    return ["♜", "♞", "♝", "♛", "♚", "♟"].includes(p);
  }
  function isOwnPiece(p, side) {
    return side === "white" ? isWhitePiece(p) : isBlackPiece(p);
  }
  function isEnemyOf(piece, target) {
    if (!piece || !target) return false;
    return (isWhitePiece(piece) && isBlackPiece(target)) ||
           (isBlackPiece(piece) && isWhitePiece(target));
  }

  // Visual highlights using inline styles (so no CSS changes needed)
  function highlightSelected(cell, on) {
    if (on) {
      cell.style.outline = "3px solid #ffea08ff";
      cell.style.boxShadow = "inset 0 0 0 9999px rgba(255, 242, 2, 1)";
      cell.dataset.sel = "1";
    } else {
      cell.style.outline = "";
      cell.style.boxShadow = "";
      delete cell.dataset.sel;
    }
  }
  function markMoveHint(r, c) {
  const cell = document.querySelector(`[data-index="${r}-${c}"]`);
  if (!cell) return;

  const cell_div = document.createElement("div");
  cell_div.classList.add("move-hint-circle");
  cell.appendChild(cell_div);

  cell.dataset.hint = "1";
}
  function clearMoveHints() {
    document.querySelectorAll(".move-hint-circle").forEach((circle) => circle.remove());
    document.querySelectorAll('[data-hint="1"]').forEach((el) => {
    const hintCircle = el.querySelector(".move-hint-circle");
      if (hintCircle) {
        hintCircle.remove();
      }
      el.style.boxShadow = el.dataset.sel ? el.style.boxShadow : "";
      delete el.dataset.hint;
    });
  }

  // ---------- Move generation for highlighting ----------
  function enumerateLegalTargets(board, from, piece, side) {
    const targets = [];
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (r === from[0] && c === from[1]) continue;
        if (isValidMoveColWise(piece, board, from, [r, c])) {
          targets.push([r, c]);
        }
      }
    }
    return targets;
  }

  // ---------- Column-wise validators ----------
  function isValidMoveColWise(piece, board, from, to) {
    if (!piece) return false;
    const p = piece;
    if (p === "♙" || p === "♟") return validPawnColWise(board, from, to, p);
    if (p === "♘" || p === "♞") return validKnight(board, from, to);
    if (p === "♖" || p === "♜") return validRook(board, from, to);
    if (p === "♗" || p === "♝") return validBishop(board, from, to);
    if (p === "♔" || p === "♚") return validKing(board, from, to);
    if (p === "♕" || p === "♛")
      return validRook(board, from, to) || validBishop(board, from, to);
    return false;
  }

  // Pawns move ALONG COLUMN index (right for White, left for Black)
  function validPawnColWise(board, from, to, piece) {
    const [fr, fc] = from; // fr=row, fc=col
    const [tr, tc] = to;

    const dir = piece === "♙" ? +1 : -1;       // white goes to the right (col +1), black to the left (col -1)
    const startCol = piece === "♙" ? 1 : 6;     // starting columns for pawns (column-wise setup)

    // Forward 1
    if (tr === fr && tc === fc + dir && !board[tr][tc]) return true;

    // Forward 2 from start
    if (tr === fr && fc === startCol && tc === fc + 2 * dir) {
      const step1 = board[fr][fc + dir];
      const step2 = board[tr][tc];
      if (!step1 && !step2) return true;
    }

    // Diagonal capture (one row up or down, one column forward)
    if (Math.abs(tr - fr) === 1 && tc === fc + dir) {
      const target = board[tr][tc];
      if (target && isEnemyOf(piece, target)) return true;
    }

    return false;
  }

  function validKnight(board, from, to) {
    const [fr, fc] = from, [tr, tc] = to;
    const dr = Math.abs(tr - fr), dc = Math.abs(tc - fc);
    if (!((dr === 2 && dc === 1) || (dr === 1 && dc === 2))) return false;
    const target = board[tr][tc];
    if (target && isOwnPiece(target, isWhitePiece(board[fr][fc]) ? "white" : "black")) return false;
    return true;
  }

  function validRook(board, from, to) {
    const [fr, fc] = from, [tr, tc] = to;
    if (!(fr === tr || fc === tc)) return false;

    if (fr === tr) {
      const step = tc > fc ? 1 : -1;
      for (let c = fc + step; c !== tc; c += step) {
        if (board[fr][c]) return false;
      }
    } else {
      const step = tr > fr ? 1 : -1;
      for (let r = fr + step; r !== tr; r += step) {
        if (board[r][fc]) return false;
      }
    }

    const mover = board[fr][fc];
    const target = board[tr][tc];
    if (target && !isEnemyOf(mover, target)) return false;
    return true;
  }

  function validBishop(board, from, to) {
    const [fr, fc] = from, [tr, tc] = to;
    const dr = tr - fr, dc = tc - fc;
    if (Math.abs(dr) !== Math.abs(dc) || dr === 0) return false;

    const sr = dr > 0 ? 1 : -1;
    const sc = dc > 0 ? 1 : -1;
    let r = fr + sr, c = fc + sc;
    while (r !== tr && c !== tc) {
      if (board[r][c]) return false;
      r += sr; c += sc;
    }

    const mover = board[fr][fc];
    const target = board[tr][tc];
    if (target && !isEnemyOf(mover, target)) return false;
    return true;
  }

  function validKing(board, from, to) {
    const [fr, fc] = from, [tr, tc] = to;
    const dr = Math.abs(tr - fr), dc = Math.abs(tc - fc);
    if (dr === 0 && dc === 0) return false;
    if (dr <= 1 && dc <= 1) {
      const mover = board[fr][fc];
      const target = board[tr][tc];
      if (target && !isEnemyOf(mover, target)) return false;
      return true;
    }
    return false;
  }


  function findKing(board, side) {
  const king = side === "white" ? "♔" : "♚";
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (board[r][c] === king) return [r, c];
    }
  }
  return null;
}

function isSquareAttacked(board, [r, c], side) {
  const enemy = side === "white" ? "black" : "white";
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const piece = board[i][j];
      if (!piece) continue;
      if (isOwnPiece(piece, enemy)) {
        if (isValidMoveColWise(piece, board, [i, j], [r, c])) {
          return true;
        }
      }
    }
  }
  return false;
}

function isCheck(side) {
  const board = getBoard();
  const kingPos = findKing(board, side);
  if (!kingPos) return false;
  return isSquareAttacked(board, kingPos, side);
}

function isCheckmate(side) {
  const board = getBoard();
  if (!isCheck(side)) return false;

  // Try all moves for side
  for (let fr = 0; fr < 8; fr++) {
    for (let fc = 0; fc < 8; fc++) {
      const piece = board[fr][fc];
      if (!piece) continue;
      if (!isOwnPiece(piece, side)) continue;

      for (let tr = 0; tr < 8; tr++) {
        for (let tc = 0; tc < 8; tc++) {
          if (!isValidMoveColWise(piece, board, [fr, fc], [tr, tc])) continue;

          // simulate
          const copy = board.map(r => [...r]);
          copy[tr][tc] = copy[fr][fc];
          copy[fr][fc] = null;

          const kingPos = findKing(copy, side);
          if (!isSquareAttacked(copy, kingPos, side)) {
            return false; // Found escape
          }
        }
      }
    }
  }
  return true;
}

});

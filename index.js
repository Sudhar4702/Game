window.addEventListener("load",()=>{
    const chess_frame=document.querySelector(".container");
    for(let ri=0; ri<8; ri++){
        const tr=document.createElement("tr");
        for(let ci=0; ci<8; ci++){
            const td=document.createElement("td");
            td.setAttribute("data-index",`${ri}-${ci}`);
            td.classList.add("box");
            if((ri+ci)%2===0){
                td.classList.add("white");
            }
            else{
                td.classList.add("black");
            }
            tr.appendChild(td);
        }
        chess_frame.appendChild(tr);
    }
const White_coins = ['<span>&#9814;</span>', '<span>&#9816;</span>', '<span>&#9815;</span>', '<span>&#9813;</span>', '<span>&#9812;</span>', '<span>&#9815;</span>', '<span>&#9816;</span>', '<span>&#9814;</span>'];
const White_pawns = ['<span>&#9817;</span>', '<span>&#9817;</span>', '<span>&#9817;</span>', '<span>&#9817;</span>', '<span>&#9817;</span>', '<span>&#9817;</span>', '<span>&#9817;</span>', '<span>&#9817;</span>'];

const Black_coins = ['<span>&#9820;</span>', '<span>&#9822;</span>', '<span>&#9821;</span>', '<span>&#9819;</span>', '<span>&#9818;</span>', '<span>&#9821;</span>', '<span>&#9822;</span>', '<span>&#9820;</span>'];
const Black_pawns = ['<span>&#9823;</span>', '<span>&#9823;</span>', '<span>&#9823;</span>', '<span>&#9823;</span>', '<span>&#9823;</span>', '<span>&#9823;</span>', '<span>&#9823;</span>', '<span>&#9823;</span>'];

// code for selecting coins option

let current_coins_selection="white";

let human_color_coins= current_coins_selection;
let AI_color_coins= human_color_coins === "white" ? "black" : "white";

const white_coins_selected=document.querySelector(".btn_choose_white_coins");
const black_coins_selected=document.querySelector(".btn_choose_black_coins");

white_coins_selected.addEventListener("click",(event)=>{
    current_coins_selection="white";
    coins_placing_as_per_user_selection();
    selected_coins_choice();
    white_coins_selected.style.display="none";
    black_coins_selected.style.display="none";
});

black_coins_selected.addEventListener("click",(event)=>{
    current_coins_selection="black";
    coins_placing_as_per_user_selection();
    selected_coins_choice();
    white_coins_selected.style.display="none";
    black_coins_selected.style.display="none";
    turn ="white";
    if (turn === AI_color_coins) {
        setTimeout(() => {
            runAIMoveAndHandleOutcome();
        }, 300);
    }

});

// initilaising coins as per user selection
function coins_placing_as_per_user_selection(){
    const coinsadding=document.querySelectorAll("[data-index]");
    coinsadding.forEach((event)=>{
        const data_place=event.dataset.index;
        const[row,col]=data_place.split("-").map(Number);
        if(current_coins_selection==="white"){
            if(row===0){
                event.innerHTML=Black_coins[col];
            }
            else if(row===1){
                event.innerHTML=Black_pawns[col];
            }
            else if(row==6){
                event.innerHTML=White_pawns[col];
            }
            else if(row==7){
                event.innerHTML=White_coins[col];
            }
        }
        else{
            if(row===0){
                event.innerHTML=White_coins[col];
            }
            else if(row===1){
                event.innerHTML=White_pawns[col];
            }
            else if(row==6){
                event.innerHTML=Black_pawns[col];
            }
            else if(row==7){
                event.innerHTML=Black_coins[col];
            }
        }
    });
}

// code for clicking each cell
let human_choice=[];
let AI_choice=[];

let human_pawn_direction =-1;
let human_pawn_choice='♙';

let AI_pawn_direction;
let AI_pawn_choice;


function selected_coins_choice(){

    if(current_coins_selection==="white"){
        human_color_coins="white";
        AI_color_coins="black";
        human_choice=['♖', '♘', '♗', '♕', '♔', '♙'];
        AI_choice=['♜', '♞', '♝', '♛', '♚', '♟'];
        human_pawn_direction=-1;
        human_pawn_choice='♙';
        AI_pawn_direction=1;
        AI_pawn_choice='♟';
    }
    else{
        human_color_coins="black";
        AI_color_coins="white";
        human_choice=['♜', '♞', '♝', '♛', '♚', '♟'];
        AI_choice=['♖', '♘', '♗', '♕', '♔', '♙'];
        human_pawn_direction=-1;
        human_pawn_choice='♟';
        AI_pawn_direction=1;
        AI_pawn_choice='♙';
        
    }
}



let selected_cell=null;
let turn="white";
const coins_current_place=document.querySelectorAll(".container tr td");
    
coins_current_place.forEach((cell)=>{
    cell.addEventListener("click",(e)=>{
        if(turn!==current_coins_selection){
            alert("wait for your turn");
            return;
        }
        if(!selected_cell){
            clearHighlights();
            console.log(cell.textContent, is_this_our_enemy(cell.textContent.trim()));
            if(cell.textContent && is_own_coins(cell.textContent.trim())){
                selected_cell=cell;
                cell.classList.add("selected");
                cell.classList.add("highliter");

                const [row,col]=cell.dataset.index.split("-").map(Number);
                const from=[row,col];
                const coin_type=cell.textContent.trim();
                const board=getBoard();
                const moves_for_highliter=highliter_generateall_moves(board,from,coin_type);
                moves_for_highliter.forEach(([ro,co])=>{
                    const cell_to_highliter=document.querySelector(`[data-index="${ro}-${co}"]`);
                    if(cell_to_highliter && !cell_to_highliter.classList.contains("selected")){
                        const element_for_highlight=document.createElement("div");
                        element_for_highlight.setAttribute("class","defalut-highlight");
                        cell_to_highliter.appendChild(element_for_highlight);
                        element_for_highlight.classList.add("purple-highlight");
                    }
                })
            }
            return;
        }
        else{
            if(selected_cell===cell){
                clearHighlights();
                selected_cell.classList.remove("selected");
                selected_cell.classList.remove("highliter");
                selected_cell=null;
                return;
            }
            clearHighlights();
        }
        const currently_selected_cell=selected_cell.dataset.index.split("-").map(Number);
        const new_cell_to_move=cell.dataset.index.split("-").map(Number);
        const board=getBoard();
        if(is_own_coins(board[new_cell_to_move[0]][new_cell_to_move[1]])){
            alert("It's your own coin you can't be able to kill");
            return;
        }
        const coin_value=board[currently_selected_cell[0]][currently_selected_cell[1]]; 

        // checking coins value

        //pawns
        if(coin_value===(human_color_coins === "black" ? '♟' : '♙')){
            if(!valid_pawns_move(board,currently_selected_cell,new_cell_to_move)){
                alert("Invalid Pawn Move !! ... Kindly try to thing and Move accordingly");
                return;
            }
        }
        //kinghts
        else if(coin_value===(human_color_coins === "black" ? '♞' : '♘')){
            if(!valid_knight_move(board,currently_selected_cell,new_cell_to_move)){
                alert("Invalid Kinght Move !! ... Kindly try to thing and Move accordingly");
                return;
            }
        }
        //rooks
        else if(coin_value===(human_color_coins === "black" ? '♜' : '♖')){
            if(!valid_rook_move(board,currently_selected_cell,new_cell_to_move)){
                alert("Invalid Rook Move !! ... Kindly try to thing and Move accordingly");
                return;
            }
        }
        //bishop
        else if(coin_value===(human_color_coins === "black" ? '♝' : '♗')){
            if(!valid_bishop_move(board,currently_selected_cell,new_cell_to_move)){
                alert("Invalid Bishop Move !! ... Kindly try to thing and Move accordingly");
                return;
            }
        }
        //king
        else if(coin_value===(human_color_coins === "black" ? '♚' : '♔')){
            if(!valid_king_move(board,currently_selected_cell,new_cell_to_move)){
                alert("Invalid King Move !! ... Kindly try to thing and Move accordingly");
                return;
            }
        }
        //queen
        else if(coin_value ===(human_color_coins === "black" ? '♛' : '♕')){
            if(!valid_rook_move(board,currently_selected_cell,new_cell_to_move) && !valid_bishop_move(board,currently_selected_cell,new_cell_to_move)){
                alert("Invalid Queen Move !! ... Kindly try to thing and Move accordingly");
                return;
            }
        }
        apply_the_moves({from: currently_selected_cell, to: new_cell_to_move});
        selected_cell.classList.remove("selected");
        selected_cell.classList.remove("highliter");
        selected_cell=null;
        turn =AI_color_coins;
        if (turn === AI_color_coins) {
            setTimeout(() => {
                runAIMoveAndHandleOutcome();
            }, 300);
        }

         console.log(AI_pawn_direction, human_pawn_direction);   
        
    });
});


// movement

// valid human movement

// pawns
function valid_pawns_move(board,current_cell,new_cell){
    const [current_ro,current_co]=current_cell;
    const [new_ro,new_co]=new_cell;
    
    const curr_coin=board[current_ro][current_co];
    if(curr_coin!== human_pawn_choice){
        return false;
    }
    const pawn_moving_forward=human_pawn_direction+current_ro;
    if(new_co===current_co && new_ro===pawn_moving_forward && !board[new_ro][new_co]){
        return true;
    }
    const current_pawn_position= human_pawn_direction === -1 ? 6 : 1;
    const pawn_moving_twostep_forward=current_ro+2*human_pawn_direction;
    if(new_co === current_co && new_ro === pawn_moving_twostep_forward && current_ro === current_pawn_position  && !board[new_ro][new_co] && !board[pawn_moving_forward][new_co]){
        return true;
    }
    if((new_co === current_co+1 || new_co === current_co-1) && new_ro === pawn_moving_forward && board[new_ro][new_co] && is_this_our_enemy(board[new_ro][new_co])){
        return true;
    }
    return false;
}

//knight
function valid_knight_move(board,current_one,new_one){
    const [current_ro,current_co]=current_one;
    const [new_ro,new_co]=new_one;
    const dis_ro=new_ro - current_ro;
    const dis_co=new_co - current_co;

    const possible_moves=[[2,1],[2,-1],[1,2],[1,-2],[-2,-1],[-2,1],[-1,-2],[-1,2]];
    const valid_moves=possible_moves.some(([val_ro,val_co])=>val_ro===dis_ro && val_co===dis_co);
    if(!valid_moves){
        return false;
    }
    const any_coins=board[new_ro][new_co];
    if(any_coins && is_own_coins(any_coins)){
        return false;
    }
    return true;
}

//rook
function valid_rook_move(board,current_one,new_one){
    const [current_ro,current_co]=current_one;
    const [new_ro,new_co]=new_one;
    const moving_row= current_ro === new_ro;
    const moving_col= current_co === new_co;

    if(!(moving_row || moving_col) || (moving_row && moving_col)){
        return false;
    }
    if(moving_row){
        const starting_point=Math.min(current_co,new_co)+1;
        const ending_point=Math.max(current_co,new_co);

        for(let col=starting_point;col<ending_point;col++){
            if(board[current_ro][col]){
                return false;
            }
        }
    }
    else{
        const starting_point=Math.min(current_ro,new_ro)+1;
        const ending_point=Math.max(current_ro,new_ro);

        for(let row=starting_point;row<ending_point;row++){
            if(board[row][current_co]){
                return false;
            }
        }
    }

    const value_coin=board[new_ro][new_co];
    if(value_coin && is_own_coins(value_coin)){
        return false;
    }
    return true;

}

//bishop
function valid_bishop_move(board,current_one,new_one){
    const [current_ro,current_co]=current_one;
    const [new_ro,new_co]=new_one;
    const dir_ro=new_ro - current_ro;
    const dir_co=new_co - current_co;

    if(Math.abs(dir_ro) !==Math.abs(dir_co) || dir_ro ===0){
        return false;
    }

    const row_wise=dir_ro >0 ? 1 : -1;
    const column_wise=dir_co>0 ? 1 : -1;

    let row=current_ro+row_wise;
    let col=current_co+column_wise;

    while(row!==new_ro && col!==new_co){
        if(board[row][col]){
            return false;
        }
        row+=row_wise;
        col+=column_wise;
    }

    const value_coin=board[new_ro][new_co];
    if(value_coin && is_own_coins(value_coin)){
        return false;
    }
    return true;

}

//King
function valid_king_move(board,current_one,new_one){
    const [current_ro,current_co]=current_one;
    const [new_ro,new_co]=new_one;

    const dir_ro=Math.abs(new_ro - current_ro);
    const dir_co=Math.abs(new_co - current_co);
    if((dir_ro<=1) && (dir_co<=1)&&(dir_ro+dir_co>0)){
        const value_coin=board[new_ro][new_co];
        if(!value_coin || !is_own_coins(value_coin)){
            return true;
        }
    }
    return false;
}

//Queen (we don't need we can combine rook and bishop moves)


// .................................................................................................................


//get the board details

function getBoard(){
    const board=[];
    for(let ro=0;ro<8;ro++){
        const row=[];
        for(let co=0;co<8;co++){
            const cell=document.querySelector(`[data-index="${ro}-${co}"]`);
            row.push(cell.textContent.trim() || null);
        }
        board.push(row);
    }
    return board;
}


//check coins is inside

function coins_inside_the_board(ro,co){
    return ro>=0 && ro<8 && co>=0 && co<8;
}

//is enemy

function is_this_our_enemy(enemy){
    if(!enemy){
        return false;
    }
    // currently i am taking white as a enemy
    const opponent = AI_choice;
    return opponent.includes(enemy);
}

// is your own coins

function is_own_coins(coin){
    if(!coin){
        return false;
    }
    const own_coins=human_choice;
    return own_coins.includes(coin);
}


//AI moves >>>>>>>------------------------------------------------------------------------------------------------------>>>>>>>>>

// AI black pawns moves valid steps

function AI_pawns_moves(board, ro, co){
    const pawn_move=[];
    const moving_forward_AI=ro+AI_pawn_direction;

    if(coins_inside_the_board(moving_forward_AI,co)){
        if(coins_inside_the_board(moving_forward_AI,co) && !board[moving_forward_AI][co]){
            pawn_move.push({from: [ro,co], to: [moving_forward_AI,co]});
        }
        const current_place_AI_coin=AI_pawn_direction === -1 ? 6 : 1;
        const moving_forward_twostep_AI=ro+2*AI_pawn_direction;

        if(ro===current_place_AI_coin && coins_inside_the_board(moving_forward_twostep_AI,co) && !board[moving_forward_twostep_AI][co] && !board[moving_forward_AI][co]){
            pawn_move.push({from:[ro,co],to:[moving_forward_twostep_AI,co]});
        }

        const col_direction=[co+1,co-1];
        for(const col of col_direction){
            const target_coin = board[moving_forward_AI][col];
            if(coins_inside_the_board(moving_forward_AI,col) && target_coin && is_own_coins(target_coin)){
                pawn_move.push({from:[ro,co],to:[moving_forward_AI,col]});
            }
        }
    }
    
    return pawn_move;
}



// up means +, down means - && left means -, right means +;
const kinght_moves_for_all=[
    [2,1],[2,-1],[1,2],[1,-2],[-2,-1],[-2,1],[-1,-2],[-1,2]
];

// AI black kinght moves valid steps
function AI_knight_moves(board,ro,co){
    const kinght_move=[];
    for(const[di_ro,di_co] of kinght_moves_for_all){
        const new_ro=ro+di_ro;
        const new_co=co+di_co;
        if(!coins_inside_the_board(new_ro,new_co)){
            continue
        }
        if(!board[new_ro][new_co] || is_own_coins(board[new_ro][new_co])){
            kinght_move.push({from: [ro,co], to: [new_ro,new_co]});
        }
    }
    return kinght_move;
}

// AI black rook moves valid steps
function AI_rook_moves(board,ro,co){
    const rook_move=[];

    const rook_directions=[[1,0],[0,1],[-1,0],[0,-1]];

    for(const[dir_ro,dir_co] of rook_directions){
        let new_ro=dir_ro+ro;
        let new_co=dir_co+co;

        while(coins_inside_the_board(new_ro,new_co)){
            const new_cell=board[new_ro][new_co];
            if(!new_cell){
                rook_move.push({from:[ro,co],to:[new_ro,new_co]});
            }
            else{
                if(is_own_coins(new_cell)){
                    rook_move.push({from:[ro,co], to:[new_ro,new_co]});
                }
                break;
            }
            new_ro+=dir_ro;
            new_co+=dir_co;
        }
    }
    return rook_move;
    
}

//AI black bishop moves valid steps
function AI_bishop_moves(board,ro,co){
    const bishop_move=[];

    const bishop_directions=[[1,1],[1,-1],[-1,1],[-1,-1]];

    for(let [dir_ro,dir_co] of bishop_directions){
        let new_ro=ro+dir_ro;
        let new_co=co+dir_co;

        while(new_ro>=0 && new_ro<8 && new_co>=0 && new_co<8){
            const value_coin=board[new_ro][new_co];
            if(!value_coin){
                bishop_move.push({from:[ro,co],to:[new_ro,new_co]});
            }
            else{
                if(is_own_coins(value_coin)){
                    bishop_move.push({from:[ro,co],to:[new_ro,new_co]});
                }
                break;
            }
            new_ro+=dir_ro;
            new_co+=dir_co;
        }
    }
    return bishop_move;
}

// AI black king moves valid steps
function AI_king_moves(board,ro,co){
    const king_move=[];
    const king_directions=[
        [1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,1],[1,-1],[-1,-1]
    ];

    for(const[dir_ro,dir_co] of king_directions){
        const new_ro=dir_ro+ro;
        const new_co=dir_co+co;

        if(new_ro>=0 && new_ro<8 && new_co>=0 && new_co<8){
            const value_coin=board[new_ro][new_co];

            if(!value_coin || is_own_coins(value_coin)){
                king_move.push({from:[ro,co], to:[new_ro,new_co]});
            }
        }
    }
    return king_move;
}

//AI black queen moves valid steps
function AI_queen_moves(board,ro,co){
    const queen_move=[];
    const queen_directions=[[1,0],[0,1],[-1,0],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];

    for(const [dir_ro,dir_co] of queen_directions){
        let new_ro=dir_ro+ro;
        let new_co=dir_co+co;
        while(new_ro>=0 && new_ro<8 && new_co>=0 && new_co<8){
            const value_coin=board[new_ro][new_co];

            if(!value_coin){
                queen_move.push({from:[ro,co], to:[new_ro,new_co]});
            }
            else{
                if(is_own_coins(value_coin)){
                    queen_move.push({from:[ro,co], to:[new_ro,new_co]});
                }
                break;
            }
            new_ro+=dir_ro;
            new_co+=dir_co;
        }
    }
    return queen_move;
}


// applying AI moves >>>>>>>> ----------------- >>>>>>>>

function apply_AI_moves(board){
    const all_moves=[];

    for(let ro=0;ro<8;ro++){
        for(let co=0;co<8;co++){
            const coins_piece=board[ro][co];
            if(!coins_piece){
                continue;
            }
            if(!AI_choice.includes(coins_piece)){
                continue;
            }
            if(coins_piece === AI_pawn_choice){
                all_moves.push(...AI_pawns_moves(board,ro,co));
            }
            else if(coins_piece === (AI_color_coins === "black" ? '♞' : '♘')){
                all_moves.push(...AI_knight_moves(board,ro,co));
            }
            else if(coins_piece === (AI_color_coins === "black" ? '♜' : '♖')){
                all_moves.push(...AI_rook_moves(board,ro,co));
            }
            else if(coins_piece === (AI_color_coins === "black" ? '♝' : '♗')){
                all_moves.push(...AI_bishop_moves(board,ro,co));
            }
            else if(coins_piece === (AI_color_coins === "black" ? '♚' : '♔')){
                all_moves.push(...AI_king_moves(board,ro,co));
            }
            else if(coins_piece === (AI_color_coins === "black" ? '♛' : '♕')){
                all_moves.push(...AI_queen_moves(board,ro,co));
            }
        }
    }
    return all_moves;
}


// simulate a move on a board copy and return the new board
function simulate_move(board, move) {
  const copy = board.map(row => row.slice());
  const [fr, fc] = move.from;
  const [tr, tc] = move.to;
  copy[tr][tc] = copy[fr][fc];
  copy[fr][fc] = null;
  return copy;
}

// return only moves that don't leave aiColor's king in check
function filter_legal_moves(board, moves, aiColor) {
  return moves.filter(mv => {
    const nb = simulate_move(board, mv);
    return !is_king_check(nb, aiColor);
  });
}

// pick a random move from an array of moves. If board param is a true board and
// you passed a board by mistake, this will compute moves automatically.
function pick_random_move(movesOrBoard, boardForContext = null) {
  let moves = movesOrBoard;

  // if caller accidentally passed a board (2D array), generate moves from it
  if (!Array.isArray(moves) || (moves.length && !moves[0].from)) {
    moves = apply_AI_moves(movesOrBoard);
    boardForContext = movesOrBoard; // actual board
  }

  if (!moves || moves.length === 0) return null;

  // prefer captures when possible (requires board for detecting captures)
  if (!boardForContext && typeof getBoard === "function") {
    boardForContext = getBoard();
  }
  if (boardForContext) {
    const captures = moves.filter(m => boardForContext[m.to[0]][m.to[1]]);
    if (captures.length) return captures[Math.floor(Math.random() * captures.length)];
  }

  return moves[Math.floor(Math.random() * moves.length)];
}



// apply the moves needs to reflect in UI

function apply_the_moves(move) {
    if (!move) return;

    const current_cell=document.querySelector(`[data-index="${move.from[0]}-${move.from[1]}"]`);
    const new_cell=document.querySelector(`[data-index="${move.to[0]}-${move.to[1]}"]`);

    // update UI
    new_cell.innerHTML=current_cell.innerHTML;
    current_cell.innerHTML='';

    // check AFTER UI updates
    setTimeout(() => {
        const board=getBoard();
        const enemy_color = AI_color_coins;
        if (is_king_check(board, enemy_color)) {
            if (is_check_mate(board, enemy_color)) {
                alert("You won! Checkmate against AI 🎉");
            }
        }
    }, 500);
}



function apply_AI_move(move) {
    if (!move) return;

    const [current_ro, current_co] = move.from;
    const [new_ro, new_co] = move.to;

    const current_cell = document.querySelector(`[data-index="${current_ro}-${current_co}"]`);
    const new_cell = document.querySelector(`[data-index="${new_ro}-${new_co}"]`);

    // update UI first
    new_cell.innerHTML = current_cell.innerHTML;
    current_cell.innerHTML = '';

    // after DOM paint, check for check/checkmate
    setTimeout(() => {
        const board = getBoard();
        const enemy_color = human_color_coins;
        if (is_king_check(board, enemy_color)) {
            if (is_check_mate(board, enemy_color)) {
                alert("Check Mate! AI wins 🏆");
            } else {
                alert("Your king is in Check!");
            }
        }
    }, 500);
}






// check function

function is_king_check(board, kingColor) {
  // find king position
  const kingPiece = kingColor === "white" ? "♔" : "♚";
  let kingPos = null;

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (board[r][c] === kingPiece) {
        kingPos = [r, c];
        break;
      }
    }
    if (kingPos) break;
  }

  if (!kingPos) return false;

  // check if that square is attacked by enemy
  const enemyColor = kingColor === "white" ? "black" : "white";
  return is_square_attacked(board, kingPos[0], kingPos[1], enemyColor);
}


// checkmate function

function is_check_mate(board, king_color) {
  if (!is_king_check(board, king_color)) return false;

  if (king_color === human_color_coins) {
    // generate human legal moves using your human validators
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const coin = board[r][c];
        if (!coin || !human_choice.includes(coin)) continue;
        for (let rr = 0; rr < 8; rr++) {
          for (let cc = 0; cc < 8; cc++) {
            if (!valid_place_to_move(board, [r, c], [rr, cc], coin)) continue;
            const nb = cloneBoard(board);
            nb[rr][cc] = nb[r][c];
            nb[r][c] = null;
            if (!is_king_check(nb, king_color)) return false;
          }
        }
      }
    }
    return true;
  } else {
    // generate AI legal moves using your AI_* move generators
    const aiMoves = apply_AI_moves(board);
    for (const mv of aiMoves) {
      const nb = cloneBoard(board);
      const [fr, fc] = mv.from, [tr, tc] = mv.to;
      nb[tr][tc] = nb[fr][fc];
      nb[fr][fc] = null;
      if (!is_king_check(nb, king_color)) return false;
    }
    return true;
  }
}




// checking highliter function

function highliter_generateall_moves(board,from,coin){
    clearHighlights();
    const moves=[];
    for(let ro=0;ro<8;ro++){
        for(let co=0;co<8;co++){
            const to=[ro,co];
            if(valid_place_to_move(board,from,to,coin)){
                moves.push(to);
            }
        }
    }
    return moves;
}

function valid_place_to_move(board,from,to,coin){
    if(coin === (human_color_coins==="black"?'♟':'♙')){
        return valid_pawns_move(board,from,to);
    }
    else if(coin === (human_color_coins==="black"?'♞':'♘')){
        return valid_knight_move(board,from,to);
    }
    else if(coin === (human_color_coins==="black"?'♜':'♖')){
        return valid_rook_move(board,from,to);
    }
    else if(coin === (human_color_coins==="black"?'♝':'♗')){
        return valid_bishop_move(board,from,to);
    }
    else if(coin === (human_color_coins==="black"?'♚':'♔')){
        return valid_king_move(board,from,to);
    }
    else if(coin === (human_color_coins==="black"?'♛':'♕')){
        return valid_rook_move(board,from,to) || valid_bishop_move(board,from,to);
    }
    return false;
}

function clearHighlights(){
    const highlightedCells=document.querySelectorAll(".purple-highlight");
    highlightedCells.forEach((cell)=>{
        cell.classList.remove("purple-highlight");
    });
}

function is_square_attacked(board, r, c, byColor) {
  // pawns
  const pawn = byColor === 'white' ? '♙' : '♟';
  const pawnFromRow = r + (byColor === 'white' ? 1 : -1);
  for (const dc of [-1, 1]) {
    const cc = c + dc;
    if (coins_inside_the_board(pawnFromRow, cc) && board[pawnFromRow][cc] === pawn) return true;
  }

  // knights
  const knight = byColor === 'white' ? '♘' : '♞';
  const nMoves = [[2,1],[2,-1],[1,2],[1,-2],[-2,1],[-2,-1],[-1,2],[-1,-2]];
  for (const [dr, dc] of nMoves) {
    const rr = r + dr, cc = c + dc;
    if (coins_inside_the_board(rr, cc) && board[rr][cc] === knight) return true;
  }

  // king
  const king = byColor === 'white' ? '♔' : '♚';
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (!dr && !dc) continue;
      const rr = r + dr, cc = c + dc;
      if (coins_inside_the_board(rr, cc) && board[rr][cc] === king) return true;
    }
  }

  // rooks/queens (orthogonal)
  const rook = byColor === 'white' ? '♖' : '♜';
  const queen = byColor === 'white' ? '♕' : '♛';
  const ortho = [[1,0],[-1,0],[0,1],[0,-1]];
  for (const [dr, dc] of ortho) {
    let rr = r + dr, cc = c + dc;
    while (coins_inside_the_board(rr, cc)) {
      const p = board[rr][cc];
      if (p) { if (p === rook || p === queen) return true; else break; }
      rr += dr; cc += dc;
    }
  }

  // bishops/queens (diagonals)
  const bishop = byColor === 'white' ? '♗' : '♝';
  const diag = [[1,1],[1,-1],[-1,1],[-1,-1]];
  for (const [dr, dc] of diag) {
    let rr = r + dr, cc = c + dc;
    while (coins_inside_the_board(rr, cc)) {
      const p = board[rr][cc];
      if (p) { if (p === bishop || p === queen) return true; else break; }
      rr += dr; cc += dc;
    }
  }

  return false;
}

function cloneBoard(board) {
  return board.map(row => row.slice());
}

// Use this wherever you trigger an AI turn
function runAIMoveAndHandleOutcome() {
  const board = getBoard();
  // all candidate moves for AI (unfiltered)
  const allMoves = apply_AI_moves(board);

  // filter out moves that leave AI in check
  const legalMoves = filter_legal_moves(board, allMoves, AI_color_coins);

  // no legal moves -> checkmate or stalemate
  if (legalMoves.length === 0) {
    if (is_king_check(board, AI_color_coins)) {
      alert("Checkmate! You win 🎉");
    } else {
      alert("Stalemate! It's a draw 🤝");
    }
    return;
  }

  const AI_move = pick_random_move(legalMoves, board);
  if (!AI_move) {
    alert("AI has no moves. Game Over!");
    return;
  }

  apply_AI_move(AI_move);

  // after AI move, switch turn back to human
  turn = human_color_coins;
}



});




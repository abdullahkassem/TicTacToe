function Player(Name,marker,color)
{
    let numOfWins = 0;

    function incWins()
    {numOfWins++;}

    function getMarker()
    {return marker;}

    function getName()
    {return Name;}

    function getWins()
    {return numOfWins;}

    function setColor(clr)
    {color = clr;}

    function getColor(clr)
    {return color;}

    return {getColor,setColor,incWins,getMarker,getName,getWins};
}


function Game()
{
    //only one instance of the gameboard is needed so we will use IIFE
    const gameBoard = (function(){
        //create a 3x3 array filled with zeros
        const grid = new Array();
        let winningCombination = null;
        for(let i=0;i<3;i++)
        {
            grid[i] = new Array("-","-","-");
        }

        const winningLines = [
            [[0,0], [0,1], [0,2]],
            [[1,0], [1,1], [1,2]],
            [[2,0], [2,1], [2,2]],
            [[0,0], [1,0], [2,0]],
            [[0,1], [1,1], [2,1]],
            [[0,2], [1,2], [2,2]],
            [[0,0], [1,1], [2,2]],
            [[2,0], [1,1], [0,2]],
        ];
        
        function clearGrid(){
            winningCombination = null;
            for (let i = 0; i < grid.length; i++) {
                for (let j = 0; j < grid[0].length; j++)
                {
                    grid[i][j] = "-";
                }
            }
        }


        function editGrid(row,col,marker){
            if(row>2 || col >2)
            {
                console.error("move out of bounds");
                return -1;
            }
            if(grid[row][col] == "-")
                grid[row][col] = marker;
            else
            {   return -1;}

        }

        function checkWinner()
        {
            for(let i=0;i<winningLines.length;i++)
            {
                const [[ax,ay], [bx,by], [cx,cy] ] = winningLines[i];
                const player = grid[ax][ay];

                if (player !== '-' && player === grid[bx][by] && player === grid[cx][cy]) {
                    winningCombination = winningLines[i];
                    return player;
                }
            }

            for (let i = 0; i < grid.length; i++) {
                for(let j = 0;j<3;j++)
                {
                    if (grid[i][j] === '-') {
                        return null;  // Game is not over yet
                    }
                }   
            }
            
            // If no winner and no empty cells, it's a tie
            return 'Tie';
        }

        function getGrid(){return grid;}

        function getwinningCombination()
        {return winningCombination;}


        return {getwinningCombination,getGrid,checkWinner,clearGrid,editGrid};
    })();

    const player1 = Player("Player 1","x","blue");
    const player2 = Player("Player 2","o","red");
    let turn=0;

    const getBoard = gameBoard.getGrid;

    function newGame(startWith = 0)
    {
        gameBoard.clearGrid();
        turn = startWith;
    }

    function getPlayerInTurn()
    {
        if(turn==0)
        return player1;
        else
        return player2;
    }

    function playStep(row,col)
    {
        let editReturnValue = 0;
        if(!turn){
            editReturnValue = gameBoard.editGrid(row,col,player1.getMarker());
        }
        else{
            editReturnValue = gameBoard.editGrid(row,col,player2.getMarker());
        }
        if(editReturnValue != -1)
        {
            turn^=1;
        }else
        {
            ;
        }
    }

    function playStep_CheckWinner(row,col)
    {
        playStep(row,col);
        return gameBoard.checkWinner();
    }

    function getPlayers()
    {
        return {player1,player2};
    }

    function getwinningCombination()
    {
        return gameBoard.getwinningCombination();
    }


    return {getwinningCombination,newGame,getBoard,playStep_CheckWinner,getPlayerInTurn,getPlayers};
}

function screenController()
{
    const myGame = Game();
    const playerTurnDiv = document.querySelector("#playersTurn");
    const gameBoardDiv = document.querySelector("#gameBoard");
    const board = myGame.getBoard();
    let cells = new Array();
    
    function initilizeBoard()
    {
        const currPlayer = myGame.getPlayerInTurn();
        playerTurnDiv.textContent = "It's "+ currPlayer.getName()+"'s turn";
        playerTurnDiv.style.color = currPlayer.getColor();
        
        
        for(let i=0;i<board.length;i++)
        {
            for(let j=0;j<board[0].length;j++)
            {
                const cellButton = document.createElement("button");
                cellButton.classList.add("cell");
                cellButton.dataset.position = [i,j];
                cellButton.textContent = board[i][j];
                cellButton.addEventListener("click", clickHandlerBoard);                
                gameBoardDiv.appendChild(cellButton);
                // strikeThroughCell(cellButton,0);
                cells.push(cellButton);
            }
        }
    }

    function findCell(row,col)
    {
        for(let i=0;i<cells.length;i++)
        {
            const myRow = cells[i].dataset.position[0];
            const myCol = cells[i].dataset.position[2];
            if(row == myRow && col == myCol)
            {
                return cells[i];
            }
        };
        console.error("No such cell found");
    }

    function clearBoard()
    {
        const myCells = document.querySelectorAll(".cell");
        myCells.forEach(cell=>{
            cell.remove();
        });
        cells = new Array();
    }

    function arraysEqual(arr1, arr2) {
        for(let i=0;i<3;i++)
        {
            for(let j=0;j<2;j++)
            {
                if(arr1[i][j] != arr2[i][j])
                {
                    return false;
                }
            }
        }
        return true;
    }

    function makeCellsUnclickable()
    {
        cells.forEach((cell)=>{
            cell.style["z-index"] = -1;
        });
    }

    function strikeThroughCell(cell,degree)
    {
        const line = document.createElement("div");
        line.classList.add("strikeThroughElemenet");
        line.style = `transform: rotate(${degree}deg);`;
        if(null == cell.insertAdjacentElement('afterbegin',line))
        {
            console.error("Failed to add element");
        }
    }

    function crossWinningCells()
    {
        const comb = myGame.getwinningCombination();
        let angle = 0;
        if(arraysEqual(comb,[[0,0], [0,1], [0,2]]) || arraysEqual(comb, [[1,0], [1,1], [1,2]]) || arraysEqual(comb, [[2,0], [2,1], [2,2]])  )
        {
            angle =0;
        }else if (arraysEqual(comb, [[0,0], [1,0], [2,0]] ) || arraysEqual(comb, [[0,1], [1,1], [2,1]]) || arraysEqual(comb, [[0,2], [1,2], [2,2]]) )
        {
            angle =90;
        }
        else if(arraysEqual(comb, [[0,0], [1,1], [2,2]] ) )
        {
            angle =45;
        }
        else if(arraysEqual(comb, [[2,0], [1,1], [0,2]]) )
        {
            angle = -45;
        }
        else
        {
            console.error("unknown winning combination entered");
        }

        comb.forEach((coordinate)=>{
            const cell = findCell(coordinate[0],coordinate[1]);
            strikeThroughCell(cell,angle);
            
        })
    }

    function updateWinsDisplay()
    {
        const {player1,player2} = myGame.getPlayers();
        const p1Div = document.querySelector("#p1Wins");
        const p2Div = document.querySelector("#p2Wins");
        p1Div.textContent = `${player1.getName()}(${player1.getMarker()}) wins: ${player1.getWins()}`;
        p2Div.textContent = `${player2.getName()}(${player2.getMarker()}) wins: ${player2.getWins()}`;
        // console.log("The winning combination is ",myGame.getwinningCombination());
        crossWinningCells();
        makeCellsUnclickable();
        
        
    }

    document.querySelector("#restartButton").addEventListener("click",startNewGame);

    function startNewGame()
    {
        myGame.newGame();
        clearBoard();
        initilizeBoard();
    }

    function isGameFinished(state)
    {
        const {player1,player2} = myGame.getPlayers();
        let xplayer;
        let oplayer;
        if(player1.getMarker() == 'x' || player1.getMarker() == 'X' )
        {
            xplayer = player1;
            oplayer = player2;
        }else if(player2.getMarker() == 'x' || player2.getMarker() == 'X')
        {
            xplayer = player2;
            oplayer = player1;
        }else
        {
            console.error("None of the players' marker is an 'x' ");
        }
     
        // possible values are null - x - o - tie
        if(state == null){
            return;
        }
        state = state.toLowerCase();
        if (state == 'x' ){
            xplayer.incWins();
            updateWinsDisplay();
        }
        else if (state == 'o'){
            oplayer.incWins();
            updateWinsDisplay();
        }
        else if(state == 'tie'){
            console.log(`its a tie`);
        }
    }

    function updateCell(cell,row,col)
    {
        // cell.style['z-index'] = -1;
        cell.textContent = board[row][col];
        const currPlayer = myGame.getPlayerInTurn();
        playerTurnDiv.textContent = "It's "+currPlayer.getName()+"'s turn";
        playerTurnDiv.style.color = currPlayer.getColor();

    }

    function clickHandlerBoard(e){
        const myRow = e.target.dataset.position[0];
        const myCol = e.target.dataset.position[2];
        // console.log(`my position is ${myRow},${myCol}`);
        const winnerState = myGame.playStep_CheckWinner(myRow,myCol);
        updateCell(e.target,myRow,myCol);
        isGameFinished(winnerState);
        
        
    }
    
    

    return {initilizeBoard}
}




const myScreen = screenController();
myScreen.initilizeBoard();


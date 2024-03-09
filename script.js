

function Player(Name,marker)
{
    let numOfWins = 0;



    function incWins()
    {
        numOfWins++;
    }

    function getMarker()
    {
        return marker;
    }

    function getName()
    {
        return Name;
    }

    function getWins()
    {return numOfWins;}

    return {incWins,getMarker,getName,getWins};
}


function Game()
{
    //only one instance of the gameboard is needed so we will use IIFE
    const gameBoard = (function(){
        //create a 3x3 array filled with zeros
        const grid = new Array();
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
            for (let i = 0; i < grid.length; i++) {
                for (let j = 0; j < grid[0].length; j++)
                {
                    grid[i][j] = "-";
                }
            }
        }

        function displayGrid(){
            console.log("Current Grid: ")
            console.log(JSON.stringify(grid[0]));
            console.log(JSON.stringify(grid[1]));
            console.log(JSON.stringify(grid[2]));
            // console.table(grid);
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
                    // console.log(`${player} has won`);
                    return player;
                }
            }

            for (let i = 0; i < grid.length; i++) {
                for(let j = 0;j<3;j++)
                {
                    if (grid[i][j] === '-') {
                        // console.log("Game is not over yet");
                        return null;  // Game is not over yet
                    }
                }   
            }
            
            // If no winner and no empty cells, it's a tie
            // console.log("Tie");
            return 'Tie';
        }

        function getGrid(){return grid;}



        return {getGrid,checkWinner,clearGrid,editGrid};
    })();

    const player1 = Player("Human","x");
    const player2 = Player("Human2","o");
    let turn=0;

    const getBoard = gameBoard.getGrid;

    function roundStart(startWith = 0)
    {
        gameBoard.clearGrid();
        turn = startWith;
    }

    function playConsole()
    {
        roundStart();
        
        while(true){
            playStepConsole();
            if(gameBoard.checkWinner() !== null)
            {
                console.log("Round Has Finished!");
                break;
            }
        }
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
            console.log("position already filled");
        }
    }

    function playStep_CheckWinner(row,col)
    {
        playStep(row,col);
        return gameBoard.checkWinner();
    }

    function playStepConsole()
    {
        if(!turn){
            
            const row = prompt(`${player1.getName()} row:`);
            const col = prompt(`${player1.getName()} col:`);
            console.log(`${player1.getName()} played in ${row},${col}`);
            gameBoard.editGrid(row,col,player1.getMarker());
        }
        else{
            const row = prompt(`${player2.getName()} row:`);
            const col = prompt(`${player2.getName()} col:`);
            console.log(`${player2.getName()} played in ${row},${col}`);
            gameBoard.editGrid(row,col,player2.getMarker());
        }
        gameBoard.displayGrid();
        turn^=1;
    }

    function getPlayers()
    {
        return {player1,player2};
    }

    return {getBoard,playStep_CheckWinner,getPlayerInTurn,getPlayers};
}

function screenController()
{
    const myGame = Game();
    const playerTurnDiv = document.querySelector("#playersTurn");
    const gameBoardDiv = document.querySelector("#gameBoard");
    const board = myGame.getBoard();
    function initilizeBoard()
    {
        playerTurnDiv.textContent = "It's "+myGame.getPlayerInTurn().getName()+"'s turn";
        
        for(let i=0;i<board.length;i++)
        {
            for(let j=0;j<board[0].length;j++)
            {
                const cellButton = document.createElement("button");
                cellButton.classList.add("cell");
                cellButton.dataset.position = [i,j];
                cellButton.textContent = board[i][j];
                gameBoardDiv.appendChild(cellButton);
            }
        }
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
            console.log(`${xplayer.getName()} has won !!`);
        }
        else if (state == 'o'){
            console.log(`${oplayer.getName()} has won !!`);
        }
        else if(state == 'tie'){
            console.log(`its a tie`);
        }
    }

    function updateCell(cell,row,col)
    {
        cell.textContent = board[row][col];
        playerTurnDiv.textContent = "It's "+myGame.getPlayerInTurn().getName()+"'s turn";
    }

    function clickHandlerBoard(e){
        const myRow = e.target.dataset.position[0];
        const myCol = e.target.dataset.position[2];
        // console.log(`my position is ${myRow},${myCol}`);
        const winnerState = myGame.playStep_CheckWinner(myRow,myCol);
        isGameFinished(winnerState);
        updateCell(e.target,myRow,myCol);
        
    }

    gameBoardDiv.addEventListener("click", clickHandlerBoard);

    return {initilizeBoard}
}



const myScreen = screenController();
myScreen.initilizeBoard();
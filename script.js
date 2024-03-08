
// gameBoard.displayGrid();
// gameBoard.editGrid(0,0,'X');
// gameBoard.editGrid(0,1,'X');
// gameBoard.editGrid(0,2,'o');
// gameBoard.editGrid(1,0,'o');
// gameBoard.editGrid(1,1,'o');
// gameBoard.editGrid(1,2,'X');
// gameBoard.editGrid(2,0,'X');
// gameBoard.editGrid(2,1,'X');
// gameBoard.editGrid(2,2,'o');

// gameBoard.displayGrid();
// console.log(gameBoard.checkWinner());


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
                return;
            }
            if(grid[row][col] == "-")
                grid[row][col] = marker;

        }

        function checkWinner()
        {
            for(let i=0;i<winningLines.length;i++)
            {
                const [[ax,ay], [bx,by], [cx,cy] ] = winningLines[i];
                const player = grid[ax][ay];

                if (player !== '-' && player === grid[bx][by] && player === grid[cx][cy]) {
                    console.log(`${player} has won`);
                    return player;
                }
            }

            for (let i = 0; i < grid.length; i++) {
                for(let j = 0;j<3;j++)
                {
                    if (grid[i][j] === '-') {
                        console.log("Game is not over yet");
                        return null;  // Game is not over yet
                    }
                }   
            }
            
            // If no winner and no empty cells, it's a tie
            console.log("Tie");
            return 'Tie';
        }

        function getGrid(){return grid;}



        return {getGrid,checkWinner,clearGrid,displayGrid,editGrid};
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
        if(!turn){
            console.log(`${player1.getName()} turn:`);
            gameBoard.editGrid(row,col,player1.getMarker());
        }
        else{
            console.log(`${player2.getName()} turn:`);
            gameBoard.editGrid(row,col,player2.getMarker());
        }

        turn^=1;
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

    return {roundStart,getBoard,playConsole,playStep,getPlayerInTurn};
}

function screenController()
{
    const myGame = Game();
    const playerTurnDiv = document.querySelector("#playersTurn");
    const gameBoardDiv = document.querySelector("#gameBoard");

    function initilizeBoard()
    {
        playerTurnDiv.textContent = "It's "+myGame.getPlayerInTurn().getName()+"'s turn";
        const board = myGame.getBoard();
        for(let i=0;i<board.length;i++)
        {
            for(let j=0;j<board[0].length;j++)
            {
                const cellButton = document.createElement("button");
                cellButton.classList.add("cell");
                cellButton.textContent = board[i][j];
                gameBoardDiv.appendChild(cellButton);
            }
        }
    }

    return {initilizeBoard}
}

const myScreen = screenController();
myScreen.initilizeBoard();
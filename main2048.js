var board = [];
var score = 0;
var hasConflicted = []

$(document).ready(function(){
    newGame();
});

function newGame(){
    //初始化棋盘格
    init();
    //在随机两个格子生成数字
    generateOneNumber();
    generateOneNumber();
}

function init(){
    for(var i = 0; i < 4; i++)
        for(var j = 0; j < 4; j++){
            var gridCell = $("#grid-cell-"+i+"-"+j);
            gridCell.css('top', getPosTop(i, j));
            gridCell.css('left', getPosLeft(i, j));
        }


    for(var i = 0; i < 4; i++){
        board[i] = [];
        hasConflicted[i] = [];
        for(var j = 0; j < 4; j++){
            board[i][j] = 0;
            hasConflicted[i][j] = false;
        }
    }

    updateBoardView();

    score = 0;
}

function updateBoardView(){
    
    $(".number-cell").remove();
    for(var i = 0; i < 4; i++){
        for(var j = 0; j < 4; j++){
            $("#grid-container").append('<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>');
            var theNumberCell = $('#number-cell-'+i+'-'+j);

            if(board[i][j] == 0){
                theNumberCell.css('width','0px');
                theNumberCell.css('height','0px');
                theNumberCell.css('top',getPosTop(i,j) + 50);
                theNumberCell.css('left',getPosLeft(i,j) + 50);
            }
            else{
                theNumberCell.css('width', '100px');
                theNumberCell.css('height', '100px');
                theNumberCell.css('top', getPosTop(i,j));
                theNumberCell.css('left', getPosLeft(i,j));
                theNumberCell.css('background-color',getNumberBackgroundColor(board[i][j]));
                theNumberCell.css('color', getNumberColor(board[i][j]));
                theNumberCell.text(board[i][j]);
            }

            hasConflicted[i][j] = false;
        }
    }
}

function generateOneNumber(){
    
    if( nospace(board))
        return false;

    //randomly generate a position
    //first way
    /*
    var randX = parseInt(Math.floor( Math.random() * 4));
    var randY = parseInt(Math.floor( Math.random() * 4));

    var times = 0;
    while( times < 50){
        if( board[randX][randY] == 0)
            break;
        
        randX = parseInt(Math.floor( Math.random() * 4));
        randY = parseInt(Math.floor( Math.random() * 4));

        times ++;
    }
    if( times == 50 ){
        for( var i = 0; i < 4; i++ ){
            for( var j = 0; j < 4; j++){
                if( board[i][j] == 0 ){
                    randX = i;
                    randY = j;
                }
            }
        }
    }
    */

    //the second way to generate a position
    var count = 0;
    var temporary = [];
    for( var i = 0; i < 4; i++ ){
        for( var j = 0; j < 4; j++ ){
            if( board[i][j] == 0){
                temporary[count] = i * 4 + j;
                count++;
            }
        }
    }
    var pos= parseInt( Math.floor( Math.random()  * count ) );
 
    randX=Math.floor(temporary[pos]/4);
    randY=Math.floor(temporary[pos]%4);

    //randomly generate a number
    var randNumber = Math.random() < 0.5 ? 2 : 4;

    //display randNumber in random position
    board[randX][randY] = randNumber;
    showNumberWithAnimation(randX, randY, randNumber);


    return true;
}

$(document).keydown( function( event ){
    switch( event.keyCode ){
        case 37: //left
            if( moveLeft() ){
                setTimeout("generateOneNumber()",210);
                setTimeout("isGameOver()",300);
            }
            break;
        case 38: //up
            if( moveUp() ){
                setTimeout("generateOneNumber()",210);
                setTimeout("isGameOver()",300);
            }
            break;
        case 39: //right
            if( moveRight() ){
                setTimeout("generateOneNumber()",210);
                setTimeout("isGameOver()",300);
            }
            break;
        case 40: //down
            if( moveDown() ){
                setTimeout("generateOneNumber()",210);
                setTimeout("isGameOver()",300);
            }
            break;
        default: //default
            break;
    }
});

function isGameOver(){
    if( nospace( board ) && noMove( board ) ){
        gameOver();
    };
    
}

function gameOver(){
    alert("Game Over!");
}

function moveLeft(){

    if( !canMoveLeft( board ))
        return false;

    //move left
    for( var i = 0; i < 4; i++ )
        for( var j = 1; j < 4; j++ ){
            if( board[i][j] != 0){

                for( var k = 0; k < j; k++ ){
                    if( board[i][k] == 0 && noBlockHorizontal(i, k, j, board)){
                        
                        //move
                        showMoveAnimation(i, j, i, k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }

                    else if( board[i][k] == board[i][j] && noBlockHorizontal(i, k, j, board) && !hasConflicted[i][k]){

                        //move
                        showMoveAnimation(i, j, i, k);
                        //add
                        board[i][k] += board[i][j];
                        board[i][j] = 0;
                        //add score
                        score += board[i][k];
                        updateScore( score );

                        hasConflicted[i][k] = true;
                        continue;
                    }
                    
                }
            }
        }

    setTimeout("updateBoardView()",200);
    return true;
}

function moveUp(){

    if( !canMoveUp( board ))
        return false;
    
    //move up
    for( var j = 0; j < 4; j++ )
        for(var i = 1; i < 4; i++ ){
            if( board[i][j] != 0 ){

                for( var k = 0; k < i; k++ ){
                    if( board[k][j] == 0 && noBlockVertical(j, k, i, board)){

                        //move
                        showMoveAnimation(i, j, k, j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }

                    else if( board[k][j] == board[i][j] && noBlockVertical( j, k, i, board ) && !hasConflicted[k][j]){

                        //move
                        showMoveAnimation(i, j, k, j);
                        //add
                        board[k][j] += board[i][j];
                        board[i][j] = 0;
                        //add score
                        score += board[k][j];
                        updateScore( score );

                        hasConflicted[k][j] = true;
                        continue;
                    }
                }
            }
        }
    

    setTimeout("updateBoardView()",200);
    return true;
}

function moveRight(){

    if( !canMoveRight( board ))
        return false;

    //move right
    for( var i = 0; i < 4; i++)
        for( var j = 2; j >= 0; j-- ){
            if( board[i][j] != 0 ){

                for( var k = 3; k > j; k-- ){
                    if( board[i][k] == 0 && noBlockHorizontal( i, j, k, board )){
                        
                        //move
                        showMoveAnimation(i, j, i, k );
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    else if( board[i][k] == board[i][j] && noBlockHorizontal( i, j, k, board ) && !hasConflicted[i][k]){

                        //move
                        showMoveAnimation( i, j, i, k);
                        //add
                        board[i][k] += board[i][j];
                        board[i][j] = 0;
                        //add score
                        score += board[i][k];
                        updateScore( score );

                        hasConflicted[i][k] = true;
                        continue;
                    }
                }
            }
        }
    

    setTimeout("updateBoardView()",200);
    return true;
}

function moveDown(){

    if( !canMoveDown( board ))
        return false;

    //move down
    for( var j = 0; j < 4; j++ )
        for( var i = 2; i >= 0; i-- ){

            if( board[i][j] != 0){

                for( var k = 3; k > i; k--){

                    if( board[k][j] == 0 && noBlockVertical( j, i, k, board )){

                        //move
                        showMoveAnimation( i, j, k, j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    else if( board[k][j] == board[i][j] && noBlockVertical( j, i, k, board) && !hasConflicted[k][j] ){

                        //move
                        showMoveAnimation( i, j, k, j);
                        //add
                        board[k][j] += board[i][j];
                        board[i][j] = 0;
                        //add score
                        score += board[k][j];
                        updateScore( score );

                        hasConflicted[k][j] = true;
                        continue;
                    }
                }
            }
        }
    

    setTimeout("updateBoardView()",200);
    return true;
}
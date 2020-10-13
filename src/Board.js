import React from 'react';
import './Board.css';
import Tile from './Tile';
import flag from './flag.png';
import timer from './timer.png';

class Board  extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            board: this.createTileData(this.props.rows, this.props.columns),
            minesSet: false,
            uncovered: 0,
            marked: 0,
            exploded: false,
            seconds: 0
        };
        let interval = 0;
    }

    UNSAFE_componentWillReceiveProps(nextProps){
        if(this.props.rows !== nextProps.rows){
            this.setState({board: this.createTileData(nextProps.rows, nextProps.columns)});
            this.setState({minesSet: false});
        }
        if(this.props.mines !== nextProps.mines){
            this.setState({marked: 0});
            clearInterval(this.interval);
            this.setState({seconds: 0});
        }
    }

    createTileData = (rows, columns) => {
        let tileData = [];
        for (let i = 0; i < rows; i++) {
          let tileDataRow = [];
          for (let j = 0; j < columns; j++) {
            tileDataRow.push({
                row: i,
                column: j,
                isMine: false,
                isRevealed: false,
                isFlagged: false,
                count: 0
            })
          }
          tileData.push(tileDataRow);
        }
        return tileData;
    }

    createMineField = () => {
        let mineField = [];
        for (let i = 0; i < this.props.rows; i++) {
          let row = [];
          for (let j = 0; j < this.props.columns; j++) {
            row.push(<td>
                <Tile onClick={this.handleTileClick} onContextMenu={this.handleMarkFlag} data = {this.state.board[i][j]} exploded = {this.state.exploded} difficulty={this.props.difficulty}/>
                </td>);
          }
          mineField.push(<tr>{row}</tr>);
        }
        return mineField;
    }

    handleMarkFlag = (e, row, column) => {
        e.preventDefault();
        let currentBoard = this.state.board;

        if(! this.validCoord(row,column) || this.state.exploded === true || currentBoard[row][column].isRevealed === true) {
            return;
        }
        else if(currentBoard[row][column].isFlagged === true){
            let updatedBoard = currentBoard;
            updatedBoard[row][column].isFlagged = false;
            this.setState({board: updatedBoard});
            let updatedMarked = this.state.marked - 1;
            this.setState({marked: updatedMarked});
        }
        else if(currentBoard[row][column].isFlagged === false){
            let updatedBoard = currentBoard;
            updatedBoard[row][column].isFlagged = true;
            this.setState({board: updatedBoard});
            let updatedMarked = this.state.marked +1;
            this.setState({marked: updatedMarked});
        }
    }

    handleTileClick = (row, column) => {
        if (this.state.minesSet === false){
            this.setMines(row, column);
            this.setState({minesSet: true});

            this.interval = setInterval(() => {
                this.setState(prevState => ({seconds: prevState.seconds + 1}));
            }, 1000);
        }
        if (this.state.board[row][column].isRevealed === true 
            || this.state.board[row][column].isFlagged === true 
            || this.state.exploded === true){
            return;
        }
        let updatedBoard = this.state.board;
        const ff = (r,c) => {
            if(!this.validCoord(r,c)) return;
            if(updatedBoard[r][c].isRevealed === true) return;
            if(updatedBoard[r][c].isFlagged === true) return;
            updatedBoard[r][c].isRevealed = true;
            this.setState({board: updatedBoard});
            this.setState(prevState => ({uncovered: prevState.uncovered + 1}));
            if(updatedBoard[r][c].count !== 0) return;
            ff(r-1,c-1);ff(r-1,c);ff(r-1,c+1);
            ff(r  ,c-1);         ;ff(r  ,c+1);
            ff(r+1,c-1);ff(r+1,c);ff(r+1,c+1);
        };
        ff(row,column);
        // have we hit a mine?
        if(this.state.board[row][column].isMine === true) {
            this.setState({exploded: true});
            clearInterval(this.interval);
        }
    }

    rndInt = (min, max) => {
        [min,max] = [Math.ceil(min), Math.floor(max)]
        return min + Math.floor(Math.random() * (max - min + 1));
    }
    
    count = (row,col, boardWithMines) => {
        const c = (r,c) =>
              (this.validCoord(r,c) && boardWithMines[r][c].isMine ? 1 : 0);
        let res = 0;
        for( let dr = -1 ; dr <= 1 ; dr ++ )
          for( let dc = -1 ; dc <= 1 ; dc ++ )
            res += c(row+dr,col+dc);
        return res;
    }

    validCoord = (row, col) => {
        return row >= 0 && row < this.props.rows && col >= 0 && col < this.props.columns;
    }

    setMines = (clickedRow, clickedColumn) => {
        let boardWithMines = this.state.board;

        // prepare a list of allowed coordinates for mine placement
        let allowed = [];
        for(let r = 0 ; r < this.props.rows ; r ++ ) {
            for( let c = 0 ; c < this.props.columns ; c ++ ) {
            if(Math.abs(clickedRow-r) > 2 || Math.abs(clickedColumn-c) > 2)
                allowed.push([r,c]);
            }
        }
        let nmines = Math.min(this.props.mines, allowed.length);
        for( let i = 0 ; i < nmines ; i ++ ) {
            let j = this.rndInt(i, allowed.length-1);
            [allowed[i], allowed[j]] = [allowed[j], allowed[i]];
            let [r,c] = allowed[i];
            boardWithMines[r][c].isMine = true;
        }
        // erase any marks (in case user placed them) and update counts
        for(let r = 0 ; r < this.props.rows ; r ++ ) {
            for( let c = 0 ; c < this.props.columns ; c ++ ) {
                if(boardWithMines[r][c].isFlagged === true)
                    boardWithMines[r][c].isFlagged = false;
                boardWithMines[r][c].count = this.count(r,c, boardWithMines);
            }
        }
        this.setState({marked: 0});
        this.setState({board: boardWithMines});
    }

    resetGame = () => {
        window.location.reload();
    }

    getGameStatus = () => {
        if(this.state.exploded === true){
            return (
                <div class="modal">
                    <p>You exploded a mine! You lost!</p>
                    <button className="modalButton" onClick={() => this.resetGame()}>Reset Game</button>
                </div>
            );
        }
        else if(this.state.uncovered === (this.props.rows * this.props.columns - this.props.mines)){
            return (
                <div class="modal">
                    <p>Congrats, you win!!!</p>
                    <button className="modalButton" onClick={() => this.resetGame()}>Reset Game</button>
                </div>
            );
        }
    }

    formatSeconds = (number) => {
        let numString = "" + number;
        while (numString.length < 4) {
            numString = "0" + numString;
        }
        return numString;
    }

    createStatusBar = () => {
        let seconds = this.formatSeconds(this.state.seconds)
        return (
            <tr className = "statusBar">
                <th colspan={this.props.columns/2}>
                    <div className = "flagCount">
                        <img src={flag} className="flagIcon" alt="minesweeper-flag" />
                        <h2 className = "flagNumber">{this.props.mines - this.state.marked}</h2>
                    </div>
                </th>
                <th colspan={this.props.columns/2}>
                    <div className = "timeGame">
                        <img src={timer} className="timeIcon" alt="minesweeper-timer" />
                        <h2 className = "time">{seconds}</h2>
                    </div>
                </th>
            </tr>
        );
    }

    render() {            
        return (
            <table className="field">
                {this.state.minesSet === true? this.getGameStatus() : ""}
                <thead>
                    {this.createStatusBar()}
                </thead>
                <tbody>
                    {this.createMineField()} 
                </tbody>
            </table>
        );
    }
}

export default Board;
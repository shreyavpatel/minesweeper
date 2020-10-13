import React from 'react';
import logo from './minesweeper-logo.png';
import './Game.css';
import Board from './Board';

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      difficulty: "easy"
    };
  }

  changeDifficultyEasy = () => {
    this.setState({difficulty: "easy"});
  }

  changeDifficultyMedium = () => {
    this.setState({difficulty: "medium"});
  }

  FIELD_SIZES = [[8, 10, 10], [14, 18, 40]]

  getBoardSize = () => {
      if(this.state.difficulty === "easy"){
          return this.FIELD_SIZES[0]
      }
      else if(this.state.difficulty  === "medium"){
          return this.FIELD_SIZES[1]
      }
      else if(this.state.difficulty  === "hard"){
        return this.FIELD_SIZES[2]
    }
  }

  render() {
    let boardSize = this.getBoardSize();

    return (
      <div className="game">
        <header className="game-header">
          <img src={logo} className="game-logo" alt="minesweeper-logo" />
          <h1>Minesweeper</h1>
          <img src={logo} className="game-logo2" alt="minesweeper-logo" />
        </header>
        <div className = "board">
            <Board rows={boardSize[0]} columns={boardSize[1]} mines={boardSize[2]} difficulty={this.state.difficulty}/>
        </div>
        <div className="buttons-bar">
          <button className = "difficultyButton buttonWidth" onClick={this.changeDifficultyEasy}> easy </button>
          <button className = "difficultyButton buttonWidth" onClick={this.changeDifficultyMedium}> medium </button>
        </div>
      </div>
    );
  }
}

export default Game;

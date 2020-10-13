import React from 'react';
import './Tile.css';
import flag from './flag.png';
import bomb from './bomb.png';

class Tile  extends React.Component {

    addTile(){
        if(this.props.exploded === true && this.props.data.isMine===true){
            if(this.props.difficulty === "easy"){
                return (
                    <div className="tile easy">
                        <img src={bomb} className="bomb" alt="minesweeper-bomb" />
                    </div>
                );
            }
            return (
                <div className="tile medium">
                    <img src={bomb} className="bomb" alt="minesweeper-bomb" />
                </div>
            );
        }
        else if(this.props.data.isRevealed===true && this.props.data.isMine!==true){
            if(this.props.difficulty === "easy"){
                return (
                    <div className="tileRevealed easy">
                        {this.props.data.count!==0 ? this.showCount() : ""}
                    </div>
                );
            }
            return (
                <div className="tileRevealed medium">
                    {this.props.data.count!==0 ? this.showCount() : ""}
                </div>
            );
        }
        else if(this.props.data.isFlagged===true){
            if(this.props.difficulty === "easy"){
                return (
                    <div className="tile easy">
                        <img src={flag} className="flag" alt="minesweeper-flag" />
                    </div>
                );
            }
            return (
                <div className="tile medium">
                    <img src={flag} className="flag" alt="minesweeper-flag" />
                </div>
            );
        }
        else{
            if(this.props.difficulty === "easy"){
                return (
                    <div className="tile easy">
                    </div>
                );
            }
            return (
                <div className="tile medium">
                </div>
            );
        }
        
    }

    showCount(){
        if(this.props.difficulty === "easy"){
            return (<h3 className = "tileCount easy">{this.props.data.count}</h3>);
        }
        return (<h3 className = "tileCount medium">{this.props.data.count}</h3>);
    }
    
    render() {
        return (
            <div onClick={() => this.props.onClick(this.props.data.row, this.props.data.column)} onContextMenu={(e) => this.props.onContextMenu(e, this.props.data.row, this.props.data.column)}>
            {this.addTile()}
            </div>
        );
    }
}

export default Tile;
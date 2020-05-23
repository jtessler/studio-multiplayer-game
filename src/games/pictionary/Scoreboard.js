import React from 'react';

function Scoreboard(props){
    return(
        <div className='scoreboard'>
            <div>
                <p><strong>Round:</strong> {props.round}/7</p>
            </div>
            <div>
                <p><strong>Drawing Player:</strong> Player {props.drawingPlayer}</p>
            </div>
            <div>
                <div>
                    <p><strong>Score:</strong> {props.score}</p>
                </div>
            </div>

        </div>

    )
}

export default Scoreboard;
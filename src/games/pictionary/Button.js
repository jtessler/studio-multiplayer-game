import React from 'react';


function Button(props) {
    return(
        <div>
            <button 
                onClick={props.handleClick}
            >
                {props.text}
            </button>
        </div>
    )


}

export default Button;
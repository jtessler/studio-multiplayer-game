import React, { useState } from 'react';

const defaultDuckClassName = 'duckReset';
const numberOfSecondsDuckFlies = 6;
const movingTransition = `left ${numberOfSecondsDuckFlies}s linear`;
const defaultTransition = 'none';

const DuckSprite = (props) => {
    console.log('DuckSprite Ran')
    const [movingClass, setMovingClass] = useState(defaultDuckClassName);
    const [movingTransitionRule, setMovingTransitionRule] = useState(defaultTransition);
    console.log(props);

    // var myDuckFlightTimer = setTimeout(function(){
    //   resetDuck();
    // }, numberOfSecondsDuckFlies*1000);

    const animationStarterTimer = setTimeout(function() {
      console.log('start moving', movingClass);
      setMovingTransitionRule(movingTransition);
      setMovingClass('duckMove');
      console.log('moving commenced', movingClass);
    }, 300);
    
    const resetDuck = () => {
      clearTimeout(animationStarterTimer);
      // clearTimeout(myDuckFlightTimer);
      setMovingClass(defaultDuckClassName);
      setMovingTransitionRule(defaultTransition);
    };

    // function duckWasShotBeforeHeGotAway() {
    //   clearTimeout(myDuckFlightTimer);
    // }

    const style = {
      transition: movingTransitionRule,
      ...(props.style || {}),
    }

    return (
        <div
          className={`DuckSprite ${movingClass}`}
          onClick={() => {
            resetDuck();
            props.duckClick();
          }}
          style= {style}
        >
        </div>
    )
}
/*keyFrames
*/
export {
    DuckSprite
}

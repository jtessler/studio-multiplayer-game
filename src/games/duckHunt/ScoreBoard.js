import React from "react";

const ScoreRow = ({ rank, score, name, className }) => (
  <div className={"rank-score-name-section-row " + className}>
    <div className="user-rank">{rank}</div>
    <div className="user-score">{score}</div>
    <div className="user-name">{name}</div>
  </div>
);

// a React "function component"
const ScoreBoard = (props) => {
  const userScoresArray = [
    {
      score: 500,
      name: "Not Bald Edgar"
    },
    {
      score: 1000,
      name: "Bald Edgar"
    }
  ];

  // sort by score value
  userScoresArray.sort((currUserRank, nextUserRank) => {
    return nextUserRank.score - currUserRank.score;
  });

  return (
    <div className="screen scoreBoard">
      <div className="insert-coin-header blueText">
        Insert Coin
       </div>
      <div className="player-credits-2-col-section whiteText">
        <div className="player-credits-2-col-section-col-1">
          1 Play
          2 Play
         </div>
        <div className="player-credits-2-col-section-col-2">
          1 Credit
          2 Credit
         </div>
      </div>
      <div className="encouragement-comment pinkText">
        Try Harder!
      </div>
      <div className="rank-score-name-section blueText">
        {/* scoreboard header */}
        <ScoreRow rank="Rank" score="Score" name="Name" />
        {userScoresArray.map((userRank, index) => {
          const rankNumber = index + 1;
          return (
          <ScoreRow
            className={rankNumber === 1 ? 'pinkText' : 'orangeText'}
            rank={rankNumber}
            score={userRank.score}
            name={userRank.name}
          />
        )
        })}
      </div>
    </div>
  )
};

export {
  ScoreBoard
}
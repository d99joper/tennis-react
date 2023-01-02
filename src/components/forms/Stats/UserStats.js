import { matchFunctions, userFunctions } from "helpers";
import React, { useState } from "react";

const UserStats = ({player}) => {

    // match win/loss: 34/23 (60%) (i) = sets w/l, games w/l / year
    // Sets W/L
    // Tiebreak W/L
    // Games W/L
    //const {allStats, setAllStats} = useState({wins: 10, losses: 6, setWins: 23, setLosses: 18})
    //const [stats, setStats] = useState(userFunctions.usePlayerStats(player.id, 'singles'))
    const stats = userFunctions.usePlayerStats(player.id, 'singles')
 
    return (
        <>
            <div>
                Matches W/L: {stats.totalWins}/{stats.totalLosses} ({stats.winPercentage}%)<br/>
                Sets W/L: {stats.setsWon}/{stats.setsLost} ({stats.setsWonPercentage}%)<br/>
                Games W/L: {stats.gamesWon}/{stats.gamesLost} ({stats.gamesWonPercentage}%)<br/>
                Tiebreaks W/L: {stats.tiebreaksWon}/{stats.tiebreaksLost} ({stats.tiebreakPercentage}%)
            </div>
        </>
    )
}

export default UserStats
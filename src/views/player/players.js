import React, { useContext, useState } from "react";
import { playerAPI } from "api/services";
import MapSearch from "components/forms/MapSearch";
import { ProfileImage } from "components/forms";

const PlayersLandingPage = () => {

  const fetchData = async (filters) => {
    const results = await playerAPI.getPlayers(filters);
    return {data: results.data.players, count: results.data?.total_count || 0};
    //return results.data.players;
  };

  const renderInfoWindow = (players) => `<div style='width: 200px;'>
          ${players.map(player => {
            console.log(player, players)
    const imageUrl = player.image_urls.thumbnail || '/images/default_player.png';
    const ntrpText = player.NTRP ? `NTRP: ${player.NTRP}` : '';
    const utrText = player.cached_utr
      ? `UTR: ${player.cached_utr['singles'] ? `singles: ${player.cached_utr['singles']}` : ''} ${player.cached_utr['doubles'] ? `| doubles: ${player.cached_utr['doubles']}` : ''}`
      : '';
    return `
              <div style='display: flex; align-items: center; gap: 8px;'>
                <img src='${imageUrl}' alt='${player.name}' style='width: 40px; height: 40px; border-radius: 50%;'/>
                <div>
                  <strong>${player.name}</strong><br/>
                  ${ntrpText} ${ntrpText && '<br/>'} ${utrText}
                </div>
              </div>`;
  }).join("<hr>")}
        </div>`;

  const renderListItem = (player) => (
    <ProfileImage player={player} asLink={true} showName={true} showNTRP={true} />
  )

  return (
    <MapSearch
      title={'Player Search'}
      fetchData={fetchData}
      showNTRP={true}
      showUTR={true}
      renderInfoWindow={renderInfoWindow}
      renderListItem={renderListItem}
      type="players"
    />
  );
};

export default PlayersLandingPage;

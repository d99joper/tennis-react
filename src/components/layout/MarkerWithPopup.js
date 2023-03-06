import { helpers } from 'helpers'
import { useState } from 'react'
import { Marker, Popup } from 'react-map-gl'
import { ItemCard } from '../forms'
//const { default: ItemCard } = require("ui-components/ItemCard")

const MarkerWithPopup = ({ latitude, longitude, ladder, ...props }) => {
  const [showPopup, setShowPopup] = useState(false)

  // event listener that toggles whether the popup is displayed
  const handleMarkerClick = ({ originalEvent }) => {
    originalEvent.stopPropagation()
    setShowPopup(true)
  }

  // render the marker and the popup, render the ItemCard again within the popup.
  return (
    <>
      <Marker
        latitude={latitude}
        longitude={longitude}
        onClick={handleMarkerClick}
      />
      {showPopup && (
        <Popup key={'fafd'}
          latitude={latitude}
          longitude={longitude}
          offset={{ bottom: [0, -40] }}
          onClose={() => setShowPopup(false)}
          maxWidth='95%'
          closeOnMove
        >
          <ItemCard
            header={ladder.name}
            description={ladder.description}
            footer={`${ladder.players.length ?? 0} players`}  
            footerRight={`Level: ${helpers.intToFloat(ladder.level.min)}${ladder.level.max !== ladder.level.min ? '-'+helpers.intToFloat(ladder.level.max) :''}`}
          />
          {/* something */}
        </Popup>
      )}
    </>
  )
}

export default MarkerWithPopup
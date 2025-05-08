import { Box, Card, Checkbox, Typography } from "@mui/material";
import { ProfileImage } from "../ProfileImage";
import { Link } from "react-router-dom";

const PlayerCard = ({
  player,
  padding,
  marginTop,
  backgroundColor,
  asLink,
  headerAsLink,
  selectedPlayer,
  setSelectedPlayer, // optional highlighting 
  checkboxText,
  size,
  openToBlank = false,
  children
}) => {

  const handleCardClick = () => {
    if (setSelectedPlayer) {
      if (selectedPlayer?.id === player.id) {
        setSelectedPlayer(null); // reset selected player
      }
      else {
        // console.log(player)
        setSelectedPlayer(player); // Set selected player's id
      }
    }
  };
  const isSelected = selectedPlayer?.id === player?.id;

  const profilePic = <ProfileImage player={player} size={size || 80} />
  const profileName = <Typography as='span'>{player.name}</Typography>

  const cardContent =
    <Card
      sx={{
        backgroundColor: isSelected ? 'lightblue' : backgroundColor || 'blue.10', // Highlight if selected
        padding: padding || '0.5rem',
        marginTop: marginTop || '0.5rem',
        //cursor: setSelectedPlayer ? 'pointer' : 'arrow', // Show pointer cursor for clickable feedback
        border: isSelected ? '2px solid #1976d2' : 'none', // Apply border if selected
      }}
      //onClick={handleCardClick}
      variation="outlined"
    >
      <Box display={'flex'} flexDirection={'column'}>
        <Box display={'flex'} flexDirection={'row'}>
          {headerAsLink
            ? <Link to={"/players/" + player.slug} {...openToBlank && { target: "_blank" }}>{profilePic}</Link>
            : profilePic
          }
          <Box display={'flex'} flexDirection={'column'} gap="0.1rem">
            {headerAsLink
              ? <Link to={"/players/" + player.slug} {...openToBlank && { target: "_blank" }}>{profileName}</Link>
              : profileName
            }
            {player.location &&
              <Typography as='div'>{player.location}</Typography>}
            {player.NTRP &&
              <Typography as='div'>NTRP: {player.NTRP}</Typography>}
            {player.cached_utr?.singles > 0 &&
              <Typography as='div'>UTR: {player.cached_utr.singles > 0 ? player.cached_utr.singles : 'UR'}</Typography>}
          </Box>

        </Box>
        {children}
        {typeof setSelectedPlayer === 'function' &&
          <span>
            <Checkbox onClick={handleCardClick} checked={isSelected} /> {checkboxText || 'Claim this profile'}
          </span>
        }
      </Box>
    </Card>

  return (

    asLink ? (
      <Link to={"/players/" + player.slug} {...openToBlank && { target: "_blank" }}>
        {cardContent}
      </Link>
    ) :
      <>{cardContent}</>

  )
}
export default PlayerCard
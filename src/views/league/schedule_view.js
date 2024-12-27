import { Box, Typography } from "@mui/material"
import { ProfileImage } from "components/forms"

const ScheduleView = ({ schedule }) => {

  return (
    <Box>
      {schedule?.map((item, index) => (
        <Box key={index} sx={{ marginBottom: 3 }}>
          {/* Round Header */}
          {index === 0 || schedule[index - 1].round !== item.round ? (
            <Typography
              variant="h6"
              sx={{ textAlign: 'center', borderBottom: '1px solid', marginBottom: 1 }}
            >
              Round {item.round}
            </Typography>
          ) : null}

          {/* Match Details */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingX: 2,
            }}
          >
            {/* Match Date */}
            <Typography variant="body2" sx={{ flex: 1, textAlign: 'left' }}>
              {new Date(item.scheduled_date).toISOString().split('T')[0]}
            </Typography>

            {/* Player 1 */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flex: 2,
                textAlign: 'center',
              }}
            >
              <ProfileImage player={item.player1} size={50} />
              <Typography variant="body1" sx={{ marginLeft: 1 }}>
                {item.player1.name}
              </Typography>
            </Box>

            {/* Versus Label */}
            <Typography
              variant="body1"
              sx={{ textAlign: 'center', marginX: 2, fontWeight: 'bold' }}
            >
              vs
            </Typography>

            {/* Player 2 */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flex: 2,
                textAlign: 'center',
              }}
            >
              <ProfileImage player={item.player2} size={50} />
              <Typography variant="body1" sx={{ marginLeft: 1 }}>
                {item.player2.name}
              </Typography>
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  )
}
export default ScheduleView
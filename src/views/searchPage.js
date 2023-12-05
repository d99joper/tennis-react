import {React, useState} from "react"
import LadderSearch from "./ladder/search"
import { TabItem, Tabs } from "@aws-amplify/ui-react"
import { Box, Button, Slider, TextField } from "@mui/material"
import { enums } from "helpers"

const SearchPage = (props) => {

  const [level, setLevel] = useState()

  return (
    <Tabs 
      defaultIndex={0}
      justifyContent="flex-start"
    >
      <TabItem title="Search for ladders" >
        {/* Search for ladder */}
        <LadderSearch />

      </TabItem>
      <TabItem title="Search for players">
        {/* Search box for player */}
        <TextField placeholder="Name..."/> 
        {/* <div className="form-group"> */}
          <Slider
              getAriaLabel={()=>'Level'}
              label="Level"
              min={2}  
              max={6.5}  
              step={0.5}
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              disableSwap
              marks={enums.LevelMarks}
              valueLabelDisplay="auto"
          />
      {/* </div> */}
        <Button variant="outlined">Go</Button>

        {/* View box with the search results */}
        <Box>
          Results ...
        </Box>
      </TabItem>


    </Tabs>
  )
}

export default SearchPage
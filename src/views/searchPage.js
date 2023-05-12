import {React, useState} from "react"
import LadderSearch from "./ladder/search"
import { TabItem, Tabs } from "@aws-amplify/ui-react"
import { Box, Button, TextField } from "@mui/material"

const SearchPage = (props) => {

  const [state, setState] = useState()

  return (
    <Tabs 
      defaultIndex={0}
      justifyContent="flex-start"
    >
      <TabItem title="Search for ladders">
        {/* Search for ladder */}
        <LadderSearch />

      </TabItem>
      <TabItem title="Search for players">
        {/* Search box for player */}
        <TextField placeholder="Name..."/> 
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
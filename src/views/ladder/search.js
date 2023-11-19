import { Flex } from "@aws-amplify/ui-react"
import {  AutoCompletePlaces, MapComponent } from "components/forms"

const LadderSearch = () => {
	return (
		<Flex direction={"row"}>
			<AutoCompletePlaces />
			
		</Flex>
	)
}

export default LadderSearch
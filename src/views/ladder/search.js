import { Collection, Flex } from "@aws-amplify/ui-react"
import { ladderAPI } from "api/services"
import { AutoCompletePlaces, ItemCard } from "components/forms"
import { helpers } from "helpers"
import { useEffect } from "react"
import { useState } from "react"
import { Link } from "react-router-dom"



const LadderSearch = () => {

	const [ladders, setLadders] = useState([])
	const [totalCount, setTotalCount] = useState('-1')

	function handlePlaceChanged(geoPoint, radius) {
		console.log(geoPoint)
		ladderAPI.searchLadderByGeo(geoPoint, radius).then((ladderResults) => {
			setLadders(ladderResults.ladders)
			setTotalCount(ladderResults.total_count)
			console.log(ladderResults)
		})
	}

	useEffect(() => {
		
	},[ladders])

	return (
		<Flex direction={"row"}>
			<AutoCompletePlaces onPlaceChanged={handlePlaceChanged} />
			<Flex direction={"column"}>
					Total ladders found: {totalCount} {ladders[0]?.id}
					<Collection
						type="list"
						items={ladders}
						direction='column'
						justifyContent={'space-between'}
					>
						{(ladder, index) => (
							<ItemCard
								key={`${ladder.id}_list${ladder}`}
								footer={<>
									{`${ladder.players?.ladder?.length ?? 0} players`}<br />
									{`${ladder.matches?.ladder?.length ?? 0} matches`}
								</>
								}
								header={
									ladder.name ?
										<Link to={`/ladders/${ladder.id}`}>{ladder.name}</Link>
										: 'No ladder found'
								}
								description={ladder.description ?? ''}
								footerRight={`Level: ${ladder.level_min}${ladder.level_max !== ladder.level_min ? '-' + ladder.level_max : ''}`}
							/>
						)}
					</Collection>
			</Flex>
		</Flex>
	)
}

export default LadderSearch
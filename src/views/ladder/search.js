import { Collection, Flex } from "@aws-amplify/ui-react"
import { ladderAPI } from "api/services"
import { AutoCompletePlaces, ItemCard } from "components/forms"
import { enums, helpers } from "helpers"
import { useEffect } from "react"
import { useState } from "react"
import { Link } from "react-router-dom"



const LadderSearch = () => {

	const [ladders, setLadders] = useState([])
	const [totalCount, setTotalCount] = useState(0)

	function handlePlaceChanged(geoPoint, radius) {
		console.log(geoPoint)
		let filter = [{name: 'geo', point: geoPoint, radius: radius }, {name: 'match_type', matchType: enums.MATCH_TYPE.SINGLES}]
		ladderAPI.getLadders(filter).then((ladderResults) => {
			setLadders(ladderResults.ladders)
			setTotalCount(ladderResults.total_count)
			console.log(ladderResults)
		})

		// ladderAPI.searchLadderByGeo(geoPoint, radius).then((ladderResults) => {
		// 	setLadders(ladderResults.ladders)
		// 	setTotalCount(ladderResults.total_count)
		// 	console.log(ladderResults)
		// })
	}

	useEffect(() => {

	}, [ladders])

	return (
		<Flex direction={"row"} gap=".5rem">
			<AutoCompletePlaces onPlaceChanged={handlePlaceChanged} />
			<Flex direction={"column"}>
				{`${totalCount} ladder${ladders.length > 1 ? 's' : ''} found`}
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
								{`${ladder.counts.players} players`}<br />
								{`${ladder.counts.matches} matches`}
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
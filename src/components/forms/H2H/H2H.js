import { Card, Divider, Flex, Grid, Loader, Text, View } from "@aws-amplify/ui-react";
import React, { useEffect, useState } from "react";
import './H2H.css'
import { userHelper as uf } from "helpers";
import { Match, ProfileImage } from "../index";
import { playerAPI } from "api/services";

const H2H = ({ winners, losers, ...props }) => {
	const [data, setData] = useState()

	//console.log("H2H", winners[0], losers[0])

	useEffect(() => {
		async function getData() {
			const stats = await playerAPI.getPlayerH2H(winners[0], losers[0])
			console.log(stats)
			setData(stats)
		}
		getData()
	}, [winners, losers])

	return (
		data?.player1 ?
			<Grid gap="0.1rem"
				templateColumns="1fr 1fr 1fr"
			>
				{/*** Player 1 ****/}
				<Card columnStart={1} columnEnd={2} className="center">
					<View className={"profileImageContainer_100"}>
						<ProfileImage player={data.player1} size={100} />
					</View>
					<Text marginLeft={'.25rem'}>{uf.SetPlayerName([data.player1])}</Text>
				</Card>

				{/*** vs ****/}
				<Card columnStart={2} columnEnd={3}>
					<Grid gap="0" templateColumns={"1fr 0fr 1fr"}>
						<span style={{ textAlign: 'center' }}>
							<View className="circle_60 player1">
								<Text fontSize={'2.3rem'}>{data.stats.totals.stats.matches.wins}</Text>
							</View>
							<Text variation="success">{data.stats.totals.stats.matches.percentage.toFixed(0)} % wins</Text>
						</span>
						<Divider orientation="vertical" marginLeft="1rem" marginRight={'1rem'} />
						<span style={{ textAlign: 'center' }}>
							<View className="circle_60 player2">
								<Text fontSize={'2.3rem'}>{data.stats.totals.stats.matches.losses}</Text>
							</View>
							<Text>{100 - data.stats.totals.stats.matches.percentage.toFixed(0)} % wins</Text>
						</span>
					</Grid>
				</Card>

				{/*** Player 2 ****/}
				<Card columnStart={3} columnEnd={-1} className="center">
					<View className={"profileImageContainer_100"}>
						<ProfileImage player={data.player2} size={100} />
					</View>
					<Text marginLeft={'.25rem'}>{uf.SetPlayerName([data.player2])}</Text>
				</Card>

				{/*** Stats section ****/}
				{[{ name: 'sets' }, { name: 'games' }, { name: 'tiebreaks' }].map((x, i) =>
					<React.Fragment key={i}>
						<Card columnStart={1} columnEnd={2} className="statsCard">
							{`${data.stats.totals.stats[x.name].wins}/${data.stats.totals.stats[x.name].total} (${data.stats.totals.stats[x.name].percentage.toFixed(0)}%)`}
						</Card>
						<Card columnStart={2} columnEnd={3} className="statsCard statsName">
							{x.name.charAt(0).toUpperCase() + x.name.slice(1)} Won
						</Card>
						<Card columnStart={3} columnEnd={-1} className="statsCard">
							{
								`${data.stats.totals.stats[x.name].losses}/${data.stats.totals.stats[x.name].total} (${100 - data.stats.totals.stats[x.name].percentage.toFixed(0)}%)`}
						</Card>
					</React.Fragment>
				)}

				{/*** All matches ****/}
				<Flex direction={'column'}>
					<h3>Matches</h3>
					{data ? data.matches.map(m =>
						<Match 
							displayAs="card" 
							match={m} 
							color={'blue'} 
							showH2H={false}
							showComments={true} 
							key={'m' + m.id} 
						/>
					) : null}
				</Flex>

			</Grid>
			: <h2><Loader /> Loading</h2>

	)
}

export default H2H

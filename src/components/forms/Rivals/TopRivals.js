import { Badge, Card, Collection, Divider, Flex, Grid, Image, Loader, Text, View } from "@aws-amplify/ui-react";
import React from "react";
import { SlUser } from "react-icons/sl";
import "./rivals.css"
import { userFunctions as uf } from "helpers";
import { Link } from "react-router-dom";

const TopRivals = ({ data, ...props }) => {

	console.log("TopRivals", data)
	return (
		props.rivalsFetched ?
			data?.length > 0 ?
				<>
					<Grid
						templateColumns={"3fr 5fr"}
						rowGap='.5rem'
						marginTop="1rem"
					>
						{data.map((rival, index) =>
							<React.Fragment key={index}>
								<Card
									backgroundColor={'blue.10'}
									variation="outlined"
									borderRadius={'medium'}>
									<Flex direction={'row'}>
										<Text>vs. </Text>
										<Flex direction={'column'}>
											<Link to={"/profile/" + rival.player.id} key={rival.player.id + '_' + index}>
												<View className={"profileImageContainer_small"}>
													{rival.player.image ?
														<Image
															src={rival.player.imageUrl}
															alt={`visual aid for ${uf.SetPlayerName(rival.player)}`}
															className={`profileImage`}
														/>
														: <SlUser size='30' />}
												</View>
												<Text as='span'> {uf.SetPlayerName(rival.player)}</Text>
											</Link>
										</Flex>

									</Flex>
								</Card>
								<Card>

									<Text> You have {' '}
										<Badge variation="success">{rival.wins}</Badge>
										{` wins and `}
										<Badge variation="warning">{rival.losses} </Badge>
										{` losses in ${rival.total_matches} matches.`}
									</Text>
								</Card>


							</React.Fragment>

						)}
					</Grid>
				</>
				: <h5>
					You don't have any rivals yet. <br />
					Register at least two matches against the same opponent and then come back.
				</h5>
			:
			<h5><Loader /> Loading ...</h5>
	)
}

export default TopRivals
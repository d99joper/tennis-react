// Matches.js
import { Button, Collection, Divider, Flex, Grid, Loader, Pagination, Text, View } from "@aws-amplify/ui-react";
import { enums, helpers, userHelper as uf, userHelper } from "helpers";
import React, { Suspense, useState, lazy, useEffect, useRef } from "react";
import { Comments, DynamicTable, H2H, InfoPopup, Match } from "../index.js"
import "./Matches.css"
import { Box, CircularProgress, LinearProgress } from "@mui/material";
import { Link } from "react-router-dom";
import { matchAPI } from "api/services/index.js"
import { AiFillAndroid, AiFillApple, AiFillFacebook, AiTwotoneCrown } from "react-icons/ai";
import { GoCommentDiscussion } from "react-icons/go";
import { GiCrossedSwords } from "react-icons/gi";
import { MdOutlineSportsTennis } from "react-icons/md";
import MyModal from "components/layout/MyModal.js";

const Matches = ({
	player,
	startDate,
	endDate,// = new Date(),
	ladder,
	matchType = enums.MATCH_TYPE.SINGLES,
	ladderMatches,
	onAddMatches,
	showHeader = true,
	displayAs = enums.DISPLAY_MODE.Table,
	allowAdd = true,
	allowDelete = false,
	excludeColumns,
	useColorCode = true,
	sortingField = "played_on",
	sortDirection = "DESC",
	pageSize = 10,
	refreshMatches = 0,
	hightlightedMatch,
	showH2H = false,
	showComments = false,
	showChallenge = false,
	isLoggedIn = false,
	...props
}) => {

	const MatchEditor = lazy(() => import("../MatchEditor/MatchEditor").then(module => { return { default: module.MatchEditor } }))

	const [matches, setMatches] = useState([])
	// const [sortField, setSortField] = useState(sortingField)
	// const [direction, setDirection] = useState(sortDirection)
	//const [{ sortField, direction }, setSort] = useState({ sortField: sortingField, direction: sortDirection })
	const [page, setPage] = useState(1)
	const [totalPages, setTotalPages] = useState()
	const [showLoader, setShowLoader] = useState(true)
	const [showH2HModal, setShowH2HModal] = useState()
	const [showCommentsModal, setShowCommentsModal] = useState()
	const [showChallengeModal, setShowChallengeModal] = useState()
	const matchPrefix = matches?.[0]?.hasOwnProperty('match') ? 'match.' : ''
	const useMatchPrefix = matches?.[0]?.hasOwnProperty('match') ? true : false
	const [isLoading, setIsLoading] = useState(false)
	const [highlightedItem, setHighlightedItem] = useState(hightlightedMatch)
	const prevPlayer = useRef(player)
	const prevLadder = useRef(ladder)

	const tableHeaders = [
		{ label: "Date", accessor: matchPrefix + "played_on", sortable: false, parts: useMatchPrefix ? 2 : 1, link: 'Match/id' },
		{ label: "Winner", accessor: matchPrefix + "winner.name", sortable: false, parts: useMatchPrefix ? 3 : 2, link: 'Profile/id' },
		{ label: "Loser", accessor: matchPrefix + "loser.name", sortable: false, parts: useMatchPrefix ? 3 : 2, link: 'Profile/id' },
		{ label: "Score", accessor: matchPrefix + "score", sortable: false, parts: useMatchPrefix ? 2 : 1, link: 'Match/id' },
		...notExclude('ladder') ? [{ label: "Ladder", accessor: matchPrefix + "ladder.name", sortable: false, parts: useMatchPrefix ? 3 : 2, link: 'Ladders/id' }] : [],
		{ label: "", accessor: "games", sortable: false, parts: 0 }
	]

	function notExclude(columnName) {
		if (!excludeColumns) return true

		return !excludeColumns.includes(columnName)
	}

	const removeHighlight = () => {
		setTimeout(() => {
			setHighlightedItem(null) // Reset highlightedItem after 5 seconds
		}, 5000) // 5000 milliseconds = 5 seconds
	}

	useEffect(() => {
		setShowLoader(true)
		setIsLoading(true)
		if (player) {
			// if there's a new player, reset the page to 1
			if (prevPlayer.current !== player) {
				setPage(1)
				prevPlayer.current = player
			}
			setShowLoader(true)
			matchAPI.getMatchesForPlayer(player.id, matchType, page, pageSize, 'desc').then((data) => {
				//console.log(data.matches)
				setMatches(data.matches)
				setTotalPages(Math.ceil(data.total_count / pageSize))
				setShowLoader(false)
				setIsLoading(false)
				setShowH2HModal(Array(data.matches.length).fill(false))
				setShowCommentsModal(Array(data.matches.length).fill(false))
				setShowChallengeModal(Array(data.matches.length).fill(false))
			})
		}
		else setShowLoader(false)

		if (ladderMatches) {
			setMatches(ladderMatches.matches)
			setTotalPages(Math.ceil(ladderMatches.total_count / pageSize))
			setShowLoader(false)
			setIsLoading(false)
		}
		else
			if (ladder) {
				// if there's a new ladder, reset the page to 1
				if (prevLadder.current !== ladder) {
					setPage(1)
					prevLadder.current = ladder
				}
				//mf.getMatchesForLadder(ladder.id, 'DESC', nextToken, 10).then((data) => {
				matchAPI.getMatchesForLadder(ladder.id, matchType, page, pageSize, 'DESC', 'playedOn').then((data) => {
					console.log(data)
					setMatches(data.matches)
					//setNextToken(data.nextToken)
					setTotalPages(Math.ceil(data.total_count / pageSize))
					//setDataIsFetched(true)
					setShowLoader(false)
					setIsLoading(false)
					setShowH2HModal(Array(data.matches.length).fill(false))
					setShowCommentsModal(Array(data.matches.length).fill(false))
					setShowChallengeModal(Array(data.matches.length).fill(false))
				})
			}
	}, [endDate, ladder, ladderMatches, player, startDate, page, refreshMatches])

	const setColor = ((match, index) => {
		//console.log('setColor winnerId', match.winner)
		if (player) // win gets green and loss gets red
			return (match.winner.id === player.id) ? 'lightgreen' : '#ff5c5cb0'
		else // even gets white and odd gets grey
			return (index % 2 === 0) ? 'white' : 'grey'

	})

	if (showLoader) {
		return (
			<div style={{ width: '100%' }}>
				<LinearProgress />
			</div>
		)
	}

	function displayGames(score) {
		const sets = score.split(',')

		let games = sets.map((set, i) => {
			const games = set.match(/\d+/g).map(Number)

			return (
				<React.Fragment key={`matchScore_${i}`}>
					<Text marginLeft={'1rem'} columnStart={i + 2} columnEnd={i + 3} rowStart="2">
						{games[0]}
						{/* there's a tiebreak score, check what side to put it */}
						{(games[2] && games[0] < games[1]) && <sup>({games[2]})</sup>}
					</Text>
					<Text marginLeft={'1rem'} columnStart={i + 2} columnEnd={i + 3} rowStart="4">
						{games[1]}
						{/* there's a tiebreak score, check what side to put it */}
						{(games[2] && games[0] > games[1]) && <sup>({games[2]})</sup>}
					</Text>
				</React.Fragment>
			)
		})
		return games
	}
	function handleNextPage() {
		setPage(page + 1)
	}
	function handlePreviousPage() {
		setPage(page - 1)
	}
	function handleOnChange(newPageIndex) {
		console.log(newPageIndex)
		setPage(newPageIndex)
	}
	function modalSwitch(index, type, open) {
		switch (type) {
			case 'h2h':
				setShowH2HModal(prevState => {
					const newState = [...prevState]
					newState[index] = open
					return newState
				})
				break;
			case 'comments':
				setShowCommentsModal(prevState => {
					const newState = [...prevState]
					newState[index] = open
					return newState
				})
				break;
			case 'challenge':
				setShowChallengeModal(prevState => {
					const newState = [...prevState]
					newState[index] = open
					return newState
				})
				break;
			default:
				break;
		}
	}

	return (
		isLoading === true ? <CircularProgress size={200} /> :
			<section {...props}>
				{displayAs === enums.DISPLAY_MODE.Inline ?
					<>
						<Collection className="matchCollection"
							items={matches}
							direction="column"
							paddingTop={".5rem"}
							paddingBottom={".5rem"}
							gap={"3px"}
						>
							{(item, index) => (
								<Match props={props}
									key={index}
									displayAs={displayAs}
									index={index}
									match={item}
									allowDelete={allowDelete}
									color={'lightgrey'}
									showHeader={false}
									showComments={showComments}
								></Match>
							)}
						</Collection>
						{( // keep false for now (it's moved into the profile)
							false && allowAdd && displayAs === enums.DISPLAY_MODE.Inline &&
							<Flex >
								<Button>Add New</Button>
								<Suspense fallback={<h2><Loader />Loading...</h2>}>
									<MatchEditor player={player} onSubmit={(m) => { setMatches(...matches, m) }} />
								</Suspense>
							</Flex>
						)}
					</>
					: null
				}
				{displayAs === enums.DISPLAY_MODE.Table ?
					<>
						<DynamicTable
							key={"matches"}
							columns={tableHeaders}
							allowDelete={allowDelete}
							deleteFunc={(match) => {
								console.log(match.id)
								matchAPI.deleteMatch(match.id)
								setMatches(matches.filter(x => x.id !== match.id))
							}}
							// sortHandler={sortHandler}
							// sortField={sortField}
							// direction={direction}
							data={matches}//{matches?.slice((page - 1)* pageSize, page * pageSize)}
							iconSet={[
								showH2H ? { name: 'H2H' } : {},
								showComments ? { name: 'Comments' } : {},
								showChallenge ? { name: 'Challenge' } : {}
							]}
							//nextToken={nextToken}
							nextText={"View more matches"}
							//onNextClick={addMatches}
							onLinkClick={(p) => { if (p != player.id) setShowLoader(true) }}
							styleConditionColor={useColorCode ? ['win-accent', 'lose-accent'] : null}
							styleConditionVariable={useColorCode ? 'win' : null}
							styleConditionVariable2={useColorCode ? player.id : null}
						/>
						<Pagination
							currentPage={page}
							totalPages={totalPages}
							onNext={handleNextPage}
							onPrevious={handlePreviousPage}
							onChange={handleOnChange}
						/>
					</>
					: null
				}
				{displayAs === enums.DISPLAY_MODE.SimpleList ?
					matches?.map((m, i) => {
						const isHighlighted = highlightedItem && m.id === highlightedItem.id
						//console.log(isHighlighted, highlightedItem, m.id)
						// Call removeHighlight function if the item is highlighted
						if (isHighlighted) {
							removeHighlight()
						}
						return (
							<Grid key={'m_' + i}
								templateColumns={'auto 1fr'}
								paddingRight={'1rem'}
							>
								<Grid key={i}
									templateColumns="auto 1fr 1fr 1fr 1fr 1fr 1fr"
									marginBottom={'1rem'}
									width={'250px'}
									className={isHighlighted ? 'highlight' : ''}
								//backgroundColor={isHighlighted ? 'yellow' : 'transparent'}
								//backgroundColor={'blue'}
								>
									<Text columnStart="1" columnEnd="-1" fontSize="0.8em" fontStyle="italic">
										{m?.played_on}
									</Text>
									<View columnStart="1" columnEnd="2">
										{userHelper.SetPlayerName(m.winner)}
									</View>
									<Divider columnStart="1" columnEnd="-1" />
									<View columnStart="1" columnEnd="2">
										{userHelper.SetPlayerName(m.loser)}
									</View>
									{displayGames(m.score)}

								</Grid>
								<View margin={'auto'} marginLeft={'1rem'} padding={'0.5rem'}>
									{showH2H &&
										<>
											<GiCrossedSwords
												size={30}
												color="#058d0c"
												className={'cursorHand'}
												onClick={() => { modalSwitch(i, 'h2h', true) }}
											/>
											<MyModal
												showHide={showH2HModal[i]}
												onClose={() => { modalSwitch(i, 'h2h', false) }}
												title='H2H'
												height="500px"
												overflow="auto"
											>
												<H2H winners={m.winner} losers={m.loser} />
											</MyModal>
										</>
									}
									&nbsp;
									{showChallenge &&
										<>
											<MdOutlineSportsTennis
												size={30}
												color="#058d0c"
												className={'cursorHand'}
												onClick={() => { modalSwitch(i, 'challenge', true) }}
											/>
											<MyModal
												showHide={showChallengeModal[i]}
												onClose={() => { modalSwitch(i, 'challenge', false) }}
												title='Challenge'
												height="500px"
												overflow="auto"
											>
												Challenge
											</MyModal>
										</>
									}
									&nbsp;
									{showComments &&
										<>
											<GoCommentDiscussion
												size={30}
												color="#058d0c"
												className={'cursorHand'}
												onClick={() => { modalSwitch(i, 'comments', true) }}
											/>
											<MyModal
												showHide={showCommentsModal[i]}
												onClose={() => { modalSwitch(i, 'comments', false) }}
												title={'Match comments'}
												height="500px"
												overflow="auto"
											>
												<Match match={m} showComments={true} />
												<Comments 
													showComments={true} 
													entityId={m.id} 
													entityType="match"
													data={m.comments} 
													allowAdd={isLoggedIn}
												/>
											</MyModal>
										</>
									}
								</View>
							</Grid>
						)
					})

					: null
				}
			</section>
	)

}

export { Matches };
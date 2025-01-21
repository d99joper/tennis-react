import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
// import {
// 	Button, Card, Flex, Grid, Text, TextField, SelectField, View,
// 	TextAreaField, Divider, Loader, TabItem, Tabs
// } from "@aws-amplify/ui-react";
import { enums, helpers } from 'helpers'
import { Editable, Matches, PhoneNumber, UserStats, TopRivals, UnlinkedMatches, ProfileImage, InfoPopup, MergeProfiles } from '../../components/forms/index.js'
import './profile.css';
import { Modal, Box, Typography, Dialog, DialogTitle, CircularProgress, LinearProgress, Button, Card, Tabs, Tab, Grid2 as Grid, Divider, Select, TextField } from '@mui/material';
import { AiOutlineEdit, AiOutlineMail, AiOutlinePhone, AiOutlineUsergroupAdd } from 'react-icons/ai';
import { MdOutlineCancel, MdOutlineCheck, MdOutlineRefresh } from 'react-icons/md'
import { authAPI, playerAPI } from 'api/services/index.js';
import { useContext } from 'react';
import { ProfileImageContext } from 'components/forms/ProfileImage.js';
import MyModal from 'components/layout/MyModal.js';
import notificationAPI from 'api/services/notifications.js';

function Profile(props) {

	const NTRPItems = ["-", "1.5", "2.0", "2.5", "3.0", "3.5", "4.0", "4.5", "5.0", "5.5"]
	const params = useParams();
	const [error, setError] = useState({ status: false, message: null });
	const [tabIndex, setTabIndex] = useState(0)
	const [matchTabIndex, setMatchTabIndex] = useState(0)
	// player
	const [player, setPlayer] = useState()
	const { setProfileImage } = useContext(ProfileImageContext)
	const [updatingImage, setUpdatingImage] = useState(false)
	const [loggedInPlayer, setLoggedInPlayer] = useState()
	const [rivals, setRivals] = useState({})
	const [rivalsFetched, setRivalsFetched] = useState(false);
	const [stats, setStats] = useState({})
	const [statsFetched, setStatsFetched] = useState(false);
	const [isLoaded, setIsLoaded] = useState(false);
	const isLoggedIn = props.isLoggedIn;
	const [isEdit, setIsEdit] = useState(false);
	const [canEdit, setCanEdit] = useState(false);
	// image modal
	const [showImagePicker, setShowImagePicker] = useState(false)
	// utr
	const [utrLink, setUtrLink] = useState('')
	const [utrRankSingles, setUtrRankSingles] = useState()
	const [utrRankDoubles, setUtrRankDoubles] = useState()
	const [showUtrRefresh, setShowUtrRefresh] = useState(true)
	const [showUtrRefreshing, setShowUtrRefreshing] = useState(false)
	// matches
	const [showMatchEditor, setShowMatchEditor] = useState(false);
	const [unLinkedMatches, setUnLinkedMatches] = useState()
	const [unLinkedMatchesAdded, setUnLinkedMatchesAdded] = useState(0)
	const [refreshMatchesCounter, setRefreshMatchesCounter] = useState(0)
	const [highLightedMatch, setHighLightedMatch] = useState({})
	// mergers
	const [showMergers, setShowMergers] = useState(false);
	const navigate = useNavigate()


	const MatchEditor = lazy(() => import("../../components/forms/index") //MatchEditor/MatchEditor")
		.then(module => { return { default: module.MatchEditor } }))

	const handleUpdatedPhoneNumber = newNumber => {
		setPlayer({ ...player, phone: newNumber })
	}

	const handleStatsClick = () => {
		if (!statsFetched) {
			//userHelper.getPlayerStatsByYear(player.id, 'SINGLES')
			playerAPI.getPlayerStatsByYear(player.id, 'SINGLES')
				.then((data) => {
					setStats(data)
					setStatsFetched(true)
					console.log("statsFetched", data)
				})
		}
	}

	const handleRivalsClick = () => {
		if (!rivalsFetched) {
			// userHelper.getGreatestRivals(player.id)
			playerAPI.getGreatestRivals([player.id], enums.MATCH_TYPE.SINGLES)
				//playerFunctions.getGreatestRivals([player.id,'abc'], enums.MATCH_TYPE.DOUBLES)
				.then((data) => {
					setRivals(data)
					setRivalsFetched(true)
				})
		}
	}

	async function updateProfilePic(e) {

		setUpdatingImage(true)
		setShowImagePicker(false)
		const origImage = Array.from(e.target.files)[0]
		//console.log(origImage)
		const smallImage = await helpers.resizeImage(origImage, 800)
		//console.log(smallImage)
		let p = await playerAPI.updatePlayerImage(player.id, smallImage)
		setProfileImage(player.id, player.image)
		setUpdatingImage(false)
	}

	async function updateProfileData(e) {
		e.preventDefault();

		//setIsLoaded(false)
		const form = new FormData(document.getElementById('profileForm'))

		const data = {
			id: player.id,
			about: form.get("about"),
			NTRP: form.get("NTPR"),
			UTR: form.get("UTR"),
			phone: player.phone || '',
		};

		let p = await playerAPI.updatePlayer(data)
		p.events = player.events
		p.stats = player.stats
		// setPlayer(prevState => ({...prevState, p}))
		setPlayer(p)
		//setIsLoaded(true)
		setIsEdit((isEdit) => !isEdit)
	}

	function openUserImagePicker(e) {
		e.preventDefault()
		if (canEdit) setShowImagePicker(true);
	}

	function handleUnlinkedMatchAdded() {
		setUnLinkedMatchesAdded(prevVal => { return prevVal + 1 })
	}

	useEffect(() => {
		console.log("profile page got new userId", params.userid)

		setRivals({})
		setRivalsFetched(false)
		setStatsFetched(false)
		setStats({})
		setTabIndex(0)
		setUnLinkedMatches()

		async function getProfile() {

			let p = null;
			setCanEdit(false)
			let sessionPlayer = authAPI.getCurrentUser()

			console.log('sessionPlayer', sessionPlayer)
			setLoggedInPlayer(sessionPlayer)
			// Check if userid param was provided
			let id = params.userid
			if ((!id) && sessionPlayer)
				id = sessionPlayer.id

			if (id) {
				p = await playerAPI.getPlayer(id)
				setStats(p.stats)
				setStatsFetched(true)

				//check if this user has been merged (main profile's id returned from the API)
				if (id !== p.id) {
					console.log('merged')
					navigate('/profile/' + p.id)
				}
				if (p.UTR) {
					if (p.cached_utr) {
						console.log(p.cached_utr)
						setUtrRankSingles(p.cached_utr?.singles?.toFixed(2))
						setUtrRankDoubles(p.cached_utr?.doubles?.toFixed(2))
					}
					setUtrLink(`https://app.utrsports.net/profiles/${p.UTR}`)
				}
				if (p.error)
					setError({ status: true, message: p.error })
			}

			if (sessionPlayer) {
				if (sessionPlayer.email === p.email || sessionPlayer.merged_into === p.id) {
					console.log('This is your page, so you can edit it')
					setUnLinkedMatches(sessionPlayer.unLinkedMatches)
					setCanEdit(true)
				}
			}
			else if (!p) {
				setError({ status: true, message: 'This user does not exist.' });
			}
			setIsLoaded(true)

			if (p)
				document.title = 'My Tennis Space - ' + p.name

			return p

		}

		getProfile().then(p => {
			console.log("getProfile", p)
			setPlayer(p)
		})
		//}, []);  
	}, [params.userid, unLinkedMatchesAdded]);

	function updateUTR() {
		// this is just to refresh the utrm once someone looks at the profile
		setShowUtrRefresh(false)
		setShowUtrRefreshing(true)
		playerAPI.getPlayerUTR(player.id).then((utr_obj) => {
			if (utr_obj) {
				console.log(utr_obj)
				setUtrRankSingles(utr_obj.singles.toFixed(2))
				setUtrRankDoubles(utr_obj.doubles.toFixed(2))
			}
			setShowUtrRefreshing(false)
		})
	}


	if (error.status) {
		return <div>Error: {error.message}</div>;
	} else if (!isLoaded) {
		return <h2><LinearProgress />Loading...</h2>;
	} else {
		return (
			<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }} className='profile-main' id="profile">

				<Box as="form"
					id="profileForm"
					className='profile-form'
					onSubmit={updateProfileData}
				>
					{/******** MODAL TO UPDATE PICTURE   *********/}
					<Modal
						aria-labelledby="Update profile picture"
						onClose={() => setShowImagePicker(false)}
						open={showImagePicker}
					>
						<Box sx={helpers.modalStyle}>
							<Typography id="modal-modal-title" variant="h6" component="h2" marginBottom={'1rem'}>
								{`Update profile picture`}
							</Typography>
							<Box
								name="profilePic"
								as="input"
								type="file"
								accept='image/*'
								id="imageInput"
								text={player.name}
								className="hiddenImageInput"
								onChange={(e) => { updateProfilePic(e) }}
							/>

							<Button>
								<label htmlFor="imageInput" className='cursorHand'>
									Select a profile picture.
								</label>
							</Button>
						</Box>
					</Modal>


					<Card className='card profile-info' id="profileContact" variation="elevated">

						{/************ EDIT TOOGLE   *************/}
						<div className="desktop-only editIconWrapper">
							{canEdit && isEdit &&
								<>
									<MdOutlineCheck
										size={25}
										onClick={(e) => { updateProfileData(e) }}
										className='cursorHand'
									/>
									<MdOutlineCancel
										size={25}
										onClick={() => setIsEdit(!isEdit)}
										className='cursorHand'
									/>
								</>
							}
							{canEdit && !isEdit &&
								<>
									<AiOutlineEdit
										size={25}
										onClick={() => setIsEdit(!isEdit)}
										className='cursorHand'
									/>
								</>

							}
						</div>
						{/************ PROFILE PICTURE   *************/}
						{updatingImage
							? <CircularProgress size={140} />
							:
							<ProfileImage player={player} size={150}
								className={`image ${canEdit ? " cursorHand" : null}`}
								onClick={(e) => { openUserImagePicker(e) }}
							/>
						}
						{/************ NAME   *************/}
						<Typography fontSize='x-large' className='name'>
							{player.name}
						</Typography>

					</Card>

					{/************ RIGHT CONTENT   *************/}
					<Card className='card rightProfileContent' variation="elevated" flex="1">
						<Tabs
							currentIndex={tabIndex}
							onChange={(i) => setTabIndex(i)}
							justifyContent="flex-start">
							<Tab title="General">
								<Grid
									className='profile-info-grid'
									// templateColumns="1fr 5fr"
									templateRows="auto"
									paddingTop={"10px"}
									position={'relative'}
								>

									<Box className='profile-contact' columnStart="1" columnEnd={'-1'}>
										{/************ EMAIL   *************/}
										<Typography fontSize='medium'>
											<AiOutlineMail />
											{isLoggedIn
												? <>&nbsp;<a href={`mailto:${player.email}`}>{player.email}</a></>
												: <>&nbsp;Hidden</>
											}
										</Typography>
										{/************ PHONE   *************/}
										<Typography fontSize='medium'>
											{(player.phone || isEdit) && <AiOutlinePhone />}
											{isLoggedIn
												?
												<>&nbsp;
													<PhoneNumber name="name" onNewNumber={handleUpdatedPhoneNumber} number={player.phone} editable={isEdit && canEdit} />
												</>
												: <>&nbsp;Hidden</>
											}
										</Typography>
										{/************ MERGERS   *************/}
										{(player.potential_mergers?.length > 0 && canEdit) &&
											<>
												<Typography fontSize='medium' className='cursorHand' onClick={() => setShowMergers(true)}>
													<AiOutlineUsergroupAdd />
													<a>
														&nbsp;
														Is this you? There's a potential merger.
													</a>
												</Typography>
												<MyModal
													showHide={showMergers}
													onClose={() => setShowMergers(false)}
													height="auto"
													overflow="auto"
												>
													<MergeProfiles mainPlayer={player} potentialMergers={player.potential_mergers} />
												</MyModal>
											</>
										}

									</Box>

									<Box columnStart={'1'} columnEnd={'-1'}>
										<Button onClick={async () => {
											const newNotification = await notificationAPI.createNotification({
												recipient_id: 'a0ee264b-9486-49dc-908a-ee9b7d0485aa',
												title: 'New Event',
												message: 'Don’t miss this awesome event!',
											});
										}}>Add comment</Button>
										<Divider paddingBottom={'.5rem'} />
									</Box>

									{/************ EDIT TOOGLE   *************/}
									<div className="mobile-only" style={{ textAlign: 'right', paddingRight: '1rem', flexGrow: 1, position: 'absolute', top: 0, right: 0, padding: '1rem', zIndex: 9999 }}>

										{canEdit && isEdit &&
											<>
												<MdOutlineCheck
													onClick={(e) => { updateProfileData(e) }}
													className='cursorHand'
												/>
												<MdOutlineCancel
													onClick={() => setIsEdit(!isEdit)}
													className='cursorHand'
												/>
											</>
										}
										{canEdit && !isEdit &&
											<AiOutlineEdit
												onClick={() => setIsEdit(!isEdit)}
												className='cursorHand'
											/>

										}
									</div>
									<Box >Location </Box>
									<div>
										{player.location ?? 'Unknown'}

									</div>
									{/************ NTRP   *************/}
									<Box>NTRP
										<InfoPopup paddingLeft={"0.1rem"}>
											<a
												href='https://www.usta.com/content/dam/usta/pdfs/NTRP%20General%20Characteristics.pdf'
												target='_blank'
											>
												{`View the USTA NTPR guidelines here >>`}
											</a>
										</InfoPopup>
										:
									</Box>
									<div>
										<Box sx={{ display: 'flex', direction:'row', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
											<Editable
												text={player.NTRP ?? '-'}
												isEditing={isEdit}
												direction="row"
												gap="0.5rem"
											>
												<Select
													name="NTPR"
													size='small'
													defaultValue={player.NTRP ? player.NTRP : '2.0'}
													options={NTRPItems}
												></Select>

											</Editable>
										</Box>
									</div>
									{/************ UTR   *************/}
									<Box>UTR
										<InfoPopup paddingLeft={"0.1rem"}>
											Add your UTR id to link up with your UTR account
										</InfoPopup>:
									</Box>
									<Box sx={{ display: 'flex', direction:'row', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
										<Editable
											text={
												<Box sx={{ display: 'flex', direction:'column', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
													{!player.UTR ? <div>'Add your UTR id'</div> : ''}
													<div>
														Singles: {showUtrRefreshing ? <CircularProgress size={14} /> : (utrRankSingles > 0 ? utrRankSingles : 'UR')}
													</div>
													<div>
														Doubles: {showUtrRefreshing ? <CircularProgress size={14} /> : (utrRankDoubles > 0 ? utrRankDoubles : 'UR')}
													</div>

													{showUtrRefresh &&
														<MdOutlineRefresh
															color="green"
															className='cursorHand'
															onClick={() => updateUTR()} />
													}
													{utrLink ? <a target='_blank' href={utrLink}>{`View UTR profile >>`}</a> : ''}
												</Box>
											}
											isEditing={isEdit}
										>
											<TextField name="UTR" size='small' defaultValue={player.UTR}></TextField>

										</Editable>

									</Box>
									{/************ LADDERS   *************/}
									<Box>Events:</Box>
									<Grid templateRows={"auto"}>
										{player.events?.map((event, i) => {
											if (event.event_type === 'league') {
												return (<Link to={`/league/${event.id}`} key={event.id}>{event.name}</Link>)
											}
											if (event.event_type === 'ladder')
												return (<Link to={`/ladders/${event.id}`} key={event.id}>{event.name}</Link>)
										})}
									</Grid>
									{/************ ABOUT   *************/}
									{(player.about || isEdit === true) &&
										<>
											<Box><Typography>About:</Typography></Box>
											<Editable
												text={player.about}
												isEditing={isEdit}>
												<TextField multiline name="about" defaultValue={player.about}></TextField>
											</Editable>
										</>
									}
									{/* {isEdit &&
                                        <Button type="submit" variation="primary">
                                            Update
                                        </Button>
                                    } */}
								</Grid>
							</Tab>
							<Tab title="Stats" onClick={handleStatsClick} >
								{/************ STATS   *************/}
								<UserStats
									stats={stats}
									statsFetched={statsFetched}
									paddingTop={10}
									displayAs={enums.DISPLAY_MODE.SimpleList}
									className="mobile-only"
								/>
								<UserStats
									stats={stats}
									statsFetched={statsFetched}
									paddingTop={10}
									displayAs={enums.DISPLAY_MODE.Table}
									className="desktop-only"
								/>
							</Tab>
							<Tab title="Greatest Rivals" onClick={handleRivalsClick} >
								{/************ RIVALS   *************/}
								<TopRivals data={rivals} rivalsFetched={rivalsFetched} player={player} paddingTop={10} />
							</Tab>
							<Tab title='Notifications'>
								test
							</Tab>
						</Tabs>
					</Card>
				</Box>

				{/************ MATCHES   *************/}

				<Box sx={{direction:"row", display:'flex', gap:"1rem"}}>
					<Card className='card' variation="elevated" style={{ width: "100%" }}>
						<Tabs
							autoSave=''
							currentIndex={matchTabIndex}
							onChange={(i) => setMatchTabIndex(i)}
							justifyContent="flex-start"
						>
							<Tab title="Singles">
								<UnlinkedMatches matches={unLinkedMatches} player={player} handleMatchAdded={handleUnlinkedMatchAdded} />
								<Matches
									originId={player.id}
									originType={'player'}
									hightlightedMatch={highLightedMatch}
									refreshMatches={refreshMatchesCounter}
									pageSize="10"
									matchType={enums.MATCH_TYPE.SINGLES}
									// displayAs={enums.DISPLAY_MODE.SimpleList}
									allowDelete={loggedInPlayer?.isAdmin}
									className="desktop-only"
									showH2H={true}
									showChallenge={true}
									showComments={true}
									isLoggedIn={isLoggedIn}
								/>

							</Tab>
							<Tab title="Doubles">
								<Matches
									originId={player.id}
									originType={'player'}
									hightlightedMatch={highLightedMatch}
									refreshMatches={refreshMatchesCounter}
									pageSize="10"
									matchType={enums.MATCH_TYPE.DOUBLES}
									allowDelete={loggedInPlayer?.isAdmin}
									className="desktop-only"
									showH2H={false}
									showChallenge={false}
									showComments={true}
									isLoggedIn={isLoggedIn}
									displayAs={enums.DISPLAY_MODE.SimpleList}
								/>
							</Tab>
						</Tabs>
						{canEdit &&
							<Button label="Add new match"
								onClick={() => setShowMatchEditor(true)}
							// onClick={(e) => { toggleMatchEditor(e) }}
							>
								{showMatchEditor ? 'Cancel' : 'Add'}
							</Button>
						}
						<Dialog
							onClose={() => setShowMatchEditor(false)}
							open={showMatchEditor}
							aria-labelledby={`Add a match`}
							aria-describedby="Add a new match"
							padding={'1rem'}
						>
							<DialogTitle>Add a new match</DialogTitle>
							<Box padding={'1rem'}>
								<Suspense fallback={<h2><CircularProgress /> Loading...</h2>}>
									<MatchEditor
										participant={player}
										onSubmit={(match) => {
											setRefreshMatchesCounter(refreshMatchesCounter + 1)
											setHighLightedMatch(match)
											setShowMatchEditor(false)
										}}
										minDate={helpers.setDate(-90)}
									/>
								</Suspense>
							</Box>
						</Dialog>
					</Card>
				</Box>
			</Box>
		)
	}

};

export default Profile;

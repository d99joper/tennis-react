import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
	Button, Card, Flex, Grid, Text, TextField, SelectField, View,
	TextAreaField, Divider, SwitchField, Loader, TabItem, Tabs
} from "@aws-amplify/ui-react";
import { enums, helpers, userHelper } from 'helpers'
import { Editable, Matches, PhoneNumber, UserStats, TopRivals, Match, UnlinkedMatches, ProfileImage } from '../components/forms/index.js'
import './profile.css';
import { Avatar, Modal, Box, Typography, Dialog, DialogTitle, Checkbox, Toolbar } from '@mui/material';
import { AiOutlineEdit, AiOutlineMail, AiOutlinePhone, AiOutlineUndo } from 'react-icons/ai';
import { MdOutlineCancel, MdOutlineCheck, MdOutlineInfo } from 'react-icons/md';
import { BiLogOutCircle } from 'react-icons/bi';
import { authAPI, playerAPI } from 'api/services/index.js';

function Profile(props) {

	const MatchEditor = lazy(() => import("../components/forms/index") //MatchEditor/MatchEditor")
		.then(module => { return { default: module.MatchEditor } }))
	//const UserStats = lazy(() => import("../components/forms/index")
	//    .then(module => { return { default: module.UserStats } }))

	const NTRPItems = ["-", "1.5", "2.0", "2.5", "3.0", "3.5", "4.0", "4.5", "5.0", "5.5"];
	const [isLinkVisible, setIsLinkVisible] = useState(false);

	const handleIconClick = () => {
		setIsLinkVisible(!isLinkVisible);
	};
	const params = useParams();
	const [error, setError] = useState({ status: false, message: null });
	const [isLoaded, setIsLoaded] = useState(false);
	const [isLoggedIn, setIsLoggedIn] = useState(props.isLoggedIn);
	const [isEdit, setIsEdit] = useState(false);
	//const [profileChange, setProfileChange] = useState(0)
	const [canEdit, setCanEdit] = useState(false);
	const [showImagePicker, setShowImagePicker] = useState(false);
	const [showMatchEditor, setShowMatchEditor] = useState(false);
	const [player, setPlayer] = useState()
	const [stats, setStats] = useState({})
	const [statsFetched, setStatsFetched] = useState(false);
	const [rivals, setRivals] = useState({})
	const [rivalsFetched, setRivalsFetched] = useState(false);
	const [tabIndex, setTabIndex] = useState(0)
	const [matchTabIndex, setMatchTabIndex] = useState(0)
	const [unLinkedMatches, setUnLinkedMatches] = useState()
	const [loggedInPlayer, setLoggedInPlayer] = useState()
	const [unLinkedMatchesAdded, setUnLinkedMatchesAdded] = useState(0)
	const [randomImageNumber, setRandomImageNumber] = useState(0)

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

		setIsLoaded(false)
		const origImage = Array.from(e.target.files)[0]
		//console.log(origImage)
		const smallImage = await helpers.resizeImage(origImage, 800)
		//console.log(smallImage)
		let p = await playerAPI.updatePlayerImage(player.id, smallImage)
		//console.log("updateProfilePic", p)
		// update the localstorage cache
		localStorage.setItem(`profile_image_${player.id}`, `${player.image}?dummy=${Math.random()}`)
		setPlayer(prevState => ({ ...prevState, image: p.image }))
		setIsLoaded(true)
		setShowImagePicker(false)
		// to avoid caching images, set a random number to add to the url
		//setRandomImageNumber(Math.floor(Math.random() * 1000000))
	}

	async function updateProfileData(e) {
		e.preventDefault();

		//setIsLoaded(false)
		const form = new FormData(document.getElementById('profileForm'))

		const data = {
			about: form.get("about"),
			NTRP: form.get("NTPR"),
			UTR: form.get("UTR"),
			phone: player.phone || '',
		};

		let p = await userHelper.UpdatePlayer(data, player.id)

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
		setRandomImageNumber(Math.floor(Math.random() * 1000000))

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
				if (p.error)
					setError({ status: true, message: p.error })
			}

			if (sessionPlayer) {
				if (sessionPlayer.email === p.email) {
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


	if (error.status) {
		return <div>Error: {error.message}</div>;
	} else if (!isLoaded) {
		return <h2><Loader />Loading...</h2>;
	} else {
		return (
			<Flex className='profile-main' id="profile">

				<Flex as="form"
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
							<View
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
						<ProfileImage player={player} size={150}
							className={`image ${canEdit ? " cursorHand" : null}`}
							onClick={(e) => { openUserImagePicker(e) }}
						/>
						{/************ NAME   *************/}
						<Text fontSize='x-large' className='name'>
							{player.name}
						</Text>

					</Card>

					{/************ RIGHT CONTENT   *************/}
					<Card className='card rightProfileContent' variation="elevated" flex="1">
						<Tabs
							currentIndex={tabIndex}
							onChange={(i) => setTabIndex(i)}
							justifyContent="flex-start">
							<TabItem title="General">
								<Grid
									templateColumns="1fr 5fr"
									templateRows="auto"
									paddingTop={"10px"}
								>

									<View className='profile-contact' columnStart="1" columnEnd={'-1'}>
										{/************ EMAIL   *************/}
										<Text fontSize='medium'>
											<AiOutlineMail />
											{isLoggedIn
												? <>&nbsp;<a href={`mailto:${player.email}`}>{player.email}</a></>
												: <>&nbsp;Hidden</>
											}
										</Text>
										{/************ PHONE   *************/}
										<Text fontSize='medium'>
											<AiOutlinePhone />
											{isLoggedIn
												?
												<>&nbsp;
													<PhoneNumber name="name" onNewNumber={handleUpdatedPhoneNumber} number={player.phone} editable={isEdit && canEdit} />
												</>
												: <>&nbsp;Hidden</>
											}
										</Text>

									</View>

									<View columnStart={'1'} columnEnd={'-1'}>
										<Divider paddingBottom={'.5rem'} />
									</View>

									{/************ EDIT TOOGLE   *************/}
									<div className="mobile-only" style={{ textAlign: 'right', paddingRight: '1rem', flexGrow: 1 }}>

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
									{/************ NTRP   *************/}
									<View>NTRP:</View>
									<div>
										<Editable
											text={player.NTRP ? <>{player.NTRP} <MdOutlineInfo onClick={handleIconClick} className='cursorHand' /></> : '-'}
											isEditing={isEdit}
											direction="row"
											gap="0.5rem"
										>
											<SelectField
												name="NTPR"
												size='small'
												defaultValue={player.NTRP ? player.NTRP : '2.0'}
												options={NTRPItems}
											></SelectField>

											<MdOutlineInfo onClick={handleIconClick} className='cursorHand' />
										</Editable>

										<a
											href='https://www.usta.com/content/dam/usta/pdfs/NTRP%20General%20Characteristics.pdf'
											target='_blank'
											style={{
												display: isLinkVisible ? 'block' : 'none',
												position: 'absolute',
												//top: '30px', // Adjust the top position as needed
												//left: 0,
												background: 'white',
												padding: '10px',
												border: '1px solid #ccc',
												borderRadius: '5px',
												transform: 'scale(1.1)',
												transition: 'transform 0.3s',
											}}
										>
											View the USTA NTPR guidelines
										</a>
									</div>
									{/************ UTR   *************/}
									<View>UTR rating:</View>
									<View>
										<Editable
											text={player.UTR ? <>{player.UTR} <MdOutlineInfo ></MdOutlineInfo></> : '-'}
											isEditing={isEdit}
										>
											<TextField name="UTR" size='small' defaultValue={player.UTR}></TextField>
											<MdOutlineInfo ></MdOutlineInfo>
										</Editable>
									</View>
									{/************ LADDERS   *************/}
									<View>Ladders:</View>
									{/* <Ladders ladderList={player.ladders} player={player} /> */}
									{/* <Grid templateRows={"auto"}>
                                        {player.ladders.items.map((item, i) => {
                                            console.log(item)
                                            return (
                                                <Link to={`/ladders/${item.ladder.id}`} key={item.ladder.id}>{item.ladder.name}</Link>
                                            )
                                        })}
                                    </Grid> */}
									<Grid templateRows={"auto"}>
										{player.ladders?.map((ladder, i) => {
											return (
												<Link to={`/ladders/${ladder.id}`} key={ladder.id}>{ladder.name}</Link>
											)
										})}
									</Grid>
									{/************ ABOUT   *************/}
									{(player.about || isEdit === true) &&
										<>
											<View><Text>About:</Text></View>
											<Editable
												text={player.about}
												isEditing={isEdit}>
												<TextAreaField name="about" defaultValue={player.about}></TextAreaField>
											</Editable>
										</>
									}
									{/* {isEdit &&
                                        <Button type="submit" variation="primary">
                                            Update
                                        </Button>
                                    } */}
								</Grid>
							</TabItem>
							<TabItem title="Stats" onClick={handleStatsClick} >
								{/************ STATS   *************/}
								<UserStats stats={stats} statsFetched={statsFetched} paddingTop={10} />
							</TabItem>
							<TabItem title="Greatest Rivals" onClick={handleRivalsClick} >
								{/************ RIVALS   *************/}
								<TopRivals data={rivals} rivalsFetched={rivalsFetched} player={player} paddingTop={10} />
							</TabItem>
						</Tabs>
					</Card>
				</Flex>

				{/************ MATCHES   *************/}

				<Flex direction="row" gap="1rem">
					<Card className='card' variation="elevated" style={{ width: "100%" }}>
						<Tabs
							autoSave=''
							currentIndex={matchTabIndex}
							onChange={(i) => setMatchTabIndex(i)}
							justifyContent="flex-start"
						>
							<TabItem title="Singles">
								<UnlinkedMatches matches={unLinkedMatches} player={player} handleMatchAdded={handleUnlinkedMatchAdded} />
								<Matches player={player} pageSize="5" matchType={enums.MATCH_TYPE.SINGLES} allowDelete={loggedInPlayer?.isAdmin}></Matches>

							</TabItem>
							<TabItem title="Doubles">
								<Matches player={player} pageSize="5" matchType={enums.MATCH_TYPE.DOUBLES} allowDelete={loggedInPlayer?.isAdmin}></Matches>
							</TabItem>
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
								<Suspense fallback={<h2><Loader />Loading...</h2>}>
									<MatchEditor
										player={player}
										onSubmit={updateProfileData}
										minDate={helpers.setDate(-90)}
									/>
								</Suspense>
							</Box>
						</Dialog>
					</Card>
				</Flex>
			</Flex>
		)
	}

};

export default Profile;

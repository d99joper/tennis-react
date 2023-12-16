import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
	Button, Card, Flex, Grid, Text, TextField, SelectField, View,
	TextAreaField, Divider, Loader, TabItem, Tabs
} from "@aws-amplify/ui-react";
import { enums, helpers } from 'helpers'
import { Editable, Matches, PhoneNumber, UserStats, TopRivals, UnlinkedMatches, ProfileImage } from '../components/forms/index.js'
import './profile.css';
import { Modal, Box, Typography, Dialog, DialogTitle, Popover, CircularProgress } from '@mui/material';
import { AiOutlineEdit, AiOutlineMail, AiOutlinePhone } from 'react-icons/ai';
import { MdOutlineCancel, MdOutlineCheck, MdOutlineInfo } from 'react-icons/md'
import { authAPI, playerAPI } from 'api/services/index.js';
import { useContext } from 'react';
import { ProfileImageContext } from 'components/forms/ProfileImage.js';

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
	const [isLoggedIn, setIsLoggedIn] = useState(props.isLoggedIn);
	const [isEdit, setIsEdit] = useState(false);
	const [canEdit, setCanEdit] = useState(false);
	// info popover
	const [showInfoModal, setShowInfoModal] = useState(false)
	const [infoContent, setInfoContent] = useState('')
	const [infoAnchorEl, setInfoAnchorEl] = useState(null)
	// image modal
	const [showImagePicker, setShowImagePicker] = useState(false)
	// utr
	const [utrLink, setUtrLink] = useState('')
	const [utrRankSingles, setUtrRankSingles] = useState()
	const [utrRankDoubles, setUtrRankDoubles] = useState()
	// matches
	const [showMatchEditor, setShowMatchEditor] = useState(false);
	const [unLinkedMatches, setUnLinkedMatches] = useState()
	const [unLinkedMatchesAdded, setUnLinkedMatchesAdded] = useState(0)
	//const [startPage, setStartPage]

	const MatchEditor = lazy(() => import("../components/forms/index") //MatchEditor/MatchEditor")
		.then(module => { return { default: module.MatchEditor } }))

	const handleUpdatedPhoneNumber = newNumber => {
		setPlayer({ ...player, phone: newNumber })
	}

	const handleIconClick = (origin, e) => {
		console.log(origin, e)
		setInfoAnchorEl(e.currentTarget)
		switch (origin) {
			case 'utr':
				setInfoContent('Add your UTR id to link up with your UTR account')
				break;
			case 'ntrp':
				setInfoContent(
					<a
						href='https://www.usta.com/content/dam/usta/pdfs/NTRP%20General%20Characteristics.pdf'
						target='_blank'
					>
						{`View the USTA NTPR guidelines here >>`}
					</a>
				)
				break;
			default:
				break;
		}
		setShowInfoModal(!showInfoModal);
	};

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
		//console.log("updateProfilePic", p)
		setProfileImage(player.id, player.image)
		// update the localstorage cache
		//localStorage.setItem(`profile_image_${player.id}`, `${player.image}?dummy=${Math.random()}`)
		//setPlayer(prevState => ({ ...prevState, image: p.image }))
		setUpdatingImage(false)
		// to avoid caching images, set a random number to add to the url
		//setRandomImageNumber(Math.floor(Math.random() * 1000000))
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
		p.ladders = player.ladders
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
				console.log('utr', p.UTR, p.utr_data)
				if(p.UTR) {
					setUtrLink(`https://app.utrsports.net/profiles/${p.UTR}`)
					playerAPI.getPlayerUTR(id).then((utr_obj) => {
						if(utr_obj) {
							console.log(utr_obj)
							setUtrRankSingles(utr_obj.singlesUTR.toFixed(2))
							setUtrRankDoubles(utr_obj.doublesUTR.toFixed(2))
						}
					})
				}
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
						{updatingImage
							? <CircularProgress size={140} />
							:
							<ProfileImage player={player} size={150}
								className={`image ${canEdit ? " cursorHand" : null}`}
								onClick={(e) => { openUserImagePicker(e) }}
							/>
						}
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
											{(player.phone || isEdit) && <AiOutlinePhone />}
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
									<View>Location </View>
									<div>
										{player.location}
											
									</div>
									{/************ NTRP   *************/}
									<View>NTRP <MdOutlineInfo onClick={(e) => { handleIconClick('ntrp', e) }} className='cursorHand' />:</View>
									<div>
										<Flex direction={"row"}>
											<Editable
												text={player.NTRP ?? '-'}
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

											</Editable>
											
										</Flex>
										{/******** POPOVER FOR NTRP AND UTR INFO   *********/}
										<Popover
											onClose={() => setShowInfoModal(false)}
											anchorEl={infoAnchorEl}
											anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
											open={showInfoModal}
										>
											<Typography sx={{ p: 2, backgroundColor: 'info.light' }}>
												{infoContent}
											</Typography>
										</Popover>
									</div>
									{/************ UTR   *************/}
									<View>UTR <MdOutlineInfo onClick={(e) => { handleIconClick('utr', e) }} className='cursorHand' />:</View>
									<Flex direction={"row"}>
										<Editable
											text={
												<Flex direction={"column"} gap={"0"}>
													{!player.UTR ? <div>'Add your UTR id'</div> : ''}
													{utrRankSingles > 0 && <div>Singles: {utrRankSingles}</div>}
													{utrRankDoubles > 0 && <div>Doubles: {utrRankDoubles}</div>}
													{utrLink ? <a target='_blank' href={utrLink}>{`View UTR profile >>`}</a> : ''}
												</Flex>
											}
											isEditing={isEdit}
										>
											<TextField name="UTR" size='small' defaultValue={player.UTR}></TextField>

										</Editable>
										
									</Flex>
									{/************ LADDERS   *************/}
									<View>Ladders:</View>
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
								<Matches player={player} pageSize="10" matchType={enums.MATCH_TYPE.SINGLES} allowDelete={loggedInPlayer?.isAdmin}></Matches>

							</TabItem>
							<TabItem title="Doubles">
								<Matches player={player} pageSize="10" matchType={enums.MATCH_TYPE.DOUBLES} allowDelete={loggedInPlayer?.isAdmin}></Matches>
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

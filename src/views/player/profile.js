import React, { useState, useEffect, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import utrInstructions from '../../images/utr_instructions.png';
import {
	Box,
	Typography,
	Modal,
	CircularProgress,
	LinearProgress,
	Card,
	Tabs,
	Tab,
	Select,
	MenuItem,
	TextField,
	Divider
} from '@mui/material';
import { AiOutlineEdit } from 'react-icons/ai';
import { MdOutlineCancel, MdOutlineCheck, MdOutlineRefresh, MdSportsTennis } from 'react-icons/md';
import { authAPI, playerAPI } from 'api/services/index.js';
import { ProfileImage, ProfileImageContext } from 'components/forms/ProfileImage.js';
import './profile.css';
import { enums, helpers } from 'helpers';
import { AutoCompletePlaces, Editable, InfoPopup, Matches, TopRivals, UnlinkedMatches, UserStats } from 'components/forms';
import { BsHouse } from 'react-icons/bs';
import { useNotificationsContext } from 'contexts/NotificationContext';

function Profile({ isLoggedIn }) {
	const params = useParams();
	const { setProfileImage } = useContext(ProfileImageContext);
	const [tabIndex, setTabIndex] = useState(0);
	const [player, setPlayer] = useState(null);
	const [canEdit, setCanEdit] = useState(false);
	const [isEdit, setIsEdit] = useState(false);
	const [isLoaded, setIsLoaded] = useState(false);
	const [showImagePicker, setShowImagePicker] = useState(false);
	const [updatingImage, setUpdatingImage] = useState(false)
	const [utrLink, setUtrLink] = useState('');
	const [utrRankSingles, setUtrRankSingles] = useState();
	const [utrRankDoubles, setUtrRankDoubles] = useState();
	const [stats, setStats] = useState({})
	const [statsFetched, setStatsFetched] = useState(false);
	const [rivals, setRivals] = useState({})
	const [rivalsFetched, setRivalsFetched] = useState(false);
	const [unLinkedMatches, setUnLinkedMatches] = useState([]);
	const [refreshMatchesCounter, setRefreshMatchesCounter] = useState(0);
	const [highLightedMatch, setHighLightedMatch] = useState(null);
	const [matchTabIndex, setMatchTabIndex] = useState(0);
	const [showUtrRefresh, setShowUtrRefresh] = useState(false)
	const [showUtrRefreshing, setShowUtrRefreshing] = useState(false)
	const [locationData, setLocationData] = useState()
	const [birthyear, setBirthyear] = useState()

	const currentYear = new Date().getFullYear();
	const years = Array.from({ length: currentYear - 1940 + 1 }, (v, i) => currentYear - i - 5);

	const NTRPItems = ["-", "1.5", "2.0", "2.5", "3.0", "3.5", "4.0", "4.5", "5.0", "5.5"]
	const { notificationCount } = useNotificationsContext()

	useEffect(() => {
		async function fetchProfile() {
			setRivals({})
			setRivalsFetched(false)
			setStatsFetched(false)
			setStats({})
			try {
				const sessionPlayer = authAPI.getCurrentUser();
				setCanEdit(false);

				let id = params.userid || sessionPlayer?.id;
				if (!id) throw new Error('No user ID found.');

				const fetchedPlayer = await playerAPI.getPlayer(id);
				setPlayer(fetchedPlayer);
				setBirthyear(fetchedPlayer.birth_year || '')
				setStats(fetchedPlayer.stats)
				setStatsFetched(true)
				setIsLoaded(true);

				if (sessionPlayer && sessionPlayer.email === fetchedPlayer.email) {
					setCanEdit(true);
					setShowUtrRefresh(true)
				}

				if (fetchedPlayer.UTR) {
					setUtrLink(`https://app.utrsports.net/profiles/${fetchedPlayer.UTR}`);
					if (fetchedPlayer.cached_utr) {
						setUtrRankSingles(fetchedPlayer.cached_utr?.singles?.toFixed(2));
						setUtrRankDoubles(fetchedPlayer.cached_utr?.doubles?.toFixed(2));
					}
				}
			} catch (error) {
				console.error(error);
				setIsLoaded(true);
			}
		}

		fetchProfile();
	}, [params.userid]);

	const handleMatchAdded = () => {
		setRefreshMatchesCounter((prev) => prev + 1);
	};

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

	async function updateProfileData() {

		const form = new FormData(document.getElementById('profileForm'))

		const data = {
			id: player.id,
			about: form.get("about"),
			NTRP: form.get("NTPR"),
			UTR: form.get("UTR"),
			phone: player.phone || '',
			lat: locationData?.lat,
			lng: locationData?.lng,
			location: locationData?.location,
			birth_year: form.get("birthyear")
		};

		let p = await playerAPI.updatePlayer(data)
		p.events = player.events
		p.stats = player.statsFetched
		setPlayer(p)
		if (p.cached_utr) {
			setUtrRankSingles(p.cached_utr?.singles?.toFixed(2));
			setUtrRankDoubles(p.cached_utr?.doubles?.toFixed(2));
		}
		else {
			setUtrRankSingles();
			setUtrRankDoubles();
		}
		setIsEdit((isEdit) => !isEdit)
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

	const handleEditToggle = () => setIsEdit(!isEdit);

	const handleImageUpdate = async (e) => {
		try {
			setUpdatingImage(true)
			setShowImagePicker(false);
			const imageFile = e.target.files[0];
			const resizedImage = await helpers.resizeImage(imageFile, 800);
			await playerAPI.updatePlayerImage(player.id, resizedImage);
			setProfileImage(player.id, player.image_urls?.thumbnail);
			setUpdatingImage(false)
		} catch (error) {
			console.error('Error updating image:', error);
		}
	};

	if (!isLoaded) return <LinearProgress />;
	if (!player) return <Typography>Error: Player not found.</Typography>;

	const renderEvents = () => {
		const activeEvents = player.events.active_events
		const archivedEvents = player.events.archived_events
		const renderLink = (event) => {
			return (
				<Box key={'event_' + event.id}>
					<Link to={'/events/' + event.id}>
						{event.name}
					</Link>
				</Box>
			)
		}
		return (
			<Box sx={{ padding: { xs: 1, sm: 2, md: 3 } }}>
				<Typography variant="h6">Active events</Typography>
				{activeEvents.ladder || activeEvents.league || activeEvents.tournament
					?
					<Box>
						<Typography variant="subtitle1" sx={{ pl: 2 }}>Leagues</Typography>
						<Box sx={{ pl: 4 }}>
							{activeEvents.league?.map((e) => renderLink(e))}
							{!activeEvents.league &&
								<Typography variant='body2'>Not currently participating in any leagues</Typography>
							}
						</Box>
						<Typography variant="subtitle1" sx={{ pl: 2 }}>Tournaments</Typography>
						<Box sx={{ pl: 4 }}>
							{activeEvents.tournament?.map((e) => renderLink(e))}
							{!activeEvents.tournament &&
								<Typography variant='body2'>Not currently participating in any tournaments</Typography>
							}
						</Box>
						<Typography variant="subtitle1" sx={{ pl: 2 }}>Ladders</Typography>
						<Box sx={{ pl: 4 }}>
							{activeEvents.ladder?.map((e) => renderLink(e))}
							{!activeEvents.ladder &&
								<Typography variant='body2'>Not currently participating in any ladders</Typography>
							}
						</Box>
					</Box>
					: <Typography variant='subtitle1' sx={{ pl: 2 }}>No active events</Typography>
				}
				<Typography variant="h6" sx={{ pt: 2 }}>Archived events</Typography>
				{archivedEvents.ladder || archivedEvents.league || archivedEvents.tournament
					? <Box>
						<Typography variant="subtitle1" sx={{ pl: 2 }}>Leagues</Typography>
						<Box sx={{ pl: 4 }}>
							{archivedEvents.league?.map((e) => renderLink(e))}
							{!archivedEvents.league &&
								<Typography variant='body2'>No archived leagues</Typography>
							}
						</Box>
						<Typography variant="subtitle1" sx={{ pl: 2 }}>Tournaments</Typography>
						<Box sx={{ pl: 4 }}>
							{archivedEvents.tournament?.map((e) => renderLink(e))}
							{!archivedEvents.tournament &&
								<Typography variant='body2'>No archived tournaments</Typography>
							}
						</Box>
						<Typography variant="subtitle1" sx={{ pl: 2 }}>Ladders</Typography>
						<Box sx={{ pl: 4 }}>
							{archivedEvents.ladder?.map((e) => renderLink(e))}
							{!archivedEvents.ladder &&
								<Typography variant='body2'>No archived ladders</Typography>
							}
						</Box>
					</Box>
					: <Typography variant='subtitle1' sx={{ pl: 2 }}>No archived events</Typography>
				}
			</Box>
		)
	}

	return (
		<Box
			sx={{ display: 'flex', flexDirection: 'column', gap: 2, padding: { xs: 1, sm: 2, md: 3 }, width: '100%', maxWidth: '100%', }}
			as="form"
			id="profileForm">
			{/*********** Profile Header ***********/}
			<Card sx={{
				display: 'flex',
				flexDirection: 'column',
				flexWrap: 'wrap',
				//alignItems: 'center',
				gap: 2,
				maxWidth: '100%',
				padding: { xs: 1, sm: 2, md: 3 },
				position: 'relative',
				width: '100%', maxWidth: '100%', boxSizing: 'border-box'
			}}
			>
				<Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
					{/************ PROFILE PICTURE   *************/}
					{updatingImage
						? <CircularProgress size={140} />
						:
						<ProfileImage player={player} size={150}
							className={`image ${canEdit ? " cursorHand" : null}`}
							onClick={() => canEdit && setShowImagePicker(true)}
						/>
					}
					{ //*********** EDIT ICONS  ***********/
						canEdit && (
							<Box sx={{ position: 'absolute', top: 8, right: 8 }}>
								{isEdit ? (
									<>
										<MdOutlineCheck size={25} className='cursorHand' onClick={updateProfileData} />
										<MdOutlineCancel size={25} className='cursorHand' onClick={handleEditToggle} />
									</>
								) : (
									<AiOutlineEdit size={25} className='cursorHand' onClick={handleEditToggle} />
								)}
							</Box>
						)
					}
					{/************ NAME AND LOCATION   *************/}
					<Box display="flex" flexDirection={'column'} gap={1}>
						{/** Name */}
						<Editable
							isEditing={isEdit}
							text={
								<Typography variant="h5" fontWeight="bold" sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} >
									{player.name}
								</Typography>
							}>
							<TextField name="name" defaultValue={player.name} />
						</Editable>

						{/** birth year */}
						<Editable
							text={birthyear ? <Typography>Born in {birthyear}</Typography> : ''}
							isEditing={isEdit}>
							<Box>
								<Typography>Year I was born:</Typography>
								<TextField
									select
									name="birthyear"
									label="Birth Year"
									value={birthyear ?? ''}
									onChange={(e) => setBirthyear(e.target.value)}
									fullWidth
									sx={{ mb: 3 }} // Add bottom margin to the TextField
								>
									{/* Map over the years array to create MenuItem components */}
									{years.map((year) => (
										<MenuItem key={year} value={year}>
											{year}
										</MenuItem>
									))}
								</TextField>
							</Box>
						</Editable>

						{/** Notifications */}
						{canEdit &&
							<Link to='/notifications/'>
								You have {notificationCount} unread messages
							</Link>
						}

						{/** Location */}
						<Editable
							text={<Typography>{player.location || 'Location Unknown'}</Typography>}
							isEditing={isEdit}
						>
							<AutoCompletePlaces
								onPlaceChanged={(e) => {
									console.log(e.lat, e.lng)
									setLocationData((prev) => ({ ...prev, location: e.location, lat: e.lat, lng: e.lng }));
								}}
								showGetUserLocation={true}
								initialCity={player.location}
							/>
						</Editable>

						{/** About */}
						<Editable
							text={player.about}
							isEditing={isEdit}>
							<Box>
								<Typography>About Me:</Typography>
								<TextField
									multiline
									fullWidth
									rows={4}
									name="about"
									placeholder={'Something about me...'}
									defaultValue={player.about}
								/>
							</Box>
						</Editable>
					</Box>
				</Box>

				{/************ BELOW PROFILE IMAGE  *************/}
				<Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'top', gap: 1, mb: 2, mt: 2 }}>
					{/************ NTRP  *************/}
					<Editable
						text={
							<Typography>
								<MdSportsTennis />
								{` NTRP: ${player.NTRP || 'N/A'}`}
								<InfoPopup paddingLeft={"0.5rem"}>
									<a
										href='https://www.usta.com/content/dam/usta/pdfs/NTRP%20General%20Characteristics.pdf'
										target='_blank'
									>
										{`View the USTA NTPR guidelines here >>`}
									</a>
								</InfoPopup>
							</Typography>
						}
						isEditing={isEdit}
					>
						NTRP: <Select
							name="NTPR"
							size='small'
							defaultValue={player.NTRP ? player.NTRP : '2.0'}
						>
							{NTRPItems.map((x) =>
								<MenuItem key={x} value={x}>{x}</MenuItem>
							)}
						</Select>
					</Editable>
					<Divider orientation='vertical' flexItem />
					{/************ UTR  *************/}
					<Box sx={{ display: 'flex', flexDirection: 'column', gap: 0, }}>
						<Typography>
							<MdSportsTennis /> UTR:
							{canEdit &&
								<InfoPopup paddingLeft={"0.5rem"} >
									Add your UTR ID to link up with your UTR account.<br />
									You can find your ID if you go to your UTR profile page.
									<img src={utrInstructions} alt='UTR Instructions' />
								</InfoPopup>
							}
						</Typography>
						<Editable isEditing={isEdit} text={
							<Box sx={{ ml: '1rem' }}>
								<Typography variant="body2">
									Singles: {showUtrRefreshing ? <CircularProgress size={14} /> : (utrRankSingles > 0 ? utrRankSingles : 'UR')}
									{showUtrRefresh &&
										<MdOutlineRefresh
											style={{ marginLeft: '5px' }}
											title='Refresh your UTR score'
											color="green"
											className='cursorHand'
											onClick={() => updateUTR()} />
									}
								</Typography>
								<Typography variant="body2">
									Doubles: {showUtrRefreshing ? <CircularProgress size={14} /> : (utrRankDoubles > 0 ? utrRankDoubles : 'UR')}
								</Typography>
								{utrLink && (
									<Typography variant="body2">
										<a href={utrLink} target="_blank" rel="noopener noreferrer">
											View UTR Profile &gt;&gt;
										</a>
									</Typography>
								)}
							</Box>
						}>
							<TextField name="UTR" size='small' defaultValue={player.UTR}></TextField>
						</Editable>
					</Box>
					<Divider orientation='vertical' flexItem />
					<Box>
						<Typography>
							<BsHouse /> Clubs:
						</Typography>
						{player.clubs?.map((club) => (
							<Typography key={club.id}>
								<Link to={'/clubs/' + club.id}>{club.name}</Link>
							</Typography>
						))}
					</Box>
					{/* {player.email && (
								<Typography><AiOutlineMail /> <a href={`mailto:${player.email}`}>{player.email}</a></Typography>
							)}
							{player.phone && (
								<Typography><AiOutlinePhone /> {player.phone}</Typography>
							)} 
						*/}
				</Box>
				{/* </Box> */}
			</Card >

			{/*********** Tabs Section ***********/}
			< Card sx={{ maxWidth: '100%', padding: { xs: 1, sm: 2 } }}>
				<Tabs value={tabIndex} onChange={(e, newValue) => setTabIndex(newValue)}
				//orientation={isSmallScreen ? 'vertical' : 'horizontal'}
				>
					<Tab label="Events" />
					<Tab label="Matches" />
					<Tab label="Stats" />
					<Tab label="Rivals" onClick={handleRivalsClick} />
				</Tabs>
				{
					tabIndex === 0 && (
						renderEvents()
					)
				}
				{tabIndex === 1 &&
					<Box sx={{ padding: { xs: 1, sm: 2 } }}>
						<Tabs
							value={matchTabIndex}
							onChange={(e, newValue) => setMatchTabIndex(newValue)}
							sx={{ marginBottom: 2 }}
						>
							<Tab label="Singles" />
							<Tab label="Doubles" />
						</Tabs>
						{matchTabIndex === 0 && (
							<>
								<UnlinkedMatches
									matches={unLinkedMatches}
									player={player}
									handleMatchAdded={handleMatchAdded}
								/>

								<Matches
									originId={player.id}
									originType={'player'}
									matchType={'singles'}
									pageSize={10}
									showAddMatch={true}
									showComments={true}
									showH2H={true}
									callback={(matchdata) => {console.log('new match to profile', matchdata)}}
								// highlightedMatch={highLightedMatch}
								// refreshMatches={refreshMatchesCounter}
								//allowDelete={true}
								//showChallenge={true}
								//isLoggedIn={isLoggedIn}
								/>
							</>
						)}
						{matchTabIndex === 1 && (
							<Matches
								originId={player.id}
								originType={'player'}
								matchType={'doubles'}
								pageSize={10}
								showAddMatch={true}
								showComments={true}
								showH2H={true}
							/>
						)}
					</Box>
				}
				{/************ STATS   *************/}
				{tabIndex === 2 &&
					<UserStats stats={stats} statsFetched={statsFetched} />
				}
				{/************ RIVALS   *************/}
				{tabIndex === 3 &&
					<TopRivals data={rivals} rivalsFetched={rivalsFetched} player={player} paddingTop={10} />
				}

			</Card >

			{/*********** Image Modal ***********/}
			< Modal open={showImagePicker} onClose={() => setShowImagePicker(false)
			}>
				<Box sx={{ overflow: 'auto', maxHeight: '80vh', width: 300, padding: { xs: 1, sm: 2, md: 3 }, margin: 'auto', marginTop: '10%', backgroundColor: 'white' }}>
					<Typography variant="h6">Update Profile Picture</Typography>
					<input
						type="file"
						accept="image/*"
						onChange={handleImageUpdate}
						style={{ display: 'block', marginTop: 16 }}
					/>
				</Box>
			</Modal >
		</Box >
	);
}

export default Profile;

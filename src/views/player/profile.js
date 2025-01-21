import React, { useState, useEffect, Suspense, lazy, useContext } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
	Box,
	Typography,
	Modal,
	CircularProgress,
	LinearProgress,
	Button,
	Card,
	Tabs,
	Tab,
	Grid2 as Grid,
	Divider,
	Select,
	TextField
} from '@mui/material';
import { AiOutlineEdit, AiOutlineMail, AiOutlinePhone, AiOutlineUsergroupAdd } from 'react-icons/ai';
import { MdOutlineCancel, MdOutlineCheck, MdOutlineRefresh } from 'react-icons/md';
import { authAPI, playerAPI } from 'api/services/index.js';
import { ProfileImage, ProfileImageContext } from 'components/forms/ProfileImage.js';
import MyModal from 'components/layout/MyModal.js';
import './profile.css';
import { enums, helpers } from 'helpers';
import { Matches, UnlinkedMatches, UserStats } from 'components/forms';

function Profile({ isLoggedIn }) {
	const params = useParams();
	const navigate = useNavigate();
	const { setProfileImage } = useContext(ProfileImageContext);
	const [tabIndex, setTabIndex] = useState(0);
	const [player, setPlayer] = useState(null);
	const [canEdit, setCanEdit] = useState(false);
	const [isEdit, setIsEdit] = useState(false);
	const [isLoaded, setIsLoaded] = useState(false);
	const [showImagePicker, setShowImagePicker] = useState(false);
	const [utrLink, setUtrLink] = useState('');
	const [utrRankSingles, setUtrRankSingles] = useState();
	const [utrRankDoubles, setUtrRankDoubles] = useState();
	const [stats, setStats] = useState({})
	const [statsFetched, setStatsFetched] = useState(false);
	const [rivals, setRivals] = useState({})
	const [rivalsFetched, setRivalsFetched] = useState(false);
	const [matches, setMatches] = useState([]);
  const [unLinkedMatches, setUnLinkedMatches] = useState([]);
  const [refreshMatchesCounter, setRefreshMatchesCounter] = useState(0);
  const [highLightedMatch, setHighLightedMatch] = useState(null);
  const [matchTabIndex, setMatchTabIndex] = useState(0);

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
				setStats(fetchedPlayer.stats)
				setStatsFetched(true)
				setIsLoaded(true);

				if (sessionPlayer && sessionPlayer.email === fetchedPlayer.email) {
					setCanEdit(true);
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

	const handleEditToggle = () => setIsEdit(!isEdit);

	const handleImageUpdate = async (e) => {
		try {
			setShowImagePicker(false);
			const imageFile = e.target.files[0];
			const resizedImage = await helpers.resizeImage(imageFile, 800);
			await playerAPI.updatePlayerImage(player.id, resizedImage);
			setProfileImage(player.id, player.image);
		} catch (error) {
			console.error('Error updating image:', error);
		}
	};

	if (!isLoaded) return <LinearProgress />;
	if (!player) return <Typography>Error: Player not found.</Typography>;

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, padding: 2 }}>
			{/*********** Profile Header ***********/}
			<Card sx={{ display: 'flex', alignItems: 'center', gap: 2, padding: 2 }}>
				<ProfileImage
					player={player}
					size={150}
					className={`image ${canEdit ? 'cursorHand' : ''}`}
					onClick={() => canEdit && setShowImagePicker(true)}
				/>
				<Box>
					<Typography variant="h5" fontWeight="bold">{player.name}</Typography>
					<Typography>{player.location || 'Location Unknown'}</Typography>
					{player.email && (
						<Typography><AiOutlineMail /> <a href={`mailto:${player.email}`}>{player.email}</a></Typography>
					)}
					{player.phone && (
						<Typography><AiOutlinePhone /> {player.phone}</Typography>
					)}

				</Box>
				{
					canEdit && (
						<Box sx={{ marginLeft: 'auto' }}>
							{isEdit ? (
								<>
									<MdOutlineCheck className='cursorHand' onClick={handleEditToggle} />
									<MdOutlineCancel className='cursorHand' onClick={handleEditToggle} />
								</>
							) : (
								<AiOutlineEdit className='cursorHand' onClick={handleEditToggle} />
							)}
						</Box>
					)
				}
			</Card >

			{/*********** Tabs Section ***********/}
			< Card >
				<Tabs value={tabIndex} onChange={(e, newValue) => setTabIndex(newValue)}>
					<Tab label="General" />
					<Tab label="Stats" />
					<Tab label="Matches" />
				</Tabs>
				{
					tabIndex === 0 && (
						<Box sx={{ padding: 2 }}>
							<Typography variant="h6">About</Typography>
							<Typography>{player.about || 'No details provided.'}</Typography>
						</Box>
					)
				}
				{tabIndex === 1 &&
					<>
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
					</>
				}
				{tabIndex === 2 && 
				<Box sx={{ padding: 2 }}>
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
                  highlightedMatch={highLightedMatch}
                  refreshMatches={refreshMatchesCounter}
                  pageSize={10}
                  matchType={'SINGLES'}
                  allowDelete={true}
                  className="desktop-only"
                  showH2H={true}
                  showChallenge={true}
                  showComments={true}
                  isLoggedIn={isLoggedIn}
                />
              </>
            )}
            {matchTabIndex === 1 && (
              <Matches
                originId={player.id}
                originType={'player'}
                highlightedMatch={highLightedMatch}
                refreshMatches={refreshMatchesCounter}
                pageSize={10}
                matchType={'DOUBLES'}
                allowDelete={true}
                className="desktop-only"
                showH2H={false}
                showChallenge={false}
                showComments={true}
                isLoggedIn={isLoggedIn}
              />
            )}
				</Box>}
			</Card >

			{/*********** Image Modal ***********/}
			< Modal open={showImagePicker} onClose={() => setShowImagePicker(false)
			}>
				<Box sx={{ width: 300, padding: 2, margin: 'auto', marginTop: '10%', backgroundColor: 'white' }}>
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

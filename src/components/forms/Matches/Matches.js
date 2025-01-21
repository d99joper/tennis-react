import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
	Box,
	Pagination,
	CircularProgress,
	Typography,
	Autocomplete,
	TextField,
	useMediaQuery,
} from '@mui/material';
import { authAPI, matchAPI, playerAPI } from 'api/services';
import ResponsiveDataLayout from 'components/layout/Data/responsiveDataLayout';
import { enums, userHelper as uh, userHelper } from 'helpers';
import { GiCrossedSwords } from 'react-icons/gi';
import { GoCommentDiscussion } from 'react-icons/go';
import { MdMoreVert } from 'react-icons/md';
import InfoPopup from '../infoPopup';
import { useTheme } from '@emotion/react';
import MyModal from 'components/layout/MyModal';
import H2H from '../H2H/H2H';
import { Comments } from '../Comments/Comments';
import PlayerNameView from 'views/player/playerNameView';

const Matches = ({
	originType,
	originId,
	matchType='singles',
	pageSize = 10,
	showH2H = false,
	showComments = false,
}) => {
	const [matchesCache, setMatchesCache] = useState({}); // Cache matches by page
	const [pagedMatches, setPagedMatches] = useState([]); // Matches for current page
	const [allMatches, setAllMatches] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [loading, setLoading] = useState(false);
	const [playerSearch, setPlayerSearch] = useState('');
	const [selectedPlayer, setSelectedPlayer] = useState(null);
	const [playerOptions, setPlayerOptions] = useState([]);
	const [isFetchingMore, setIsFetchingMore] = useState(false); // Track infinite scrolling state
	const [pagesLoaded, setPagesLoaded] = useState(new Set()); const [modalContent, setModalContent] = useState(null);
	const [modalTitle, setModalTitle] = useState("");
	const [isModalOpen, setIsModalOpen] = useState(false);
	const currentUser = authAPI.getCurrentUser();

	const openModal = (content, title) => {
		setModalContent(content);
		setModalTitle(title);
		setIsModalOpen(true);
	};

	const theme = useTheme();
	const isLargeScreen = useMediaQuery(theme.breakpoints.up("md"));
	const observer = useRef(null);

	const fetchMatches = useCallback(
		async (page = 1) => {
			if (matchesCache[page]) {
				setPagedMatches(matchesCache[page]);
				return;
			}

			const effectiveSkip = (page - 1) * pageSize;
			setLoading(true);
			try {
				const response = await matchAPI.getMatches(
					originType,
					originId,
					matchType,
					page,
					pageSize,
					effectiveSkip
				);

				setMatchesCache((prev) => ({ ...prev, [page]: response.matches }));
				setPagedMatches(response.matches);
				setAllMatches((prev) => [...prev, ...response.matches]);
				setTotalPages(response.num_pages);
				setPagesLoaded((prev) => new Set(prev).add(page)); // Track the page as loaded
			} catch (error) {
				console.error("Failed to fetch matches:", error);
			} finally {
				setLoading(false);
			}
		},
		[originType, originId, pageSize, matchesCache]
	);

	const fetchPlayerSuggestions = useCallback(
		async (searchTerm) => {
			try {
				const response = await playerAPI.getPlayers({ search: searchTerm });
				setPlayerOptions(response.players);
			} catch (error) {
				console.error('Failed to fetch player suggestions:', error);
			}
		},
		[]
	);

	// Fetch matches on component mount and page change
	useEffect(() => {
		fetchMatches(currentPage);
	}, [fetchMatches, currentPage]);

	// Fetch player suggestions dynamically as the user types
	useEffect(() => {
		if (playerSearch.trim()) {
			fetchPlayerSuggestions(playerSearch);
		} else {
			setPlayerOptions([]);
		}
	}, [playerSearch, fetchPlayerSuggestions]);

	const loadMoreMatches = useCallback(() => {
		if (currentPage < totalPages && !isFetchingMore && !pagesLoaded.has(currentPage + 1)) {
			setIsFetchingMore(true);
			const nextPage = currentPage + 1; // Calculate the next page
			fetchMatches(nextPage).then(() => {
				setCurrentPage(nextPage); // Update the currentPage state
				setIsFetchingMore(false);
			});
		}
	}, [currentPage, totalPages, fetchMatches, isFetchingMore, pagesLoaded]);

	const lastMatchRef = useCallback(
		(node) => {
			if (isLargeScreen) return; // Prevent infinite scrolling on large screens
			if (observer.current) observer.current.disconnect();
			observer.current = new IntersectionObserver((entries) => {
				if (entries[0].isIntersecting && currentPage < totalPages && !isFetchingMore) {
					loadMoreMatches();
				}
			});
			if (node) observer.current.observe(node);
		},
		[loadMoreMatches, currentPage, totalPages, isFetchingMore, isLargeScreen]
	);

	const handlePlayerChange = (event, value) => {
		setSelectedPlayer(value); // Update selected player
		setPagedMatches([]); // Clear matches when filter changes
		setAllMatches([]); // Clear all matches
		setMatchesCache({}); // Clear cache
		setCurrentPage(1); // Reset to the first page
	};

	const handlePageChange = (event, value) => {
		setCurrentPage(value);
	};

	const renderBasicContent = (match) => (
		<Box>
			<Typography variant="body2">
				Score: {match.score}
			</Typography>
		</Box>
	);

	const renderExpandableContent = (match, isSmall, isMedium) => (

		<Box>
			{match.court &&
				<Typography variant="body1">Court: {match.court?.name}</Typography>
			}
			{renderIconData(match)}
		</Box>
	);
	const renderTitleForScreen = (match, isSmall, isMedium) => {
		if (!match) return 'No match data';
		return (
			<Box sx={{ pb: 2 }}>
				<Typography
					variant={isSmall ? "body2" : "body1"}
					sx={{ marginBottom: 1 }}
				>
					{new Date(match.played_on).toISOString().split("T")[0]}

				</Typography>
				<Typography variant="body1" sx={{ fontWeight: "bold", fontSize: isMedium ? "1.2rem" : "1rem" }}>
					{uh.getPlayerNames(match.winners)} vs {uh.getPlayerNames(match.losers)}
				</Typography>
			</Box>
		)
	};


	const renderIconData = (match) => (
		<Box display="flex" justifyContent="flex-end" alignItems="center">
			<Box sx={{ mr: { xs: '0.25rem', md: '0.5rem' } }}>
				{showH2H && (
					<GiCrossedSwords
						size={20}
						className="cursorHand"
						title="Head-to-Head"
						onClick={() => openModal(<H2H winners={match.winners} losers={match.losers} />, "Head-to-Head")}
					/>
				)}
			</Box>
			<Box sx={{ mr: { xs: '0.25rem', md: '0.5rem' } }}>
				{showComments && (
					<GoCommentDiscussion
						size={20}
						className="cursorHand"
						title="Comments"
						onClick={() => openModal(
							<Comments entityId={match.id} entityType='match' />,
							`${uh.getPlayerNames(match.winners)} vs ${uh.getPlayerNames(match.losers)}`
						)}
					/>
				)
				}
			</Box>
			<Box sx={{ mr: { xs: '0.25rem', md: '0.5rem' } }}>
				{match.court &&
					<InfoPopup iconType='custom' size={20} customIcon={<MdMoreVert />}>
						Court: {match.court.name}
					</InfoPopup>
				}
			</Box>
		</Box>
	);

	const isCurrentUser = (player) => {return originType==='player' && player.id === currentUser.id}
	const getRowData = (row) => [
		row.played_on,
		matchType === enums.MATCH_TYPE.SINGLES
			? <PlayerNameView player={row.winners[0]} asLink={!isCurrentUser(row.winners[0])} />
			: userHelper.getPlayerNames(row.losers) || 'N/A',
			matchType === enums.MATCH_TYPE.SINGLES
			? <PlayerNameView player={row.losers[0]} asLink={!isCurrentUser(row.losers[0])} />
			: userHelper.getPlayerNames(row.losers) || 'N/A',
		row.score,
		renderIconData(row)
	];

	return (
		<Box>
			{/* Player Search */}
			<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
				<Typography variant="h6">Matches</Typography>
				<Autocomplete
					options={playerOptions}
					getOptionLabel={(option) => option.name}
					onInputChange={(event, value) => setPlayerSearch(value)} // Search as user types
					onChange={handlePlayerChange} // Set selected player
					value={selectedPlayer}
					renderInput={(params) => (
						<TextField {...params} label="Search Player" placeholder="Type a player's name" />
					)}
					sx={{ width: 300 }}
				/>
			</Box>

			<ResponsiveDataLayout
				headers={[
					{ label: 'Date', accessor: 'played_on' },
					{ label: 'Winner', accessor: 'winners[0].name' },
					{ label: 'Loser', accessor: 'losers[0].name' },
					{ label: 'Score', accessor: 'score' },
					{ label: '', accessor: 'actions' },
				]}
				rows={isLargeScreen ? pagedMatches : allMatches}
				rowKey={(match) => match.id}
				getRowData={getRowData}
				sortableColumns={['played_on']}
				onSort={() => { alert('should sort') }}
				titleForScreen={renderTitleForScreen} // Always pass a function
				basicContentForScreen={renderBasicContent} // Always pass a function
				expandableContentForScreen={renderExpandableContent}
				loading={loading}
			/>

			{!loading && currentPage < totalPages && !pagesLoaded.has(currentPage + 1) && (
				<Box ref={lastMatchRef} sx={{ textAlign: 'center', py: 2 }}>
					{isFetchingMore ? <CircularProgress /> : <Typography>Scroll to load more</Typography>}
				</Box>
			)}

			{!loading && allMatches.length === 0 && <Typography>No matches found.</Typography>}

			{isLargeScreen && (
				<Pagination
					count={totalPages}
					page={currentPage}
					onChange={handlePageChange}
					sx={{ mt: 2 }}
				/>
			)}
			{!isLargeScreen && (
				<Box ref={lastMatchRef} sx={{ textAlign: "center", py: 2 }}>
					{loading && <CircularProgress />}
				</Box>
			)}

			<MyModal
				showHide={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				title={modalTitle}
			>
				{modalContent}
			</MyModal>

		</Box>
	);
};

export default Matches;

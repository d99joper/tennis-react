import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  Box,
  Pagination,
  CircularProgress,
  Typography,
  useMediaQuery,
  Badge,
  Button,
} from '@mui/material';
import { authAPI, matchAPI } from 'api/services';
import ResponsiveDataLayout from 'components/layout/Data/responsiveDataLayout';
import { enums, userHelper as uh, userHelper } from 'helpers';
import { GiCrossedSwords, GiTennisCourt } from 'react-icons/gi';
import { GoCommentDiscussion } from 'react-icons/go';
import InfoPopup from '../infoPopup';
import { useTheme } from '@emotion/react';
import MyModal from 'components/layout/MyModal';
import H2H from '../H2H/H2H';
import { Comments } from '../Comments/Comments';
import PlayerSearch from '../Player/playerSearch';
import GetParticipants from '../Event/getParticipants';
import MatchEditor from '../MatchEditor/MatchEditor';
import useComponentWidth from 'helpers/useComponentWidth';
import { ProfileImage } from '../ProfileImage';
import MatchFilters from './MatchFilters';
import { useParams, useSearchParams } from 'react-router-dom';

const Matches = ({
  originType,
  originId,
  matchType = 'singles',
  pageSize = 10,
  showFilterByPlayer = true,
  showFilterByDivision = false,
  divisions = [], // New prop for divisions
  showAsSmallScreen = false,
  showH2H = false,
  showComments = false,
  showAddMatch = false,
  refresh=0,
  callback,
}) => {
  const [matchesCache, setMatchesCache] = useState({}); // Cache matches by page
  const [pagedMatches, setPagedMatches] = useState([]); // Matches for current page
  const [allMatches, setAllMatches] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [searchParams] = useSearchParams();
  const division_id_from_url = searchParams.get('division');
  
  // Initialize selectedDivisionId immediately with URL param value
  const [selectedDivisionId, setSelectedDivisionId] = useState(() => {
    if (divisions && division_id_from_url) {
      return divisions[division_id_from_url]?.id || '';
    }
    return '';
  });
  
  const [isFetchingMore, setIsFetchingMore] = useState(false); // Track infinite scrolling state
  const [pagesLoaded, setPagesLoaded] = useState(new Set());
  const [modalContent, setModalContent] = useState(null);
  const [modalTitle, setModalTitle] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const currentUser = authAPI.getCurrentUser();

  const openModal = (content, title) => {
    console.log(title)
    setModalContent(content);
    setModalTitle(title);
    setIsModalOpen(true);
  };

  // Simplified effect - only update if URL param changes after initial load
  useEffect(() => {
    if (divisions && division_id_from_url) {
      const newDivisionId = divisions[division_id_from_url]?.id || '';
      if (newDivisionId !== selectedDivisionId) {
        setSelectedDivisionId(newDivisionId);
      }
    }
  }, [division_id_from_url, divisions, selectedDivisionId]);

  const theme = useTheme();
  const [ref, width] = useComponentWidth();
  //console.log("Component width:", width, "sm breakpoint:", theme.breakpoints.values.sm);

  const isLargeScreen = width > 0 && width >= theme.breakpoints.values.sm;

  const observer = useRef(null);

  const fetchMatches = useCallback(
    async (page = 1) => {
      const effectiveSkip = (page - 1) * pageSize;
      setLoading(true);
      
      try {
        const filter = {
          ...originType ? { "origin-type": originType } : {},
          ...originId ? { "origin-id": originId } : {},
          ...matchType ? { "match-type": matchType } : {},
          ...selectedPlayers.length > 0 ? { "player-ids": selectedPlayers.map(p => p.id).join(',') } : {},
          ...selectedDivisionId ? { "division": selectedDivisionId } : {}
        };
        
        const response = await matchAPI.getMatches(filter, page, pageSize, effectiveSkip);

        setMatchesCache((prev) => ({
          originId,
          pages: { 
            ...(prev.originId === originId ? prev.pages : {}),
            [page]: response.matches 
          }
        }));
        
        setPagedMatches(response.matches);
        setAllMatches((prev) => {
          const newMatches = [...prev, ...response.matches];
          return Array.from(new Map(newMatches.map(m => [m.id, m])).values());
        });
        setTotalPages(response.num_pages);
        setPagesLoaded((prev) => new Set(prev).add(page));
      } catch (error) {
        console.error("Failed to fetch matches:", error);
      } finally {
        setLoading(false);
      }
    },
    [originType, originId, pageSize, refresh, selectedPlayers, selectedDivisionId]
  );

  // Effect to handle cache clearing when originId changes
  useEffect(() => {
    if (matchesCache.originId && matchesCache.originId !== originId) {
      setMatchesCache({ originId, pages: {} });
      setAllMatches([]);
      setPagesLoaded(new Set());
      setCurrentPage(1); // Reset to page 1 when origin changes
    }
  }, [originId, matchesCache.originId]);

  // Effect to handle fetching data
  useEffect(() => {
    // Check if we have cached data first
    if (matchesCache.originId === originId && matchesCache.pages?.[currentPage]) {
      setPagedMatches(matchesCache.pages[currentPage]);
      return;
    }
    
    // Fetch new data
    fetchMatches(currentPage);
  }, [fetchMatches, currentPage, originId]);

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

  const handlePlayerChange = (player) => {
    if (!player)
      setSelectedPlayers([])
    else
      setSelectedPlayers(Array.isArray(player) ? player : [player]); // Update selected player
    setPagedMatches([]); // Clear matches when filter changes
    setAllMatches([]); // Clear all matches
    setMatchesCache({}); // Clear cache
    setCurrentPage(1); // Reset to the first page
  };

  const handleDivisionChange = (divisionId) => {
    setSelectedDivisionId(divisionId || ''); // Update selected division
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
          <Badge badgeContent={match.comment_count}>
            <GoCommentDiscussion
              size={20}
              className="cursorHand"
              title="Comments"
              onClick={() => openModal(
                <Comments entityId={match.id} entityType='match' />,
                `${uh.getPlayerNamesString(match.winners)} vs ${uh.getPlayerNamesString(match.losers)}`
              )}
            />
          </Badge>
        )
        }
      </Box>
      <Box sx={{ mr: { xs: '0.25rem', md: '0.5rem' } }}>
        {match.court &&
          <InfoPopup iconType='custom' size={20} customIcon={<GiTennisCourt />}>
            Court: {match.court.name}
          </InfoPopup>
        }
      </Box>
    </Box>
  );

  const getRowData = (row) => {
    //console.log(row)
    return [
      row.played_on,
      <Box sx={{
        display: 'table', // Ensures Box behaves like a centered block
        margin: 'auto', // Centers the Box inside the <td>
        textAlign: 'left', // Aligns text inside the Box to the left
      }}>
        <Box sx={{ alignItems: 'flex-start', alignSelf: 'center', width: 'fit-content', display: 'flex', flexDirection: 'column' }}>
          {row.match_type?.toLowerCase() === enums.MATCH_TYPE.SINGLES.toLowerCase()
            ? <ProfileImage player={row.winners[0]} showName={true} asLink={originId !== row.winners[0].id} size={30} />
            : row.winners.map(p => (
              <ProfileImage player={p} showName={true} asLink={originId !== p.id} key={p.id} size={30} />
            ))
          }
        </Box>
      </Box>
      ,

      <Box sx={{
        display: 'table', // Ensures Box behaves like a centered block
        margin: 'auto', // Centers the Box inside the <td>
        textAlign: 'left', // Aligns text inside the Box to the left
      }}>
        <Box sx={{ alignItems: 'flex-start', alignSelf: 'center', width: 'fit-content', display: 'flex', flexDirection: 'column' }}>
          {row.match_type?.toLowerCase() === enums.MATCH_TYPE.SINGLES.toLowerCase()
            ? <ProfileImage player={row.losers[0]} showName={true} asLink={originId !== row.losers[0].id} size={30} />
            : row.losers.map(p => (
              <ProfileImage key={p.id} player={p} showName={true} asLink={originId !== p.id} size={30} />
            ))
          }
        </Box></Box>,
      row.score + (row.retired ? ' ret.' : ''),
      renderIconData(row)
    ]
  };

  return (
    <Box ref={ref}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2, gap: 2, flexDirection: 'column' }} >
        {showAddMatch && (
          <Box sx={{ width: '100%' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => openModal(
                <MatchEditor
                  participant={currentUser}
                  originType={originType}
                  originId={originId}
                  matchType={matchType}
                  onSubmit={(matchData) => {
                    console.log("Match reported:", matchData);
                    let matches = isLargeScreen ? pagedMatches : allMatches;
                    matches.push(matchData.match);
                    matches.sort((a, b) => new Date(b.played_on) - new Date(a.played_on));
                    if (isLargeScreen) {
                      setPagedMatches(matches)
                    } else {
                      setAllMatches(matches)
                    }
                    if (callback) {
                      callback(matchData)
                    }
                    //handleMatchEditorSubmit(matchData);
                    setIsModalOpen(false);
                  }}
                />,
                "Add match"
              )} // Show wizard editor
              sx={{ mb: 2 }}
            >
              Add Match
            </Button>
          </Box>
        )}
        
        {/* Filter Controls */}
        <MatchFilters
          originType={originType}
          originId={originId}
          divisions={divisions}
          selectedPlayers={selectedPlayers}
          selectedDivisionId={selectedDivisionId}
          onPlayerChange={handlePlayerChange}
          onDivisionChange={handleDivisionChange}
          showFilterByPlayer={showFilterByPlayer}
          showFilterByDivision={showFilterByDivision}
          fromProfileId={originType?.toLowerCase() === 'player' ? originId : null}
        />
      </Box>

      <ResponsiveDataLayout
        headers={[
          { label: 'Date', key: 'played_on' },
          { label: 'Winner', key: 'winners[0].name' },
          { label: 'Loser', key: 'losers[0].name' },
          { label: 'Score', key: 'score' },
          { label: '', key: 'actions' },
        ]}
        rows={isLargeScreen ? pagedMatches : allMatches}
        rowKey={(match) => match.id}
        getRowData={getRowData}
        sortableColumns={['played_on']}
        titleForScreen={renderTitleForScreen} // Always pass a function
        basicContentForScreen={renderBasicContent} // Always pass a function
        expandableContentForScreen={renderExpandableContent}
        loading={loading}
      />

      {!loading && currentPage < totalPages && !isLargeScreen && !pagesLoaded.has(currentPage + 1) && (
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

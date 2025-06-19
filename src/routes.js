import {
  Routes,
  Route,
  useLocation
} from 'react-router-dom';
import React, { lazy, Suspense, useContext, useRef } from 'react';
import Registration from 'views/Auth/registration';
import Header from 'components/layout/header';
import { Box, LinearProgress } from '@mui/material';
import Footer from 'components/layout/footer';
import { Home, AboutPage, ClubViewPage, EventView, FAQPage, LeagueViewPage, PlayersLandingPage, Profile, ProfileNew, RulesPage, SearchPage, Login } from './views/index'
import NotificationsView from 'views/NotificationsView';
import { AuthContext } from 'contexts/AuthContext';
import ForgotPassword from 'views/Auth/forgotpassword';
import ResetPassword from 'views/Auth/resetpassword';
import DTCLeagueInfoPage from 'views/Temp/DTCLeagueInfo';

// const Profile = lazy(() => import('./views/profile'))
const ProfileInfo = lazy(() => import('./views/player/profile-information'))
const UserConfirmation = lazy(() => import('./views/Auth/user-confirmation'))
const UserMerge = lazy(() => import('./views/Auth/user-merge'))
const LadderCreate = lazy(() => import('./views/ladder/create'))
const LadderSearch = lazy(() => import('./views/ladder/search'))
const LadderView = lazy(() => import('./views/ladder/view'))
const CourtsCreate = lazy(() => import('./components/forms/Courts/create'))
const CourtsLanding = lazy(() => import('./views/court/courtsLanding'))
const CourtView = lazy(() => import('./views/court/courtView'))
const ClubsLandingPage = lazy(() => import('./views/club/clubsLanding'))
const EventsLandingPage = lazy(() => import('./views/event/eventsLanding'))
const NoPage = lazy(() => import('./views/NoPage'))
const AdminTasks = lazy(() => import('./views/adminTasks'))
const PrivacyPolicyPage = lazy(() => import('./views/privacyPolicyPage'))
const TermsOfServicePage = lazy(() => import('./views/termsOfServicePage'))
const LeagueCreate = lazy(() => import('./components/forms/League/create'))
const preloadPage = (page) => page().then((module) => module.default);



// preloadPage(() => import('./views/about'));
// preloadPage(() => import('./views/profile'));
// preloadPage(() => import('./views/faq'));
// preloadPage(() => import('./views/rules'));
// preloadPage(() => import('./views/searchPage'));

const MyRouter = (props) => {
  const location = useLocation()
  const { isLoggedIn, user } = useContext(AuthContext)
  const homeDataRef = useRef(null);

  // useEffect(() => {
  //   navigate(props.navigateTo)
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [props.navigateTo])

  function showHeaderOrFooter(path) {
    switch (path) {
      case '/privacy-policy':
        return false
      case '/terms-of-service':
        return false
      default:
        return true
    }
  }
  const MemoizedHeader = React.memo(Header);
  const MemoizedFooter = React.memo(Footer);

  return (
    <Suspense fallback={<LinearProgress size="large" />}>
      <MemoizedHeader
        show={showHeaderOrFooter(location.pathname)}
        isLoggedIn={isLoggedIn}
        //currentUser={props.currentUser}
        currentUser={user}
      />

      <Box component="main" className='content'
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem',
          //backgroundColor: 'blueviolet',
          flexGrow: 1, p: 3,
          transition: 'flex-grow 0.2s ease',
          overflowX: 'hidden', // Hide overflowing content
        }}
      >
        <Routes key="MyMainRoutes">
          <Route exact path="/" element={<Home homeDataRef={homeDataRef} />} />
          <Route exact path="/about" element={<AboutPage  />} />
          <Route exact path="/faq" element={<FAQPage />} />
          <Route exact path="/rules" element={<RulesPage />} />
          <Route exact path="/search" element={<SearchPage />} />
          <Route path="/profile/:userid" element={<ProfileNew />} />
          <Route path="/players" element={<PlayersLandingPage />} />
          <Route path="/players/:userid" element={<Profile />} />
          <Route path="/profile-information" element={<ProfileInfo  />} />
          <Route path='/notifications' element={<NotificationsView />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/user-confirmation/:userid/:key" element={<UserConfirmation />} />
          <Route path="/user-merge/:userid/:mergeId/:key" element={<UserMerge />} />
          <Route path="/terms-of-service" element={<TermsOfServicePage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/adminTasks" element={<AdminTasks />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/temp/DTC-league-info" element={<DTCLeagueInfoPage />} />
          <Route path='/clubs'>
            <Route index={true} element={<ClubsLandingPage />} />
            <Route path=":clubId" element={<ClubViewPage />} />
          </Route>
          <Route path='/courts'>
            <Route index={true} element={<CourtsLanding {...props} />} />
            <Route path=":courtsId" element={<CourtView {...props} />} />
            <Route path="new" element={<CourtsCreate {...props} />} />
          </Route>
          <Route path="ladders">
            <Route index={true} element={<LadderView isLoggedIn={isLoggedIn} currentUser={user} />} />
            <Route path=":ladderId" element={<LadderView isLoggedIn={isLoggedIn} currentUser={user} />} />
            <Route path="search" element={<LadderSearch isLoggedIn={isLoggedIn} />} />
            <Route path="new" element={<LadderCreate isLoggedIn={isLoggedIn} />} />
            {/* <Route index element={<Home />} /> */}
          </Route>
          <Route path='league'>
            <Route path=":id" element={<LeagueViewPage isLoggedIn={isLoggedIn} />} />
            <Route path="create" element={<LeagueCreate isLoggedIn={isLoggedIn} />} />
          </Route>
          <Route path='events'>
            <Route index={true} element={<EventsLandingPage {...props} />} />
            <Route path=":id" element={<EventView isLoggedIn={isLoggedIn} />} />
            <Route path="create" element={<LeagueCreate isLoggedIn={isLoggedIn} />} />
          </Route>
          <Route path="*" element={<NoPage />} />
        </Routes>
        {showHeaderOrFooter(location.pathname) ? <MemoizedFooter /> : null}
      </Box>
    </Suspense>
  )
};

export default MyRouter;
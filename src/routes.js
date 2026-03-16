import {
  Routes,
  Route,
  useLocation
} from 'react-router-dom';
import React, { lazy, Suspense, useContext, useRef } from 'react';
import Registration from 'features/auth/pages/registration';
import Header from 'shared/components/layout/header';
import ChunkErrorBoundary from 'shared/components/layout/ChunkErrorBoundary';
import { Box, LinearProgress } from '@mui/material';
import Footer from 'shared/components/layout/footer';
import { Home, AboutPage, ClubViewPage, EventView, FAQPage, LeagueViewPage, PlayersLandingPage, Profile, RulesPage, SearchPage, Login } from './views/index'
import NotificationsView from 'views/NotificationsView';
import { AuthContext } from 'contexts/AuthContext';
import ForgotPassword from 'features/auth/pages/forgotpassword';
import ResetPassword from 'features/auth/pages/resetpassword';
import DTCLeagueInfoPage from 'views/Temp/DTCLeagueInfo';
import TournamentViewPage from 'features/tournament/pages/tournamentView';
import TournamentCreate from 'features/tournament/components/createTournament';

// const Profile = lazy(() => import('./views/profile'))
const ProfileInfo = lazy(() => import('features/player/pages/profile-information'))
const UserConfirmation = lazy(() => import('features/auth/pages/user-confirmation'))
const UserMerge = lazy(() => import('features/auth/pages/user-merge'))
const LadderCreate = lazy(() => import('features/ladder/pages/create'))
const LadderSearch = lazy(() => import('features/ladder/pages/search'))
const LadderView = lazy(() => import('features/ladder/pages/view'))
const CourtsCreate = lazy(() => import('features/court/components/create'))
const CourtsLanding = lazy(() => import('features/court/pages/courtsLanding'))
const CourtView = lazy(() => import('features/court/pages/courtView'))
const ClubsLandingPage = lazy(() => import('features/club/pages/clubsLanding'))
const EventsLandingPage = lazy(() => import('features/event/pages/eventsLanding'))
const NoPage = lazy(() => import('./views/NoPage'))
const AdminTasks = lazy(() => import('./views/adminTasks'))
const PrivacyPolicyPage = lazy(() => import('./views/privacyPolicyPage'))
const TermsOfServicePage = lazy(() => import('./views/termsOfServicePage'))
const LeagueCreate = lazy(() => import('features/league/components/create'))
const MarketplaceCheckout = React.lazy(() => import('features/stripe/pages/MarketplaceCheckout'));
const PaymentComplete = React.lazy(() => import('features/stripe/pages/PaymentComplete'));
const StripeConnectReturn = React.lazy(() => import('features/stripe/pages/StripeConnectReturn'));
const StripeOAuthCallback = React.lazy(() => import('features/stripe/pages/StripeOAuthCallback'));
const ThemeSelector = React.lazy(() => import('views/ThemeSelector'));
const SubscriptionPage = React.lazy(() => import('views/subscription'));
const preloadPage = (page) => page().then((module) => module.default);



// preloadPage(() => import('./views/about'));
// preloadPage(() => import('./views/profile'));
// preloadPage(() => import('./views/faq'));
// preloadPage(() => import('./views/rules'));
// preloadPage(() => import('./views/searchPage'));

const MyRouter = (props) => {
  const location = useLocation()
  const { isLoggedIn, user, authReady } = useContext(AuthContext)
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
      case '/stripe/connect/return':
        return false
      default:
        return true
    }
  }
  const MemoizedHeader = React.memo(Header);
  const MemoizedFooter = React.memo(Footer);

  return (
    <ChunkErrorBoundary>
    <Suspense fallback={<LinearProgress size="large" />}>
      {!authReady ? (
        <LinearProgress size="large" />
      ) : (
        <>
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
              {/* <Route path="/profile/:userid" element={<ProfileNew />} /> */}
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
              <Route path='tournament'>
                <Route path=":id" element={<TournamentViewPage isLoggedIn={isLoggedIn} />} />
                <Route path="create" element={<TournamentCreate isLoggedIn={isLoggedIn} />} />
              </Route>
              <Route path='events'>
                <Route index={true} element={<EventsLandingPage {...props} />} />
                <Route path=":id" element={<EventView isLoggedIn={isLoggedIn} />} />
                <Route path="create" element={<LeagueCreate isLoggedIn={isLoggedIn} />} />
              </Route>
              <Route path="/checkout/:billableItemId" element={<MarketplaceCheckout />} />
              <Route path="/payments/complete" element={<PaymentComplete />} />
              <Route path="/stripe/connect/return" element={<StripeConnectReturn />} />
              <Route path="/stripe/oauth/callback" element={<StripeOAuthCallback />} />
              <Route path="/subscription" element={<SubscriptionPage />} />
              <Route path="/theme-selector" element={<ThemeSelector />} />
              <Route path="*" element={<NoPage />} />
            </Routes>
            {showHeaderOrFooter(location.pathname) ? <MemoizedFooter /> : null}
          </Box>
        </>
      )}

    </Suspense>
    </ChunkErrorBoundary>
  )
};

export default MyRouter;
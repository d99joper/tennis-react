import {
  Routes,
  Route,
  useLocation
} from 'react-router-dom';
import { LinearProgress } from '@mui/joy';
import React, { lazy, useEffect, Suspense } from 'react';
import { useNavigate } from "react-router-dom";
import Registration from 'views/Auth/registration';
import Header from 'components/layout/header';
import { Box } from '@mui/material';
import Footer from 'components/layout/footer';
import {AboutPage, ClubViewPage, FAQPage, LeagueViewPage, Profile, RulesPage, SearchPage, Login} from './views/index'

// const Profile = lazy(() => import('./views/profile'))
const ProfileInfo = lazy(() => import('./views/profile-information'))
const UserConfirmation = lazy(() => import('./views/Auth/user-confirmation'))
const UserMerge = lazy(() => import('./views/Auth/user-merge'))
const LadderCreate = lazy(() => import('./views/ladder/create'))
const LadderSearch = lazy(() => import('./views/ladder/search'))
const LadderView = lazy(() => import('./views/ladder/view'))
const CourtsCreate = lazy(() => import('./views/court/create'))
const CourtsView = lazy(() => import('./views/court/view'))
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

  let navigate = useNavigate()
  const location = useLocation()

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
        isLoggedIn={props.isLoggedIn} 
        currentUser={props.currentUser}
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
        }}>
        <Routes key="MyMainRoutes">
          <Route exact path="/" element={<AboutPage isLoggedIn={props.isLoggedIn} />} />
          <Route exact path="/about" element={<AboutPage isLoggedIn={props.isLoggedIn} />} />
          <Route exact path="/faq" element={<FAQPage />} />
          <Route exact path="/rules" element={<RulesPage />} />
          <Route exact path="/search" element={<SearchPage />} />
          <Route path="/profile" element={<Profile isLoggedIn={props.isLoggedIn} currentUser={props.currentUser} />} />
          <Route path="/profile/:userid" element={<Profile isLoggedIn={props.isLoggedIn} currentUser={props.currentUser} />} />
          <Route path="/profile-information" element={<ProfileInfo isLoggedIn={props.isLoggedIn} currentUser={props.currentUser} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/user-confirmation/:userid/:key" element={<UserConfirmation />} />
          <Route path="/user-merge/:userid/:mergeId/:key" element={<UserMerge />} />
          <Route path="/terms-of-service" element={<TermsOfServicePage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/adminTasks" element={<AdminTasks />} />
          <Route path='/clubs'>
            <Route path=":clubId" element={<ClubViewPage />} />
          </Route>
          <Route path='/courts'>
            <Route index={true} element={<CourtsView {...props } />} />
            <Route path="new" element={<CourtsCreate {...props} />} />
          </Route>
          <Route path="ladders">
            <Route index={true} element={<LadderView isLoggedIn={props.isLoggedIn} currentUser={props.currentUser} />} />
            <Route path=":ladderId" element={<LadderView isLoggedIn={props.isLoggedIn} currentUser={props.currentUser} />} />
            <Route path="search" element={<LadderSearch isLoggedIn={props.isLoggedIn} />} />
            <Route path="new" element={<LadderCreate isLoggedIn={props.isLoggedIn} />} />
            {/* <Route index element={<Home />} /> */}
          </Route>
          <Route path='league'>
            <Route path=":id" element={<LeagueViewPage isLoggedIn={props.isLoggedIn} />} />
            <Route path="create" element={<LeagueCreate isLoggedIn={props.isLoggedIn} />} />
          </Route>
          <Route path="*" element={<NoPage />} />
        </Routes>
        {showHeaderOrFooter(location.pathname) ? <MemoizedFooter /> : null}
      </Box>
    </Suspense>
  )
};

export default MyRouter;
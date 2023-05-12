import {
  Routes,
  Route,
  useLocation
} from 'react-router-dom';
import { Heading, Loader } from '@aws-amplify/ui-react';
import Login from './views/login'
import MyMenu from './components/layout/menu';
import { lazy, useEffect } from 'react';
import { Suspense } from 'react';
import { Breadcrumbs, Typography } from '@mui/material';
import { useNavigate } from "react-router-dom";

const Profile = lazy(() => import('./views/profile'))
const LadderView = lazy(() => import('./views/ladder/view'))
const LadderSearch = lazy(() => import('./views/ladder/search'))
const NoPage = lazy(() => import('./views/NoPage'))
const AdminTasks = lazy(() => import('./views/adminTasks'))
const LadderCreate = lazy(() => import('./views/ladder/create'))
const AboutPage = lazy(() => import('./views/about'))
const FAQPage = lazy(() => import('./views/faq'))
const RulesPage = lazy(() => import('./views/rules'))
const SearchPage = lazy(() => import('./views/searchPage'))

const MyRouter = (props) => {
  
  const location = useLocation()
  const pathnames = location.pathname.split('/').filter((x) => x);
  let navigate = useNavigate()

  useEffect(() => {
    navigate(props.navigateTo)
  }, [props.navigateTo])

  return (
    <>
    {/* <BrowserRouter key="MyMainBrowserRouter"> */}
      <header>
        <MyMenu {...props} />
        <Breadcrumbs>
          {pathnames.map((elem, index) => {
            return (
              <Typography key={`${elem}_${index}`}>{elem}</Typography>
            )
          })}
        </Breadcrumbs>
        {/* <Navbar useMenu={MyMenu} isLoggedIn={props.isLoggedIn} testing={props.testing} key="myNavbar" /> */}
      </header>
      <div className='Content'>
        <Suspense fallback={<h2><Loader/>Loading...</h2>}>
          <Routes key="MyMainRoutes">
            <Route exact path="/" element={<AboutPage />} />
            <Route exact path="/about" element={<AboutPage isLoggedIn={props.isLoggedIn} />} />
            <Route exact path="/faq" element={<FAQPage />} />
            <Route exact path="/rules" element={<RulesPage />} />
            <Route exact path="/search" element={<SearchPage />} />
            <Route path="/profile" element={<Profile isLoggedIn={props.isLoggedIn} currentUser={props.currentUser} />} />
            <Route path="/profile/:userid" element={<Profile isLoggedIn={props.isLoggedIn} currentUser={props.currentUser} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/adminTasks" element={<AdminTasks />} />
            <Route path="ladders">
              <Route index={true} element={<LadderView isLoggedIn={props.isLoggedIn} currentUser={props.currentUser} />} />
              <Route path=":ladderId" element={<LadderView isLoggedIn={props.isLoggedIn} currentUser={props.currentUser} />} />
              <Route path="search" element={<LadderSearch isLoggedIn={props.isLoggedIn} />} />
              <Route path="new" element={<LadderCreate isLoggedIn={props.isLoggedIn} />} />
              {/* <Route index element={<Home />} /> */}
            </Route>
            <Route path="*" element={<NoPage />} />
          </Routes>
        </Suspense>
      </div>
    {/* </BrowserRouter> */}
    </>
  )
};

export default MyRouter;
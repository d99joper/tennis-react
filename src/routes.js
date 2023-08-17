import {
  Routes,
  Route
} from 'react-router-dom';
import { Loader } from '@aws-amplify/ui-react';
import Login from './views/login'
import { lazy, useEffect } from 'react';
import { Suspense } from 'react';
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

  let navigate = useNavigate()

  useEffect(() => {
    navigate(props.navigateTo)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.navigateTo])

  return (
    <Suspense fallback={<h2><Loader />Loading...</h2>}>
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
  )
};

export default MyRouter;
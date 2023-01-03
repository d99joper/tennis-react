import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom';
import { Heading, Loader } from '@aws-amplify/ui-react';
import Login from './views/login'
import Navbar from './components/layout/navbar';
import MyMenu from './components/layout/menu';
import { lazy } from 'react';
import { Suspense } from 'react';

function Home() {
  return <Heading level={2}>Home</Heading>;
};

function About() {
  return <Heading level={2}>About</Heading>;
};

const Profile = lazy(() => import('./views/profile'))
const LadderView = lazy(() => import('./views/ladderView'))
const NoPage = lazy(() => import('./views/NoPage'))

const MyRouter = (props) => {
  return (
    <BrowserRouter key="MyMainBrowserRouter">
      <header>
        <Navbar useMenu={MyMenu} isLoggedIn={props.isLoggedIn} testing={props.testing} key="myNavbar" />
      </header>
      <div className='Content'>
        <Suspense fallback={<h2><Loader/>Loading...</h2>}>
          <Routes key="MyMainRoutes">
            <Route exact path="/" element={<Home />} />
            <Route exact path="/about" element={<About />} />
            <Route path="/profile" element={<Profile isLoggedIn={props.isLoggedIn} />} />
            <Route path="/profile/:userid" element={<Profile isLoggedIn={props.isLoggedIn} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/ladders" element={<LadderView />} >
              <Route path=":ladderId" element={<LadderView />} />
              <Route path="new" element={<Home />} />
              <Route index element={<Home />} />
            </Route>
            <Route path="*" element={<NoPage />} />
          </Routes>
        </Suspense>
      </div>
    </BrowserRouter>
  )
};

export default MyRouter;
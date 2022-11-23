import {
    BrowserRouter,
    Routes,
    Route
  } from 'react-router-dom';
import { Heading } from '@aws-amplify/ui-react';
import Login from './views/login'
import Profile from './views/profile'
import LadderView from './views/ladderView'
// import Ladder from './views/ladder'
import NoPage from './views/NoPage'
import AuthTest from './views/authTest'
import Navbar from './components/layout/navbar';
import MyMenu from './components/layout/menu';

function Home() {
  return <Heading level={2}>Home</Heading>;
};

function About() {
  return <Heading level={2}>About</Heading>;
};

const MyRouter = (props) => {
  return (
    <BrowserRouter key="MyMainBrowserRouter">
      <header>
        <Navbar useMenu={MyMenu} isLoggedIn={props.isLoggedIn} testing={props.testing} key="myNavbar"/>
      </header>
      <div className='Content'>
        <Routes key="MyMainRoutes">
            <Route exact path="/"  element={<Home />} />
            <Route exact path="/about" element={<About />}/>
            <Route path="/profile" element={<Profile isLoggedIn={props.isLoggedIn} />} />
            <Route path="/profile/:userid" element={<Profile isLoggedIn={props.isLoggedIn} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/ladders" element={<LadderView />} >
              <Route path=":ladderId" element={<LadderView />} />
              <Route path="new" element={<Home />} />
              <Route index element={<Home />} />
            </Route>
            
            <Route path="/authtest"  element={<AuthTest />} />
            <Route path="*" element={<NoPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
};

  export default MyRouter;
import './App.css';
import React from 'react';
import { Route, BrowserRouter, Routes } from 'react-router-dom';
import LoginPage from './Pages/Login/Login';
import HomePage from './Pages/Home/Home';
import ManageGroupsPage from './Pages/ManageGroups/ManageGroups';
import MakeGroupsPage from './Pages/MakeGroup/MakeGroups';
import AdminGroupLogsPage from './Pages/AdminGroupLogs/AdminGroupLogs';
import AdminUserLogsPage from './Pages/AdminUserLogs/AdminUserLogs';
import RegisterAttackPage from './Pages/RegisterAttack/RegisterAttack';
import AdminHomePage from './Pages/AdminHome/AdminHome';
import ProfilePage from './Pages/Profile/Profile';
import { Provider } from './Context/context';

function App() {

  return (
    <Provider>
      <BrowserRouter>
        <div className="App">
          <Routes>
            <Route exact path = "/" element = {<LoginPage/>}/>
            <Route exact path = "/home" element = {<HomePage/>}/>
            <Route exact path = "/manage-groups" element = {<ManageGroupsPage/>}/>
            <Route exact path = "/make-groups" element = {<MakeGroupsPage/>}/>
            <Route exact path = "/profile" element = {<ProfilePage/>}/>
            <Route exact path = "/admin-home" element = {<AdminHomePage/>}/>
            <Route exact path = "/register-attack" element = {<RegisterAttackPage/>}/>
            <Route exact path = "/admin-user-logs" element = {<AdminUserLogsPage/>}/>
            <Route exact path = "/admin-group-logs" element = {<AdminGroupLogsPage/>}/>
          </Routes>
        </div>
      </BrowserRouter>
    </Provider>
  );
}

export default App;

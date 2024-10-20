import './App.css';
import React from 'react'
import { Sidebar } from './sidebar/Sidebar';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import { HomePage } from './Home-page/HomePage'
import { CustomGame } from './Room/CustomGame'
import { Game } from './Game/Game'
import { LoggingContainer } from './Login/LoggingContainer'
import { useLogContext } from './HandyComponents/LogContext'

function App() {
  const flexStyle = {
    display: "flex",
  }
 
  const Layout = ({children}) => {
    return (
      <div style={{width:'100%', height:'100%'}}>
        <Sidebar/>
        {children}
      </div>
    )
  }

  const Logger = React.memo(() => (<LoggingContainer/>));

  return (
    <div
      className="App"
    >
      <Router>
        <Layout>
          <Routes>
            {/* jeszcze landing page tutaj pójdzie */}
            <Route path="/" style={flexStyle} Component={HomePage}/>
            <Route path="/Play-A" element={
              <CustomGame variant='A'/>
            }/>
            <Route path="/Play-B" element={
              <CustomGame variant='B'/>
            }/>
            <Route path="/Game" element={Game}/>
            <Route path="/logging" element={
              <Logger/>
            }/>
          </Routes>
        </Layout>
      </Router>
    </div>
  );
}

export default App;
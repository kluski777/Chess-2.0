import './App.css';
import React from 'react'
import { Sidebar } from './sidebar/Sidebar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { HomePage } from './Home-page/HomePage'
import { CustomGame } from './Room/CustomGame'
import { Game } from './Game/Game'
import { GameContextProvider } from './Game/gameContext';
import { LoggingContainer } from './Login/LoggingContainer'

function App() {
  const flexStyle = {
    display: "flex",
    height: "100%",
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
      id='hierarchy-top'
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
            <Route path="/Game" element={
              <GameContextProvider>
                <Game/>
              </GameContextProvider>
            }/>
            <Route path="/logging" element={<Logger/>}/>
            {/* to do modyfikacji leci */}
          </Routes>
        </Layout>
      </Router>
    </div>
  );
}

export default App;
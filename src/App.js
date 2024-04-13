import './App.css';
import {Sidebar} from './sidebar/Sidebar';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import {HomePage} from './Home-page/HomePage'
import {useThemeContext} from './HandyComponents/Context'
import {PlayRoom} from './Room/PlayRoom'
import {Game} from './Game/Game'

function App() {
  const darkOrLightMode = useThemeContext()
  const flexStyle = {
    display: "flex",
  }
  const backgroundColor = {
    backgroundColor: darkOrLightMode.isBright ? 'white' : 'rgb( 20, 20, 20)',
  }

  const Layout = ({children}) => {
    return (
      <div>
        <Sidebar/>
        {children}
      </div>
    )
  }

  return (
    <div 
      className="App"
      style={backgroundColor}
    >
      <Router>
        <Layout>
          <Routes>
            <Route path="/" style={flexStyle} Component={HomePage}/>
            <Route path="/Play-A" element={
              <PlayRoom variant='A'/>
            }/>
            <Route path="/Play-B" element={
              <PlayRoom variant='B'></PlayRoom>
            }/>
            <Route path="/Play" element={
              <Game/>
            }/>
          </Routes>
        </Layout>
      </Router>
    </div>
  );
}

export default App;
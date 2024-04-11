import './App.css';
import {Sidebar} from './sidebar/Sidebar';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import {HomePage} from './Home-page/HomePage'
import {useThemeContext} from './sidebar/Context'

function App() {
  const darkOrLightMode = useThemeContext()
  const flexStyle = {
    display: "flex",
  }
  const backgroundColor = {
    backgroundColor: darkOrLightMode.isBright ? 'white' : 'rgb( 20, 20, 20)',
  }

  return (
    <div 
      className="App"
      style={backgroundColor}
    >
      <Router>
        <Routes>
          <Route exact path="/" style={flexStyle} element={
            <>
              <Sidebar/>
              <HomePage/>
            </>
          }/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
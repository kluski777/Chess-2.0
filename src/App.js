import './App.css';
import {Sidebar} from './Sidebar';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'

function App() {
  const flexStyle = {
    display: "flex",
  }


  return (
    <div className="App">
      <Router>
        <Routes>
          <Route exact path="/" style={flexStyle} Component={Sidebar}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
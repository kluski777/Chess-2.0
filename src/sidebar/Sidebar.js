import logoWithCaption from './../Assets/chess2.png'
import logo from './../Assets/logo.png'
import {useThemeContext} from './Context'
import {Link} from 'react-router-dom'
import {Box, Button, FormLabel, Switch} from '@chakra-ui/react'
import styled, {keyframes} from 'styled-components'
import "./Sidebar.css"
import React from 'react'

////////////////////////////// Css styles for components.
const boxStyle = {
  marginBottom: "10px",
  marginTop: "10px",
}

const appear = keyframes`
  0%{
    opacity: 0;
    height: 0;
  }
  100%{
    opacity: 1;
    height: auto;
  }
`

// const disappear = keyframes`
//   from{
//     opacity: 1;
//   }
//   to {
//     opacity: 0;
//   }
// `

// const DisappearingDiv = styled.div`
//   opacity: 0;
//   animation: ${disappear} 0.25s ease-in-out;
// `

const AppearingDiv = styled.div`
  opacity: 1;
  animation: ${appear} 0.25s ease-in-out;
`

const logoStyle = {
  height: "128.2px"
}

const AppearingComponent = ({whenDisplayed, children}) => {
  return (whenDisplayed &&
    <AppearingDiv>
      {children}
    </AppearingDiv>
    // :
    // <DisappearingDiv>
    //   {/* {children} */}
    // </DisappearingDiv>
  )
}

////////////////////////////// Component itself
export const Sidebar = () => {
  const themeContext = useThemeContext()
  const [isHovered, setIsHovered] = React.useState(false)
  const [buttonHovered, setButtonHovered] = React.useState({
    play: false,
    rules: false,
    tactics: false,
    new_patches: false,
    tools: false
  })
  const timer = React.useRef(null), buttonTimer = React.useRef(null) // timer for whole sidebar, buttonTimer for all buttons

  const logoComponent = isHovered ? 
    <img src={logoWithCaption} style={logoStyle} alt="logo"/> : 
    <img src={logo} style={logoStyle} alt="logo with caption"/>


  const handleSidebarMouseEnter = () => {
    clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      setIsHovered(true)
    }, 150)
  }
  
  const handleSidebarMouseLeave = () => {
    clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      setIsHovered(false)
    }, 150)
    handleButtonMouseEvent({
      play: false,
      rules: false,
      tactics: false,
      new_patches: false,
      tools: false
    })
  }

  const handleButtonMouseEvent = (toSend) => {
    clearTimeout(buttonTimer.current)
    buttonTimer.current = setTimeout(() => {
      setButtonHovered(toSend)
    }, 251)
  }

  return (
    <Box
      bg="black"
      width={isHovered ? "200px" : "84.5px"}
      height="100%"
      display="flex"
      flexDirection="column"
      position="fixed"
      justifyContent="spaceBetween"
      alignItems="center"
      transition="width 0.35s"
      onMouseEnter = {handleSidebarMouseEnter}
      onMouseLeave = {handleSidebarMouseLeave}
    >
      <Link to="/" >{logoComponent}</Link>
      <Box
        id="play"
        cursor="pointer"
        style={boxStyle}
        onMouseEnter={() => handleButtonMouseEvent({...buttonHovered, play: true})}
        onMouseLeave={() => handleButtonMouseEvent({...buttonHovered, play: false})}
      >
        <h2 className="captionStyle">Play</h2>
        <AppearingComponent whenDisplayed={buttonHovered.play}>
          <Link to="/A-room"><h3 className="subCaptionStyle">Wariant A</h3></Link>
          <Link to="/B-room"><h3 className="subCaptionStyle">Wariant B</h3></Link>
        </AppearingComponent>
      </Box>
      <Box
        id="rules"
        cursor="pointer"
        style={boxStyle}
        onMouseEnter={() => handleButtonMouseEvent({...buttonHovered, rules: true})}
        onMouseLeave={() => handleButtonMouseEvent({...buttonHovered, rules: false})}
      >
        <h2 className="captionStyle">Learn</h2>
        <AppearingComponent whenDisplayed={buttonHovered.rules}>
          <Link to="/technology-tree"><h3 className="subCaptionStyle">Technology tree</h3></Link>
          <Link to="/special-tiles"><h3 className="subCaptionStyle">Special tiles</h3></Link>
          <Link to="/fog-of-war"><h3 className="subCaptionStyle">Fog of War</h3></Link>
        </AppearingComponent>
      </Box>
      <Box
        id="tactics"
        cursor="pointer"
        style={boxStyle}
        onMouseEnter={() => handleButtonMouseEvent({...buttonHovered, tactics: true})}
        onMouseLeave={() => handleButtonMouseEvent({...buttonHovered, tactics: false})}
      >
        <h2 className="captionStyle">Tactics</h2>
        <AppearingComponent whenDisplayed={buttonHovered.tactics}>
          <Link to="/puzzles"><h3 className="subCaptionStyle">Puzzles</h3></Link>
          <Link to="/puzzle-storm"><h3 className="subCaptionStyle">Puzzle storm</h3></Link>
          <Link to="/puzzle-dashboard"><h3 className="subCaptionStyle">Puzzle dashboard</h3></Link>
        </AppearingComponent>
      </Box>
      <Link to="/new patches"><h2 className="captionStyle">New Patches</h2></Link>
      <Box
        id="tools"
        cursor="pointer"
        style={boxStyle}
        onMouseEnter={() => handleButtonMouseEvent({...buttonHovered, tools: true})}
        onMouseLeave={() => handleButtonMouseEvent({...buttonHovered, tools: false})}
      >
        <h2 className="captionStyle">Tools</h2>
        <AppearingComponent whenDisplayed={buttonHovered.tools}>
          <Link to="/computer-analysis"><h3 className="subCaptionStyle">Computer analysis</h3></Link>
          <Link to="/board-editor"><h3 className="subCaptionStyle">Board editor</h3></Link>
          <Link to="/import-game"><h3 className="subCaptionStyle">Import game</h3></Link>
        </AppearingComponent>
      </Box>
      <FormLabel 
        className='label' 
        htmlFor='mode-label'
        sx={{ 
          margin: 3,
          fontSize: '21px',
          color: themeContext.isBright ? 'white' : 'gray'
        }}
      >
          {isHovered ? themeContext.isBright ? 'Light' : 'Dark' : ''}
      </FormLabel>
      <Switch size='lg' id='mode-switch' isChecked={!themeContext.isBright} onChange={() => themeContext.toggleTheme(!themeContext.isBright)}/>
      <Button
        variaint='outline'
        className='SidebarButton'
        style={{background: 'green'}}
      >
        Log in
      </Button>
      <Button
        className='SidebarButton'
        style={{backgroundColor: 'orange'}}
      >
        Sign up
      </Button>
    </Box>
  );
}
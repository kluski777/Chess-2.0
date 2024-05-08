import logoWithCaption from './../Assets/chess2.png'
import logo from './../Assets/logo.png'
import {useThemeContext} from './../HandyComponents/Context'
import {Link} from 'react-router-dom'
import {Box, Button, FormLabel, Switch} from '@chakra-ui/react'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faCog} from '@fortawesome/free-solid-svg-icons'
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
  )
}

////////////////////////////// Component itself
export const Sidebar = () => {
  const theme = useThemeContext()
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

  const SubCaption = ({children}) => {
    return <h3 className="subCaptionStyle">{children}</h3>
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
          <Link to="/Play-A"><SubCaption>Wariant A</SubCaption></Link>
          <Link to="/Play-B"><SubCaption>Wariant B</SubCaption></Link>
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
          <Link to="/technology-tree"><SubCaption>Technology tree</SubCaption></Link>
          <Link to="/special-tiles"><SubCaption>Special tiles</SubCaption></Link>
          <Link to="/fog-of-war"><SubCaption>Fog of War</SubCaption></Link>
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
          <Link to="/puzzles"><SubCaption>Puzzles</SubCaption></Link>
          <Link to="/puzzle-storm"><SubCaption>Puzzle storm</SubCaption></Link>
          <Link to="/puzzle-dashboard"><SubCaption>Puzzle dashboard</SubCaption></Link>
        </AppearingComponent>
      </Box>
      <Link to="/new-patches"><h2 className="captionStyle">New Patches</h2></Link>
      <Box
        id="tools"
        cursor="pointer"
        style={boxStyle}
        onMouseEnter={() => handleButtonMouseEvent({...buttonHovered, tools: true})}
        onMouseLeave={() => handleButtonMouseEvent({...buttonHovered, tools: false})}
      >
        <h2 className="captionStyle">Tools</h2>
        <AppearingComponent whenDisplayed={buttonHovered.tools}>
          <Link to="/computer-analysis"><SubCaption>Computer analysis</SubCaption></Link>
          <Link to="/board-editor"><SubCaption>Board editor</SubCaption></Link>
          <Link to="/import-game"><SubCaption>Import game</SubCaption></Link>
        </AppearingComponent>
      </Box>
      <FormLabel 
        className='label' 
        htmlFor='mode-label'
        sx={{
          margin: 3,
          fontSize: '21px',
          color: theme.isBright ? 'white' : 'gray'
        }}
      >
          {isHovered ? theme.isBright ? 'Light' : 'Dark' : ''}
      </FormLabel>
      <Switch 
        size='lg'
        isChecked={!theme.isBright}
        onChange={() => theme.toggleTheme(!theme.isBright)}
      />
      <Button
        className='SidebarButton'
        borderRadius='25px'
        style={{background: 'green'}}
      >
        Log in
      </Button>
      <Button
        className='SidebarButton'
        borderRadius='25px'
        style={{backgroundColor: 'orange'}}
      >
        Sign up
      </Button>
      <FontAwesomeIcon icon={faCog} />
      {/* Settingi będą działać w taki sposób, że rozwijać się
      będą opcje podstawowe ale będzie też opcja more settings */}
    </Box>
  );
}
import {Button, Box, Table, Tbody, Tr, Td} from '@chakra-ui/react'
import {useThemeContext} from '../HandyComponents/themeContext'
import React from 'react'
import {Link} from 'react-router-dom'
import {CenteredCell} from './../HandyComponents/HandyComponents'
import {CustomGame} from './../Room/CustomGame'

import darkBackground from './../Assets/mainPage/darkBackground.jpg'
import brightBackground from './../Assets/mainPage/brightMode.jpg'

// WIEDZIEĆ KIEDY SIDEBAR JEST A KIEDY NIE JEST ROZWINIETY 
// Rerender taki jak trzeba po zmianie theme'u 
// w tle będzie szła szachownica nieskończona

const toggleVariant = ['A', 'B', 'C'] // tu powinny być nazwy wariantów.

export const HomePage = () => {
  // user is choosing which option to set, so that he'll be able to play
  
  const [firstButtonOption, setFirstButtonOption] = React.useState('A')
  const [custom, setCustom] = React.useState(false);
  const theme = useThemeContext();

  const ButtonWrapper = ({children, color, timeFormat, hoverColor}) => {
    return ( 
      <Button 
        color={color}
        _hover={{bg: hoverColor}}
        variant='outline'
        fontSize='26px'
        width='100%'
        px='10'
        py='20'
        borderColor="teal.200"
        onClick={(e) => {
          if(custom)
            e.preventDefault();
        }}
      >
        {children} <br/>
        {timeFormat+''}
      </Button>
    )
  }



  const BulletGameButton = ({children}) => {
    return <ButtonWrapper timeFormat='Bullet' color={theme.isBright ? 'gray.900' : 'white'} hoverColor={theme.isBright ? '#DF0000' : '#8A0000'}>{children}</ButtonWrapper>
  }
  
  const BlitzGameButton = ({children}) => {
    return <ButtonWrapper timeFormat='Blitz' color={theme.isBright ? 'gray.900' : 'white'} hoverColor={theme.isBright ? '#FFAA00' : '#AA6600'}>{children}</ButtonWrapper>
  }
  
  const RapidGameButton = ({children}) => {
    return <ButtonWrapper timeFormat='Rapid' color={theme.isBright ? 'gray.900' : 'white'} hoverColor={theme.isBright ? '#AAAAAA' : '#555555'}>{children}</ButtonWrapper>
  }

  // do TbodyContent dorzucić custom i drugą tabelę.
  const TbodyContent = () => {
    return <Tbody>
      <Tr id='bullet games' display='grid' gridTemplateColumns='1fr 1fr 1fr'>
        <CenteredCell><BulletGameButton>2+0</BulletGameButton></CenteredCell>
        <CenteredCell><BulletGameButton>3+0</BulletGameButton></CenteredCell>
        <CenteredCell><BulletGameButton>3+1</BulletGameButton></CenteredCell>
      </Tr>
      <Tr id='blitz games' display='grid' gridTemplateColumns='1fr 1fr 1fr'>
        <CenteredCell><BlitzGameButton>5+0</BlitzGameButton></CenteredCell>
        <CenteredCell><BlitzGameButton>5+3</BlitzGameButton></CenteredCell>
        <CenteredCell><BlitzGameButton>10+0</BlitzGameButton></CenteredCell>
      </Tr>
      <Tr id='rapid games' display='grid' gridTemplateColumns='1fr 1fr 1fr'>
        <CenteredCell><RapidGameButton>15+0</RapidGameButton></CenteredCell>
        <CenteredCell><RapidGameButton>15+5</RapidGameButton></CenteredCell>
        <CenteredCell><RapidGameButton>30+15</RapidGameButton></CenteredCell>
      </Tr>
    </Tbody>
  }

  return (
    <Box
      backgroundImage={theme.isBright ? brightBackground : darkBackground}
      backgroundRepeat="Repeat"
      backgroundSize="100px"
    >
      <Table
        opacity={0.9}
        position='relative'
        width='75%'
        left='calc((100% + 200px)/2)'
        transform='translateX(-50%)'
        border='5px solid gray.800'
        top='10px'
        marginBottom='25px'
        backgroundColor={theme.isBright ? 'gray.300' : 'gray.600'}
      >
        <Tbody>
          <Tr>
            <Td colSpan={3} borderColor='transparent'>
              <Table>
                <Tbody>
                  <Tr borderColor='transparent'>
                    <CenteredCell width='50%'>
                      <Button 
                        variant={ !custom ? 'solid' : 'ghost' }
                        colorScheme={firstButtonOption === 'A' ? 'teal' : firstButtonOption === 'B' ? 'green' : 'red'}
                        color={ !custom || theme.isBright ? 'black' : 'white' }
                        onClick={() => {
                          if(!custom)
                            setFirstButtonOption(toggleVariant[(toggleVariant.indexOf(firstButtonOption)+1)%toggleVariant.length])
                          setCustom(false)
                        }}
                        size='lg'
                        px='35%'
                        py='10%'
                      >
                        Quick {firstButtonOption} variant
                      </Button>
                    </CenteredCell>
                    <CenteredCell width='50%'>
                      <Button
                        variant={ custom ? 'solid' : 'ghost' }
                        colorScheme='blue'
                        color={ custom || theme.isBright ? 'black' : 'white' }
                        onClick={() => setCustom(true)}
                        size='lg'
                        px='35%'
                        py='10%'
                      >
                        Custom game
                      </Button>
                    </CenteredCell>
                  </Tr>
                </Tbody>
              </Table>
            </Td>
          </Tr>
        </Tbody>
        <TbodyContent/>
      </Table>
      {/* <Table
        id='Leaderboard and upcoming tournaments'
        position='relative'
        left='50%'
        transform='translate(-50%) translateX(100px)'
        width='75%'
      >
        <Thead>
          <Tr display='grid' gridTemplateColumns='1fr 1fr'>
            <CenteredCell border='5px solid gray' color={theme.isBright ? 'black' : 'rgb(210, 210, 210)'}>
              Leaderboard
            </CenteredCell>
            <CenteredCell border='5px solid gray' color={theme.isBright ? 'black' : 'rgb(210, 210, 210)'}>
              Upcoming tournaments
            </CenteredCell>
          </Tr>
        </Thead>
        <Tbody>
          <Tr display='grid' gridTemplateColumns='1fr 1fr'>
            // wyniki najlepszych graczy.
          </Tr>
        </Tbody>
      </Table> // jak będzie serwer to to się doda */}
      {custom && 
        // Tutaj box jak się kliknie to Box znika tj. setCustom(false)
        <Box
          top='0px'
          right='0px'
          left='0px'
          width='100%'
          height='100vh'
          display="flex"
          alignItems='center'
          justifyContent='center'
          position="absolute"
          background='rgba(0, 0, 0, 0.25)'
          onClick={() => {setCustom(false)}}
        >
          <Box
            left='50%'
            transform='translateX(calc(-50% + 100px))'
            position='absolute'
            textAlign='center'
            top='20%'
            borderRadius='35px'
            backgroundColor='rgb(170, 200, 140)'
            zIndex='1'
            width='60%'
            onClick={(event) => {event.stopPropagation();}}
          >
            <CustomGame top='0px' left='50%' transform='translateX(-50%)'/>
          </Box>
        </Box>
      }
    </Box>
    // jeśli jest zalogowany to na dole będzie profil z potencjalnym zapisem wszystkich gier które zagrał
  )
}
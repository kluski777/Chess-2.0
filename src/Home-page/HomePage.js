import {Button, Box, Table, Tbody, Thead, Tr, Td} from '@chakra-ui/react'
import {useThemeContext} from '../HandyComponents/Context'
import React from 'react'
import {Link} from 'react-router-dom'
import {CenteredCell} from './../HandyComponents/HandyComponents'

// funkcja, która skróci program o automatyczne dodanie Linków, props-ów
const ButtonWrapper = ({children, color, timeFormat}) => {
  // const childrenInString = React.Children.toArray(children).join('')
  return (
  <Link to='/Play'> 
    <Button 
      color={color}
      _hover={{bg: 'teal.200'}}
      variant='outline'
      fontSize='26px'
      width='100%'
      px='10'
      py='20'
      borderColor="teal.200"
    >
      {children} <br/>
      {timeFormat+''}
    </Button>
  </Link>
  )
}

const toggleVariant = ['A', 'B', 'C'] // tu powinny być nazwy wariantów.

export const HomePage = () => {
  // user is choosing which option to set, so that he'll be able to play
  const [firstButtonOption, setFirstButtonOption] = React.useState('A')
  const [custom, setCustom] = React.useState(false)
  const value = useThemeContext()
  
  const BulletGameButton = ({children}) => {
    return <ButtonWrapper timeFormat='Bullet' color={value.isBright ? 'gray.900' : 'white'}>{children}</ButtonWrapper>
  }
  
  const BlitzGameButton = ({children}) => {
    return <ButtonWrapper timeFormat='Blitz' color={value.isBright ? 'gray.900' : 'white'}>{children}</ButtonWrapper>
  }
  
  const RapidGameButton = ({children}) => {
    return <ButtonWrapper timeFormat='Rapid' color={value.isBright ? 'gray.900' : 'white'}>{children}</ButtonWrapper>
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
    <Box>
      <Table
        opacity={0.5}
        position='relative'
        width='75%'
        left='calc((100% + 200px)/2)'
        transform='translateX(-50%)'
        border='5px solid gray.800'
        top='10px'
        marginBottom='25px'
        backgroundColor={value.isBright ? 'gray.300' : 'gray.600'}
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
                        opacity='1'
                        color={ !custom || value.isBright ? 'black' : 'white' }
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
                        color={ custom || value.isBright ? 'black' : 'white' }
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
      <Table
        id='Leaderboard and upcoming tournaments'
        position='relative'
        left='50%'
        transform='translate(-50%) translateX(100px)'
        width='75%'
      >
        <Thead>
          <Tr display='grid' gridTemplateColumns='1fr 1fr'>
            <CenteredCell border='5px solid gray' color={value.isBright ? 'black' : 'rgb(210, 210, 210)'}>
              Leaderboard
            </CenteredCell>
            <CenteredCell border='5px solid gray' color={value.isBright ? 'black' : 'rgb(210, 210, 210)'}>
              Upcoming tournaments
            </CenteredCell>
          </Tr>
        </Thead>
        <Tbody>
          <Tr display='grid' gridTemplateColumns='1fr 1fr'>
            {/* To się doda */}
          </Tr>
        </Tbody>
      </Table>
    </Box>
  )
}
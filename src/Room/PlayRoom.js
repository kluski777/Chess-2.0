import React from 'react';
import {
  Table, Thead, Tr, Switch, FormLabel, Slider, 
  SliderTrack, SliderFilledTrack, SliderThumb, 
  SliderMark, Select, Button
} from '@chakra-ui/react';
import {Link} from 'react-router-dom';
import {CenteredCell, CenteredLabel} from './../HandyComponents/HandyComponents'; 
import {useThemeContext} from '../HandyComponents/Context';

export const PlayRoom = ({variant, top, left, transform}) => {
  const [isRated, setIsRated] = React.useState(true);
  const theme = useThemeContext();
  const [sliderValues, setSliderValues] = React.useState({
    time: 3, 
    increment: 0
  });
  const [showMark, setShowMark] = React.useState({
    time: false,
    increment: false
  })
  const [playWith, setPlayWith] = React.useState("Stranger")
  // z tych wartości powyżej wypadałoby zrobić jeden wielki context,
  // widoczny dla większości z plików

  const tableFont = {
    fontFamily: 'Verdana',
    fontSize: '25px',
    fontWeight: '900'
  }

  return (
    <Table
      width='75%'
      position='relative'
      top={top === undefined ? '25px' : top}
      left={left === undefined ? '50%' : left}
      transform={transform === undefined ? 'translate(-50%) translateX(100px)' : transform}
      background={theme.isBright ? 'linear-gradient(to right, rgb(250, 190, 170), rgb(220, 200, 170))' : 'linear-gradient(to right, rgb(45, 60, 30), rgb(60, 45, 30))'}
      borderRadius='10px'
    >
      <Thead>
        <Tr>
          <CenteredCell 
            color={theme.isBright ? 'black' : 'gray'}
            fontSize='40px'
            fontFamily='Tahoma'
            fontWeight='900'
            fontStyle='italic'
          >
            Variant {variant}
          </CenteredCell>
        </Tr>
        <Tr display='grid' gridTemplateColumns='1fr 1fr'>
          <CenteredCell style={tableFont}>
            <Slider 
              defaultValue={3} 
              colorScheme="orange"
              min={1}
              max={60}
              step={1}
              onChange={(v) => setSliderValues({...sliderValues, time: v})}
              onMouseEnter={() => setShowMark({...showMark, time: true})}
              onMouseLeave={() => setShowMark({...showMark, time: false})}
            >
              <SliderMark
                theme={sliderValues.time}
                textAlign='center'
                bg='transparent'
                color={theme.isBright ? 'white' : 'gray'}
                transform={'translateX(calc(-50% + 25px))'}
                mt='-5.5%'
              >
                {showMark.time && sliderValues.time + ' min'}
              </SliderMark>
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>
            <CenteredLabel color={theme.isBright ? 'black' : 'white'}>
              Time
            </CenteredLabel>
          </CenteredCell>
          <CenteredCell style={tableFont}>
          <Slider 
              defaultValue={0} 
              colorScheme="yellow"
              min={0}
              max={30}
              step={1}
              onChange={(v) => setSliderValues({...sliderValues, increment: v})}
              onMouseEnter={() => setShowMark({...showMark, increment: true})}
              onMouseLeave={() => setShowMark({...showMark, increment: false})}
            >
              <SliderMark
                theme={sliderValues.increment}
                textAlign='center'
                bg='transparent'
                color={theme.isBright ? 'white' : 'gray'}
                transform={'translateX(-50%)'}
                mt='-5.5%'
              >
                {showMark.increment && sliderValues.increment + ' s'}
              </SliderMark>
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>
            <CenteredLabel color={theme.isBright ? 'black' : 'white'}>
              Increment
            </CenteredLabel>
          </CenteredCell>
        </Tr>
        <Tr display='grid' gridTemplateColumns='1fr 1fr'>
          <CenteredCell style={tableFont}>
            <CenteredLabel
              {...tableFont}
              fontSize='19px'
              display='grid'
              color={theme.isBright ? 'black' : 'white'}
              textAlign='center'
              marginBottom='10px'
            >
              With whom to play?
            </CenteredLabel>
            <Select 
              defaultValue="stranger" 
              style={tableFont}
              onChange={(v) => setPlayWith(v)}
            >
              <option theme='stranger' >Stranger</option>
              <option theme='friend'>Friend</option>
            </Select>
          </CenteredCell>
          <CenteredCell>
            <FormLabel
              style={tableFont}
              position='relative'
              textAlign='center'
              color={isRated ? 'rgb(170, 250, 100)' : 'purple'}
            >
              {isRated ? 'Unrated' : 'Rated'}
            </FormLabel>
            <Switch size='lg' isChecked={isRated} onChange={() => setIsRated(!isRated)} colorScheme='orange'/>
          </CenteredCell>
        </Tr>
        <Tr>
          <CenteredCell>
            <Link to="/Game">
              <Button
                width='60%'
                backgroundColor={theme.isBright ? 'white' : 'gray'}
              >
                Play
              </Button>
            </Link>
          </CenteredCell>
        </Tr>
      </Thead>
    </Table>
  );
}
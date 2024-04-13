import React from 'react';
import {
  Table, Thead, Tr, Switch, FormLabel, Slider, 
  SliderTrack, SliderFilledTrack, SliderThumb, 
  SliderMark, Select, Button
} from '@chakra-ui/react';
import {Link} from 'react-router-dom';
import {CenteredCell, CenteredLabel} from './../HandyComponents/HandyComponents'; 
import {useThemeContext} from '../HandyComponents/Context';

export const PlayRoom = ({variant}) => {
  const [isRated, setIsRated] = React.useState(true);
  const value = useThemeContext();
  const [sliderValues, setSliderValues] = React.useState({
    time: 3, 
    increment: 0
  });
  const [showMark, setShowMark] = React.useState({
    time: false,
    increment: false
  })
  const [playWith, setPlayWith] = React.useState("Stranger")
  // z tych wartości powyżej wypadałoby zrobić jeden wielki context.

  const tableFont = {
    fontFamily: 'Verdana',
    fontSize: '25px',
    fontWeight: '900'
  }

  return (
    <Table
      width='75%'
      position='relative'
      top='25px'
      left='50%'
      transform='translate(-50%) translateX(100px)'
      backgroundColor={value.isBright ? 'rgb(80, 182, 110)' : 'rgb(40, 91, 55)'}
      borderRadius='10px'
    >
      <Thead>
        <Tr>
          <CenteredCell 
            color={value.isBright ? 'black' : 'gray'}
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
                value={sliderValues.time}
                textAlign='center'
                padding='1'
                bg='transparent'
                color={value.isBright ? 'white' : 'gray'}
                mt='-10'
                ml='-5'
              >
                {showMark.time && sliderValues.time + ' min'}
              </SliderMark>
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>
            <CenteredLabel color={value.isBright ? 'black' : 'white'}>
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
                value={sliderValues.increment}
                textAlign='center'
                padding='1'
                bg='transparent'
                color={value.isBright ? 'white' : 'gray'}
                mt='-10'
                ml='-5'
                w='15'
              >
                {showMark.increment && sliderValues.increment + ' min'}
              </SliderMark>
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>
            <CenteredLabel color={value.isBright ? 'black' : 'white'}>
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
              color={value.isBright ? 'black' : 'white'}
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
              <option value='stranger'>Stranger</option>
              <option value='friend'>Friend</option>
            </Select>
          </CenteredCell>
          <CenteredCell>
            <FormLabel
              style={tableFont}
              position='relative'
              textAlign='center'
              color={isRated ? 'rgb(255, 182, 193)' : 'purple'}
            >
              {isRated ? 'Unrated' : 'Rated'}
            </FormLabel>
            <Switch size='lg' isChecked={isRated} onChange={() => setIsRated(!isRated)} colorScheme='orange'/>
          </CenteredCell>
        </Tr>
        <Tr>
          <CenteredCell>
            <Link to="/game">
              <Button
                width='60%'
                backgroundColor={value.isBright ? 'white' : 'gray'}
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
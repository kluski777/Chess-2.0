import React from 'react';
import {
  Table, Thead, Tr, Switch, FormLabel, Slider, 
  SliderTrack, SliderFilledTrack, SliderThumb, 
  SliderMark, Button
} from '@chakra-ui/react';
import {Link} from 'react-router-dom';
import {CenteredCell, CenteredLabel} from '../HandyComponents/HandyComponents'; 
import {useThemeContext} from '../HandyComponents/themeContext';

export const CustomGame = ({variant, top, left, transform}) => {
  const timeSliderRef = React.useRef(null);
  const incrementSliderRef = React.useRef(null);

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
      width='70%'
      position='relative'
      top={top === undefined ? '25px' : top}
      left={left === undefined ? '50%' : left}
      transform={transform === undefined ? 'translate(-50%) translateX(100px)' : transform}
      background={theme.isBright ? 'linear-gradient(to right, red, orange)' : 'linear-gradient(to right, rgb(45, 60, 30), rgb(60, 45, 30))'}
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
              colorScheme="blue"
              ref={timeSliderRef}
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
                transform={`translateX(calc(${(sliderValues.time / 60 * timeSliderRef?.current?.parentElement?.clientWidth) ?? 0}px - 40%))`}
                mt='-15%'
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
              ref={incrementSliderRef}
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
                transform={`translateX(calc(${Math.floor(sliderValues.increment / 30 * incrementSliderRef?.current?.parentElement?.clientWidth) ?? 0}px - 40%))`}
                mt='-15%'
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
          <CenteredCell padding='0px 3px 0px 3px' display='flex' justifyContent='center' alignItems='center' flexDirection='column'>
            <CenteredLabel
              {...tableFont}
              fontSize='24px'
              display='grid'
              color='#FFD700' // golden yellow
              textAlign='center'
              margin='0px 0px 10px 10px'
              textShadow='0px 0px 5px rgba(255, 215, 0, 0.5)' // retro arcade effect
              fontWeight='bold'
              letterSpacing='2px'
              fontFamily='Pixel Arial'
            >
              Gaming buddy?
            </CenteredLabel>
            <select            
              style={{
                padding: "0px 20px 0px 20px",
                width: "85%",
                border: '1px solid white',
                borderRadius: '5px',
                backgroundColor: "none",
                ...tableFont
              }}
              defaultValue="stranger"
              onChange={(e) => setPlayWith(e.target.value)}
            >
              <option theme='stranger' >Stranger</option>
              <option theme='friend'>Friend</option>
            </select>
          </CenteredCell>
          <CenteredCell padding='0px' display='flex' justifyContent='center' alignItems='center' flexDirection='column'>
            <FormLabel
              style={tableFont}
              position='relative'
              margin='0px 0px 10px 0px'
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
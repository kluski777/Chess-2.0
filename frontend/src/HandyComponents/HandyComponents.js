import {Td, FormLabel} from '@chakra-ui/react';

export const CenteredCell = ({children, ...props}) => {
  return (
    <Td 
      padding="20px"
      textAlign='center'
      borderColor='transparent'
      {...props}
    >
      {children}
    </Td>
  )
}

export const CenteredLabel = ({children, ...props}) => { 
  return (
    <FormLabel 
      display='relative' 
      left='50%'
      {...props}
    >
      {children}
    </FormLabel>
  );
}
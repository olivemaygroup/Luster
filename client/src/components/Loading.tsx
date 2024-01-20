import React from 'react'
import { Center, Spinner } from 'native-base';


export function Loading(): React.FC {
  return (
    <Center flex={1} bg='gray.700'>
      <Spinner color='purple.500'/>
    </Center>
  );
}
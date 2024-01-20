import React, { ReactNode, useEffect, useState } from 'react';
import { Image, Text, Box, VStack, Input, Icon, Center, Button, ScrollView, Pressable } from 'native-base';
import { LinearGradient } from 'expo-linear-gradient';

import BackgroundImg from '@assets/Background.png';
import Search from '@assets/search.svg';

import { useNavigation } from '@react-navigation/native';

import { useForegroundPermissions, watchPositionAsync, LocationAccuracy, LocationSubscription } from 'expo-location';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { Loading } from '../components/Loading';
import { getAddressLocation } from '../utils/getAddressLocation';

type currAddType = ReactNode & {
  latitude: any;
  longitude: any;
}
export function Region({ setLocation }:any) {
  const [locationForegroundPermission, requestLocationForegroundPermission] = useForegroundPermissions();
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [currentAddress, setCurrentAddress] = useState< currAddType>({});
  const [inputValue, setInputValue] = useState<string | object >('');
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [clearInput, setClearInput] = useState(false);
  const navigation : any = useNavigation();

  useEffect(() => {
    requestLocationForegroundPermission();


    const clearAsyncStorage = async () => {
      try {
        await AsyncStorage.removeItem('selectedLocation');
        await AsyncStorage.removeItem('selectedCity');
      } catch (error) {
        console.error('Error clearing AsyncStorage:', error);
      }
    };

    return () => {
      clearAsyncStorage();
    };
  }, []);


  useEffect(() => {
    requestLocationForegroundPermission();
  }, []);

  useEffect(() => {
    if (!locationForegroundPermission?.granted) {
      return;
    }

    let subscription: LocationSubscription;


    watchPositionAsync({
        accuracy: LocationAccuracy.High,
        timeInterval: 1000,
      }, (location) => {
        getAddressLocation(location.coords)
          .then((address:any) => {
            if (address) {
              setCurrentAddress(address);
            }
          })
          .finally(() => setIsLoadingLocation(false));
      });



    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [locationForegroundPermission, inputValue]);

  const handleSearch = async () => {
    try {
      setIsLoading(true); // Ativar o carregamento

      let location;

      if (typeof inputValue === 'string' && inputValue.trim() === '' || inputValue === currentAddress) {
        location = await getAddressLocation({
          latitude: currentAddress.latitude || 0,
          longitude: currentAddress.longitude || 0,
        });

        setInputValue(currentAddress);
      } else {

        location = await getAddressLocation({
          latitude: 0,
          longitude: 0,
        });
      }

      if (location) {
        await AsyncStorage.setItem('selectedLocation', JSON.stringify(location));
        await AsyncStorage.setItem('selectedCity', inputValue);
        setClearInput(true);
      }
    } finally {
      setIsLoading(false);
    }
  };


  const handleNext = async () => {
    setIsLoading(true);

    try {
      await saveLocationToAsyncStorage();
      navigation.navigate('date_selection');
    } catch (error) {
      console.error('Error during saveLocationToAsyncStorage:', error);
    } finally {
      setIsLoading(false);
    }
  };



  const saveLocationToAsyncStorage = async () => {
    try {
      let location;

      if (typeof inputValue === 'string' && inputValue.trim() === '' && currentAddress) {

        location = await getAddressLocation({
          latitude: currentAddress.latitude || 0,
          longitude: currentAddress.longitude || 0,
        });


        setInputValue(currentAddress);
      } else {

        location = await getAddressLocation({
          latitude: 0,
          longitude: 0,
        });
      }


      setLocation(location);


      if (location && inputValue !== undefined && inputValue !== null) {
        await AsyncStorage.setItem('selectedLocation', JSON.stringify(location));
        await AsyncStorage.setItem('selectedCity', inputValue);
        setClearInput(true);
      }
    } catch (error) {
      console.error('Error saving location to AsyncStorage:', error);
    }
  };



  if (!locationForegroundPermission?.granted) {
    return (
      <Text color='gray.100' fontSize='lg' textAlign='center' margin={24}>
        To discover all upcoming music events, allow location access. Head to your device settings and grant Luster permission to access your location.
      </Text>
    );
  }

  if (isLoadingLocation) {
    return <Loading />;
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsHorizontalScrollIndicator={false} >
      <VStack flex={1} bg="gray.700" px={22}>
        <Image
          source={BackgroundImg}
          alt="Music Event Image"
          maxW={428}
          maxH={624}
          resizeMode="cover"
          position="absolute"
        />

        <Text color='gray.100' fontSize='sm' fontWeight={400} mt={20}>
          Your Location
        </Text>
        {selectedCity ? (
          <Center>
            <Text color='gray.100' fontSize='xl'>{selectedCity}</Text>
          </Center>
        ) : (
          <Text color='gray.100' fontSize='lg' fontWeight={700}>
            {currentAddress}
          </Text>
        )}

        <Input
          px={2}
          h={14}
          mt={8}
          mb={500}
          borderRadius={8}
          backgroundColor='transparent'
          borderWidth={.4}
          fontSize='xs'
          fontFamily='body'
          placeholder='Discover nearby events'
          color='gray.100'
          value={inputValue}
          // defaultValue={inputValue}
          onChangeText={(text) => {
            setInputValue(text);
          }}
          autoCapitalize="words"
          returnKeyType="search"
          _focus={{
            borderWidth: 1,
            borderColor: 'purple.900',
            selectTextOnFocus: true
          }}
          onSubmitEditing={handleSearch}
          InputRightElement={
            <Pressable
              onPress={() => {
                handleSearch();
                setClearInput(true);
              }}
            >
              <Box mr={2} mt={1}>
                <Icon as={<Search />} />
              </Box>
            </Pressable>
          }
        />

        {isLoading ? (
          <Loading />
        ) : (
          <Pressable>
            <LinearGradient
              colors={['#6D50A0', '#E983F7', '#EC84F9', '#F687FF']}
              locations={[0, 0.85, 0.5, 1]}
              start={[0, 0]}
              end={[1, 0]}
              style={{ borderRadius: 8, overflow: 'hidden'}}
              marginBottom={42}
            >
              <Button
                onPress={handleNext}
                variant="unstyled"
              >
                <Text color="gray.100" fontSize="md" padding={2}>
                  NEXT
                </Text>
              </Button>
            </LinearGradient>
          </Pressable>
        )}

      </VStack>
    </ScrollView>
  );

}
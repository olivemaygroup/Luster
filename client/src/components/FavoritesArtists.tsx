import React, { PropsWithChildren, useEffect, useState } from 'react';
import { Image, VStack, HStack, Text, Box, Pressable, ScrollView } from "native-base";
import ArrowSvg from '@assets/arrow.svg';
import { useNavigation } from '@react-navigation/native';
import { useArtistContext } from '../contexts/ArtistContext';
import { getUpcomingEvents } from '../services/ticketmasterService';

//TODO: Make the page work. Not yet plugged in
interface SvgProps {
  width: number;
  height: number;
  fill: string;
  top: number;
  right: number;
  position?: string;
}
type Artist = PropsWithChildren & {
  artist: any;
}

export function FavoritesArtists({ artist }: Artist) {
  const navigation: any = useNavigation();
  // const { selectedArtists: globalSelectedArtists } = useArtistContext();
  const [eventsData, setEventsData] = useState([]);
  // const { favoriteArtistsNames } = useArtistContext();

  // useEffect(() => {
  //   const fetchData = async (): Promise <any> => {
  //     try {

  //       //TODO: Need to pass 2 arguments in
  //       const events = await getUpcomingEvents();


  //     setEventsData(events);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };
  //   fetchData();
  // }, []);


  return (
    <ScrollView showsHorizontalScrollIndicator={false}>
      <Pressable
        onPress={() => {
          navigation.navigate('artists_list');
        }}
      >
        <VStack mt={4}>
          {eventsData.map((event, index) => {
             

            const { day, month, city, country, venue } = event;

            return (
              <Box borderRadius={2} key={index}>
                <HStack space={4} width="100%" alignItems="center">
                  <Image
                    source={{ uri: artist?.image }}
                    style={{
                      height: 80,
                      width: 80,
                      borderRadius: 1000,
                      overflow: "hidden",
                      marginTop: 58
                    }}
                    resizeMode="cover"
                    alt={`Image for ${artist?.name}`}
                  />

                  <VStack alignItems="flex-start" flex={1} mt={12}>
                    <Text
                      color="gray.200"
                      fontSize="lg"
                      fontWeight="bold"
                      textAlign="center"
                      marginTop={4}
                      textTransform="uppercase"
                    >
                      {artist?.name}
                    </Text>

                    <HStack mt={-6}>
                      <VStack>
                        <Text color='gray.100' fontSize={30} fontWeight="bold" textAlign="left" lineHeight={40} mt={6}>
                          {day}
                        </Text>

                        <Text color='gray.100' fontSize="md" textAlign="left" mt={1}>
                          {month}
                        </Text>
                      </VStack>

                      <VStack padding={6} mt={2}>
                        <Text color='gray.100' fontSize="sm" fontWeight="bold" textAlign="left" mt={1} mr={8}>
                          {`${city}, ${country}`}
                        </Text>

                        <Text color='#F9FAFC' fontSize="xs" textAlign="left">
                          {venue}
                        </Text>
                      </VStack>
                    </HStack>

                    <ArrowSvg width={24} height={24} fill="#FFFFFF" style={{ position: 'absolute', top: 62, right: 6 }} />
                  </VStack>
                </HStack>
              </Box>
            );
          })}
        </VStack>
      </Pressable>
    </ScrollView>
  );
}

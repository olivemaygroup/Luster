import React, { Key, PropsWithChildren, useEffect, useState } from 'react';
import { Image, HStack, Text, Box, Pressable, ScrollView, Center, SimpleGrid } from "native-base";
import CheckSvg from '../assets/check.svg';
import { useNavigation } from '@react-navigation/native';
import { getAllArtists } from '../services/spotifyService';
import { LongPressGestureHandler, State, GestureHandlerRootView } from 'react-native-gesture-handler';
import { useArtistContext } from '../contexts/ArtistContext';

type AGPropsType = PropsWithChildren & {
  addSelectedArtist: (artist: any)=>void;
  clearSelectedArtists: (artist: any)=>void;
  isInFavoritesScreen:(boolean);
}

export function ArtistsGroup({ addSelectedArtist, clearSelectedArtists, ...rest }: AGPropsType) {
  const [topArtists, setTopArtists]: any = useState([]);
  const [selectedArtists, setSelectedArtists]: any = useState([]);
  const [dataLoaded, setDataLoaded]: any = useState(false);
  const navigation: any = useNavigation();
  const { selectedArtists: globalSelectedArtists }: any = useArtistContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const artists: any = await getAllArtists();
        setTopArtists(artists || []);
      } catch (error) {
        console.error('Error fetching artists:', error);
      } finally {
        setDataLoaded(true);
      }
    };

    if (!dataLoaded) {
      fetchData();
    }
  }, []);

  const handleLongPress = (artist: any) => {
    const isArtistSelected = selectedArtists.includes(artist);

    if (isArtistSelected) {
      setSelectedArtists((prevSelectedArtists: any) =>
        prevSelectedArtists.filter((a: any) => a !== artist)
      );
      clearSelectedArtists(artist);
    } else {
      setSelectedArtists((prevSelectedArtists: any) => [...prevSelectedArtists, artist]);
      addSelectedArtist(artist);
    }
  };

  return (
    <ScrollView padding={9} showsVerticalScrollIndicator={false} centerContent>
      <SimpleGrid columns ={3/*{ base: 3, md: 1 }*/} space={2} >
        {topArtists.map((artist: any, index: any) => (
          <GestureHandlerRootView>
            <LongPressGestureHandler
              onHandlerStateChange={({ nativeEvent }) => {
                if (nativeEvent.state === State.ACTIVE) {
                  handleLongPress(artist);
                }
              }}
              minDurationMs={2}
            >
              <Pressable
                padding={1}
                marginTop={16}
                width={120}
                overflow="hidden"
                {...rest}
              >
                <HStack>
                  <Box position="relative">
                    <Image
                      source={{ uri: artist?.image }}
                      style={{
                        height: 90,
                        width: 90,
                        borderRadius: 1000,
                        overflow: "hidden",
                        opacity: globalSelectedArtists.includes(artist) ? 0.2 : 1,
                      }}
                      resizeMode="cover"
                      alt={`Image for ${artist?.name}`}
                    />
                    {globalSelectedArtists.includes(artist) && (
                      <Center
                        position="absolute"
                        top={0}
                        left={0}
                        right={0}
                        bottom={0}
                      >
                        <CheckSvg color="white" style={{marginTop: -30}} />
                      </Center>
                    )}
                    <Center>
                      <Text
                        color="gray.200"
                        fontSize="xs"
                        fontWeight="bold"
                        textAlign="center"
                        marginTop={4}
                      >
                        {artist?.name}
                      </Text>
                    </Center>
                  </Box>
                </HStack>
              </Pressable>
            </LongPressGestureHandler>
          </GestureHandlerRootView>
        ))}
      </SimpleGrid>
    </ScrollView>
  );
}

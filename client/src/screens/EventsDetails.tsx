import React, { useEffect, useState } from "react";
import { Image, VStack, Text, Box, HStack, Pressable, Button } from "native-base";
import { Linking } from 'react-native';
import MapImg from '../assets/map.png';
import Calendar from '../assets/calendar.svg';
import LocationSvg from "../assets/location.svg";
import { getEvents } from "../services/ticketmasterService";
import { getUpcomingEvents } from '../services/ticketmasterService';



export function EventsDetails({location, date}:any) {
  const [eventsData, setEventsData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const events = await getEvents(location, date);
        setEventsData(events);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const event = eventsData[0];


  useEffect(() => {
    const fetchData = async (): Promise <any>  => {
      try {
        const events = await getUpcomingEvents(location, date);

      setEventsData(events);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const handleBuyTicket = () => {
    if (event && event.ticketmasterUrl){
      Linking.openURL(event.ticketmasterUrl);
    } else {
      console.error('Ticketmaster URL is not available.');
    }
  };

  const handleOpenGoogleMaps = () => {
    if (event && event.venue && event.city && event.country) {
      const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${event.venue},${event.city},${event.country}`;
      Linking.openURL(googleMapsUrl);
    } else {
      console.error('Venue, city, or country information is not available.');
    }
  };

  return (
    <VStack>
      {event && (
        <Pressable>
          <VStack alignItems="center">
            <Box >
              <Image
                source={{ uri: event.image }}
                style={{
                  height: 440,
                  width: 428,
                  borderRadius: 8,
                  overflow: "hidden",
                }}
                resizeMode="cover"
                alt={`Event Image`}
              />


              <Box  position="absolute" bottom={0} left={0} p={2} width="100%">
                <Text color="gray.100" fontSize="lg" textAlign="left" fontWeight="bold">
                  {event.eventName}
                </Text>
                <Text color="gray.200" fontSize="sm" textAlign="left" mt={2} fontWeight='bold'>
                  {event.day} - {event.month} {event.year}
                </Text>

                <HStack space={1} alignItems="center"  marginTop={2}>
                  <LocationSvg width={10} height={10} fill="white" />
                  <Text color="#F9FAFC" fontSize="xs" textAlign="left">
                    {`${event.venue}, ${event.city} - ${event.country}`}
                  </Text>
                </HStack>

              </Box>
            </Box>

              <Box  alignItems='center' justifyContent='center'>



                  <Button

                    bg="transparent"
                    borderRadius={6}
                    borderWidth={1}
                    borderColor="purple.500"
                    width={180}
                    height={42}
                    color=""
                    marginTop={8}
                    onPress={handleBuyTicket}


                  >
                      <Text color="gray.100" textAlign="center">
                        BUY A TICKET
                      </Text>
                  </Button>


              </Box>
          </VStack>
              <Text color="gray.100" fontSize="lg" fontWeight={700} marginTop={8} marginLeft={6} >
          LOCATION
        </Text>
        <Pressable onPress={handleOpenGoogleMaps}>
            <Image
              source={require('../assets/map.png')}
              style={{
                height: 180,
                width: 370,
                borderRadius: 2,
                overflow: "hidden",
                marginLeft: 24,
                marginTop: 18
              }}
              resizeMode="cover"
              alt={`Map Image`}
            />
          </Pressable>
        </Pressable>
      )}
    </VStack>
  );
}



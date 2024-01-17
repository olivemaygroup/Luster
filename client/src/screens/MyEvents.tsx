import React, { useEffect, useState } from "react";
import { Image, Text, VStack, Box, HStack, ScrollView, Pressable, Heading } from "native-base";
import LocationSvg from "@assets/location.svg";
import ArrowSvg from '@assets/arrow.svg';
import { useNavigation } from '@react-navigation/native';
import { getUpcomingEvents } from '@services/ticketmasterService';


export function MyEvents({location, date}) {
  const navigation = useNavigation();
  const [eventsData, setEventsData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const events = await getUpcomingEvents(location, date);

      events.sort((a, b) => {
        const dateA = new Date(`${a.month} ${a.day}`);
        const dateB = new Date(`${b.month} ${b.day}`);
        return dateA - dateB;
      });

      setEventsData(events);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <ScrollView showsHorizontalScrollIndicator={false} >
      <Pressable

         onPress={() => {
          navigation.navigate('event_details');
        }}
      >
        <Box px={22}>
            <Text color="gray.100" fontSize="lg" fontWeight={700} marginTop={68}>
              YOURS EVENTS
            </Text>
        </Box>
        <VStack px={2} py={1}>
          {eventsData.map((event, index) => (
            <Box borderRadius={2}>
                <HStack space={4} width="100%" alignItems="center" px={4} py={1}>
                  <Box height={95} width={75}borderRadius={8} overflow="hidden" marginTop={6}>
                    <Image
                      source={{uri: event.image}}
                      style={{
                        flex: 1,
                        width: null,
                        height: null,
                        borderRadius: 8,
                        overflow: "hidden",
                      }}
                      resizeMode="cover"
                      alt={`Event Image ${index}`}
                    />
                  </Box>
                  <VStack alignItems="flex-start" flex={1} >
                    <Text color='gray.100' fontSize="md" fontWeight="bold" textAlign="left" lineHeight={20} mt={4}>
                      {event.day}
                    </Text>
                    <Text color='gray.100' fontSize="sm" textAlign="left" mt={1} >
                      {event.month}
                    </Text>
                    <Box >
                      <Text color='gray.100' fontSize="sm" fontWeight="bold" textAlign="left" mt={1} mr={8}>
                        {event.eventName}
                      </Text>
                    </Box>
                    <HStack space={1} alignItems="center" justifyContent="center" marginRight={4} marginTop={1}>
                      <LocationSvg width={10} height={10} fill="white" />
                      <Text color='#F9FAFC' fontSize="xs" textAlign="left" >
                        {`${event.venue}, ${event.city} - ${event.country}`}
                      </Text>
                    </HStack>
                    <ArrowSvg width={24} height={24} fill="#FFFFFF" position="absolute" top={62} right={18} />
                  </VStack>
                </HStack>

            </Box>
          ))}
        </VStack>
      </Pressable>
    </ScrollView>
  );
}

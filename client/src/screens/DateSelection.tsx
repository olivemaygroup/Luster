import React, { useState, useEffect } from 'react';
import { VStack, Image, Text, Button, Pressable, Center, Box, HStack } from 'native-base';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackgroundDateImg from '@assets/DateScreenImg.png';
import { useNavigation } from '@react-navigation/native';
// import { getTestEndpointData } from '../services/spotifyService';

type DateSelectionProps = {
  setDate: React.Dispatch<React.SetStateAction<Date>>;
}

export function DateSelection ({ setDate }: DateSelectionProps) {
  type selectedDatesType = Date[];

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDates, setSelectedDates] = useState<selectedDatesType>([]);
  const [inputValue, setInputValue] = useState('');
  const [today, setToday] = useState(new Date());

  const navigation = useNavigation();




  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const testEndpointData = await getTestEndpointData();

  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //     }
  //   };

  //   fetchData();
  // }, []);


  const onChangeDate = (_event: any, selected: any) => {
    if (_event.type === 'set' && selected) {
      setSelectedDate(selected);

    }
    setShowDatePicker(false);
  };

  

  const exploreEvents = async () => {
    try {
      await AsyncStorage.setItem('selectedDates', JSON.stringify(selectedDates));
      navigation.navigate('./events_feed', { selectedDates });


    } catch (error) {
      console.error(error);
    }
  };


  const isDateSelected = (date: Date) => {
    return selectedDates.some((selected: any) => selected.toDateString() === date.toDateString());
  };

  return (
    <VStack flex={1} bg="gray.700" px={22}>

      <Image source={BackgroundDateImg} alt="Music Event Image" maxW={428} maxH={624} resizeMode="cover" position="absolute" />

      {showDatePicker && <DateTimePicker value={selectedDate} mode="date" display="default" onChange={onChangeDate} />}

        <HStack flex={1} space={2} marginTop={412} justifyContent='center'>

          <Button
                  onPress={() => setShowDatePicker(true)}
                  bg="transparent"
                  borderRadius={6}
                  borderWidth={1}
                  borderColor="purple.500"
                  width={180}
                  height={42}
                >
                  <Text color="gray.100">Choose Event Date</Text>
          </Button>
        </HStack>



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
          onPress={exploreEvents}
          variant="unstyled"
           >
            <Text color="gray.100" fontSize="md" padding={2}>
              Explore Events
            </Text>
          </Button>
        </LinearGradient>
      </Pressable>
    </VStack>
  );
}
import { apiKey } from '.././../secret';


async function getEvents(location, date) {

  try {
    const response = await fetch(
      `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${apiKey}&size=5&classificationName=music&countryCode=ES&${location}&${date}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseData = await response.json();

    const eventsData = responseData._embedded.events.map(event => {
      const day = new Date(event.dates.start.localDate).getDate().toString();
      const month = new Date(event.dates.start.localDate).toLocaleString('default', { month: 'short' }).toUpperCase();
      const ticketmasterUrl = event.url;


      const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${event._embedded.venues[0].location.latitude},${event._embedded.venues[0].location.longitude}`;

      return {
        image: event.images[0].url,
        day,
        month,
        eventType: event.classifications[0].segment.name,
        eventName: event.name,
        ticketmasterUrl,
        googleMapsUrl,
        venue: event._embedded.venues[0].name,
        city: event._embedded.venues[0].city.name,
        country: event._embedded.venues[0].country.name,
      };
    });

    const uniqueEvents = [...new Set(eventsData)];

    return uniqueEvents;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
}

async function getUpcomingEvents(location, date) {
  try {
    const response = await fetch(
      `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${apiKey}&size=20&classificationName=music&countryCode=ES&${location}&${date}`
    );


    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseData = await response.json();

    const upcomingEventsData = responseData._embedded.events.map(event => ({
      day: new Date(event.dates.start.localDate).getDate().toString(),
      month: new Date(event.dates.start.localDate).toLocaleString('default', { month: 'short' }).toUpperCase(),
      eventName: event.name,
      venue: event._embedded.venues[0].name,
      city: event._embedded.venues[0].city.name,
      country: event._embedded.venues[0].country.name,
      image: event.images[0].url,
    }));

    return upcomingEventsData;
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
    throw error;
  }
}





export { getEvents, getUpcomingEvents };

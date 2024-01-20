

interface CTType {
  expiresAt: any;
  accessToken: any;
}
let cachedToken: CTType;

function capitalizeFirstLetter(string:string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function isGenre(artistName:string) {
  const genres = ['pop', 'rock', 'metal', 'reggae', 'indie', 'folk', 'soul', 'jazz', 'blues'];
  return genres.some((genre) => artistName.includes(genre));
}

async function getArtistData(artistId:any, token:any) {
  const response = await fetch(`https://api.spotify.com/v1/artists/${artistId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  return await response.json();
}

async function getToken(clientId:any, clientSecret:any) {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    body: new URLSearchParams({
      'grant_type': 'client_credentials',
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + (Buffer.from(`${clientId}:${clientSecret}`).toString('base64')),
    },
  });

  return await response.json();
}

exports.getCredentials = async (req: any, res: any): Promise <any> => {
  try {
    const spotifyCredentials = { clientId, clientSecret, redirectUri };

    if (!cachedToken || cachedToken.expiresAt < Date.now()) {
      const body = await getToken(clientId, clientSecret);
      cachedToken = {
        accessToken: body.access_token,
        expiresAt: Date.now() + body.expires_in * 1000,
      };
    }

    res.status(200).json({ accessToken: cachedToken.accessToken });/*fisgen - no clue what this is!*/
  } catch (error) {
    console.error('Error getting Spotify credentials:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}


exports.getArtists = async (req:any, res:any) => {
  try {
    const token = cachedToken.accessToken;

    if (!token) {
      console.error('Access token not available.');
      res.status(500).json({ error: 'Access token not available.' });
      return;
    }

    const response = await fetch('https://api.spotify.com/v1/search?type=artist&limit=10&sort=popularity', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(`Error fetching top artists: ${data.error}`);
      res.status(500).json({ error: 'Error fetching top artists.' });
      return;
    }

    const topArtists = data.artists && data.artists.items
      ? data.artists.items
      : [];

    const filteredTopArtists = topArtists
      .filter((artist:any) => !!artist.name)
      .sort(() => Math.random() - 0.5)
      .map((artist:any) => ({
        name: capitalizeFirstLetter(artist.name),
        image: artist.images && artist.images.length > 0
          ? artist.images[0].url
          : null,
      }));

    res.json(filteredTopArtists);
  } catch (error) {
    console.error('Error fetching top artists:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
// import * as React from 'react' 

import React, { createContext, useContext, useState, useEffect, ReactNode, ChildContextProvider, PropsWithChildren } from 'react';

const ArtistContext = createContext(null);

interface Artist {
  id: any;
  name: string;
}

export const ArtistProvider: React.FC = ({ children }:PropsWithChildren) => {
  const [selectedArtists, setSelectedArtists] = useState([]);
  const [favoriteArtistsNames, setFavoriteArtistsNames] = useState([]);

  const addSelectedArtist = (artist: Artist) => {
    // setSelectedArtists([...selectedArtists, artist]);
    setSelectedArtists((prevSelectedArtists):any=> [...prevSelectedArtists, artist]);
  };

  const removeSelectedArtist = (artist: Artist) => {
    setSelectedArtists(selectedArtists.filter((a: any) => a.id !== artist.id));
  };

  const clearSelectedArtists = (clear = true) => {
    setSelectedArtists(clear ? [] : selectedArtists);
  };

  useEffect(() => {
    const names: any = selectedArtists.map((artist: Artist) => artist.name);
    setFavoriteArtistsNames(names);
  }, [selectedArtists]);

  return (
    <ArtistContext.Provider
      value={{
        selectedArtists,
        addSelectedArtist,
        removeSelectedArtist,
        clearSelectedArtists,
        favoriteArtistsNames,
      }}
    >
      {children}
    </ArtistContext.Provider>
  );
};

export const useArtistContext = () => {
  return useContext(ArtistContext);
};

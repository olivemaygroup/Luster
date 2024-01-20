// import * as React from 'react' 

import React, { createContext, useContext, useState, useEffect, ReactNode, ChildContextProvider, PropsWithChildren } from 'react';


const ArtistContext = createContext<ArtistContextType | null>(null);

interface Artist {
  id: any;
  name: string;
}

interface ArtistContextType {
  selectedArtists: Artist[];
  addSelectedArtist: (artist: Artist) => void;
  removeSelectedArtist: (artist: Artist) => void;
  clearSelectedArtists: (clear?: boolean) => void;
  favoriteArtistsNames: string[];

}


export const ArtistProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [selectedArtists, setSelectedArtists] = React.useState<Artist[]>([]);
  const [favoriteArtistsNames, setFavoriteArtistsNames] = React.useState<string[]>([]);

  const addSelectedArtist = (artist: Artist) => {
    setSelectedArtists([...selectedArtists, artist]);
    // setSelectedArtists((prevSelectedArtists) => [...prevSelectedArtists, artist]);
  };

  const removeSelectedArtist = (artist: Artist) => {
    setSelectedArtists(selectedArtists.filter((a) => a.id !== artist.id));
  };

  const clearSelectedArtists = (clear = true) => {
    setSelectedArtists(clear ? [] : selectedArtists);
  };

  useEffect(() => {
    const names: string[] = selectedArtists.map((artist: Artist) => artist.name);
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
  const context = useContext(ArtistContext);
  if (!context) {
    throw new Error('useArtistContext must be used within an ArtistProvider')
  }
  return context;
};

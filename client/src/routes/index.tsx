import React from 'react';
import { useTheme, Box } from 'native-base';
import { NavigationContainer, DefaultTheme, Theme } from "@react-navigation/native";

import { AppRoutes } from "../routes/app.routes";

export function Routes(): React.FC {
  const { colors } = useTheme();

  const theme: Theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: colors.gray[700],
    },
  };

  return (
    <Box flex={1} bg="gray.700">
      <NavigationContainer theme={theme}> 
        <AppRoutes />
      </NavigationContainer>
    </Box>
  );
}

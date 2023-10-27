import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
// @mui
import { CssBaseline } from '@mui/material';
import {
  createTheme,
  StyledEngineProvider,
  ThemeProvider as MUIThemeProvider,
} from '@mui/material/styles';
// components
import { useSettingsContext } from '../components/settings';
//
import palette from './palette';
import typography from './typography';
import shadows from './shadows';
import customShadows from './customShadows';
import componentsOverride from './overrides';
import GlobalStyles from './globalStyles';

// ----------------------------------------------------------------------

ThemeProvider.propTypes = {
  children: PropTypes.node,
};

export default function ThemeProvider({ children }) {
  const { themeMode, themeDirection, themeDnsData } = useSettingsContext();
  const [paletteObj, setPaletteObj] = useState(palette(themeMode))
  useEffect(() => {
    if (themeDnsData?.theme_css?.main_color) {
      let palette_obj = { ...paletteObj };
      palette_obj['primary']['main'] = themeDnsData?.theme_css?.main_color;
      palette_obj['primary']['dark'] = themeDnsData?.theme_css?.main_color;
      palette_obj['primary']['darker'] = themeDnsData?.theme_css?.main_color;
      palette_obj['primary']['light'] = themeDnsData?.theme_css?.main_color + '';
      palette_obj['primary']['lighter'] = themeDnsData?.theme_css?.main_color + '29';
      setPaletteObj(palette_obj);
    }
  }, [themeDnsData])
  const themeOptions = useMemo(
    () => ({
      palette: palette(themeMode),
      typography,
      shape: { borderRadius: 8 },
      direction: themeDirection,
      shadows: shadows(themeMode),
      customShadows: customShadows(themeMode),
    }),
    [themeDirection, themeMode]
  );

  const theme = createTheme(themeOptions);

  theme.components = componentsOverride(theme);

  return (
    <StyledEngineProvider injectFirst>
      <MUIThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles />
        {children}
      </MUIThemeProvider>
    </StyledEngineProvider>
  );
}

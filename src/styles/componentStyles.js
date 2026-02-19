/**
 * Reusable component styles and utilities
 * Use these across your application for consistent styling
*/
import { createTheme } from '@mui/material/styles';

// Common flex layout utilities
export const flexRow = { display: 'flex', flexDirection: 'row' };
export const flexColumn = { display: 'flex', flexDirection: 'column' };
export const flexCenter = { display: 'flex', alignItems: 'center' };
export const flexCenterGap = (gap) => ({ display: 'flex', alignItems: 'center', gap });
export const flexBetween = { display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
export const flexEnd = { display: 'flex', justifyContent: 'flex-end', alignItems: 'center' };

/**
 * Get styles for modern tab container with subtle background and shadow
 * @param {Object} theme - MUI theme object
 * @returns {Object} Style object for tab container
 */
export const getTabContainerStyles = (theme) => ({
  mt: 4,
  backgroundColor: theme.palette.background.paper, // Use theme paper color
  borderRadius: 2,
  boxShadow: theme.palette.mode === 'dark' 
    ? '0 2px 8px rgba(0, 0, 0, 0.3)' 
    : '0 2px 8px rgba(0, 0, 0, 0.08)',
  overflow: 'hidden',
  border: `1px solid ${theme.palette.divider}`, // Add subtle border for definition
});

/**
 * Get styles for modern tabs with icons and smooth transitions
 * @param {Object} theme - MUI theme object
 * @returns {Object} Style object for tabs component
 */
export const getTabStyles = (theme) => ({
  borderBottom: 1,
  borderColor: 'divider',
  backgroundColor: theme.palette.background.header, // Use header background for differentiation
  
  // Remove any centering - tabs will be left-aligned by default
  '& .MuiTabs-flexContainer': {
    justifyContent: 'flex-start', // Explicitly left-align
  },
  
  '& .MuiTab-root': {
    textTransform: 'none',
    fontSize: '1rem',
    fontWeight: 500,
    minHeight: 64,
    minWidth: 120, // Ensure tabs have minimum width
    paddingLeft: theme.spacing(3), // 24px horizontal padding
    paddingRight: theme.spacing(3),
    marginRight: theme.spacing(1), // 8px spacing between tabs
    borderRadius: '8px 8px 0 0', // Rounded top corners
    transition: 'all 0.2s ease-in-out',
    // Mobile responsive adjustments
    [theme.breakpoints.down('sm')]: {
      minWidth: 80, // Narrower tabs on mobile
      paddingLeft: theme.spacing(1.5), // 12px padding
      paddingRight: theme.spacing(1.5),
      marginRight: theme.spacing(0.5), // 4px spacing between tabs
      fontSize: '0.875rem', // Slightly smaller text
      minHeight: 48, // Shorter tabs
    },
    '&:hover': {
      backgroundColor: theme.palette.action.hover, // Use theme action color
    },
    '&.Mui-selected': {
      fontWeight: 600,
      backgroundColor: theme.palette.background.paper, // Selected tab matches content
    },
    '&:last-of-type': {
      marginRight: 0, // Remove margin from last tab
    }
  },
  '& .MuiTabs-indicator': {
    height: 3,
    borderRadius: '3px 3px 0 0',
  }
});

/**
 * Common button group styles
 */
export const buttonGroup = {
  display: 'flex',
  gap: 2,
  mt: 2
};

/**
 * Common modal footer styles
 */
export const modalFooter = {
  display: 'flex',
  justifyContent: 'flex-end',
  mt: 2,
  gap: 2
};

/**
 * Clickable box with cursor pointer
 */
export const clickable = {
  cursor: 'pointer',
  transition: 'opacity 0.2s ease-in-out',
  '&:hover': {
    opacity: 0.8
  }
};

/**
 * Get clickable box with centered content and color
 * @param {string} color - Color for the box
 * @returns {Object} Style object
 */
export const getClickableBox = (color) => ({
  ...flexCenter,
  color,
  cursor: 'pointer',
  transition: 'opacity 0.2s ease-in-out',
  '&:hover': {
    opacity: 0.7
  }
});

// Warning styles using CSS variable (falls back to theme if desired)
export const warningBox = (theme) => ({
  backgroundColor: `var(--color-warn, ${theme?.palette?.warning?.main || '#FFA000'})`,
  color: `var(--color-warn-contrast, ${theme?.palette?.warning?.contrastText || '#fff'})`,
  padding: theme?.spacing ? `${theme.spacing(1)} ${theme.spacing(2)}` : '8px 16px',
  borderRadius: 4,
});

export const warningText = (theme) => ({
  color: `var(--color-warn-dark, ${theme?.palette?.warning?.dark || '#FF8F00'})`
});

/**
 * Get responsive tab props based on container width
 * Returns variant and scrollButtons props for Tabs component
 * @param {boolean} isSmallScreen - Whether screen is mobile (from useMediaQuery)
 * @param {number} tabCount - Number of tabs to display
 * @returns {Object} Props object for Tabs component
 */
export const getResponsiveTabProps = (isSmallScreen, tabCount) => {
  // On mobile or with many tabs, use scrollable mode
  const shouldScroll = isSmallScreen || tabCount > 4;
  
  return {
    variant: shouldScroll ? 'scrollable' : 'standard',
    scrollButtons: shouldScroll ? 'auto' : false,
    allowScrollButtonsMobile: true,
  };
};

const createTennisTheme = (primaryColor, secondaryColor, themeName) => {
  // Create base color for subtle background variations
  const getBackgroundShades = (primary) => {
    // Different background strategies per theme
    switch(themeName) {
      case 'Navy & Court Green':
        return {
          default: '#f5f7fa',      // Very light blue-gray
          paper: '#ffffff',         // Pure white
          header: '#e3f2fd',        // Light blue tint
        };
      case 'Modern Sport':
        return {
          default: '#f5f5f5',       // Warm light gray
          paper: '#ffffff',         // Pure white
          header: '#fafafa',        // Slightly lighter
        };
      case 'Wimbledon':
        return {
          default: '#f9f8fc',       // Very light purple tint
          paper: '#ffffff',         // Pure white
          header: '#f3e5f5',        // Light purple
        };
      case 'Clean Minimal':
        return {
          default: '#f8f9fa',       // Cool light gray
          paper: '#ffffff',         // Pure white
          header: '#eceff1',        // Light blue-gray
        };
      default: // Tennis Classic
        return {
          default: '#f1f8f4',       // Very light green tint
          paper: '#ffffff',         // Pure white
          header: '#e8f5e9',        // Light green (for banner)
        };
    }
  };

  const backgrounds = getBackgroundShades(primaryColor);

  return createTheme({
    palette: {
      primary: {
        main: primaryColor,
        light: lightenColor(primaryColor, 20),
        dark: darkenColor(primaryColor, 20),
      },
      secondary: {
        main: secondaryColor,
        light: lightenColor(secondaryColor, 20),
        dark: darkenColor(secondaryColor, 20),
      },
      background: {
        default: backgrounds.default,  // Main page background
        paper: backgrounds.paper,      // Cards, dialogs, drawers
        header: backgrounds.header,    // Header/navigation areas
      },
      text: {
        primary: '#333333',
        secondary: '#666666',
      },
      divider: 'rgba(0, 0, 0, 0.12)',
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      h1: { fontWeight: 700 },
      h2: { fontWeight: 600 },
      h3: { fontWeight: 600 },
      h4: { fontWeight: 600 },
      h5: { fontWeight: 500 },
      h6: { fontWeight: 500 },
      button: { textTransform: 'none', fontWeight: 500 },
    },
    shape: {
      borderRadius: 8,
    },
    spacing: 8,
  });
};

// Helper functions remain the same
const lightenColor = (color, percent) => {
  const num = parseInt(color.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.min(255, (num >> 16) + amt);
  const G = Math.min(255, ((num >> 8) & 0x00ff) + amt);
  const B = Math.min(255, (num & 0x0000ff) + amt);
  return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`;
};

const darkenColor = (color, percent) => {
  const num = parseInt(color.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.max(0, (num >> 16) - amt);
  const G = Math.max(0, ((num >> 8) & 0x00ff) - amt);
  const B = Math.max(0, (num & 0x0000ff) - amt);
  return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`;
};

export const themes = {
  classic: {
    name: 'Tennis Classic',
    description: 'Traditional tennis greens with improved contrast',
    primary: '#2E7D32',
    secondary: '#66BB6A',
  },
  navy: {
    name: 'Navy & Court Green',
    description: 'Professional navy blue with tennis green accents',
    primary: '#1565C0',
    secondary: '#43A047',
  },
  modern: {
    name: 'Modern Sport',
    description: 'Bold charcoal with energetic orange highlights',
    primary: '#37474F',
    secondary: '#FF6F00',
  },
  wimbledon: {
    name: 'Wimbledon',
    description: 'Iconic purple and green championship colors',
    primary: '#5E35B1',
    secondary: '#66BB6A',
  },
  minimal: {
    name: 'Clean Minimal',
    description: 'Sophisticated slate with teal accents',
    primary: '#455A64',
    secondary: '#00897B',
  },
};

export const PrimaryTheme = (themeKey = 'classic') => {
  const theme = themes[themeKey] || themes.classic;
  return createTennisTheme(theme.primary, theme.secondary, theme.name);
};

export default PrimaryTheme;

/**
 * Reusable component styles and utilities
 * Use these across your application for consistent styling
 */

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
  backgroundColor: theme.palette.mode === 'dark' 
    ? 'rgba(255, 255, 255, 0.05)' 
    : 'rgba(0, 0, 0, 0.02)',
  borderRadius: 2,
  boxShadow: theme.palette.mode === 'dark' 
    ? '0 2px 8px rgba(0, 0, 0, 0.3)' 
    : '0 2px 8px rgba(0, 0, 0, 0.08)',
  overflow: 'hidden'
});

/**
 * Get styles for modern tabs with icons and smooth transitions
 * @param {Object} theme - MUI theme object
 * @returns {Object} Style object for tabs component
 */
export const getTabStyles = (theme) => ({
  borderBottom: 1,
  borderColor: 'divider',
  '& .MuiTab-root': {
    textTransform: 'none',
    fontSize: '1rem',
    fontWeight: 500,
    minHeight: 64,
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      backgroundColor: theme.palette.mode === 'dark' 
        ? 'rgba(255, 255, 255, 0.08)' 
        : 'rgba(0, 0, 0, 0.04)',
    },
    '&.Mui-selected': {
      fontWeight: 600,
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

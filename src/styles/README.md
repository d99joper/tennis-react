# Component Styles Utilities

This directory contains reusable styling utilities for consistent design across the application.

## Usage

### Import the utilities you need:

```javascript
import { 
  flexRow, 
  flexColumn, 
  flexCenter,
  flexCenterGap,
  getTabContainerStyles,
  getTabStyles,
  getClickableBox,
  modalFooter
} from 'styles/componentStyles';
```

### Example: Modern Tabs Component

```javascript
import { useTheme, useMediaQuery, Box, Tabs, Tab } from '@mui/material';
import { getTabContainerStyles, getTabStyles } from 'styles/componentStyles';
import { MdEvent, MdPeople, MdSettings } from 'react-icons/md';

function MyPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [activeTab, setActiveTab] = useState(0);

  const tabContainerStyles = useMemo(() => getTabContainerStyles(theme), [theme]);
  const tabStyles = useMemo(() => getTabStyles(theme), [theme]);

  return (
    <Box sx={tabContainerStyles}>
      <Tabs
        value={activeTab}
        onChange={(e, val) => setActiveTab(val)}
        variant={isMobile ? "fullWidth" : "standard"}
        centered={!isMobile}
        sx={tabStyles}
      >
        <Tab icon={<MdEvent size={20} />} iconPosition="start" label="Events" />
        <Tab icon={<MdPeople size={20} />} iconPosition="start" label="Members" />
        <Tab icon={<MdSettings size={20} />} iconPosition="start" label="Settings" />
      </Tabs>
      
      <Box sx={{ p: 3 }}>
        {/* Tab content here */}
      </Box>
    </Box>
  );
}
```

### Example: Flex Layout Utilities

```javascript
import { flexRow, flexColumn, flexCenterGap, flexBetween } from 'styles/componentStyles';

// Horizontal layout with centered items and gap
<Box sx={flexCenterGap(2)}>
  <Icon />
  <Typography>Label</Typography>
</Box>

// Vertical column layout
<Box sx={flexColumn}>
  <Item1 />
  <Item2 />
</Box>

// Space between items
<Box sx={flexBetween}>
  <LeftContent />
  <RightContent />
</Box>
```

### Example: Clickable Boxes

```javascript
import { getClickableBox } from 'styles/componentStyles';

<Box
  sx={getClickableBox("primary.main")}
  onClick={handleClick}
>
  <Icon /> Action
</Box>
```

### Example: Modal Footer

```javascript
import { modalFooter } from 'styles/componentStyles';

<Box sx={modalFooter}>
  <Button variant="outlined" onClick={handleCancel}>Cancel</Button>
  <Button variant="contained" onClick={handleSave}>Save</Button>
</Box>
```

## Available Utilities

### Layout Utilities
- `flexRow` - Horizontal flex layout
- `flexColumn` - Vertical flex layout
- `flexCenter` - Centered flex items
- `flexCenterGap(gap)` - Centered flex with custom gap
- `flexBetween` - Space between with centered items
- `flexEnd` - Flex end alignment

### Component Utilities
- `getTabContainerStyles(theme)` - Modern tab container with background and shadow
- `getTabStyles(theme)` - Tab styles with icons and transitions
- `getClickableBox(color)` - Clickable box with hover effect
- `modalFooter` - Consistent modal footer layout
- `buttonGroup` - Button group layout
- `clickable` - Generic clickable element with hover

## Benefits

✅ **Consistency** - Same look and feel across all pages  
✅ **Maintainability** - Update once, apply everywhere  
✅ **Performance** - Memoized styles reduce re-renders  
✅ **Readability** - Clear, semantic naming  
✅ **Less Code** - Reuse instead of repeat

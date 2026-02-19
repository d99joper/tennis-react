import React, { useContext } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Chip,
  Tab,
  Tabs,
  Paper,
  Alert
} from '@mui/material';
import { ThemeContext } from 'contexts/ThemeContext';
import { themes, themeNames } from 'theme_config';
import { Helmet } from 'react-helmet-async';
import { MdColorLens, MdCheck } from 'react-icons/md';

const ThemeSelector = () => {
  const { currentTheme, setCurrentTheme, theme } = useContext(ThemeContext);
  const [previewTab, setPreviewTab] = React.useState(0);

  const handleThemeChange = (event) => {
    setCurrentTheme(event.target.value);
  };

  const themeDescriptions = {
    classic: 'Traditional green tennis colors with improved contrast. Professional and familiar.',
    navy: 'Deep navy blue primary with tennis court green accents. Clean and authoritative.',
    charcoal: 'Modern charcoal gray with vibrant orange. Bold and energetic sport aesthetic.',
    wimbledon: 'Iconic purple and green inspired by the prestigious tournament. Elegant and distinctive.',
    minimal: 'Sophisticated slate gray with teal accents. Contemporary and understated.'
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Helmet>
        <title>Theme Selector | My Tennis Space</title>
      </Helmet>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <MdColorLens size={32} />
          Theme Selector
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Choose a color scheme for your application. Changes are saved automatically.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Theme Selector */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Select Theme
              </Typography>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Color Scheme</InputLabel>
                <Select
                  value={currentTheme}
                  label="Color Scheme"
                  onChange={handleThemeChange}
                >
                  {themeNames.map((name) => (
                    <MenuItem key={name} value={name}>
                      {themes[name].name}
                      {name === currentTheme && <MdCheck style={{ marginLeft: 8 }} />}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {themeDescriptions[currentTheme]}
              </Typography>

              <Alert severity="info" sx={{ mt: 2 }}>
                Your selection is saved automatically and will persist across sessions.
              </Alert>
            </CardContent>
          </Card>

          {/* Color Palette Display */}
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Color Palette
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Primary
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                    <Box
                      sx={{
                        width: 60,
                        height: 60,
                        bgcolor: theme.palette.primary.main,
                        borderRadius: 1,
                        border: '1px solid',
                        borderColor: 'divider'
                      }}
                    />
                    <Box
                      sx={{
                        width: 40,
                        height: 60,
                        bgcolor: theme.palette.primary.light,
                        borderRadius: 1,
                        border: '1px solid',
                        borderColor: 'divider'
                      }}
                    />
                    <Box
                      sx={{
                        width: 40,
                        height: 60,
                        bgcolor: theme.palette.primary.dark,
                        borderRadius: 1,
                        border: '1px solid',
                        borderColor: 'divider'
                      }}
                    />
                  </Box>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Secondary
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                    <Box
                      sx={{
                        width: 60,
                        height: 60,
                        bgcolor: theme.palette.secondary.main,
                        borderRadius: 1,
                        border: '1px solid',
                        borderColor: 'divider'
                      }}
                    />
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Live Preview */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Live Preview - {theme.name}
              </Typography>
              
              {/* Preview Tabs */}
              <Paper sx={{ width: '100%', mb: 3 }}>
                <Tabs 
                  value={previewTab} 
                  onChange={(e, v) => setPreviewTab(v)}
                  variant="fullWidth"
                >
                  <Tab label="Components" />
                  <Tab label="Buttons" />
                  <Tab label="Forms" />
                </Tabs>
              </Paper>

              {/* Components Preview */}
              {previewTab === 0 && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Sample Card Component
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        This is how cards will appear with the selected theme.
                        Notice the contrast between text and background.
                      </Typography>
                      <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                        <Chip label="Tag 1" color="primary" />
                        <Chip label="Tag 2" color="secondary" />
                        <Chip label="Tag 3" variant="outlined" />
                      </Box>
                    </CardContent>
                  </Card>

                  <Alert severity="success">Success message styling</Alert>
                  <Alert severity="info">Information message styling</Alert>
                  <Alert severity="warning">Warning message styling</Alert>
                  <Alert severity="error">Error message styling</Alert>
                </Box>
              )}

              {/* Buttons Preview */}
              {previewTab === 1 && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Primary Buttons
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                      <Button variant="contained" color="primary">
                        Contained
                      </Button>
                      <Button variant="outlined" color="primary">
                        Outlined
                      </Button>
                      <Button variant="text" color="primary">
                        Text
                      </Button>
                    </Box>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Secondary Buttons
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                      <Button variant="contained" color="secondary">
                        Contained
                      </Button>
                      <Button variant="outlined" color="secondary">
                        Outlined
                      </Button>
                      <Button variant="text" color="secondary">
                        Text
                      </Button>
                    </Box>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Action Buttons
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                      <Button variant="contained" color="error">
                        Delete
                      </Button>
                      <Button variant="contained" color="warning">
                        Archive
                      </Button>
                      <Button variant="contained" color="success">
                        Approve
                      </Button>
                    </Box>
                  </Box>
                </Box>
              )}

              {/* Forms Preview */}
              {previewTab === 2 && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <FormControl fullWidth>
                    <InputLabel>Sample Select Field</InputLabel>
                    <Select label="Sample Select Field" value="">
                      <MenuItem value={1}>Option 1</MenuItem>
                      <MenuItem value={2}>Option 2</MenuItem>
                      <MenuItem value={3}>Option 3</MenuItem>
                    </Select>
                  </FormControl>

                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button variant="contained" fullWidth>
                      Submit
                    </Button>
                    <Button variant="outlined" fullWidth>
                      Cancel
                    </Button>
                  </Box>

                  <Typography variant="body2" color="text.secondary">
                    Form elements use the primary color for focus states and
                    maintain good contrast for readability.
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* All Themes Overview */}
      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            All Available Themes
          </Typography>
          <Grid container spacing={2}>
            {themeNames.map((name) => {
              const t = themes[name];
              return (
                <Grid item xs={12} sm={6} md={4} key={name}>
                  <Paper
                    sx={{
                      p: 2,
                      cursor: 'pointer',
                      border: 2,
                      borderColor: name === currentTheme ? 'primary.main' : 'transparent',
                      '&:hover': {
                        borderColor: 'primary.light',
                      },
                    }}
                    onClick={() => setCurrentTheme(name)}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {t.name}
                      </Typography>
                      {name === currentTheme && <MdCheck color={theme.palette.primary.main} />}
                    </Box>
                    <Box sx={{ display: 'flex', gap: 0.5, mb: 1 }}>
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          bgcolor: t.palette.primary.main,
                          borderRadius: 1,
                        }}
                      />
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          bgcolor: t.palette.secondary.main,
                          borderRadius: 1,
                        }}
                      />
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          bgcolor: t.palette.background.header,
                          borderRadius: 1,
                          border: '1px solid',
                          borderColor: 'divider'
                        }}
                      />
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {themeDescriptions[name]}
                    </Typography>
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ThemeSelector;

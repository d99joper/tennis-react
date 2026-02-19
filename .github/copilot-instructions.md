# Tennis React App - AI Coding Instructions

## Project Overview
React-based tennis community platform for managing clubs, players, ladders, leagues, tournaments, and matches. Built with Material-UI v7, Firebase notifications, and a Django REST backend.

## Code Standards
- **Indentation:** Always use 2 spaces (never tabs)

## Development Guidelines

### Component Rules
- Use functional components only
- Use hooks instead of class components
- Keep components focused and under 200-300 lines when practical
- Extract reusable logic into custom hooks (see `src/helpers/`)
- Avoid prop drilling — lift state or use context when appropriate
- Never duplicate UI logic across components

### State Management
- Use `useState` for local state
- Use `useEffect` carefully — avoid unnecessary re-renders
- Always include dependency arrays
- Avoid derived state duplication
- Memoize expensive computations using `useMemo`
- Memoize callbacks with `useCallback` when passed to children

**Never:**
- Store computed values in state if they can be derived
- Trigger infinite loops in `useEffect`

### API Integration
- All API calls must be isolated in `src/api/services/`
- Never call fetch directly inside components - always use API services
- Handle loading, success, and error states explicitly
- Always wrap async calls in try/catch
- Never ignore API errors

**Standard loading state pattern:**
```javascript
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
const [data, setData] = useState(null);
```

Do not mix UI rendering with API logic.

### MUI Usage Standards
- Use MUI v7 components instead of raw HTML when possible
- **Always import shared styles from `styles/componentStyles.js`** (`flexRow`, `flexColumn`, `getTabStyles`, etc.)
- **Always use theme from `theme_config.js`** via `useTheme()` hook
- Use `sx` prop for styling, not inline styles
- Maintain consistent padding and margins via `theme.spacing()`
- Memoize theme-dependent styles: `useMemo(() => getTabStyles(theme), [theme])`

**Never:**
- Hardcode colors outside `PrimaryTheme`
- Mix multiple styling systems
- Create custom styles without checking `componentStyles.js` first
- Skip responsive breakpoints: `useMediaQuery(theme.breakpoints.down('md'))`

**Button patterns:**
- Primary actions: `variant="contained"`
- Secondary actions: `variant="outlined"`
- Destructive actions: `color="error"`

### Forms & Validation
- Use controlled components
- Always validate before submit
- Disable submit while loading
- Show clear error messages
- Never allow silent failures

For large forms:
- Extract form sections into smaller components in `src/components/forms/`
- Keep validation logic separate from UI when possible

### Performance Rules
- Lazy load routes using `React.lazy` (see `src/routes.js`)
- Avoid unnecessary re-renders
- Use `React.memo` when appropriate (e.g., `MemoizedHeader`, `MemoizedFooter`)
- Virtualize large lists
- Paginate API-driven lists

**Never:**
- Render large datasets without pagination
- Fetch data repeatedly without dependency control

### Authentication
- Never assume user is authenticated
- Handle unauthorized responses (401)
- Redirect to login when necessary
- Auth state is centralized in `AuthContext`
- User object includes: `isLoggedIn`, `user`, `isProSubscriber`, `isBasicSubscriber`

### File Organization
- Pages live in `src/views/`
- Reusable components live in `src/components/forms/` (organized by entity folder)
- API services live in `src/api/services/`
- Custom hooks live in `src/helpers/` (`useAwardToast`, `useGoogleMapsApi`, etc.)

**Never:**
- Put API calls inside UI component files
- Create giant multi-purpose components

## Architecture

### API Service Layer (`src/api/services/`)
- Each entity (club, player, match, ladder, league, tournament, court, event) has a dedicated service module
- **`fetchWithRetry`** used ONLY for specific GET operations prone to cold starts (getting player, event, events) - exponential backoff with 3 retries
- Regular `fetch` used for all other operations, especially POST/PUT/DELETE mutations
- Import services from `api/services`: `import { clubAPI, playerAPI, matchAPI } from 'api/services'`
- Auth handled via Token authentication: `'Authorization': 'Token ' + key`
- Service methods return `{success, statusCode, data}` objects

### API Configuration (`src/config.js`)
- Environment detection: localhost vs production via `REACT_APP_API_BASE`
- Local dev override: set `REACT_APP_USE_LOCAL_DB=true` to use `http://127.0.0.1:8000/`
- Always import as: `import apiUrl from 'config'`

### Context Providers (Required App Structure)
1. **AuthContext** - User authentication state, token management, `isLoggedIn`, `user`, `login()`, `logout()`
2. **NotificationContext** - Firebase push notifications with badge/trophy display
3. **SnackbarContext** - Toast notifications
- import { useSnackbar } from 'contexts/snackbarContext';
- const { showSnackbar } = useSnackbar();

### Component Organization
- **Views** (`src/views/`) - Page-level components that fetch data and orchestrate layout
- **Forms** (`src/components/forms/`) - Reusable entity-specific components organized by folder (Club/, Player/, Match/, etc.)
- **Layout** (`src/components/layout/`) - Shared layout components (Header, Footer, Modals)

### Custom Components
- **ProfileImage** - Handles profile image display with fallback and styling
- **Wizard** - Multi-step form component for complex entity creation (e.g., tournament setup)
- **MyModal** - Custom modal wrapper with consistent styling and behavior
- **InfoPopup** - Reusable info tooltip component
- **MatchEditor** - Complex component for creating/editing matches with dynamic participant selection
- **Editable** - Inline editable text component with validation
- **truncateText** - Utility function for truncating text with ellipsis
- **FloatingAward** - Component for displaying floating badge/trophy notifications

### Iconography
- Use react-icons for consistent iconography across the app
- Import icons from `react-icons/*` as needed (e.g., `import { FaTrophy } from 'react-icons/fa'`)

### Routing (`src/routes.js`)
- React Router v6 with lazy-loaded route components
- Routes follow pattern: `/entity/:entityId` (e.g., `/players/:userid`, `/clubs/:clubId`)
- Header/Footer conditionally rendered based on route

## Development Patterns

### Styling & Theming
- **Always** import shared style utilities from `styles/componentStyles.js`:
there is also a `theme_config.js` that defines the custom MUI theme with tennis-specific colors and typography. Always use `useTheme()` to access theme values in components.
  ```javascript
  import { flexRow, flexColumn, flexCenterGap, getTabContainerStyles, getTabStyles, getClickableBox, modalFooter } from 'styles/componentStyles';
  ```
- Memoize theme-dependent styles: `const tabStyles = useMemo(() => getTabStyles(theme), [theme])`
- Custom theme in `theme_config.js` exports `PrimaryTheme` with tennis-specific color palette
- Responsive breakpoints: `const isMobile = useMediaQuery(theme.breakpoints.down('md'))`

### Component Patterns
```javascript
// Standard view component structure
import { clubAPI } from 'api/services';
import { AuthContext } from 'contexts/AuthContext';
import { flexColumn, getTabContainerStyles } from 'styles/componentStyles';

function MyView() {
  const { user, isLoggedIn } = useContext(AuthContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const tabStyles = useMemo(() => getTabStyles(theme), [theme]);
  
  useEffect(() => {
    async function fetchData() {
      const response = await clubAPI.getClub(id);
      if (response.success) {
        setData(response.data);
      }
    }
    fetchData();
  }, [id]);
  
  return <Box sx={flexColumn}>...</Box>;
}
```

### Helper Utilities (`src/helpers/helpers.js`)
- **`hasValue(param)`** - Check if value exists (handles null, undefined, empty string, NaN)
- **`truncateText(text, length)`** - Truncate with ellipsis (default 20 chars)
- **`parseTextToHTML(text)`** - Convert `[[Text|URL]]` to links and newlines to `<br />`
- **`camelToSnake(obj)`** - Convert object keys from camelCase to snake_case
- **`validateEmail(email)`** - Email regex validation

### Constants & Enums (`src/helpers/const.js`)
Use enums for match types, participant types, login modes:
```javascript
import { enums } from 'helpers/const';
// PARTICIPANT_TYPES: SINGLES, DOUBLES, TEAM
// MATCH_FORMATS: REGULAR_3, PRO_8, PRO_10, FAST4_3, FAST4_5
// DISPLAY_MODE: Card, Inline, Table, SimpleList
```

## Environment Variables (`.env`)
Required `REACT_APP_*` variables (see `src/config.js`, `src/firebase/firebase.js`):
- `REACT_APP_API_BASE` - Backend API URL
- `REACT_APP_USE_LOCAL_DB` - Force local API (true/false)
- `REACT_APP_GOOGLE_CLIENT_ID` - Google OAuth
- `REACT_APP_FIREBASE_*` - Firebase config (API_KEY, AUTH_DOMAIN, PROJECT_ID, etc.)
- `REACT_APP_FIREBASE_VAPID_KEY` - FCM web push
- `REACT_APP_PLACES_API_KEY` - Google Maps/Places
- `REACT_APP_MAP_ID` - Google Maps ID

## Build & Development

### Commands
- **`npm start`** - HTTPS dev server on port 3000 (requires `localhost.pem` and `localhost-key.pem` in root)
- **`npm run build`** - Production build (auto-generates Firebase service worker via `generate-sw.js`)
- **`npm test`** - Jest test runner

### CRACO Configuration
- Custom HTTPS dev server config in `craco.config.js`
- Requires local SSL certificates: `localhost.pem` and `localhost-key.pem`

### Service Worker Generation
- `generate-sw.js` dynamically creates `public/firebase-messaging-sw.js` with Firebase config
- Run automatically during build, but NOT included in version control
- Uses environment variables (without `REACT_APP_` prefix)

## Firebase Push Notifications
- Foreground: handled in `App.js` via `onNotificationReceived()`
- Background: service worker in `public/firebase-messaging-sw.js`
- Special handling for badge/trophy notifications using `useAwardToast` hook
- Permission requested on app mount in `App.js`

## Common Entity Patterns

### Club Operations
```javascript
import { clubAPI } from 'api/services';

const club = await clubAPI.getClub(clubId); // Returns {success, statusCode, data}
const members = await clubAPI.getMembers(clubId);
await clubAPI.addPlayer(clubId, playerId);
await clubAPI.removePlayer(clubId, playerId);
```

### Player/User Flow
- **AuthContext** provides `user` object populated on mount via `playerAPI.getPlayer(null, true)`
- User object includes subscription flags: `isProSubscriber`, `isBasicSubscriber`
- Profile images handled via `ProfileImage` component

### Match & Event Entities
- Match formats defined in `helpers/const.js` (REGULAR_3, PRO_8, etc.)
- Events can be active or archived
- Matches linked to ladders, leagues, or tournaments

## Testing
- Test files: `src/helpers/helpers.test.js` (example)
- Use `npm test` to run Jest in watch mode

## Key Gotchas
- `fetchWithRetry` is ONLY for specific GET operations that may experience cold starts (player, event, events) - never use for POST/PUT/DELETE
- Always check `response.success` or `response.ok` before accessing `response.data`
- Service worker changes require browser hard refresh or cache clear
- HTTPS dev server required for Firebase messaging in development
- Use `hasValue()` helper instead of truthy checks to handle edge cases
- Always use 2-space indentation throughout the codebase

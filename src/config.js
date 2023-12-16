let apiUrl 

const isLocalhost = Boolean(
  window.location.hostname === "localhost" ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === "[::1]" ||
    // 127.0.0.1/8 is considered localhost for IPv4.
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
)

const useLocalDbConnection = process.env.REACT_APP_USE_LOCAL_DB?.toLowerCase() === 'true'

if(isLocalhost && useLocalDbConnection) {
  apiUrl = 'http://127.0.0.1:8000/'
  console.log('we are here because isLocalhost && useLocalDbConnection is', isLocalhost && useLocalDbConnection)
}
else
  apiUrl = 'https://mytennis-space.uw.r.appspot.com/'

export default apiUrl
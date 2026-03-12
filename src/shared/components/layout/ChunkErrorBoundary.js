import React from 'react';

/**
 * Catches ChunkLoadError (and similar dynamic import failures) that occur when
 * a new build is deployed and the browser has cached the old HTML but the old
 * chunk files no longer exist on the CDN. Automatically reloads the page once
 * to fetch the latest build. Falls back to a simple error message if reload
 * does not resolve the issue.
 */
class ChunkErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    const isChunkError =
      error?.name === 'ChunkLoadError' ||
      error?.message?.includes('Loading chunk') ||
      error?.message?.includes('Loading CSS chunk') ||
      error?.message?.includes('dynamically imported module');

    if (isChunkError) {
      // Avoid reload loops: only reload once per session key
      const reloadKey = `chunk_reload_${window.location.pathname}`;
      if (!sessionStorage.getItem(reloadKey)) {
        sessionStorage.setItem(reloadKey, '1');
        window.location.reload();
        // Return null so we don't render the fallback before reload completes
        return null;
      }
    }

    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('ChunkErrorBoundary caught an error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h2>Something went wrong loading this page.</h2>
          <p>Please <button onClick={() => window.location.reload()}>refresh the page</button> and try again.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ChunkErrorBoundary;

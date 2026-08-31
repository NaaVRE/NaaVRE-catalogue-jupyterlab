import { createMemoryHistory } from '@tanstack/history';

/**
 * Create a memory history and wire up synchronization:
 *
 *   memory -> hash : when the router navigates, mirror the path to
 *                    window.location.hash
 *
 * Returns the history instance and a `setFocused(boolean)` called by the
 * ReactWidget when restoring focus.
 */
export function createSyncedMemoryHistory(basepath: string) {
  const initialPath = parseHashPath(basepath);
  const memoryHistory = createMemoryHistory({
    initialEntries: [initialPath]
  });

  // memory -> hash
  // location.href is the full router path, including the basepath.
  // Mirror it verbatim after '#'
  memoryHistory.subscribe(({ location }) => {
    const targetHash = '#' + location.href;
    if (window.location.hash === targetHash) {
      return;
    }
    history.replaceState(
      history.state,
      '',
      window.location.pathname + window.location.search + targetHash
    );
  });

  return {
    history: memoryHistory,

    setFocused(value: boolean) {
      if (value) {
        // Re-assert our hash now that we have focus back, in case
        // JupyterLab wiped it while we were unfocused.
        const targetHash = '#' + memoryHistory.location.href;
        if (window.location.hash !== targetHash) {
          history.replaceState(
            history.state,
            '',
            window.location.pathname + window.location.search + targetHash
          );
        }
      }
    }
  };
}

/**
 * Extracts the full router path from the current hash.
 *
 * The hash is:  #<basepath><subroute>
 * e.g.  #/naavre-catalogue/assets/notebook-files
 */
function parseHashPath(basepath: string): string {
  const raw = window.location.hash.slice(1); // strip leading '#'
  if (raw.startsWith(basepath)) {
    return raw;
  }
  return basepath + '/';
}

import { useCallback, useEffect, useState } from 'react';
import { ISettings } from '../settings';
import { ICatalogueListResponse } from '../utils/catalog';
import { fetchListFromCatalogue } from '../utils/catalog';

function getInitialUrl(settings: ISettings, initialPath: string) {
  return settings.catalogueServiceUrl
    ? `${settings.catalogueServiceUrl}/${initialPath}`
    : null;
}

export function useCatalogueList<T>({
  settings,
  initialPath,
  getAllPages
}: {
  settings: ISettings;
  initialPath: string;
  getAllPages?: boolean;
}) {
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [url, setUrl] = useState<string | null>(
    getInitialUrl(settings, initialPath)
  );

  const setInitialPath = useCallback(
    (initialPath: string) => {
      setUrl(getInitialUrl(settings, initialPath));
    },
    [settings]
  );

  useEffect(() => {
    settings.catalogueServiceUrl &&
      setUrl(`${settings.catalogueServiceUrl}/${initialPath}`);
  }, [settings.catalogueServiceUrl]);

  const [response, setResponse] = useState<ICatalogueListResponse<T>>({
    count: 0,
    next: null,
    previous: null,
    results: []
  });

  const fetchResponse = useCallback(() => {
    setErrorMessage && setErrorMessage(null);
    setLoading && setLoading(true);
    if (url) {
      fetchListFromCatalogue<T>(url, getAllPages)
        .then(resp => {
          setResponse(resp);
        })
        .catch(error => {
          const msg = `Error listing items: ${String(error)}`;
          console.error(msg);
          setErrorMessage && setErrorMessage(msg);
        })
        .finally(() => {
          setLoading && setLoading(false);
        });
    }
  }, [url]);

  useEffect(() => fetchResponse(), [fetchResponse]);

  return {
    url,
    setUrl,
    setInitialPath,
    loading,
    setLoading,
    errorMessage,
    setErrorMessage,
    fetchResponse,
    response
  };
}

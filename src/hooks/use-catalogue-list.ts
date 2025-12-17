import { useCallback, useEffect, useState } from 'react';
import {
  fetchListFromCatalogue,
  ICatalogueListResponse
} from '../utils/catalog';

function getUrl(
  catalogueServiceUrl: string | undefined,
  path: string,
  initialSearchParams: string
) {
  return catalogueServiceUrl
    ? `${catalogueServiceUrl}/${path}/${initialSearchParams}`
    : null;
}

const emptyResponse = {
  count: 0,
  next: null,
  previous: null,
  results: []
};

export function useCatalogueList<T>({
  catalogueServiceUrl,
  path,
  initialSearchParams,
  getAllPages
}: {
  catalogueServiceUrl: string | undefined;
  path: string;
  initialSearchParams: string;
  getAllPages?: boolean;
}) {
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [url, setUrl] = useState<string | null>(
    getUrl(catalogueServiceUrl, path, initialSearchParams)
  );

  useEffect(() => {
    setUrl(url =>
      url !== null
        ? getUrl(catalogueServiceUrl, path, new URL(url).search)
        : catalogueServiceUrl
          ? getUrl(catalogueServiceUrl, path, initialSearchParams)
          : null
    );
  }, [catalogueServiceUrl, path, initialSearchParams]);

  const [response, setResponse] =
    useState<ICatalogueListResponse<T>>(emptyResponse);

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
          setResponse(emptyResponse);
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
    loading,
    setLoading,
    errorMessage,
    setErrorMessage,
    fetchResponse,
    response
  };
}

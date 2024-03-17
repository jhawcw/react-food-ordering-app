import { useCallback, useEffect, useState } from "react";

async function sendHttpRequest(url, config) {
  const response = await fetch(url, config);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong, failed to send request!");
  }

  return data;
}

const useHttp = (url, config, initialData) => {
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [backendData, setBackendData] = useState(initialData);

  function clearData() {
    setBackendData(initialData);
  }

  const sendRequest = useCallback(
    async function sendRequest(backendData) {
      setIsLoading(true);
      try {
        const data = await sendHttpRequest(url, { ...config, body: backendData });
        setBackendData(data);
      } catch (error) {
        setError(error.message || "Something went wrong!");
        console.log(error);
      }
      setIsLoading(false);
    },
    [url, config]
  );

  useEffect(() => {
    if ((config && (config.method === "GET" || !config.method)) || !config) {
      sendRequest();
    }
  }, [sendRequest, config]);

  return {
    error,
    isLoading,
    backendData,
    sendRequest,
    clearData,
  };
};

export default useHttp;

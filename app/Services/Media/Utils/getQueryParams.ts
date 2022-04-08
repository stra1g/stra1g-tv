type QueryParams = {
  [key: string]: string | null | undefined;
};

export const getQueryParams = (url: string): QueryParams => {
  const queryParamsString = url.substring(url.indexOf('?') + 1, url.length);

  const queryParamsArray = queryParamsString.split('&');

  const queryParams = {};

  queryParamsArray.forEach((item) => {
    let [key, value] = item.split('=');

    const slashIndex = value.indexOf('/');

    if (slashIndex !== -1) {
      Object.assign(queryParams, {
        stream_key: value.substring(slashIndex + 1, value.length),
      });
      value = value.substring(0, slashIndex);
    }

    Object.assign(queryParams, {
      [key]: value,
    });
  });

  return queryParams;
};

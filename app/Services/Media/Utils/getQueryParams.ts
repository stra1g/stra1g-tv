type QueryParams = {
  [key: string]: string | null | undefined;
};

export const getQueryParams = (url: string): QueryParams => {
  const queryParamsString = url.substring(url.indexOf('?') + 1, url.length);

  const queryParamsArray = queryParamsString.split('&');

  const queryParams = {};

  queryParamsArray.forEach((item) => {
    let arr = item.split('=');

    let key = '';
    let value = '';

    if (arr.length > 1) {
      key = arr[0];
      value = arr[1];
    } else {
      key = 'auth_token';
      value = arr[0];
    }

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

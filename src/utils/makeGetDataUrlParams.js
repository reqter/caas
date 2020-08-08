export const makeDataParam = (
  apiUrl,
  name,
  contentType,
  category,
  contentStatus,
  skip,
  limit,
  lang,
  dateRange
) => {
  let url = apiUrl + "?";
  if (contentType) url = url + "contentType=" + contentType;

  if (url[url.length - 1] !== "?") url = url + "&";

  if (category) url = url + "category=" + category;

  if (url[url.length - 1] !== "?" && url[url.length - 1] !== "&") {
    url = url + "&";
  }

  if (contentStatus) url = url + "status=" + contentStatus;

  if (url[url.length - 1] !== "?" && url[url.length - 1] !== "&") {
    url = url + "&";
  }

  if (name && name.length > 0) url = url + "name=" + name;

  if (url[url.length - 1] !== "?" && url[url.length - 1] !== "&") {
    url = url + "&";
  }
  if (skip || skip === 0) url = url + "skip=" + skip;

  if (url[url.length - 1] !== "?" && url[url.length - 1] !== "&") {
    url = url + "&";
  }
  if (limit) url = url + "limit=" + limit;

  if (url[url.length - 1] !== "?" && url[url.length - 1] !== "&") {
    url = url + "&";
  }

  if (lang) url = url + "lang=" + lang;

  if (url[url.length - 1] !== "?" && url[url.length - 1] !== "&") {
    url = url + "&";
  }
  if (dateRange) url = url + "daterange=" + dateRange;

  if (url[url.length - 1] !== "?" && url[url.length - 1] !== "&") {
    url = url + "&";
  }

  if (url[url.length - 1] === "?") url = url.substring(0, url.length - 1);

  if (url[url.length - 1] === "&") url = url.substring(0, url.length - 1);
  return url;
};

export const makeSearchFields = (fields) => {
  const searchArray = Object.keys(fields);
  return searchArray.reduce((obj, key) => {
    if (fields[key] && fields[key].length > 0) {
      obj["fields." + key] = fields[key];
    }
    return obj;
  }, {});
};

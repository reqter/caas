import { useLocale } from "hooks";
const imageDownloadBaseUrl = "https://assets.iran.liara.run/asset/image/download/";

const useImageResize = () => {
  const { currentLocale } = useLocale();
  function getImage(url, width, height) {
    const u = url ? (url[currentLocale] ? url[currentLocale] : url) : null;
    if (!u) {
      return "";
    }
    return (
      u
        .toString()
        .replace("https://app-spanel.herokuapp.com", imageDownloadBaseUrl)
        .replace(
          "https://assets.iran.liara.run/asset/download/",
          imageDownloadBaseUrl
        ) + `?w=${width}&h=${height}`
    );
  }
  return { getImage };
};

export default useImageResize;

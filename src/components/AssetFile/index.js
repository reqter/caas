import React from "react";
import { useLocale } from "hooks";
const AssetFile = props => {
  const { currentLocale } = useLocale();

  const imgs = ["jpg", "jpeg", "gif", "bmp", "png"];
  const videos = ["mp4", "3gp", "ogg", "wmv", "flv", "avi"];
  const audios = ["wav", "mp3", "ogg"];
  const ext = props.file.name.split(".")[1];
  const cls = "unknownFileType " + props.class;
  const { file } = props;
  if (!ext) {
    return (
      <div className={cls}>
        <i className="icon-folder un-icon" />
        <span className="un-text">unknown</span>
      </div>
    );
  } else {
    if (imgs.indexOf(ext.toLowerCase()) !== -1) {
      return (
        <img
          src={
            file.url
              ? file.url[currentLocale]
                ? file.url[currentLocale].replace(
                  "https://app-spanel.herokuapp.com",
                  "https://assets.iran.liara.run"
                )
                : file.url
                  .toString()
                  .replace(
                    "https://app-spanel.herokuapp.com",
                    "https://assets.iran.liara.run"
                  )
              : null
          }
          alt=""
        />
      );
    } else if (videos.indexOf(ext.toLowerCase()) !== -1) {
      return <i className="icon-video" />;
    } else if (audios.indexOf(ext.toLowerCase()) !== -1) {
      return <i className="icon-audio" />;
    } else {
      return (
        <div className={cls}>
          <i className="icon-file-text un-icon" />
          <span className="un-text">{props.file.name}</span>
        </div>
      );
    }
  }
};

export default AssetFile;

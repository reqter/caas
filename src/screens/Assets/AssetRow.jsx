import React, { useState } from "react";
import ButtonDropdown from "reactstrap/lib/ButtonDropdown";
import Dropdown from "reactstrap/lib/Dropdown";
import DropdownToggle from "reactstrap/lib/DropdownToggle";
import DropdownItem from "reactstrap/lib/DropdownItem";
import DropdownMenu from "reactstrap/lib/DropdownMenu";
import AssetFile from "components/AssetFile";
import { useLocale } from "hooks";
export default ({
  file,
  viewAsset,
  publishAsset,
  archiveAsset,
  unArchiveAsset,
  unPublishAsset,
  openUploaderForEdit,
  showRemoveAlert,
  t
}) => {
  const { currentLocale } = useLocale();
  const [dropdownOpen, setOpen] = useState(false);

  const toggle = e => {
    e.stopPropagation();
    setOpen(!dropdownOpen);
  };
  const actionClicked = e => {
    e.stopPropagation();
  };

  return (
    <tr onClick={() => viewAsset(file)}>
      <td>
        <div className="as-table-number-wrapper">
          <div className="as-table-number">
            <div className="as-table-number-value">{file.index}</div>
          </div>
        </div>
      </td>
      <td>
        <div className="as-table-image">
          {file.fileType.toLowerCase().includes("image") ? (
            <img
              src={
                file.url
                  ? file.url[currentLocale]
                    ? file.url[currentLocale].replace(
                        "https://app-spanel.herokuapp.com",
                        "https://assets.reqter.com"
                      )
                    : file.url
                        .toString()
                        .replace(
                          "https://app-spanel.herokuapp.com",
                          "https://assets.reqter.com"
                        )
                  : null
              }
              alt=""
            />
          ) : file.fileType.toLowerCase().includes("video") ? (
            <i className="icon-video" />
          ) : file.fileType.toLowerCase().includes("audio") ? (
            <i className="icon-audio" />
          ) : file.fileType.toLowerCase().includes("pdf") ? (
            <i className="icon-pdf" />
          ) : file.fileType.toLowerCase().includes("spreadsheet") ? (
            <i className="icon-spreadsheet" />
          ) : (
            <AssetFile file={file} className="assetFile" />
          )}
        </div>
      </td>
      <td>
        <div className="as-table-name">
          <span className="name">
            {file.title && file.title[currentLocale]}
          </span>
          <span>{file.fileType}</span>
        </div>
      </td>
      <td>
        <div className="as-table-by">
          <span>{file.sys && file.sys.issuer && file.sys.issuer.fullName}</span>
          <span>{file.sys && file.sys.issueDate}</span>
        </div>
      </td>
      <td>
        <div className="as-table-status">
          <span className="badge badge-primary">
            {t.translate(file.status)}
          </span>
        </div>
      </td>
      <td onClick={actionClicked}>
        <div className="as-table-actions">
          <ButtonDropdown isOpen={dropdownOpen} toggle={toggle}>
            <DropdownToggle
              size="sm"
              style={{
                background: "whitesmoke",
                color: "gray",
                border: "none"
              }}
            >
              <span className="icon-more-h" />
            </DropdownToggle>
            <DropdownMenu>
              {file.status === "draft" ? (
                <>
                  <DropdownItem onClick={e => publishAsset(e, file)}>
                    {t.translate("PUBLISH")}
                  </DropdownItem>
                  <DropdownItem onClick={e => archiveAsset(e, file)}>
                    {t.translate("ARCHIVE")}
                  </DropdownItem>
                </>
              ) : file.status === "changed" ? (
                <>
                  <DropdownItem onClick={e => publishAsset(e, file)}>
                    {t.translate("PUBLISH")}
                  </DropdownItem>
                  <DropdownItem onClick={e => archiveAsset(e, file)}>
                    {t.translate("ARCHIVE")}
                  </DropdownItem>
                </>
              ) : file.status === "archived" ? (
                <DropdownItem onClick={e => unArchiveAsset(e, file)}>
                  {t.translate("UN_ARCHIVE")}
                </DropdownItem>
              ) : file.status === "published" ? (
                <DropdownItem onClick={e => unPublishAsset(e, file)}>
                  {t.translate("UN_PUBLISH")}
                </DropdownItem>
              ) : (
                ""
              )}
              {file.status !== "published" && file.status !== "archived" && (
                <DropdownItem onClick={e => showRemoveAlert(e, file)}>
                  Remove
                </DropdownItem>
              )}
              <DropdownItem divider />
              <DropdownItem onClick={e => openUploaderForEdit(e, file)}>
                <i className="icon-pencil" /> Edit
              </DropdownItem>
            </DropdownMenu>
          </ButtonDropdown>
        </div>
      </td>
    </tr>
  );
};

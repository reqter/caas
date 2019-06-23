import React, { useState, useRef, useEffect } from "react";
import { Modal, ModalBody, ModalHeader, ModalFooter } from "reactstrap";
import Select, { components } from "react-select";
import { languageManager, useGlobalState } from "../../../../services";
import { CircleSpinner, AssetBrowser } from "../../../../components";
import { addApiKey, updateApiKey } from "./../../../../Api/apiKey-api";

const currentLang = languageManager.getCurrentLanguage().name;

const UpsertApiKey = props => {
  const [{ spaceInfo }, dispatch] = useGlobalState();

  const nameRef = useRef(null);
  const apiKeyRef = useRef(null);
  const apiSecretRef = useRef(null);

  const updateMode = props.selectedApiKey === undefined ? undefined : true;
  const selectedApiKey =
    props.selectedApiKey === undefined ? undefined : props.selectedApiKey;

  const [tab, changeTab] = useState(1);
  const [name, setName] = useState(selectedApiKey ? selectedApiKey.name : "");
  const [description, setDescription] = useState(
    selectedApiKey ? selectedApiKey.description : ""
  );
  const [homePage, setHomePage] = useState(
    selectedApiKey ? selectedApiKey.homePage : ""
  );
  const [type, setType] = useState(
    selectedApiKey ? selectedApiKey.type : "web"
  );
  const options = [
    { value: "password", label: "Password" },
    { value: "authorization_code", label: "Authorization Code" },
    { value: "clientCredentials", label: "Client Credentials" },
    { value: "implicit", label: "Implicit" },
  ];
  const [grants, setgrants] = useState(getSelectedgrants());
  const [image, setImage] = useState(
    selectedApiKey ? selectedApiKey.icon : undefined
  );
  const [assetBrowser, toggleAssetBrowser] = useState(false);
  const [spinner, toggleSpinner] = useState(false);
  const [result, setResult] = useState({});

  useEffect(() => {
     nameRef.current.focus();
  }, []);
  function getSelectedgrants() {
    if (!updateMode) return [];
    let result = [];
    for (let i = 0; i < selectedApiKey.grants.length; i++) {
      const grant = selectedApiKey.grants[i];
      for (let j = 0; j < options.length; j++) {
        const option = options[j];
        if (option.value === grant) {
          result.push(option);
          break;
        }
      }
    }
    return result;
  }
  function copyApiKey() {
    apiKeyRef.current.select();
    document.execCommand("copy");
    // This is just personal preference.
    // I prefer to not show the the whole text area selected.
    //e.target.focus();
    showNotify("success", "Api key copied");
  }
  function copyApiSecret() {
    apiSecretRef.current.select();
    document.execCommand("copy");
    // This is just personal preference.
    // I prefer to not show the the whole text area selected.
    //e.target.focus();
    showNotify("success", "Api secret copied");
  }
  function removeImage() {
    setImage();
  }
  function openAssetBrowser() {
    toggleAssetBrowser(true);
  }
  function handleChooseAsset(asset) {
    toggleAssetBrowser(false);
    if (asset) setImage(asset.url);
  }
  function showNotify(type, msg) {
    dispatch({
      type: "ADD_NOTIFY",
      value: {
        type: type,
        message: msg,
      },
    });
  }
  function handleOngrantsChange(items) {
    setgrants(items);
  }
  function closeModal() {
    props.onClose();
  }
  function onSubmit(e) {
    e.preventDefault();
    if (!spinner) {
      toggleSpinner(true);
      let grant_values = [];
      if (grants && grants.length > 0) {
        grants.forEach(g => grant_values.push(g.value));
      }
      if (!updateMode) {
        const obj = {
          icon: image ? image[currentLang] : undefined,
          redirectUris: [],
          type: type,
          name: name,
          description: description,
          longDesc: null,
          homepage: homePage,
          category: "CMS",
          grants: grant_values,
        };
        addApiKey()
          .onOk(result => {
            changeTab(2);
            // showNotify(
            //   "success",
            //   languageManager.translate("PROFILE_CHANGE_PASS_ON_OK")
            // );
            dispatch({
              type: "ADD_API_KEY",
              value: result,
            });
            setResult(result);
          })
          .onServerError(result => {
            toggleSpinner(false);
            showNotify(
              "error",
              languageManager.translate("PROFILE_CHANGE_PASS_ON_SERVER_ERROR")
            );
          })
          .onBadRequest(result => {
            toggleSpinner(false);
            showNotify(
              "error",
              languageManager.translate("PROFILE_CHANGE_PASS_ON_BAD_REQUEST")
            );
          })
          .unAuthorized(result => {
            toggleSpinner(false);
            showNotify(
              "error",
              languageManager.translate("PROFILE_CHANGE_PASS_UN_AUTHORIZED")
            );
          })
          .notFound(result => {
            toggleSpinner(false);
            showNotify(
              "error",
              languageManager.translate("PROFILE_CHANGE_PASS_NOT_FOUND")
            );
          })
          .call(spaceInfo.id, obj);
      } else {
        let apikey = {
          id: selectedApiKey._id,
          icon: image ? image[currentLang] : undefined,
          redirectUris: [],
          type: type,
          name: name,
          description: description,
          longDesc: null,
          homepage: homePage,
          category: "CMS",
          grants: grant_values,
        };

        updateApiKey()
          .onOk(result => {
            showNotify(
              "success",
              languageManager.translate("Apikey updated successfully.")
            );
            dispatch({
              type: "UPDATE_API_KEY",
              value: apikey,
            });
            closeModal();
          })
          .onServerError(result => {
            toggleSpinner(false);
            showNotify(
              "error",
              languageManager.translate("PROFILE_CHANGE_PASS_ON_SERVER_ERROR")
            );
          })
          .onBadRequest(result => {
            toggleSpinner(false);
            showNotify(
              "error",
              languageManager.translate("PROFILE_CHANGE_PASS_ON_BAD_REQUEST")
            );
          })
          .unAuthorized(result => {
            toggleSpinner(false);
            showNotify(
              "error",
              languageManager.translate("PROFILE_CHANGE_PASS_UN_AUTHORIZED")
            );
          })
          .notFound(result => {
            toggleSpinner(false);
            showNotify(
              "error",
              languageManager.translate("PROFILE_CHANGE_PASS_NOT_FOUND")
            );
          })
          .call(spaceInfo.id, apikey);
      }
    }
  }
  return (
    <>
      <Modal isOpen={props.isOpen} toggle={closeModal} size="lg">
        <ModalHeader toggle={closeModal}>
          {updateMode ? "Update Api Key" : "New Api Key"}
        </ModalHeader>
        <ModalBody>
          <div className="settings-modal-body">
            {tab === 1 && (
              <form id="form" onSubmit={onSubmit}>
                <div className="row">
                  <div className="form-group col">
                    <label>{languageManager.translate("Name")}</label>
                    <input
                      ref={nameRef}
                      type="text"
                      className="form-control"
                      placeholder={languageManager.translate("enter a name ")}
                      required
                      value={name}
                      onChange={e => {
                        setName(e.target.value);
                      }}
                    />
                    <small className="form-text text-muted">
                      {languageManager.translate("name of api key  is require")}
                    </small>
                  </div>
                  <div className="form-group col">
                    <label>{languageManager.translate("Description")}</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder={languageManager.translate(
                        "enter a short description"
                      )}
                      value={description}
                      onChange={e => {
                        setDescription(e.target.value);
                      }}
                    />
                    <small className="form-text text-muted">
                      {languageManager.translate(
                        "short description of api key"
                      )}
                    </small>
                  </div>
                </div>
                <div className="row">
                  <div className="form-group col">
                    <label>{languageManager.translate("Home Page")}</label>
                    <input
                      type="url"
                      className="form-control"
                      placeholder={languageManager.translate("enter a url")}
                      value={homePage}
                      onChange={e => {
                        setHomePage(e.target.value);
                      }}
                    />
                    <small className="form-text text-muted">
                      {languageManager.translate("enter a url as home page")}
                    </small>
                  </div>
                  <div className="form-group col">
                    <label>{languageManager.translate("Type")}</label>
                    <select
                      className="form-control"
                      value={type}
                      onChange={e => {
                        setType(e.target.value);
                      }}
                    >
                      <option value="">Choose a type</option>
                      <option value="web">Web App</option>
                      <option value="native">
                        Native app(mobile and desktop app)
                      </option>
                      <option value="service">
                        Service(Machine to Machine call)
                      </option>
                    </select>
                    <small className="form-text text-muted">
                      {languageManager.translate("category is require")}
                    </small>
                  </div>
                </div>
                <div className="form-group">
                  <label>grants</label>
                  <Select
                    menuPlacement="bottom"
                    closeMenuOnScroll={true}
                    closeMenuOnSelect={false}
                    //value={selectedOption}
                    defaultValue={true && getSelectedgrants()}
                    onChange={handleOngrantsChange}
                    options={options}
                    isMulti={true}
                    isSearchable={true}
                  />
                  <small className="form-text text-muted">
                    grants is required
                  </small>
                </div>
                <div className="up-uploader">
                  <span className="title">
                    {languageManager.translate("Icon")}
                  </span>
                  <span className="description">
                    {languageManager.translate("Set an icon for api key")}
                  </span>

                  <div className="files">
                    {image && (
                      <div className="files-uploaded">
                        <div
                          className="files-uploaded-icon"
                          onClick={removeImage}
                        >
                          <i className="icon-bin" />
                        </div>
                        <img src={image[currentLang]} alt="" />
                      </div>
                    )}
                    <div className="files-input" onClick={openAssetBrowser}>
                      <i className="icon-camera" />
                    </div>
                  </div>
                </div>
              </form>
            )}
            {tab === 2 && (
              <div className="apiKeyResult">
                <div className="alert alert-success" role="alert">
                  {/* <h4 className="alert-heading">Success!</h4>
                  <hr /> */}
                  <p className="mb-0">
                    New api key was created successfully. you can copy them
                  </p>
                </div>
                <div className="form-group">
                  <label>{languageManager.translate("Api Key")}</label>
                  <div className="input-group">
                    <input
                      ref={apiKeyRef}
                      type="text"
                      className="form-control"
                      defaultValue={result.clientId}
                      readOnly
                    />
                    <div
                      className="input-group-append"
                      onClick={copyApiKey}
                      style={{ cursor: "pointer" }}
                    >
                      <span className="input-group-text">Copy</span>
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <label>{languageManager.translate("Api Secret")}</label>
                  <div className="input-group">
                    <input
                      ref={apiSecretRef}
                      type="text"
                      className="form-control"
                      defaultValue={result.clientSecret}
                      readOnly
                    />
                    <div
                      className="input-group-append"
                      onClick={copyApiSecret}
                      style={{ cursor: "pointer" }}
                    >
                      <span className="input-group-text">Copy</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ModalBody>
        <ModalFooter>
          <button onClick={closeModal} className="btn btn-secondary">
            {tab === 1 ? languageManager.translate("CANCEL") : "Close"}
          </button>
          {tab === 1 && (
            <button
              type="submit"
              className="btn btn-primary ajax-button"
              form="form"
              disabled={
                name.length > 0 && type.length > 0 && grants.length > 0
                  ? false
                  : true
              }
            >
              <CircleSpinner show={spinner} size="small" />
              {!spinner && <span> {updateMode ? "Update" : "Create"}</span>}
            </button>
          )}
        </ModalFooter>
      </Modal>
      {assetBrowser && (
        <AssetBrowser
          isOpen={assetBrowser}
          onCloseModal={handleChooseAsset}
          mediaType={"image"}
        />
      )}
    </>
  );
};
export default UpsertApiKey;

import React, { useState, useEffect, useRef } from "react";
import {
  Dropdown,
  DropdownToggle,
  DropdownItem,
  DropdownMenu,
} from "reactstrap";
import "./styles.scss";
import { languageManager, useGlobalState, utility } from "../../services";
import { CircleSpinner } from "../../components";
import { Locales, ApiKeys, Webhooks } from "./contents";
import "./contentStyles.scss";
import UpsertLocale from "./modals/UpsertLocale";
import UpsertApiKey from "./modals/UpsertApiKey";
import WebHookCreation from "./modals/WebHook";
import CustomWebhook from "./modals/CustomWebHook";

const Settings = props => {
  const { name: pageTitle, desc: pageDescription } = props.component;

  const [{ userInfo }, dispatch] = useGlobalState();

  const [tabContent, changeTab] = useState("locales");
  const [upsertLocalModal, toggleLocaleModal] = useState(false);
  const [selectedLocale, setSelectedLocale] = useState();
  const [upsertRoleModal, toggleRoleModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState();
  const [webHookModal, setWebHookModal] = useState(false);
  const [customWebhookModal, setCustomWebHookModal] = useState(false);
  const [selectedApiKey, setSelectedApiKey] = useState();
  const [selectedWebhook, setSelectedWebhook] = useState();

  const [upsertApiKeyModal, toggleApiKeyModal] = useState(false);
  const [newWebHookDropDown, toggleWebHookDropDown] = useState(false);

  function toggleTab(tabName) {
    changeTab(tabName);
  }
  function toggleNewLocaleModal(result) {
    toggleLocaleModal(prevState => !prevState);
    if (selectedLocale) setSelectedLocale();

    if (result) {
      setSelectedLocale();
    }
  }
  function handleEditLocale(locale) {
    toggleNewLocaleModal();
    setSelectedLocale(locale);
  }

  function toggleUpsertRoleModal(result) {
    toggleRoleModal(prevState => !prevState);
    if (selectedRole) setSelectedRole();
    if (result) {
    }
  }
  function handleEditRole(role) {
    toggleUpsertRoleModal();
    setSelectedRole(role);
  }

  function handleEditApiKey(apiKey) {
    toggleUpsertApiKeyModal();
    setSelectedApiKey(apiKey);
  }
  function toggleUpsertApiKeyModal(result) {
    toggleApiKeyModal(prevState => !prevState);
    if (selectedApiKey) setSelectedApiKey();
    if (result) {
    }
  }
  // webhook
  function toggleWebHookModal() {
    setWebHookModal(prevState => !prevState);
  }
  function toggleCustomWebhookModal() {
    setCustomWebHookModal(prevState => !prevState);
  }
  function handleEditWebhook(webhook) {
    if (webhook.type === "custom") {
      toggleCustomWebhookModal();
    } else toggleWebHookModal();
    setSelectedWebhook(webhook);
  }
  return (
    <>
      <div className="se-wrapper">
        <div className="se-header">
          <div className="se-header-left">
            <span className="se-header-title">{pageTitle}</span>
            <span className="se-header-description">{pageDescription}</span>
          </div>
          <div className="se-header-right">
            {tabContent === "locales" && (
              <button
                className="btn btn-primary"
                onClick={toggleNewLocaleModal}
              >
                New Locale
              </button>
            )}
         
            {tabContent === "apiKeys" && (
              <button
                className="btn btn-primary"
                onClick={toggleUpsertApiKeyModal}
              >
                Connect New App
              </button>
            )}
            {tabContent === "webHooks" && (
              <Dropdown
                isOpen={newWebHookDropDown}
                toggle={() => toggleWebHookDropDown(prevState => !prevState)}
              >
                <DropdownToggle
                  className="btn btn-primary"
                  caret
                  color="primary"
                >
                  New Webhook
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem onClick={toggleCustomWebhookModal}>
                    {languageManager.translate("Custom Webhook")}
                  </DropdownItem>
                  <DropdownItem onClick={toggleWebHookModal}>
                    {languageManager.translate("From Templates")}
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
              // <button className="btn btn-primary" onClick={toggleWebHookModal}>
              //   New WebHook
              // </button>
            )}
          </div>
        </div>
        <div className="se-content">
          <div className="tabs">
            <div
              className={
                "tabItem " + (tabContent === "locales" ? "active" : "")
              }
              onClick={() => toggleTab("locales")}
            >
              Locales
            </div>
            <div
              className={
                "tabItem " + (tabContent === "apiKeys" ? "active" : "")
              }
              onClick={() => toggleTab("apiKeys")}
            >
              Connected Apps
            </div>
            <div
              className={
                "tabItem " + (tabContent === "webHooks" ? "active" : "")
              }
              onClick={() => toggleTab("webHooks")}
            >
              Webhooks
            </div>
          </div>
          {tabContent === "locales" && (
            <Locales onEditLocale={handleEditLocale} />
          )}
        
          {tabContent === "apiKeys" && (
            <ApiKeys onEditApiKey={handleEditApiKey} />
          )}
          {tabContent === "webHooks" && (
            <Webhooks onEditWebhook={handleEditWebhook} />
          )}
        </div>
      </div>
      {upsertLocalModal && (
        <UpsertLocale
          selectedLocale={selectedLocale}
          isOpen={upsertLocalModal}
          onClose={toggleNewLocaleModal}
        />
      )}
      {upsertApiKeyModal && (
        <UpsertApiKey
          selectedApiKey={selectedApiKey}
          isOpen={upsertApiKeyModal}
          onClose={toggleUpsertApiKeyModal}
        />
      )}
      {webHookModal && (
        <WebHookCreation
          isOpen={webHookModal}
          onClose={toggleWebHookModal}
          selectedWebhook={selectedWebhook}
        />
      )}
      {customWebhookModal && (
        <CustomWebhook
          isOpen={customWebhookModal}
          onClose={toggleCustomWebhookModal}
          selectedWebhook={selectedWebhook}
        />
      )}
    </>
  );
};

export default Settings;

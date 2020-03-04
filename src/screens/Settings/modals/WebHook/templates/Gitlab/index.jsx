import React, { useState, useRef, useEffect } from "react";
import { languageManager, useGlobalState } from "../../../../../../services";
import { setWebhooks } from "../../../../../../Api/webhook-api";
import { CircleSpinner } from "../../../../../../components";

const currentLang = languageManager.getCurrentLanguage().name;

const GitLabUpsert = props => {
  const [{ spaceInfo, userInfo, webhooks }, dispatch] = useGlobalState();
  const nameInputRef = useRef(null);
  const updateMode = props.data ? true : false;
  const { selectedTemplate } = props;

  const [spinner, toggleSpinner] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [repository, setRepository] = useState("");
  const [organization, setOrganization] = useState("");
  const [branch, setBranch] = useState("");
  const [apiToken, setApiToken] = useState("");

  useEffect(() => {}, []);

  function showNotify(type, msg) {
    dispatch({
      type: "ADD_NOTIFY",
      value: {
        type: type,
        message: msg,
      },
    });
  }

  function backToTemplates() {
    props.onShowTemplates();
  }
  function onSubmit(e) {
    e.preventDefault();
    if (!spinner) {
      toggleSpinner(true);
      let w = [...webhooks];
      let obj = {
        name: name,
        description: description,
        type: selectedTemplate.name,
        sys: {
          issuer: userInfo.id,
          issueData: new Date(),
          //lastUpdater: userInfo,
        },
        config: {
          organization: organization,
          repository: repository,
          branch: branch,
          apiToken: apiToken,
        },
      };
      if (updateMode) {
        obj["sys"]["lastUpdateTime"] = new Date();
        for (let i = 0; i < w.length; i++) {
          let w_h = w[i];
          if (w_h.name === name) {
            w_h = obj;
          }
        }
      } else w.push(obj);
      setWebhooks()
        .onOk(result => {
          showNotify(
            "success",
            languageManager.translate("Gitlab webhook created successfully")
          );
          const w = [...webhooks];
          w.push(result);
          dispatch({
            type: "SET_WEBHOOKS",
            value: w,
          });
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
        .call(spaceInfo.id, w);
    }
  }
  return (
    <div className="webhookTemplates">
      <div className="webhookTemplates-body">
        <form id="form" onSubmit={onSubmit}>
          <ul>
            <li>Triggers a Gitlab pipeline</li>
            <li>
              Triggered when a content or asset is published or unpublished
            </li>
          </ul>
          <div className="row">
            <div className="form-group col">
              <label>{languageManager.translate("Name (required)")}</label>
              <input
                ref={nameInputRef}
                type="text"
                className="form-control"
                autoFocus
                value={name}
                onChange={e => {
                  setName(e.target.value);
                }}
              />
              <small className="form-text text-muted">
                {languageManager.translate("enter a name for your webhook")}
              </small>
            </div>
            <div className="form-group col">
              <label>{languageManager.translate("Description")}</label>
              <input
                type="text"
                className="form-control"
                value={description}
                onChange={e => {
                  setDescription(e.target.value);
                }}
              />
              <small className="form-text text-muted">
                {languageManager.translate("enter a short description")}
              </small>
            </div>
          </div>
          <div className="row">
            <div className="form-group col">
              <label>
                {languageManager.translate(
                  "GitLab organization or user (required)"
                )}
              </label>
              <input
                type="text"
                className="form-control"
                placeholder={languageManager.translate("")}
                value={organization}
                onChange={e => {
                  setOrganization(e.target.value);
                }}
              />
              <small className="form-text text-muted">
                {languageManager.translate(
                  "The GitLab organization or user repository belongs to."
                )}
              </small>
            </div>
            <div className="form-group col">
              <label>
                {languageManager.translate("GitLab repository (required)")}
              </label>
              <input
                type="text"
                className="form-control"
                placeholder={languageManager.translate("")}
                value={repository}
                onChange={e => {
                  setRepository(e.target.value);
                }}
              />
              <small className="form-text text-muted">
                {languageManager.translate(
                  "The name of the repository you want to trigger."
                )}
              </small>
            </div>
          </div>
          <div className="row">
            <div className="form-group col">
              <label>{languageManager.translate("Branch (required)")}</label>
              <input
                type="text"
                className="form-control"
                placeholder={languageManager.translate("")}
                value={branch}
                onChange={e => {
                  setBranch(e.target.value);
                }}
              />
              <small className="form-text text-muted">
                {languageManager.translate(
                  "The source code branch, for example master"
                )}
              </small>
            </div>
            <div className="form-group col">
              <label>
                {languageManager.translate("Personal API token (required)")}
              </label>
              <input
                type="text"
                className="form-control"
                placeholder={languageManager.translate("")}
                value={apiToken}
                onChange={e => {
                  setApiToken(e.target.value);
                }}
              />
              <small className="form-text text-muted">
                {languageManager.translate(
                  "Can be found on the Gitlab Settings. This value can’t be revealed once stored."
                )}
              </small>
            </div>
          </div>
        </form>
      </div>
      <div className="webhookTemplates-footer">
        <button
          type="submit"
          form="form"
          className="btn btn-primary"
          disabled={
            name.length > 0 &&
            organization.length > 0 &&
            repository.length > 0 &&
            branch.length > 0 &&
            apiToken.length > 0
              ? false
              : true
          }
        >
          <CircleSpinner show={spinner} size="small" />
          {!spinner ? updateMode ? "Edit" : "Create" : null}
        </button>
        {!updateMode && (
          <button className="btn btn-secondary" onClick={backToTemplates}>
            Change Template
          </button>
        )}
      </div>
    </div>
  );
};
export default GitLabUpsert;

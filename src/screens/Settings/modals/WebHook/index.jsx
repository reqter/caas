import React, { useState, useRef, useEffect } from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import { languageManager, useGlobalState } from "../../../../services";
import "./styles.scss";
import { Gitlab } from "./templates";

const currentLang = languageManager.getCurrentLanguage().name;
const list = [
  {
    name: "gitlab",
    title: {
      en: "Gitlab",
    },
    description: "Trigger a pipeline",
    icon: require("./../../../../assets/webhooksIcons/gitlab.png"),
    hasContent: true,
  },
  {
    name: "netlify",
    title: {
      en: "Netlify",
    },
    description: "Deploy a site",
    icon: require("./../../../../assets/webhooksIcons/netlify.png"),
  },
  {
    name: "heroku",
    title: {
      en: "Heroku",
    },
    description: "Trigger a build",
    icon: require("./../../../../assets/webhooksIcons/heroku.png"),
  },
  {
    name: "travisCI",
    title: {
      en: "Travis CI",
    },
    description: "Trigger a build",
    icon: require("./../../../../assets/webhooksIcons/travis.png"),
  },
  {
    name: "circleCI",
    title: {
      en: "CircleCI",
    },
    description: "Trigger a build",
    icon: require("./../../../../assets/webhooksIcons/circleCI.png"),
  },
  {
    name: "bitbucket",
    title: {
      en: "Bitbucket",
    },
    description: "Trigger a pipeline",
    icon: require("./../../../../assets/webhooksIcons/bitbucket.png"),
  },
  {
    name: "awsLambda",
    title: {
      en: "AWS Lambda",
    },
    description: "Invoke a fucntion",
    icon: require("./../../../../assets/webhooksIcons/AWS.jpg"),
  },
  {
    name: "googleCloud",
    title: {
      en: "Google Cloud",
    },
    description: "Run a function",
    icon: require("./../../../../assets/webhooksIcons/googleCloud.png"),
  },
  {
    name: "webtask",
    title: {
      en: "Webtask",
    },
    description: "Run a function",
    icon: require("./../../../../assets/webhooksIcons/webtask.png"),
  },
  {
    name: "slack",
    title: {
      en: "Slack",
    },
    description: "Notify a channel",
    icon: require("./../../../../assets/webhooksIcons/slack.png"),
  },
  {
    name: "twilio",
    title: {
      en: "Twilio",
    },
    description: "Send a SMS",
    icon: require("./../../../../assets/webhooksIcons/twilio.png"),
  },
  {
    name: "mailgun",
    title: {
      en: "Mailgun",
    },
    description: "Send an email",
    icon: require("./../../../../assets/webhooksIcons/mailgun.png"),
  },
  {
    name: "awsSos",
    title: {
      en: "AWS SQS",
    },
    description: "Send a message",
    icon: require("./../../../../assets/webhooksIcons/AWS-sos.jpg"),
  },
  {
    name: "pubnub",
    title: {
      en: "Pubnub",
    },
    description: "Publish a message",
    icon: require("./../../../../assets/webhooksIcons/pubnub.png"),
  },
  {
    name: "awsS3",
    title: {
      en: "AWS S3",
    },
    description: "Store entries",
    icon: require("./../../../../assets/webhooksIcons/AWS-s3.jpg"),
  },
  {
    name: "algolia",
    title: {
      en: "Algolia",
    },
    description: "Index entries",
    icon: require("./../../../../assets/webhooksIcons/algolia.png"),
  },

  {
    name: "edlasticsearch",
    title: {
      en: "Elasticsearch",
    },
    description: "Index entries",
    icon: require("./../../../../assets/webhooksIcons/elastic-elasticsearch.svg"),
  },
  {
    name: "jira",
    title: {
      en: "Jira",
    },
    description: "Create a task",
    icon: require("./../../../../assets/webhooksIcons/jira.png"),
  },
];

const WebHookCreating = props => {
  const [{ spaceInfo }, dispatch] = useGlobalState();
  const selectedWebhook = props.selectedWebhook
    ? props.selectedWebhook
    : undefined;
  const [selectedTemplate, setSelectedTemplate] = useState(
    selectedWebhook ? getTemplates() : undefined
  );
  const [tab, changeTab] = useState(selectedWebhook ? 2 : 1);

  useEffect(() => {}, []);
  
  function getTemplates() {
    return list.find(t => t.name === selectedWebhook.type);
  }
  function closeModal() {
    props.onClose();
  }
  function handleSelectTemplate(item) {
    if (item.hasContent) {
      setSelectedTemplate(item);
      changeTab(2);
    }
  }
  function backToTemplates() {
    changeTab(1);
  }
  return (
    <Modal isOpen={props.isOpen} toggle={closeModal} size="lg">
      <ModalHeader toggle={closeModal}>
        {tab === 1 && "Webhook Templates"}
        {tab === 2 && (
          <div className="templatesHeader">
            <img src={selectedTemplate.icon} alt="" />
            <span>{selectedTemplate.title[currentLang]}</span>
          </div>
        )}
      </ModalHeader>
      <ModalBody>
        <div className="webhooksBody">
          {tab === 1 && (
            <div className="fristTab">
              {list.map(item => (
                <div
                  className="webhookItem"
                  onClick={() => handleSelectTemplate(item)}
                >
                  <div className="w-top">
                    <img src={item.icon} alt="" />
                  </div>
                  <div className="w-bottom">
                    <span>{item.title[currentLang]}</span>
                    <span>{item.description}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
          {tab === 2 ? (
            selectedTemplate.name === "gitlab" ? (
              <Gitlab
                onShowTemplates={backToTemplates}
                selectedTemplate={selectedTemplate}
                selectedWebHook={selectedWebhook}
              />
            ) : null
          ) : null}
        </div>
      </ModalBody>
    </Modal>
  );
};
export default WebHookCreating;

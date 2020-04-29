import React from "react";
import Modal from "reactstrap/lib/Modal";
import ModalBody from "reactstrap/lib/ModalBody";
import ModalHeader from "reactstrap/lib/ModalHeader";
import ModalFooter from "reactstrap/lib/ModalFooter";
import styles from "./styles.module.scss";
import ContentTypes from "./ContentTypes";
import Filters from "./Filters";

const FilterModal = ({ onClose }) => {
  const [selectedContentType, setContentType] = React.useState();
  const [tab, changeTab] = React.useState(1);

  function handleSelectContentType(item) {
    setContentType(item);
    changeTab(2);
  }
  function handleBack() {
    changeTab(1);
  }
  return (
    <Modal isOpen={true} toggle={onClose} size="md">
      <ModalHeader toggle={onClose}>Filter Box</ModalHeader>
      <ModalBody>
        {tab === 1 ? (
          <ContentTypes
            selectedContentType={selectedContentType}
            onSelectContentType={handleSelectContentType}
          />
        ) : (
          <Filters selectedContentType={selectedContentType} />
        )}
      </ModalBody>
      {tab === 2 && (
        <ModalFooter>
          <button className="btn btn-light" onClick={handleBack}>
            Back
          </button>
          <button className="btn btn-primary">Apply</button>
        </ModalFooter>
      )}
    </Modal>
  );
};

export default FilterModal;

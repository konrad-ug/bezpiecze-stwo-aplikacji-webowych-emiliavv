import React from "react";
import { FaStar } from "react-icons/fa";
import PropTypes from "prop-types";

const Star = ({ selected = false, onSelect }) => (
  <FaStar color={selected ? "lightpink" : "grey"} onClick={onSelect} />
);

Star.propTypes = {
  selected: PropTypes.bool,
  onSelect: PropTypes.func,
};

export default Star;

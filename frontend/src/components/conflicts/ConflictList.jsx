import { useContract } from "@/contexts/Contract.context";
import PropTypes from "prop-types";

const ConflictList = (props) => {
  const { title, description, onClick, employer, jobId } = props;
}

ConflictList.propTypes = {
  jobId: PropTypes.bigint.isRequired,
}

export default ConflictList;
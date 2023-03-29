import React from "react";
import AccessTable from '../components/appointment-components/AccessTable';

const Precall = (props) => {

  const { appointment } = props;

  return <div>
    <AccessTable
      appointment={appointment}
    />
  </div>
};

export default Precall;

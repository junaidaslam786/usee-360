import React from "react";
import AccessTable from '../components/appointment-components/AccessTable';

const Precall = (props) => {

  return <div>
    <AccessTable
      appointment={props.location.state.appointment}
    />
  </div>
};

export default Precall;

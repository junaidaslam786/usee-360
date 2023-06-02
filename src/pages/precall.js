import React from "react";
import AccessTable from '../components/meeting/AccessTable';
import { useParams } from 'react-router-dom';

const Precall = (props) => {
  let { id, usertype } = useParams();

  return <div>
    <AccessTable
      appointmentId={id}
      userType={usertype}
     />
  </div>
};

export default Precall;

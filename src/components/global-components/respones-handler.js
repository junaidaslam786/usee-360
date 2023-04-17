
import React from "react";

export default function ResponseHandler(props) {
  return (
    <div>
      {
        props.errors ?
          props.errors.map(err => {
            return <div className="alert alert-danger" role="alert" key={err.param}> { err.msg } </div>;
          }
        ) : ""
      }
      { props.success ? ( <div className="alert alert-primary" role="alert"> { props.success } </div> ) : "" }
    </div>
  );
}

import "./body.css";
import CheckEvent from "../checkevent/checkevent";
import CreateEvent from "../createevent/createevent";
import { useState } from "react";
import CreateEventInterface from "../createeventinterface/createeventinterface";
import CheckEventInterface from "../checkeventinterface/checkeventinterface";
function Body(props) {
  const {email}=props;
  const [isactive, setactive] = useState("");
  function handleswitch(action) {
    setactive(action);
  }
  function goback() {
    setactive("");
  }
  return (
    <>
      {!isactive && (
        <div className="body-containery">
          <CreateEvent email={email}func={() => handleswitch("create")} />
          <CheckEvent email={email} func={() => handleswitch("check")} />
        </div>
      )}
      <div>
        {isactive == "create" && <CreateEventInterface userEmail={email} goback={goback} />}
        {isactive == "check" && <CheckEventInterface userEmail={email} goback={goback} />}
      </div>
    </>
  );
}

export default Body;

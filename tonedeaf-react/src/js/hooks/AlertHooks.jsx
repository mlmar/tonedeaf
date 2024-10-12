import { useState } from "react";
import Alert from "../modules/ui/Alert";

export const useAlert = (initialText) => {
  const [alertText, setAlertText] = useState(initialText);

  return { 
    setAlertText, 
    alertElement:<Alert visible={alertText?.length > 0} onClick={() => { setAlertText(null) }}> {alertText} </Alert>
  };
}
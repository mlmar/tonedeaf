import { useState } from "react";
import Alert from "../modules/ui/Alert";

export const useAlert = (initialText) => {
  
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertText, setAlertText] = useState(initialText);

  return { 
    setAlertText, 
    setAlertVisible, 
    alertElement:<Alert visible={alertVisible} onClick={() => { setAlertVisible(false) }}> {alertText} </Alert>
  };
}
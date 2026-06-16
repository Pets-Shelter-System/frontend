import { createContext, useEffect, useState } from "react";

export const CounterContext = createContext(0);
 
export default function CounterContextProvider(props) {
  const [counter, setcounter] = useState(() => {
    
    return Number(localStorage.getItem("counter"));
  });

  useEffect(() => {
    
    localStorage.setItem("counter", counter);
  }, [counter]);


  return (
    <CounterContext.Provider value={{ counter, setcounter }}>
      {props.children}
    </CounterContext.Provider>
  );
}
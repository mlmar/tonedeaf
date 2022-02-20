import { useState, useEffect } from 'react'
import { preFetch } from '../util/DataUtil'
import Load from './ui/Load';

const PreFetchWrapper = ({ children }) => {
  const [ready, setReady] = useState(false);
  
  useEffect(() => {
    const fetch = async () => {
      const res = await preFetch();
      setReady(res);
    }
    fetch();
  }, []);

  return ready ? <> {children} </> : <Load/>
}

export default PreFetchWrapper;
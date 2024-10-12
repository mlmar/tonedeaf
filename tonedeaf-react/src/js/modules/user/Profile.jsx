import { useState, useEffect } from 'react';
import { getProfile } from '../../util/SpotifyUtil.js';
import { cache } from '../../util/Session.js';

import ImageWrapper from '../ui/ImageWrapper.jsx';

/*
  Displays user's picture and name
*/
const Profile = () => {
  const [userInfo, setUserInfo] = useState(null);

  /*
    Fetch and cache user info on mount
  */
  useEffect(() => {
    const fetchProfile = async () => {
      if(cache["userInfo"]) {
        setUserInfo(cache["userInfo"])
        console.log("Retrieving user info from cache");
      } else {
        const info = await getProfile();
        cache["userInfo"] = info;
        console.log("Cacheing user info");
        setUserInfo(info);
      }
    }

    fetchProfile();
  }, [])

  return (
    <div className="profile">
      { userInfo &&
        <>
          <ImageWrapper src={userInfo.images?.[0]?.url} alt="Profile" nohover/>
          <div className="description flex-col">
            <label className="large"> {userInfo.display_name} </label>
            <label className="medium"> {userInfo.country}, {userInfo.followers?.total} followers </label>
          </div>
        </>
      }
    </div>
  )
}

export default Profile;
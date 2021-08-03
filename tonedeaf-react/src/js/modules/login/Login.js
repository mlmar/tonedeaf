const Login = ({ children }) => {
  return (
    <div className="login">
      <div className="primary flex-col">
        <label className="super"> tonedeaf </label>
        {children}
      </div>
      <div className="info flex-col">
        <label className="tiny"> This application is not developed by or affiliated with Spotify AB. </label>
        <label className="tiny">  Developed using Spotify Web API.  </label>
      </div>
    </div>
  )
}

export default Login;
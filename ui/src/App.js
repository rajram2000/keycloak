import Keycloak from 'keycloak-js';
import './App.css';
import logo from './logo.svg';

const kcConfig = {
  realm: 'demoapp',
  clientId: 'demoapp-ui',
  url: 'http://localhost:8080/auth/'
};

const keycloak = new Keycloak(kcConfig)

keycloak.onTokenExpired = () => {
  alert('token expired')
}

keycloak.onAuthRefreshSuccess = () => {
  alert('token refreshed')
}

keycloak.onReady = (authenticated) => {
  alert(`authenticated=${authenticated}`)
}

keycloak.init({
  onLoad: 'login-required'
});



const clickIt = (e) => {

  console.log("authenticated", keycloak.authenticated)
  console.log("tokenExpired", keycloak.isTokenExpired())

  console.log(keycloak.tokenParsed)
  console.log(keycloak.idTokenParsed)
  console.log("refreshToken", keycloak.refreshToken)

  keycloak.updateToken()
    .then(function (refreshed) {
      if (refreshed) {
        alert('Token was successfully refreshed');
      } else {
        alert('Token is still valid');
      }
      const options = {
        headers: {
          Authorization: `Bearer ${keycloak.token}`
        }
      }

      fetch("/users", options).then((res) => {
        res.text().then((text) => alert(text))
      })
    }).catch(function () {
      alert('Failed to refresh the token, or the session has expired');
    });
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <button onClick={clickIt}>Users</button>
      </header>
    </div>
  );
}

export default App;

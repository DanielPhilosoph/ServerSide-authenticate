import axios from "axios";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

const Login = (props) => {
  const name = useRef();
  const password = useRef();
  const navigate = useNavigate();
  const login = async () => {
    try {
      const response = await axios.post("http://localhost:3001/user/login", {
        name: name.current.value,
        password: password.current.value,
      });
      console.log(response);
      // Should redirect to Home if true
      props.setAuthenticate(response.data.login);
      // Should redirect to CodePage if true
      props.setCode(response.data.authenticate);
      // Set the current authentication for home page
      props.setCurrentAuthenticate(response.data.authenticate);
      // Set global id of user
      props.setId(response.data.id);
      // Set url for code page
      props.setUrl(response.data.qrLink);
      if (response.data.login) {
        navigate("/home");
      } else if (response.data.authenticate) {
        navigate("/code");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <p>Name</p>
      <p>
        <input type="text" placeholder="name" ref={name}></input>
      </p>
      <p>Password</p>
      <p>
        <input type="password" placeholder="password" ref={password}></input>
      </p>
      <p>
        <button onClick={login}>Login</button>
      </p>
    </div>
  );
};

export default Login;

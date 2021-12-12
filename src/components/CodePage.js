import axios from "axios";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

const CodePage = (props) => {
  const code = useRef();
  const navigate = useNavigate();

  const submit = async () => {
    try {
      const response = await axios.post("http://localhost:3001/user/code", {
        id: props.id,
        code: code.current.value,
      });
      if (response.data.login) {
        props.setAuthenticate(true);
        navigate("/home");
      } else {
        console.log("Not quit right");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <p>Code</p>
      <p>
        <input type="text" placeholder="code" ref={code}></input>
      </p>
      <p>
        <button onClick={submit}>Submit</button>
      </p>
      <p>Link</p>
      <p>
        <a href={props.url} rel="noopener noreferrer" target="_blank">
          QR from scanning
        </a>
      </p>
    </div>
  );
};

export default CodePage;

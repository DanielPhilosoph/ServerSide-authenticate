import axios from "axios";

const Home = (props) => {
  const onTurn = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/user/authenticate/${props.id}`
      );
      console.log(response);
      props.setCurrentAuthenticate(response.data.authenticate);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h1>WELCOME TO MY SITE!</h1> <br />
      <p>Wanna use phone authenticate? click here</p>
      <p>
        <button onClick={onTurn}>Turn on / off</button>
      </p>
      <p>Authenticate is currently: {props.currentAuthenticate.toString()}</p>
    </div>
  );
};

export default Home;

import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import axios from "axios";

function App() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("submitted");

    try {
      setLoading(true);
      const response = await axios.post("http://localhost:3000/api", {
        prompt: input,
      });
      setMessage(response.data);
    } catch (error) {
      setMessage("There was an error in the api");
      console.log(error);
    }
    setLoading(false);
  };

  function renderMessage(text) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);

    const url = "https://www.facebook.com/profile.php?id=61569508302259";
    const match = url.match(/(?:https?:\/\/)?(?:www\.)?(facebook\.com)/);

    return parts.map((part, index) => {
      if (part.match(urlRegex)) {
        return (
          <a key={index} href={url} target="_blank" rel="noopener noreferrer">
            Bloom's Place
          </a>
        );
      } else {
        return <span key={index}>{part}</span>;
      }
    });
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Prompt here"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
      {loading ? (
        <div> Loading </div>
      ) : message ? (
        <div>
          Heres the response: <br />
          {renderMessage(message)}
        </div>
      ) : (
        <div>Ask me anything regarding Bloom's place!</div>
      )}
    </>
  );
}

export default App;

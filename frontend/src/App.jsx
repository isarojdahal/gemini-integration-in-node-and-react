import { useState } from "react";
import "./App.css";

function App() {
  const [prompt, setPrompt] = useState("");
  const [promptResponse, setPromptResponse] = useState("");
  const [file, setFile] = useState(null);

  return (
    <>
      <textarea
        value={prompt}
        rows="5"
        onChange={(e) => setPrompt(e.target.value)}
      />
      <input
        type="file"
        onChange={(e) => setFile(e.target.files)}
        multiple={true}
      />
      <br />
      <button
        type="button"
        onClick={() => {
          if (file) {
            const formData = new FormData();
            formData.append("prompt", prompt);
            for (let i = 0; i < file.length; i++) {
              formData.append("files", file[i]);
            }
            fetch(`http://localhost:4000/ai/image`, {
              method: "POST",
              body: formData,
            })
              .then((res) => res.json())
              .then((data) => setPromptResponse(data));
            return;
          } else {
            fetch(`http://localhost:4000/ai/text`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ prompt }),
            })
              .then((res) => res.json())
              .then((data) => setPromptResponse(data));
          }
        }}
      >
        Generate Response
      </button>
      <hr />
      <h2>Response</h2>
      <p>{promptResponse.text}</p>
    </>
  );
}

export default App;

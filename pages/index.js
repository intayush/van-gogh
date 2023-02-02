import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [topic, setTopic] = useState("");
  const [result, setResult] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);

  async function onSubmit(event) {
    event.preventDefault();
    try {
      setIsDrawing(true);
      setIsLoading(true);
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic,
          width: window.innerWidth > 550 ? 512 : 256,
        }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw (
          data.error ||
          new Error(`Request failed with status ${response.status}`)
        );
      }

      setResult(data.result);
      setTopic("");
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>AI Van Gogh</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <main className={styles.main}>
        {/* <img src="/dog.png" className={styles.icon} /> */}
        <h3
          style={{
            color: "white",
            padding: 16,
            textAlign: "center",
          }}
        >
          Hi I'm your personal AI powered van gogh. What can i draw for you?
        </h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="topic"
            placeholder="jimmy page playing gibson les paul"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
          <input type="submit" value="Paint it" />
        </form>
        {(isLoading || isDrawing) && (
          <div
            style={{
              color: "white",
              fontSize: 40,
              fontWeight: 600,
              marginTop: 80,
            }}
          >
            Wait Bro. Drawing......
          </div>
        )}
        <div className={styles.result}>
          {result ? (
            <img
              src={result}
              alt=""
              onLoad={() => {
                setIsDrawing(false);
              }}
            />
          ) : (
            <></>
          )}
        </div>
      </main>
    </div>
  );
}

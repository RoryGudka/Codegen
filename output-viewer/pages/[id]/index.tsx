import { useEffect, useState } from "react";

const Home = () => {
  const [content, setContent] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      const id = window.location.href.split("/").pop();
      (async () => {
        try {
          const response = await fetch(`/api/output/${id}`);
          const data = await response.json();
          setContent(data.content);
        } catch (e) {
          console.error("Error fetching content:", e);
        }
      })();
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h1>Output Viewer</h1>
      <pre>{content}</pre>
    </div>
  );
};

export default Home;

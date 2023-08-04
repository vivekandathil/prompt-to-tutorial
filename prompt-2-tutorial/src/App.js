import './App.css';
import './sass/styles.scss';
import PromptInput from './components/prompt-input';
import React, { useEffect, useState } from 'react';
import { Player } from "@remotion/player";
import { VideoComposition } from "./video/Composition";

const { Configuration, OpenAIApi } = require("openai");

function App() {

  const [topic, setTopic] = useState('');
  const [additionalTopics, setAdditionalTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openAIResponseText, setOpenAIResponseText] = useState('');
  const [videoScript, setVideoScript] = useState([]);
  const [error, setError] = useState('');

  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const openai = new OpenAIApi(configuration);

  const setTestScript = (e) => {
    setOpenAIResponseText("Turbochargers are a type of forced induction system that compresses the air flowing into the engine, allowing the engine to squeeze more air into a cylinder and burn more fuel each second. They work by using exhaust gas to spin a turbine that is attached to a second turbine that sucks air into the engine. The turbocharger is powered by the flow of exhaust gases and uses this energy to compress the intake gas, forcing more air into the engine in order to produce more power for a given displacement. The main difference between turbochargers and superchargers is their energy source. Turbochargers use the vehicle’s exhaust gas; two fans – a turbine fan and a compressor fan – rotate from exhaust gas. Conversely, superchargers are powered directly by the engine; a belt pulley drives gears that cause a compressor fan to rotate. In summary, turbochargers and superchargers are both air compressors that increase the power and efficiency of an engine. The main difference is that a supercharger is driven by the engine’s crankshaft, usually with a belt or chain, while a turbocharger is driven by the exhaust gas, with a turbine and a compressor");
    setVideoScript(splitParagraphIntoSentences(openAIResponseText));
    console.log(videoScript);
  }

  const createScript = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await openai.createCompletion({
        model: "gpt-4",
        prompt: `Please generate a script for a detailed informational video on ${topic}. Separate the script into logical sections and provide a title for each section. The script should also include details on the following: ${additionalTopics}`,
        temperature: 0.5,
        max_tokens: 4000,
      });
      console.log("response", result.data.choices[0].text);
      setOpenAIResponseText(result.data.choices[0].text);
    } catch (e) {
      console.log(e);
      setOpenAIResponseText("Something is going wrong, Please try again.");
    }
    setVideoScript(splitParagraphIntoSentences(openAIResponseText));
    setLoading(false);
  };

  return (
    <div className="App">
      <header className="prompts">
        <div className="prompt-container">
          <h2 className="prompt-label">Video Subject</h2>
          <PromptInput label={"What do you want to learn about?"} />
        </div>
        <div className="prompt-container">
        <h2 className="prompt-label">Additional Details</h2>
          <PromptInput label={"Is there anything specific it should cover?"} />
        </div>
      </header>
      <button className="submit-button" onClick={(e) => setTestScript()}>Submit</button>
      <Player
        component={VideoComposition}
        durationInFrames={120}
        compositionWidth={1920}
        compositionHeight={1080}
        inputProps={{ text: 'hello', topics: videoScript}}
        fps={30}
        loop
        autoPlay
      />
    </div>
  );
}

function splitParagraphIntoSentences(paragraph) {
  console.log(paragraph);
  return paragraph.split(/(?<=[.!?])\s+/);
}

export default App;

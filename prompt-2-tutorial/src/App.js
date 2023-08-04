import './App.css';
import './sass/styles.scss';
import PromptInput from './components/prompt-input';
import React, { useEffect, useState } from 'react';
import { Player } from "@remotion/player";
import { VideoComposition } from "./video/Composition";
import Loader from "./components/loader";
import Script from "./components/script";
import testResponse from'./test-data.json';
import logo from './vk1.png';

const { Configuration, OpenAIApi } = require("openai");

// TODO: Text to speech: https://learn.microsoft.com/en-us/azure/ai-services/speech-service/get-started-text-to-speech?tabs=macos%2Cterminal&pivots=programming-language-javascript
// TODO: Bing Image Search: https://learn.microsoft.com/en-us/bing/search-apis/bing-image-search/quickstarts/rest/nodejs

function App() {

  const [topic, setTopic] = useState('Oranges');
  const [additionalTopics, setAdditionalTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [sections, setSections] = useState([]);
  const [openAIResponseText, setOpenAIResponseText] = useState('');
  const [videoScript, setVideoScript] = useState([]);
  const [videoAvailable, setVideoAvailable] = useState(false);
  const [error, setError] = useState('');
  const keys = [...Array(30).keys()];

  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const openai = new OpenAIApi(configuration);

  const setTestScript = async () => {
    setVideoAvailable(false);
    setLoading(true);
    setLoadingMessage("Generating video scripts...")
    await delayLoading(1600);
    setLoadingMessage("Fetching images for visuals...")
    await delayLoading(1600);
    setLoadingMessage("Generating voiceovers...")
    await delayLoading(1600);
    setLoadingMessage("Rendering video...")
    await delayLoading(1600);
    setOpenAIResponseText(testResponse.text);
    console.log(videoScript);
    setVideoAvailable(true);
  }

  useEffect(() => {
    console.log(openAIResponseText);
    let sectionRegexMatches = [...openAIResponseText.matchAll(/(?<=\[Title\]).*?(?=\[\/Title\])/gm)];
    let sectionsToAdd = [];
    sectionRegexMatches.forEach(section => sectionsToAdd.push(section[0]));
    setSections(sectionsToAdd);
    setVideoScript(splitResponseIntoSections(openAIResponseText));
    console.log(splitResponseIntoSections(openAIResponseText));
    videoScript.forEach(section => {
      console.log(section);
    })
    setLoading(false);
  }, [openAIResponseText])

  const createScript = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await openai.createCompletion({
        model: "gpt-4",
        prompt: `Please generate a script for a detailed informational video on ${topic}. Separate the script into logical sections and provide a title for each section. Each section title should start with "[Title]". The script should also include details on the following: ${additionalTopics}`,
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
        {keys.map((key) => <div key={key} class="particle"></div>)}
        <div className="row">
        <div className="video-menu">
            <img src={logo} alt="VK" className="logo"></img>
            <div className="header-font">
              <p className="logo-label-top">PROMPT</p>
              <p className="logo-label-center">- to -</p>
              <p className="logo-label-bottom">TUTORIAL</p>
            </div>
          </div>
          <div className="prompt-container">
            <h2 className="prompt-label">Video Subject</h2>
            <PromptInput setTopic={setTopic} label={"What do you want to learn about?"} />
          </div>
          <div className="prompt-container">
          <h2 className="prompt-label">Additional Details</h2>
            <PromptInput label={"Is there anything specific it should cover?"} />
          </div>
        </div>
        <div className="tab-group">
          <div class="video-script-tab"><b className="video-script-tab-label">✨ Video Script: {topic}</b></div>
          <div className="video-script">
            {loading ? <Loader loadingMessage={loadingMessage} /> : <Script sections={sections} videoScript={videoScript} />}
          </div>
        </div>
        <button className={videoAvailable ? "view-video" : "no-video"} onClick={async () => { await setTestScript(); }}>{videoAvailable ? "Video is Available! (Click to View)" : "Video will be available below"}</button>
      </header>
      <Player
        component={VideoComposition}
        durationInFrames={(videoScript.length + 2) * 40}
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
  return paragraph.split(/(?<=[.!?])\s+/);
}

function splitResponseIntoSections(response) {
  return response.split(/(?<=\[Title\]).*?(?=\[\/Title\])/);
}

const delayLoading = ms => new Promise(res => setTimeout(res, ms));

export default App;

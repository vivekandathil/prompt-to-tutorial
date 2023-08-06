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
import * as sdk from 'microsoft-cognitiveservices-speech-sdk';
const { SpeechSynthesisOutputFormat, SpeechConfig, AudioConfig, SpeechSynthesizer, PassThrough } = require("microsoft-cognitiveservices-speech-sdk");

const { Configuration, OpenAIApi } = require("openai");

function App() {

  const [topic, setTopic] = useState('Oranges');
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [sections, setSections] = useState([]);
  const [openAIResponseText, setOpenAIResponseText] = useState({});
  const [videoAvailable, setVideoAvailable] = useState(false);
  const [error, setError] = useState('');
  const keys = [...Array(30).keys()];

  const speechKey = process.env.REACT_APP_SPEECH_KEY;
  const region = process.env.REACT_APP_SPEECH_REGION;

  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const openai = new OpenAIApi(configuration);

  let audioFile = "VideoVoice.wav";

  const retrieveAudioFromScript = async (text) => {
    const speechConfig = SpeechConfig.fromSubscription(speechKey, region);
    // TODO: Let the user choose voice gender
    speechConfig.speechSynthesisVoiceName = "en-US-GuyNeural";
    speechConfig.speechSynthesisOutputFormat = SpeechSynthesisOutputFormat.Audio24Khz160KBitRateMonoMp3;
    // const audioConfig = sdk.AudioConfig.fromDefaultSpeakerOutput;

    const speechSynthesizer = new SpeechSynthesizer(speechConfig);
    speechSynthesizer.speakTextAsync(
      text,
      result => {
          if (result) {
              console.log("Successfully synthesized voice over audio", result);
              const blob = new Blob([result.audioData], { type: "audio/mp3" });
              const url = window.URL.createObjectURL(blob);
              let tempLink = document.createElement('a');
              tempLink.href = url;
              tempLink.setAttribute('download', '/Users/vivekkandathil/Downloads/filename.mp3');
              tempLink.click();
              console.log(url);
              speechSynthesizer.close();
              return result.audioData;
          }
      },
      error => {
          console.log(error);
          speechSynthesizer.close();
      });
  };

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

    setOpenAIResponseText(testResponse);
    setVideoAvailable(true);
  }

  useEffect(() => {
    if ("segments" in openAIResponseText) {
      console.log(openAIResponseText);
        setSections(openAIResponseText.segments);
        retrieveAudioFromScript(openAIResponseText.segments[0].narration);
        setLoading(false);
    }
  }, [openAIResponseText])

  const createScript = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await openai.createCompletion({
        model: "gpt-4",
        prompt: `Make me a informational video script about ${topic} in json format`,
        temperature: 0.5,
        max_tokens: 4000,
      });
      console.log("response", result.data.choices[0].text);
      setOpenAIResponseText(result.data.choices[0].text);
    } catch (e) {
      console.log(e); 
      setOpenAIResponseText("Something is going wrong, Please try again.");
    }
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
            {loading ? <Loader loadingMessage={loadingMessage} /> : <Script sections={sections}/>}
          </div>
        </div>
        <button className={videoAvailable ? "view-video" : "no-video"} onClick={async () => { await setTestScript(); }}>{videoAvailable ? "Video is Available! (Click to View)" : "Video will be available below"}</button>
      </header>
      <Player
        component={VideoComposition}
        durationInFrames={(sections.length + 2) * 40}
        compositionWidth={window.innerWidth}
        compositionHeight={1080}
        inputProps={{sections : sections}}
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

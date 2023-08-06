import './App.css';
import './sass/styles.scss';
import PromptInput from './components/prompt-input';
import React, { useEffect, useState, useCallback } from 'react';
import { AbsoluteFill } from 'remotion';
import { Player } from "@remotion/player";
import { VideoComposition } from "./video/Composition";
import GenerateButton from './components/menu/generate-button';
import Loader from "./components/loader";
import Script from "./components/script";
import testResponse from'./test-data.json';
import logo from './vk1.png';
const { SpeechSynthesisOutputFormat, SpeechConfig, AudioConfig, SpeechSynthesizer, PassThrough } = require("microsoft-cognitiveservices-speech-sdk");

const { Configuration, OpenAIApi } = require("openai");

function App() {

  const [topic, setTopic] = useState('Oranges');
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [sections, setSections] = useState([]);
  const [openAIResponseText, setOpenAIResponseText] = useState({});
  const [videoAvailable, setVideoAvailable] = useState(false);
  const [exportFormat, setExportFormat] = useState('mp4');
  const [filename, setFilename] = useState('filename');
  const [error, setError] = useState('');
  const keys = [...Array(30).keys()];
  const [audioBlobUrl, setAudioBlobUrl] = useState(null);
  const [visualAids, setVisualAids] = useState([]);

  const speechKey = process.env.REACT_APP_SPEECH_KEY;
  const region = process.env.REACT_APP_SPEECH_REGION;
  const bingSearchKey = process.env.REACT_APP_SEARCH_KEY;
  const bingSearchHost = 'https://api.bing.microsoft.com/';
  const bingSearchUrl = bingSearchHost + 'v7.0/images/search/';

  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const openai = new OpenAIApi(configuration);

  const renderPoster = useCallback(({ height, width }) => {
    return (
      <AbsoluteFill style={{ backgroundColor: "gray" }}>
        Click to play! ({height}x{width})
      </AbsoluteFill>
    );
  }, []);

  const retrieveImagesFromBing = async () => {
    console.log(bingSearchKey)
    fetch(bingSearchUrl + '?q=' + encodeURIComponent(topic), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key' : bingSearchKey,
      },
    })
    .then(res => res.json())
    .then(res => {
      let images = res['value'];
      let videoImages = [];
      for (let i = 0; i < images.length; i++) {
        videoImages.push(images[i]['contentUrl']);
      }
      console.log("Images", videoImages);
      setVisualAids(videoImages);
    });
    
  };

  const retrieveAudioFromScript = async (text, narrationIndex) => {
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
              setAudioBlobUrl(url);
              // let tempLink = document.createElement('a');
              // tempLink.href = url;
              // tempLink.setAttribute('download', './audio/filename.mp3');
              // tempLink.click();
              console.log(sections);
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
        retrieveImagesFromBing();
        // retrieveAudioFromScript("Hi", 0);
        // retrieveAudioFromScript(openAIResponseText.segments[0].narration, 0);
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
        {keys.map((key) => <div key={key} class="background-particle"></div>)}
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
            <PromptInput setValue={setTopic} label={"What do you want to learn about?"} />
          </div>
          <div className="prompt-container">
            <h2 className="prompt-label">Export Options</h2>
            <div className="options-container">
              <div style={{ width: 280 }}>
                <PromptInput setValue={setFilename} textWidth={100} label={"Video-Filename"} children={
                  <select value={exportFormat} onChange={(e) => setExportFormat(e.target.value)} className="dropdown">
                    <option value="mp4">MP4</option>
                    <option value="mov">MOV</option>
                  </select>} />
              </div>
              <GenerateButton submit={async () => { await setTestScript(); }} />
            </div>
          </div>
        </div>
        <div className="tab-group">
          <div class="video-script-tab"><b className="video-script-tab-label">✨ Video Script: {topic}</b></div>
          <div className="video-script">
            {loading ? <Loader loadingMessage={loadingMessage} /> : <Script sections={sections}/>}
          </div>
        </div>
        <button className={videoAvailable ? "view-video" : "no-video"} onClick={() => window.scrollTo(0, document.body.scrollHeight - 1100)}>{videoAvailable ? "Video is Available! (Click to View)" : "Video will be available below"}</button>
      </header>
      <div className="video-player">
        <Player
          component={VideoComposition}
          durationInFrames={(sections.length + 2) * 40}
          compositionWidth={window.innerWidth - 80}
          compositionHeight={1080}
          style={{ margin: '0 auto', borderRadius: 10 }}
          inputProps={{sections : sections, images: visualAids}}
          renderPoster={renderPoster}
          fps={30}
          loop
          autoPlay
        />
      </div>
    </div>
  );
}

const delayLoading = ms => new Promise(res => setTimeout(res, ms));

export default App;

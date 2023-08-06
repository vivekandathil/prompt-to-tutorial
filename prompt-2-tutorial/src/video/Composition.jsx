import { spring, useCurrentFrame, useVideoConfig, Sequence } from "remotion";

export const VideoComposition = (props) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
 
  const scale = spring({
    fps,
    frame,
  });
 
  // TODO: take in segment.visuals 
  // make an api call to bing
  
  return (
    <div>
      <Sequence durationInFrames={40}></Sequence>
      {props.sections.map((section, index) =>           
          <Sequence key={index} from={(index + 1) * 40} durationInFrames={40}>
              <div
                    style={{
                      flex: 1,
                      textAlign: "center",
                      fontSize: "7em",
                      color: 'black'
                    }}
                  >
                    <div>{section.narration} {(index + 1) * 40}</div>
                    <img src={props.images[index]} style={{ width: 100, height: 100}} />
                  </div>
          </Sequence>)
      }
    </div>
  );
};
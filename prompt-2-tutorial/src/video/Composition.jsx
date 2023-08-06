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
    <div className="video-background">
      <Sequence durationInFrames={40}></Sequence>
      {props.sections.map((section, index) =>           
          <Sequence key={index} from={(index + 1) * 40} durationInFrames={40}>
              <div
                    style={{
                      flex: 1,
                      textAlign: "center",
                      fontSize: "4em",
                      color: 'black'
                    }}
                  >
                    <div style={{ fontWeight: 400 }}>{section.title}</div>
                    <div style={{ fontWeight: 200 }}>{section.narration} {(index + 1) * 40}</div>
                    <img src={props.images[index]} style={{ maxWidth: 200, maxHeight: 200, width: "auto", height: "auto" }} />
                  </div>
          </Sequence>)
      }
    </div>
  );
};
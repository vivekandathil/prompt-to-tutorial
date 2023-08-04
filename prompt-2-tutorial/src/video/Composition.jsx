import { spring, useCurrentFrame, useVideoConfig, Sequence } from "remotion";

export const VideoComposition = (props) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
 
  const scale = spring({
    fps,
    frame,
  });
 
  return (
    <div>
      <Sequence durationInFrames={40}></Sequence>
      {props.topics.map((topic, index) =>           
          <Sequence key={index} from={(index + 1) * 40} durationInFrames={40}>
              <div
                    style={{
                      flex: 1,
                      textAlign: "center",
                      fontSize: "7em",
                      color: 'black'
                    }}
                  >
                    <div>{topic} {(index + 1) * 40}</div>
                  </div>
          </Sequence>)
      }
    </div>
  );
};
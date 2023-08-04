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
      <Sequence durationInFrames={10}></Sequence>
      {props.topics.map((topic, index) =>           
          <Sequence from={(index + 1) * 10} durationInFrames={10}>
              <div
                    style={{
                      flex: 1,
                      textAlign: "center",
                      fontSize: "7em",
                      color: 'black'
                    }}
                  >
                    <div style={{ transform: `scale(${scale})` }}>{topic} {(index + 1) * 10}</div>
                  </div>
          </Sequence>)
      }
    </div>
  );
};
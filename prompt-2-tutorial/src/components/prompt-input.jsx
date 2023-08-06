import '../sass/styles.scss';

function PromptInput(props) {
  return (
    <div className="prompt-input">
        <input style={{ width: props.textWidth }} placeholder={props.label} onChange={(e) => props.setValue(e.target.value)}></input>
        {props.children}
    </div>
  );
}

export default PromptInput;
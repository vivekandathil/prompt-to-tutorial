import '../sass/styles.scss';

function PromptInput(props) {
  return (
    <div className="prompt-input">
        <input className="" placeholder={props.label} ></input>
        <button type="submit"><i className="icon ion-android-arrow-forward"></i></button>
    </div>
  );
}

export default PromptInput;
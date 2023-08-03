import '../sass/styles.scss';

function PromptInput(props) {
  return (
    <div class="prompt-input">
        <input class="" type="email" placeholder={props.label} ></input>
        <button type="submit"><i class="icon ion-android-arrow-forward"></i></button>
    </div>
  );
}

export default PromptInput;
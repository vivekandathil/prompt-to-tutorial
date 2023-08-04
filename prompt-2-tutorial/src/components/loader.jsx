import '../sass/styles.scss';

// Loader (using HTML from https://codepen.io/jackrugile)
function Loader(props) {
  return (
    <div className="loader">
        <div className="loader-inner">
            <div className="loader-line-wrap">
            <div className="loader-line"></div>
            </div>
            <div className="loader-line-wrap">
            <div className="loader-line"></div>
            </div>
            <div className="loader-line-wrap">
            <div className="loader-line"></div>
            </div>
            <div className="loader-line-wrap">
            <div className="loader-line"></div>
            </div>
            <div className="loader-line-wrap">
            <div className="loader-line"></div>
            </div>
        </div>
        <p className="loader-text">{props.loadingMessage}</p>
    </div>
  );
}

export default Loader;
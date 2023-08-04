import '../sass/styles.scss';
import React, { useEffect, useState } from 'react';

// Loader (using HTML from https://codepen.io/jackrugile)
function Script(props) {

    useEffect(() => {
        console.log("yeet", props.sections)
    }, [props.sections])

  return (
    <div className="script">
        {props.sections.map((section, index) => 
            <div>
                <p className="section-header">{section}</p>
                <p className="video-script-content">{props.videoScript[index + 1]}</p>
            </div>
        )}
    </div>
  );
}

export default Script;
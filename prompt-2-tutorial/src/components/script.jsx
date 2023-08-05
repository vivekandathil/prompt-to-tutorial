import '../sass/styles.scss';
import React, { useEffect, useState } from 'react';

// Loader (using HTML from https://codepen.io/jackrugile)
function Script(props) {

    useEffect(() => {
        console.log("yeet", props.sections)
    }, [props.sections])

  return (
    <div className="script">
        {props.sections.map((section) => 
            <div>
                <p className="section-header">{section.title}</p>
                <p className="video-script-content">{section.narration}</p>
            </div>
        )}
    </div>
  );
}

export default Script;
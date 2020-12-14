
import { Document, Page } from "react-pdf/dist/entry.webpack";
import React from 'react';
import { Base64 } from 'js-base64';

function Pdf(props) {
  const pass = e => {
    e(Base64.decode(props.password));  
  }
    return(
        <div>
           <Document
            onPassword={pass}
            file={props.file}
            onLoadSuccess={props.onDocumentLoadSuccess}  
          >          
            {props.pages.map((item, i) => (
                <Page className={`pdf-page-${i}`} scale={props.zoom} loading={props.loading} key={i} size="A4" pageNumber={item}/>
            ))}                 
          </Document>
        </div>

    );
}

export default Pdf;
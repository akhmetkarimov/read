// import React from 'react';

// export default (props) => {
//   const bodyRef = React.createRef();
//   console.log(props.children)
//   const createPdf = () => props.createPdf(bodyRef.current);
//   return (
//     <section className="pdf-container">
//       <section className="pdf-toolbar">
//         <button onClick={createPdf} style={{position: "fixed", zIndex: 999, left: 0, top: 0}}>Create PDF</button>
//       </section>
//       <section className="pdf-body"  ref={bodyRef}>
//         {props.children}
//       </section>
//     </section>
//   )
// }
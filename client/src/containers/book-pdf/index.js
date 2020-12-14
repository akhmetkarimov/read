import React, {useEffect, useState} from 'react';
import * as bookActions from "../../actions/bookActions";

import PropTypes from "prop-types";
import {bindActionCreators} from "redux";
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';

// import Viewer, { Worker } from '@phuocng/react-pdf-viewer';
// import { defaultLayout } from '@phuocng/react-pdf-viewer';
import '@phuocng/react-pdf-viewer/cjs/react-pdf-viewer.css';
// import { Page} from '@react-pdf/renderer'

import {Spin, Select} from 'antd';
import { LoadingOutlined } from "@ant-design/icons"
import './book-pdf.scss';
import Pdf from '../../components/pdf';
// import PdfDownload from '../../components/pdf-download';
import Pdfs from 'react-to-pdf'

let globalPage = null;
const { Option } = Select;

const ref = React.createRef();
function BookPdf(props) {
    const { bookActions, match, pdf, isLoading } = props;
    let [pageNumber, setPageNumber] = useState(3);
    const [pageShown, setPageShown] = useState(1);
    const [zoom, setZoom] = useState(`1.5`);
    const [text, setText] = useState(`asdasd`)
    let [numPages, setNumPages] = useState(null);
    useEffect(() => {
        bookActions.getBookPdf(match.params.file);
        // eslint-disable-next-line react-hooks/exhaustive-deps
        window.addEventListener('scroll', updateDimensions)
        window.addEventListener('scroll', changePage);
        if (window.screen.width >= 320) {
            setZoom(`1`);
        }
        
    }, []);
    const changePage = () => {
        let element = document.getElementsByClassName('react-pdf__Page');
        let scrollPage = 1;
        let positions = [];
        for (let i = 0; i < globalPage; i++) {
            if (element[i]) {
                positions.push({pos: element[i].getBoundingClientRect(), page: i + 1})
            }
        }
        positions.map((item) => {
            if(item.pos.top < window.innerHeight && item.pos.bottom >= 0) {
                scrollPage = item.page
            }
        })
        setPageShown(scrollPage)
    }
    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages)
        globalPage = numPages;
      };
   
    // const renderPage = (props: RenderPageProps) => {
    //     return (
    //         <>
    //             {props.canvasLayer.children}
    //             <div style={{ userSelect: 'none' }}>
    //                 {props.textLayer.children}
    //             </div>
    //             {props.annotationLayer.children}
    //         </>
    //     );
    // };
    // const renderToolbar = (toolbarSlot: ToolbarSlot): React.ReactElement => {
    //     return (
    //         <div
    //             style={{
    //                 alignItems: 'center',
    //                 display: 'flex',
    //                 width: '100%',
    //             }}
    //         >
    //             <div
    //                 style={{
    //                     alignItems: 'center',
    //                     display: 'flex',
    //                     flexGrow: 1,
    //                     flexShrink: 1,
    //                     justifyContent: 'center',
    //                 }}
    //             >
    //                 <div style={{ padding: '0 2px' }}>
    //                     {toolbarSlot.previousPageButton}
    //                 </div>
    //                 <div style={{ padding: '0 2px' }}>
    //                     {toolbarSlot.search}
    //                 </div>
    //                 <div style={{ padding: '0 2px' }}>
    //                     {toolbarSlot.currentPage + 1} / {toolbarSlot.numPages}
    //                 </div>
    //                 <div style={{ padding: '0 2px' }}>
    //                     {toolbarSlot.nextPageButton}
    //                 </div>
    //                 <div style={{ padding: '0 2px' }}>
    //                     {toolbarSlot.zoomOutButton}
    //                 </div>
    //                 <div style={{ padding: '0 2px' }}>
    //                     {toolbarSlot.zoomPopover}
    //                 </div>
    //                 <div style={{ padding: '0 2px' }}>
    //                     {toolbarSlot.zoomInButton}
    //                 </div>
    //             </div>
    //         </div>
    //     );
    // };
    // const layout = (
    //     isSidebarOpened: boolean,
    //     container: Slot,
    //     main: Slot,
    //     toolbar: RenderToolbar,
    //     sidebar: Slot,
    // ): React.ReactElement => {
    //     return defaultLayout(
    //         isSidebarOpened,
    //         container,
    //         main,
    //         toolbar(renderToolbar),
    //         sidebar,
    //     );
    // };
    // const pageStyle = {
    //       position: 'absolute',
    //       fontSize: 12,
    //       bottom: 30,
    //       left: 0,
    //       right: 0,
    //       textAlign: 'center',
    //       color: 'grey',
    //     };
    //     const onChange = e => {
    //         setPageNumber(e.target.value)
    //     }
    // const goToPrevPage = () => {
    //     pageNumber--;
    //     console.log(pageNumber);
    //     setPageNumber(pageNumber)};
   
    // const goToNextPage = () => {
        
    //     pageNumber++;
    //     console.log(pageNumber);
    //     setPageNumber( pageNumber)};
 
    const updateDimensions = () => {
        console.log(1)
        // const windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
        // let body = document.body,
        // html = document.documentElement;
        // let height = Math.max( body.scrollHeight, body.offsetHeight, 
        //     html.clientHeight, html.scrollHeight, html.offsetHeight );
        // const windowBottom = windowHeight + window.pageYOffset;     
        // if (windowBottom >= height) {
           
        //     if (pageNumber < globalPage) {
        //         pageNumber++;
        //     }      
        //     console.log({pageNumber});      
        //     setPageNumber(pageNumber)
        // } 
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
            if (pageNumber < globalPage) {
                pageNumber++;
            }      
            console.log({pageNumber});      
            setPageNumber(pageNumber)
        }
    }
    const onSelect = e => {
        setZoom(e);
    }
    let pages = [];
    for ( let i = 1; i <= pageNumber; i++) {
        pages.push(i);
    }
    // const pagesDownload = [1,2,3,4,5,6,7,8,9,10];
    // const elements = pages.map((item, i) => (
    //     <Page scale={zoom}  key={i} size="A4" pageNumber={item}/>
    // ))
    
    // const MyDoc = () => (
       
          
    //     <PdfDownload/>
          
       
    //   )
      
            return(
        <Spin spinning={isLoading} >
            {/* <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.4.456/build/pdf.worker.min.js">
    <div style={{ height: '750px' }}>
      
        <Viewer layout={layout} renderPage={renderPage}  fileUrl={`http://localhost:8000/${pdf?.path}`} />
    </div>
</Worker> */}

    <div className="book-pdf">
        <div>
        
        <div className="toolbar">
        {/* <PDFDownloadLink document={<MyDoc/>} fileName="somename.pdf">
      {({ blob, url, loading, error }) => (loading ? 'Loading document...' : 'Download now!')}
    </PDFDownloadLink> */}
    {/* <Pdfs targetRef={ref} filename="code-example.pdf">
        {({ toPdf }) => <button onClick={toPdf}>Generate Pdf</button>}
      </Pdfs> */}
      {/* <div ref={ref}>
        <h1>Hello CodeSandbox</h1>
        <h2>Start editing to see some magic happen!</h2>
      </div> */}

{/* <PdfDownload loading={<LoadingOutlined style={{fontSize: '24px'}}/>} onDocumentLoadSuccess={onDocumentLoadSuccess} file={`http://37.18.30.124:8000/${pdf?.path}`} pages={pagesDownload} zoom={zoom}/> */}
            <div className="buttons-pdf">
            {/* <button onClick={goToPrevPage}>Prev</button>
            <button onClick={goToNextPage}>Next</button> */}
                <span>{pageShown}/</span>
                <span>{numPages}</span>
            </div>
            <Select onSelect={onSelect} value={zoom}>
                {/* <Option key="0.5">50%</Option>
                <Option key="0.75">75%</Option> */}
                <Option key="1">100%</Option>
                <Option key="1.5">150%</Option>
                <Option key="2">200%</Option>
            </Select>
            <div> 
        </div>
        </div >
       <Pdf  password={pdf?.password} loading={<LoadingOutlined style={{fontSize: '36px'}}/>} onDocumentLoadSuccess={onDocumentLoadSuccess} file={`https://admin.read.kz/${pdf?.path}`} pages={pages} zoom={zoom}/></div>       
      </div>
        </Spin>
    );
}

BookPdf.propTypes = {
   pdf: PropTypes.object,
   bookActions: PropTypes.object
};

const mapStateToProps = state => ({
    error: state.book.error,
    isLoading: state.book.isLoading,
    pdf: state.book.pdf
});
const mapDispatchToProps = dispatch => ({
    bookActions: bindActionCreators(bookActions, dispatch)
});
export default connect(mapStateToProps, mapDispatchToProps) (withRouter(BookPdf));

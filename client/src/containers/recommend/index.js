import React, {useState, useEffect} from 'react';
import { Button, Pagination, Empty, Rate, Popover } from 'antd';
import PropTypes from "prop-types";
import { Link } from 'react-router-dom';
import {bindActionCreators} from "redux";
import Header from '../../components/header';
import Footer from '../../components/footer';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import * as bookActions from "../../actions/bookActions";
import './recommend.scss';
import {
    TelegramShareButton,
    FacebookShareButton,
    FacebookIcon,
    TelegramIcon
  } from "react-share";

function Recommend(props) {
    const { book } = props;
    const [page, setPage] = useState(1); 
    useEffect(() => {
        props.bookActions.getRecommendedBooks(page);
    }, [])
    const onChange = e => {
        setPage(e)
        const filter = {
            page: e
        }
        props.bookActions.getBooks(filter);
    }
    const pagination = {
        onChange: onChange,
        total: book?.page_count * 16 ? book?.page_count * 16 : 0,
        page: page
    }
   
    const showcaseItems =  book.Books?.map((item, i) => {
     
        return (
            <div className="recommend-item" key={i}>
                <div className="img-share">
                    <div  className="recommend-img">
                        <img alt={item.title} src={`${item.book_cover}`}/>
                    </div>
                    <Popover content={ <div>
                        <FacebookShareButton url={`https://magkaznu.com/ru/shop/${item.slug}`} title={item.title}>
                            <FacebookIcon size={30} round={true} />
                        </FacebookShareButton>
                        <TelegramShareButton url={`https://magkaznu.com/ru/shop/${item.slug}`} title={item.title}>
                            <TelegramIcon  size={30} round={true}/>
                        </TelegramShareButton>
        </div>} title="Поделиться" trigger="click">
                        <img src="/assets/share.svg "  alt="share"/>
                    </Popover>                   
                </div>              
                <h6 className="book-title-card normal-bold-text">{item.title}</h6>
                <p className="book-title-card small-regular-text">{item.authors.map((item, i) => <span key={i}>{item.full_name}</span>)}</p>
                <span className="rate-text normal-regular-text"><Rate style={{ color: "#E7411B" }} allowHalf disabled defaultValue={item.book_rating} /></span>
              
                <div className="recommend-footer">
                    <div className="price" >
                        <span className="normal-regular-text"> Цена </span>
                        <p className="normal-bold-text">{item.price} тг</p>
                    </div>
                    <Button><a target={'_blank'} href={`https://magkaznu.com/ru/shop/${item?.slug}`}>Купить</a></Button>
                </div>
            </div> 
        )
       
    })
    return(
        <div className="">
            <Header/>
            <div className="container-favorite">
            <div className="showcase-header">
                <h2 className="medium-roboto-text">Рекомендуемые книги</h2>
             </div>
             {showcaseItems?.length ? <div>
                <div className="showcase-inner">
                {showcaseItems}
             </div>
             <div className="pagination">
                <Pagination current={pagination.page} pageSize={`16`} onChange={pagination.onChange} total={pagination.total} />
             </div>
             </div> : <Empty description="Пусто"/>}      
             </div>     
             <Footer/>
        </div>
    )
}

Recommend.propTypes = {
    pagination: PropTypes.object,
    book: PropTypes.object
};

const mapStateToProps = state => ({
    isLoading: state.book.isLoading,
    book: state.book.book,
});
const mapDispatchToProps = dispatch => ({
    bookActions: bindActionCreators(bookActions, dispatch),
});
export default connect(mapStateToProps, mapDispatchToProps) (withRouter(Recommend));
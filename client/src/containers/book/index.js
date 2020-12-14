import React, { useState, useEffect } from 'react';
import { Button, Spin, Rate } from 'antd';
import "./book.scss";
import PropTypes from "prop-types";
import {bindActionCreators} from "redux";
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import * as bookActions from "../../actions/bookActions";
import * as reviewActions from "../../actions/reviewActions";
import * as favoriteActions from "../../actions/favoriteActions";
import { Link } from 'react-router-dom';
import Header from "../../components/header";
import Footer from "../../components/footer";
import Review from '../../components/review';
import Slider from "react-slick";

function Book(props) {
    const [rate, setRate] = useState(5);
    const [content, setContent] = useState(``);
    const [page, setPage] = useState(1);
    const { isLoading, match, bookItem, review } = props;
    const onChangeRate = e => {
        setRate(e);
    }
    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        autoPlay: true,
        slidesToShow: 6,
        slidesToScroll: 1,
       
        initialSlide: 1,
        mobileFirst:true,
        arrows: true,
        responsive: [
            {
                breakpoint: 2560,
                settings: {
                    slidesToShow: 6,
                    slidesToScroll: 1,
                    infinite: false,
                    dots: true
                }
            },
           
            {
                breakpoint: 1500,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 1,
                    infinite: false,
                    
                  
                    dots: true
                }
            },
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    infinite: false,
                    centerMode: true,
                    dots: true
                }
            },
            //  {
            //     breakpoint: 1921,
            //     settings: {
            //         slidesToShow: 6,
            //         slidesToScroll: 1,
            //         infinite: true,
            //         dots: true
            //     }
            // },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    initialSlide: 1,
                    arrows: false,
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    arrows: false,
                }
            }
        ]
    };
    useEffect(() => {
        props.bookActions.getBookBySlug(match.params.slug);
        props.reviewActions.getReviews(match.params.slug, page);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [match.params.slug])
    const handleReview = () => {
        const review = {
            rate: rate,
            content: content,
            book: bookItem?.Book.id,
            page: 1,
            slug: match.params.slug
        }
        setContent(``);
        setRate(5);
        props.reviewActions.addReview(review);
    }
    const onChangeContent = e => {
        setContent(e.target.value);
    }
    const onChange = e => {
        setPage(e)
        props.reviewActions.getReviews(match.params.slug, e);
    }
    const pagination = {
        onChange: onChange,
        total: review?.page_count * 16 ? review?.page_count * 16 : 0,
        page: page
    }
    const handleFavorite = id => {
        const fav = {
            property: 'book',
            id: id,
            slug: match.params.slug
        }
        props.favoriteActions.addFavorite(fav);
    }
    const bookDetailsLabels =  !bookItem.Book?.categories[0]?.category_direction.includes(`20`) && [
        {
            label: `Автор`,
            name: bookItem?.Book?.authors.map((item, i) => <span className="category-title" key={i}>{item.full_name}</span>),
        }, 
        {
            label: `Категория`,  
            name: bookItem?.Book?.categories.map((item, i) => <span className="category-title" key={i}>{item.category_direction}</span>), 
        },
        {
            label: `Рейтинг`,
            name: bookItem?.Book?.book_rating_avg
        },
        {
            label: `ISBN`,
            name: bookItem?.Book?.ISBN
        },
        {
            label: `Год`, 
            name: bookItem?.Book?.publish_year
        },
        {
            label: `Язык`, 
            name: bookItem?.Book?.language?.language
        }
    ] || [
        {
            label: `Категория`,  
            name: bookItem?.Book?.categories.map((item, i) => <span className="category-title" key={i}>{item.category_direction}</span>), 
        },
        {
            label: `Рейтинг`,
            name: bookItem?.Book?.book_rating_avg
        },
        {
            label: !bookItem.Book?.categories[0]?.category_direction.includes(`Вестник`) && `ISBN` || `ISSN`,
            name: bookItem?.Book?.ISBN
        },
        {
            label: `Год`, 
            name: bookItem?.Book?.publish_year
        },
        {
            label: `Язык`, 
            name: bookItem?.Book?.language?.language
        }
    ]
    // const bookDetailsLabels = [`Автор`,`Категория`,  `Рейтинг`,`ISBN`, `Год`, `Язык`]
    // const bookDetailsItem = [
    //     bookItem?.Book?.authors.map((item, i) => <span className="category-title" key={i}>{item.full_name}</span>),
    //    bookItem?.Book?.categories.map((item, i) => <span className="category-title" key={i}>{item.category_direction}</span>), 
    //    bookItem?.Book?.book_rating_avg, bookItem?.Book?.ISBN, bookItem?.Book?.publish_year, bookItem?.Book?.language?.language
    // ]
    const breadcrumb = <div className="breadcrumb">
        <Link className="tiny-regular-text" to={'/'}>Главная / </Link>
        <Link className="tiny-regular-text" to={{pathname: `/`, query: {slug: bookItem.Book?.categories[0]?.slug, title: bookItem.Book?.categories[0]?.category_direction}}}>{bookItem.Book?.categories[0]?.category_direction} / </Link>
        <span className="tiny-regular-text">{bookItem?.Book?.title}</span>
    </div>
    const bookDetails = bookDetailsLabels.map((item, i) => (
        <div key={i} className="book-info-left medium-regular-text">
            <span className="book-text">{item.label}:</span>  
            <span className="book-text">{item.name}</span>          
        </div>
        
    ))
    // const bookDetailsNames = bookDetailsItem.map((item, i) => (
    //     <div key={i} className="book-info-right medium-regular-text">
    //         <span className="book-text">{item}</span>      
    //     </div>
        
    // ))
    const recommendations = bookItem.Recomendation_list?.map((item, i) => (
        <div className="showcase-item-card slide-item" key={i}>
                <span className="rate-text normal-regular-text"><Rate style={{ color: "#E7411B" }} allowHalf disabled defaultValue={item.book_rating_avg} /></span>
                <Link to={`/book/${item.slug}`} className="showcase-img-slide">
                    <img alt={`${item.title}`} src={`${item.book_cover}`}/>
                </Link>
                <Link to={`/book/${item.slug}`} className="book-title-card normal-bold-text">{item.title}</Link>
                <p className="book-title-card small-regular-text">{item.authors.map((item, i) => <span key={i}>{item.full_name}</span>)}</p>
                <div className="showcase-footer">
                    <div className="favorite-img" onClick={() => handleFavorite(item.id, pagination.page)}>
                        <img alt="bookmark" src={item.is_favorite ? `/assets/bookmarkFilled.svg` : `/assets/bookmarkGrey.svg`}/>
                    </div>
                    <Button><Link to={`/book/show/${item.book_content_pdf}`}>Читать</Link></Button>
                </div>
            </div> 
    ))
    const book = <div className="book-annotation">
                    <div className="book-inner">
                        <div className="book-img">
                            <img src={`${bookItem?.Book?.book_cover}`} alt="book"/>
                        </div>
                        <div className="book-content">
                            <h2 className="book-title large-bold-text">{bookItem?.Book?.title}</h2>
                            {/* {bookItem?.Book?.authors?.map((item, i) => (
                                <span key={i} className="author-text medium-regular-text">{item.full_name}</span>
                            ))} */}
                            <div className="book-info">
                                <div>
                                    {bookDetails}   
                                </div>
                                {/* <div>
                                    {bookDetailsNames}          
                                </div>                                          */}
                            </div>
                            {!bookItem.Book?.categories[0]?.category_direction.includes(`20`) && <a href={`https://magkaznu.com/ru/shop/${bookItem?.Book?.slug}`} target="_blank" className="normal-regular-text link">Купить в нашем магазине</a>}
                            <div className="book-footer">
                                <div className="bookmark" onClick={() => handleFavorite(bookItem?.Book?.id)}>
                                    <img src={bookItem?.Book?.is_favorite ? `/assets/bookmarkFilled.svg` : `/assets/bookmarkRed.svg`} alt="bookmark"/>
                                </div>
                                <Button className="small-regular-text"><Link to={`/book/show/${bookItem?.Book?.book_content_pdf}`}>Читать</Link></Button>
                            </div>
                        </div>  
                    </div>
                    {bookItem?.Book?.annotation !== "NULL" ? <div className="annotation">
                        <h2 className="large-bold-text">Аннотация</h2>
                        <p className="normal-regular-text">{bookItem?.Book?.annotation}</p>
                    </div> : ``}                 
                </div>

    return (
        <Spin spinning={isLoading} className="book">
            <Header/>
            <div className="container-book">
                {breadcrumb}
                {book}
                <Review pagination={pagination} 
                handleReview={handleReview} 
                content={content} 
                onChangeContent={onChangeContent} 
                reviews={review?.reviews} 
                onChangeRate={onChangeRate} 
                rate={rate}/>
                <div className="recommendation">
                    <h2 className="medium-roboto-text">Похожие</h2>
                    <Slider {...settings}>
                        {recommendations}
                    </Slider>
                </div>              
            </div>
            <Footer/>
        </Spin>
    )
}

Book.propTypes = {
    isLoading: PropTypes.bool,    
    bookActions: PropTypes.object,
    bookItem: PropTypes.object,
    review: PropTypes.object
};
const mapStateToProps = state => ({
    bookItem: state.book.bookItem,
    isLoading: state.book.isLoading,
    review: state.review.reviews
});
const mapDispatchToProps = dispatch => ({
    bookActions: bindActionCreators(bookActions, dispatch),
    reviewActions: bindActionCreators(reviewActions, dispatch),
    favoriteActions: bindActionCreators(favoriteActions, dispatch)
});
export default connect(mapStateToProps, mapDispatchToProps) (withRouter(Book));

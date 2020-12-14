import React, {useState} from 'react';
import './showcase.scss';
import { Button, Pagination, Empty, Rate, message } from 'antd';
import PropTypes from "prop-types";
import { Link } from 'react-router-dom';
import {bindActionCreators} from "redux";
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import * as favoriteActions from "../../actions/favoriteActions";
import * as authActions from "../../actions/authActions";
import { TableOutlined, BarsOutlined } from "@ant-design/icons"
import classNames from "classnames";

function ShowCase(props) {
    const { pagination, books, property, title, isAuth } = props;
    const [view, setView] = useState(`card`);
    const addFavorite = (id, page) => {
        const fav = {
            id: id,
            page: page,
            category: title !== 'Новинки' && title,
            property: property,
        }
        isAuth &&  props.favoriteActions.addFavorite(fav) || message.error('Пожалуйста, авторизуйтесь,  чтобы добавить книгу в избранное');    
    }
    const handleView = view => {
        setView(view);
    }
    const showcaseItems =  books?.map((item, i) => {
       if (view === `card`) {
        return (
            <div className="showcase-item-card" key={i}>
                <span className="rate-text normal-regular-text"><Rate style={{ color: "#E7411B" }} allowHalf disabled defaultValue={item?.book_rating_avg} /></span>
                <Link to={`/book/${item.slug}`} className="showcase-img-card">
                    <img alt={item.title} src={`${item.book_cover}`}/>
                </Link>
                <Link to={`/book/${item.slug}`} className="book-title-card normal-bold-text">{item.title}</Link>
                <p className="book-title-card small-regular-text">{item.authors.map((item, i) => <span key={i}>{item.full_name}</span>)}</p>
                <div className="showcase-footer">
                    <div className="favorite-img" onClick={() => addFavorite(item.id, pagination.page)}>
                        <img alt="bookmark" src={item.is_favorite ? `/assets/bookmarkFilled.svg` : `/assets/bookmarkGrey.svg`}/>
                    </div>
                    <Button><Link to={isAuth ? `/book/show/${item.book_content_pdf}` : `/signin`}>Читать</Link></Button>
                </div>
            </div> 
        )
       } else {
           return (
            <div className="showcase-item-list" key={i}>
            <Link to={`/book/${item.slug}`} className="showcase-img-list">
                <img alt={item.title} src={` ${item.book_cover}`}/>
            </Link>
            <div className="showcase-list-right"> 
                <div className="showcase-list-top">
                    <span className="rate-text normal-regular-text">{item?.book_rating_avg ? item.book_rating_avg : 0}/5</span>
                    <Link to={`/book/${item.slug}`} className="normal-bold-text">{item.title}</Link>
            <p className="small-regular-text">{item.authors.map((item, i) => <span key={i}>{item.full_name}</span>)}</p>
                </div>
                <div className="showcase-footer">
                    <div className="favorite-img" onClick={() => addFavorite(item.id, pagination.page)}>
                        <img alt="bookmark" src={item.is_favorite ? `/assets/bookmarkFilled.svg` : `/assets/bookmarkGrey.svg`}/>
                    </div>
                    <Button><Link to={isAuth ? `/book/show/${item.book_content_pdf}` : `/signin`}>Читать</Link></Button>
                </div>
           </div>    
        </div> 
           )
       }
    })
    return(
        <div className="showcase">
            <div className="showcase-header">
                <h2 className="medium-roboto-text">{title}</h2>
                <div>
                    <TableOutlined className={classNames("view", {"view-active": view === "card"})}  onClick={() => handleView(`card`)}/>
                    <BarsOutlined className={classNames("view", {"view-active": view === "list"})} onClick={() => handleView(`list`)}/>
                </div>
             </div>
             {showcaseItems?.length ? <div>
                <div className="showcase-inner">
                {showcaseItems}
             </div>
             <div className="pagination">
                <Pagination showSizeChanger={false} current={pagination.page} pageSize={`16`} onChange={pagination.onChange} total={pagination.total} />
             </div>
             </div> : <Empty description="Пусто"/>}           
        </div>
    )
}

ShowCase.propTypes = {
    setPage: PropTypes.func,
    pagination: PropTypes.object,
    favoriteActions: PropTypes.object,
    isAuth: PropTypes.bool
};

const mapStateToProps = state => ({
    error: state.favorite.error,
    isAuth: state.auth.isAuthenticated
});
const mapDispatchToProps = dispatch => ({
    favoriteActions: bindActionCreators(favoriteActions, dispatch),
    authActions: bindActionCreators(authActions, dispatch)
});
export default connect(mapStateToProps, mapDispatchToProps) (withRouter(ShowCase));
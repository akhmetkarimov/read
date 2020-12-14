import React, {useEffect, useState} from 'react';
import Header from '../../components/header';
import Footer from '../../components/footer';
import * as favoriteActions from '../../actions/favoriteActions';
import PropTypes from "prop-types";
import {bindActionCreators} from "redux";
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import Showcase from "../../components/showcase";
import "./favorite.scss";

function Favorite(props) {
    const { favorite } = props;
    const [page, setPage] = useState(1);
    useEffect(() => {
         props.favoriteActions.getFavorites(page);
         // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); 
    const onChange = e => {
        setPage(e)
        props.favoriteActions.getFavorites(e);
    }
    const pagination = {
        onChange: onChange,
        total: favorite?.page_count * 16 ? favorite?.page_count * 16 : 0,
        page: page
    }
   
    return(
        <div className="favorite">
            <Header/>
            <div className="container-favorite">
                <Showcase title={'Мои Избранные'} property={'fav'} pagination={pagination} books={favorite?.favorites}/>
            </div>
            <Footer/>
        </div>
    )
    
}
Favorite.propTypes = {
    isLoading: PropTypes.bool,
    favorite: PropTypes.object    
};
const mapStateToProps = state => ({
    error: state.favorite.error,
    isLoading: state.favorite.isLoading,
    favorite: state.favorite.favorite
});
const mapDispatchToProps = dispatch => ({
    favoriteActions: bindActionCreators(favoriteActions, dispatch)
});
export default connect(mapStateToProps, mapDispatchToProps) (withRouter(Favorite));
import React, { useEffect } from 'react';
import './footer.scss';
import PropTypes from "prop-types";
import {bindActionCreators} from "redux";
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import * as reviewActions from "../../actions/reviewActions";
function Footer(props) {
    const {reviewActions, statistics} = props;
    const socialIcons = [
        {
            src: `/assets/insta.png`, 
            url: 'https://www.instagram.com/qazaquniversity/'
        }, 
        {
            src: `/assets/facebook.png`, 
            url: 'https://www.facebook.com/QazaqUniversityPress/'
        }, 
       ];
    const socialMedia = socialIcons.map((item, i) => (
        <a href={item.url} key={i} className="social-icons">
            <img src={item.src} alt="insta"/>
        </a>
    ))
    useEffect(() => {
        reviewActions.getStatistics();
    }, [])
    return(
        <footer className="footer-main">
            <div className="container">
                <div className="footer-inner">
                    <a href="https://magkaznu.com" target="_blank " className="logo-header">
                        <img src="/assets/logoheader.png" alt="logo"/>
                    </a>
                    <div className="footer-contacts">
                        <div className="footer-contact--item">
                            <h3 className="medium-bold-text">Адрес</h3>
                            <span className='normal-regular-text'>Республика Казахстан, 050040, г. Алматы, пр. аль-Фараби, 71. </span>
                        </div>
                        <div className="footer-contact--item">
                            <h3 className="medium-bold-text">Email</h3>
                            <span className='normal-regular-text'>baspa@kaznu.kz</span>
                        </div>
                        <div className="footer-contact--item">
                            <h3 className="medium-bold-text">Контакты</h3>
                            <span className='normal-regular-text'>+7 727 377 34 11 (отдел продаж)<br/>
+7 727 377 33 99 (колл-центр).</span>
                        </div>
                    </div>
                   <div className="statistics-social">
                        <div className="social-media">
                            {socialMedia}
                        </div>
                        <div className="statistics">
                            <span className="normal-regular-text"><b>Онлайн</b>: {statistics?.user_count}</span>
    <span className="normal-regular-text"><b>Кол-во пользователей за месяц: </b>{statistics?.month_count}</span>
                       </div>
                   </div>
                 
                </div>
            </div>
        </footer>
    )
}

Footer.propTypes = {
    isLoading: PropTypes.bool,    
    statistics: PropTypes.object
  };
  const mapStateToProps = state => ({
    error: state.review.error,
    isLoading: state.review.isLoading,
    statistics: state.review.statistics,
  });
  const mapDispatchToProps = dispatch => ({
    reviewActions: bindActionCreators(reviewActions, dispatch)
  });
  export default connect(mapStateToProps, mapDispatchToProps) (withRouter(Footer));
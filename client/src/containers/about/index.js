import React, { useEffect, useState } from 'react';
import Header from "../../components/header";
import Footer from "../../components/footer";
import {Button} from 'antd';
import PropTypes from "prop-types";
import {bindActionCreators} from "redux";
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import * as reviewActions from "../../actions/reviewActions";
import './about.scss';
import Modal from '../../components/modal';
import Slider from 'react-slick';
function About(props) {
    const {reviews, reviewActions} = props;
    const [visible, setVisible] = useState(false);
    const [formData, setFormData] = useState({
        full_name: ``,
        phone_number: ``,
        email: ``,
        org_title: ``
    })
    useEffect(() => {
        reviewActions.getUniReviews();
    }, [])
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        autoPlay: true,
        centered: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        initialSlide: 0,
        mobileFirst:true,
        
        
    };
    const handleVisible = status => {
        setVisible(status);
    }
    
    const reviewItems = reviews.map((item, i) => (
        <div className="user-review-item" key={i}> 
            <div className="user-review--img">
                <img src={item.avatar} alt="user-review--img"/>
            </div>
            <h4>{item.full_name}</h4>
            <p>"{item.content}"</p>
        </div>
    ))
    const handleForm = () => {
        reviewActions.addRequest(formData);
    };
    const onChangeData = e => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    }
    return(
        <div className="about">
            <Header/>
                <div className="about-inner">
                <div className="container">
                    <div className="about-us">
                        <h2 className="large-bold-text">О нас</h2>
                        <div className="about-us--inner">
                            <div className="main-about-text medium-regular-text">
                            <b>Дорогой друг! </b>
                            
                            <p>Добро пожаловать в электронно-библиотечную систему KazNUread!
                            ЭБС KazNUread – это электронно-библиотечная система Издательского дома «Қазақ университеті» при КазНУ им. аль-Фараби.</p>
                            
                            <b>Хотите быстро обеспечить качественными учебниками ваш университет?</b>
                            
                            <p><strong>ЭБС KazNUread</strong> позволит библиотекам вузов и колледжей решить вопросы обеспечения студентов и преподавателей учебной литературой, изданной в Издательском доме «Қазақ университеті».</p>
                            </div>
                            <div className="about-img">
                                <img src="/assets/2.jpg" alt="about"/>
                            </div>
                        </div>
                    </div>
                </div>  
                <div className="count">
                    <div className="container">
                        <h2 className="large-bold-text">Электронно-библиотечная система KazNUread в цифрах:</h2>
                        <div className="count-inner">
                            <div className="count-item">
                                <h3 className="large-regular-text">+4500</h3>
                                <p className="small-regular-text">
                                наименования учебных, методических изданий и научных журналов с безлимитным доступом 
                                </p>
                            </div>
                            <div className="count-item">
                            <h3 className="large-regular-text">42</h3>
                                <p className="small-regular-text">
                                именно столько направлений мы охватываем 
                                </p>
                            </div>
                            <div className="count-item">
                                <h3 className="large-regular-text">50</h3>
                                <p className="small-regular-text">
                                 новых учебных и методических изданий добавляется ежемесячно
                                </p>
                            </div>
                        </div>
                    </div>
                </div> 
                <div className="join">
                    <h3 className="large-bold-text">Оцените и присоединяйтесь! </h3>
                    <p className="normal-regular-text">Обратитесь к нам и получите пробный период 2 недели бесплатно!</p>
                    <Button type="primary" onClick={() => handleVisible(true)}>Оставить заявку</Button>
                </div>
                <div className="review-users">
                    <h2 className="large-bold-text">Отзывы</h2>
                    <Slider  {...settings} className="user-reviews">
                        {reviewItems}
                    </Slider>                   
                </div>
                <div className="container">
                    <div className="about-library">
                        <div className="about-library--img">
                            <img src="/assets/5.jpg" alt="about-library"/>
                        </div>
                        <div className="about-library--text">
                            <h3 className="large-bold-text">Издательский дом «Қазақ университеті»</h3>
                            <p className="normal-regular-text">Издательский дом «Қазақ университеті» основан в 1934 году, является подразделением КазНУ им. аль-Фараби. Издательский дом специализируется на учебной и научной литературе по основным отраслям знания. Он является одним из самых крупных университетских издательств в Казахстане. 
                               <br/> В 2019 году Издательский дом «Қазақ университеті» в седьмой раз возглавил рейтинг издательств Казахстана по числу выпущенных наименований согласно Национальной книжной палаты РК. 
                            </p>
                            <a className="normal-regular-text more-btn" target={'_blank'} href="https://magkaznu.kz">Узнать больше</a>
                        </div>
                    </div>                   
                </div>
            </div>   
            <Modal onChange={onChangeData} formData={formData} handleForm={handleForm}  visible={visible} handleVisible={handleVisible}/>   
            <Footer/>
        </div>
    );
}

About.propTypes = {
    isLoading: PropTypes.bool,    
    reviews: PropTypes.array
};
const mapStateToProps = state => ({
    isLoading: state.review.isLoading,
    reviews: state.review.universityReviews
});
const mapDispatchToProps = dispatch => ({
    reviewActions: bindActionCreators(reviewActions, dispatch)
});
export default connect(mapStateToProps, mapDispatchToProps) (withRouter(About));
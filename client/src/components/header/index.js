import React, { useEffect, useState } from 'react';
import Avatar from 'react-avatar';
import {Dropdown, Menu, Button} from 'antd';
import {DownOutlined, MenuOutlined, UserOutlined, CloseCircleOutlined} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import PropTypes from "prop-types";
import {bindActionCreators} from "redux";
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import * as userActions from "../../actions/userActions";
import * as categoryActions from "../../actions/categoryActions";
import * as authActions from "../../actions/authActions";
import './header.scss';
import CategoryMenu from '../category-menu';

function Header(props) {
    const { user, isAuth, history, handleCategory } = props;
    const [mobileMenu, setMobileMenu] = useState(false);
    const [mobileLandingMenu, setMobileLandingMenu] = useState(false);
    const handleMenu = value => {
      setMobileMenu(value);
    }
    const handleLandingMenu = value => {
      setMobileLandingMenu(value);
    }  
    useEffect(() => {
      props.userActions.getUser();
      props.categoryActions.getCategories();
         // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    const menu = (
        <Menu>        
          <Menu.Item key="0">
            <Link to={`/profile`}>
              Личный кабинет
            </Link>
          </Menu.Item>
          <Menu.Item key="1">
            <Link to={`/favorite`}>
              Мои избранные
            </Link>
          </Menu.Item>
          <Menu.Item onClick={() => props.authActions.signOut(props.history)} key="2">
            <span >
              Выйти
            </span>
          </Menu.Item>
        </Menu>
      );
      
    const mobile = (
      <div className={mobileMenu ? "mobile-menu-active" : "mobile-menu"}>
        <CategoryMenu handleCategory={handleCategory} handleMenu={handleMenu} categories={props?.categories?.length ? props.categories : []} />
      </div>
    )

    const mobileLanding = (
      <div className={mobileLandingMenu ? "mobile-landing-active" : "mobile-landing"}>
        <CloseCircleOutlined onClick={() => handleLandingMenu(false)}/>
        <ul>
          <li>
            <Link className="normal-regular-text" to="/">Главная</Link>
          </li>
          <li>
            <Link className="normal-regular-text" to="/about">О нас</Link>
          </li>
          <li>
            <Link className="normal-regular-text" to="/recommend">Рекомендуемые книги</Link>
          </li>
          <li>
            <Link className="normal-regular-text" to="/instruction">Инструкция</Link>
          </li>
          <li>
            <Link className="normal-regular-text" to="/faq">FAQ</Link>
          </li>
          <li>
            <a className="shop-link-mobile normal-regular-text" target="_blank" href="https://magkaznu.com">Посетите наш магазин</a> 
          </li>
        </ul>       
      </div>
    )
    
    return(
        <header className="header">
          <div className="container">
            <div className="header-inner">
              <div onClick={() => handleMenu(true)} className="burger-menu">
                <MenuOutlined  />
              </div>       
              <div className="logo-header-items">
              <Link to={'/'} className="logo-header">
                  <img src="/assets/logoheader.png" alt="logo"/>
              </Link>
              <ul className="landing-header">
                <li>
                  <Link className="normal-regular-text" to="/">Главная</Link>
                </li>
                <li>
                  <Link className="normal-regular-text" to="/about">О нас</Link>
                </li>
                <li>
                  <Link className="normal-regular-text" to="/recommend">Рекомендуемые книги</Link>
                </li>
                <li>
                  <Link className="normal-regular-text" to="/instruction">Инструкция</Link>
                </li>
                <li>
                  <Link className="normal-regular-text" to="/faq">FAQ</Link>
                </li>
              </ul>
            </div>                           
            <div className="shop-avatar">
              <a className="shop-link-desktop normal-regular-text" target="_blank" href="https://magkaznu.com">Посетите наш магазин</a>
              {isAuth ? 
              <Dropdown trigger={['click']} overlay={menu}>
                  <div className="dropdown" onClick={e => e.preventDefault()}>
                      <Avatar round={true} size="50" name={`${user?.first_name} ${user?.last_name}`} color="#E7411B"/>
                      <span className="ant-dropdown-link username">
                      {`${user?.first_name} ${user?.last_name}`} <DownOutlined />
                      </span>
                      <span className="ant-dropdown-link username-icon">
                      <UserOutlined /> <DownOutlined />
                      </span>
                  </div>                   
              </Dropdown> : <Button type="primary" onClick={() => history.push('/signin')}>Войти</Button>}
            </div> 
            <div onClick={() => handleLandingMenu(true)} className="burger-menu-landing">
              <MenuOutlined  />
            </div>         
          </div>
        </div>
          {mobile}
          {mobileLanding}
        <div onClick={() => handleMenu(false)} className={mobileMenu ? "overlay-active" : "overlay"}/>
      </header>
    )
}

Header.propTypes = {
  isLoading: PropTypes.bool,    
  user: PropTypes.object
};
const mapStateToProps = state => ({
  error: state.user.error,
  isLoading: state.user.isLoading,
  user: state.user.user,
  categories: state.category.categories.categories,
  isAuth: state.auth.isAuthenticated
});
const mapDispatchToProps = dispatch => ({
  userActions: bindActionCreators(userActions, dispatch),
  authActions: bindActionCreators(authActions, dispatch),
  categoryActions: bindActionCreators(categoryActions, dispatch),
});
export default connect(mapStateToProps, mapDispatchToProps) (withRouter(Header));
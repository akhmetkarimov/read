import React, { useEffect, useState } from 'react';
import Category from "../../components/category";
import Showcase from "../../components/showcase";
import Header from "../../components/header";
import Footer from "../../components/footer";
import Search from "../../components/search";
import Banner from "../../components/banner";
import "./main.scss";
import PropTypes from "prop-types";
import {bindActionCreators} from "redux";
import {connect} from 'react-redux';
import {withRouter, Link} from 'react-router-dom';
import * as bookActions from "../../actions/bookActions";
import * as categoryActions from "../../actions/categoryActions";
import * as authorActions from "../../actions/authorActions";
import * as languageActions from "../../actions/languageActions";
import { Spin } from 'antd'; 

function Main(props) {
    const {book, isLoading, categories, authors, searchCategories, languages} = props;
    const [page, setPage] = useState(1);
    const [categoryMenu, setCategoryMenu] = useState(``);
    const [categoryMenuSlug, setCategoryMenuSlug] = useState(``);
    const [isResult, setIsResult] = useState(false);
    const [author, setAuthor] = useState(``);
    const [inputData, setInputData] = useState({
        isbn: ``,
        title: ``,
        language: ``,
        category: ``,
        author: ``
    });  
    const [language, setLanguage] = useState(``);
    const [category, setCategory] = useState(``);
    const [visible, setVisible] = useState(false);
    const onChange = e => {
        setPage(e)
        const filter = {
            search: inputData.title,
            title: inputData.title,
            isbn: inputData.isbn,
            authors: inputData.author,
            language: inputData.language,
            categories:  categoryMenuSlug ? categoryMenuSlug : inputData.category ? inputData.category : ``, 
            page: e
        }
        props.bookActions.getBooks(filter);
    }
    useEffect(() => {
        const filter = {
            categories: props.history.location?.query?.slug || ``,
            page: page
        }
         setCategoryMenuSlug(props.history.location?.query?.slug)
         setCategoryMenu(props.history.location?.query?.title)
         props.bookActions.getBooks(filter);
         props.categoryActions.getCategories();
         
         // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.history.location?.query?.slug]);
    
    const handleVisible = () => {
        const filter = {
            page: page
        }
        if(visible) {
          setLanguage(``);
          setCategory(``);
          setAuthor(``);
          setVisible(false);
          setCategoryMenu(`Новинки`);
          setInputData({
              language: ``,
              category: ``, 
              isbn: ``, 
              author: ``
            })
          if (language || category || author || inputData.isbn) {
            props.bookActions.getBooks(filter);
            setIsResult(false);
          }         
        } else {
            props.authorActions.getAuthors('');
            props.languageActions.getLanguages('');
            props.categoryActions.getSearchCategories('');
            setVisible(true);
        }
    }
    const pagination = {
        onChange: onChange,
        total: book?.page_count * 16 ? book?.page_count * 16 : 0,
        page: page
    }
    const handleFilter = () => {
        setCategoryMenu(`Результаты поиска`);
        const filter = {
            categories: inputData.category && category || ``,
            language: inputData.language && language || ``,
            authors: inputData.author && author || ``, 
            isbn: inputData.isbn, 
            page: page
        }
        if (category || language || author || inputData.length > 0) {
            setIsResult(true);
         } else {
            setIsResult(false);
         }
         props.bookActions.getBooks(filter);
    }
    const onChangeAuthor = (e, option) => {
        setInputData(prev => ({...prev, author: option.label}))
        props.authorActions.getAuthors(e);      
    }
    const onSelectLanguage = (e) => {
        setLanguage(e);
    }
    const onSelectCategory = (e) => {
        setCategory(e);
    }
    const onSelectAuthor = (e) => {
        setAuthor(e);
    }
    const onChangeLanguage = (e, option) => {
        setInputData(prev => ({...prev, language: option.label}));
        props.languageActions.getLanguages(e);
    }
    const onChangeCategory = (e, option) => {
        setInputData(prev => ({...prev, category: option.label}))
        props.categoryActions.getSearchCategories(e)
    }
    const onChangeData = e => {
        const { name, value } = e.target;
        setInputData(prev => ({
            ...prev,
            [name]: value
        }));
    }
    const handleCategory = e => {
        setInputData({
            isbn: ``,
            title: ``,
            language: ``,
            category: ``,
            author: ``
        })
        const filter = {
            categories: e.key,
            page: 1
        }
        setCategoryMenu(e.item?.props?.title ? e.item.props.title : ``);
        setCategoryMenuSlug(e.key);
        setPage(1);
        props.bookActions.getBooks(filter);
    }
    const onSearchEnter = e => {
        if (e.keyCode === 13) {
            const filter = {
                search: inputData.title,
                page: page
            }
             props.bookActions.getBooks(filter);
             if (inputData.title.length > 0) {
                setIsResult(true);
             } else {
                setIsResult(false);
             }
        }
    }
    const breadcrumb = <div className="breadcrumb-main">
        {/* <p className="medium-bold-text">Результаты поиска</p>       */}
        <span className="normal-regular-text">Всего найдено: {book?.Books?.length > 0  ? book?.page_count *  book?.Books?.length : 0}</span>
    </div>
    return(
        <Spin spinning={isLoading} className="main">
            <Header handleCategory={handleCategory}/>
            <div className="container"> 
            <Banner/>                  
                <div className="main-inner">
                    <div className="main-category">
                        <Category  
                        handleCategory={handleCategory} 
                        categories={categories?.length ? categories : []}
                        />
                    </div>
                    <div className="main-showcase"> 
                    <Search
                        options={{language: languages, author: authors, category: searchCategories}}
                        handleVisible={handleVisible}
                        onSelectAuthor={onSelectAuthor}
                        onSelectLanguage={onSelectLanguage}
                        onSelectCategory={onSelectCategory}
                        onSearchEnter={onSearchEnter}
                        inputData={inputData}
                        onChangeAuthor={onChangeAuthor} 
                        onChangeLanguage={onChangeLanguage}
                        handleFilter={handleFilter} 
                        visible={visible} 
                        onChangeData={onChangeData}
                        onChangeCategory={onChangeCategory}
                        language={language}
                    />
                    {isResult ? breadcrumb : ``} 
                        <Showcase title={categoryMenu ? categoryMenu : 'Новинки'} property={'main'} pagination={pagination} books={book?.Books}/>     
                    </div>
                </div>               
            </div>
            <Footer/>
        </Spin>
    );
}

Main.propTypes = {
    isLoading: PropTypes.bool,    
    bookActions: PropTypes.object,
    book: PropTypes.object,
    categories: PropTypes.array
};
const mapStateToProps = state => ({
    error: state.auth.error,
    isLoading: state.book.isLoading,
    book: state.book.book,
    categories: state.category.categories.categories,
    authors: state.author.authors,
    languages: state.language.languages,
    searchCategories: state.category.searchCategories.Filter_categories,
});
const mapDispatchToProps = dispatch => ({
    bookActions: bindActionCreators(bookActions, dispatch),
    categoryActions: bindActionCreators(categoryActions, dispatch),
    authorActions: bindActionCreators(authorActions, dispatch),
    languageActions: bindActionCreators(languageActions, dispatch)
});
export default connect(mapStateToProps, mapDispatchToProps) (withRouter(Main));

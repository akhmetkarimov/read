import React from 'react';
import { Input } from 'antd';
import {SearchOutlined} from '@ant-design/icons';
import Filter from "../filter";
import "./search.scss";
import PropTypes from "prop-types";

function Search(props) {
    const { handleFilter, onSelectAuthor, onSelectLanguage, onSelectCategory, visible, handleVisible, 
        onChangeLanguage,language,
         onChangeAuthor, onChangeCategory, onChangeData, inputData, options, onSearchEnter, } = props;
    const icons = !visible ? 
    <div className="search-img" >
    <img className="filter-icon" onClick={handleVisible} alt="search-filter" src={`/assets/filter.svg`}/>
    </div>
     :   <div className="search-img" ><img className="close-icon" onClick={handleVisible} alt="search-close" src={`/assets/close.svg`}/></div>
    return(
        <div className="search-filter">
            <div className="search">
                <Input name="title" onKeyDown={onSearchEnter} value={inputData.title} onChange={onChangeData}  
                    placeholder="Поиск" prefix={<SearchOutlined/>}/>
                {/* <div className="search-img" > */}
                    {icons}
{/*                     
                </div> */}
            </div>
            <Filter
                options={options}
                onChangeLanguage={onChangeLanguage}
                onChangeAuthor={onChangeAuthor} 
                language={language}
                onChangeCategory={onChangeCategory}
                onSelectAuthor={onSelectAuthor}
                onSelectLanguage={onSelectLanguage} 
                onSelectCategory={onSelectCategory}
                onChangeData={onChangeData}
                inputData={inputData} 
                handleFilter={handleFilter} visible={visible}/>
        </div>
    );
}

Search.propTypes = {   
    handleFilter: PropTypes.func,
    onChangeLanguage: PropTypes.func,
    onChangeAuthor: PropTypes.func,
    onChangeCategory: PropTypes.func,
    handleVisible: PropTypes.func,
    language: PropTypes.string,
    author: PropTypes.string,
    isbn: PropTypes.string,
    category: PropTypes.string,
    visible: PropTypes.bool,
    inputData: PropTypes.object
};

export default Search;
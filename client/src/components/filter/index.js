import React from 'react';
import "./filter.scss";
import { Form, AutoComplete, Input, Button } from 'antd';
import PropTypes from "prop-types";
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import classNames from "classnames";

function Filter(props) {
    const { onSelectLanguage, onSelectAuthor, onSelectCategory,
          inputData, visible, handleFilter,
         onChangeLanguage, onChangeAuthor, onChangeCategory, onChangeData, options } = props;
    return(
        <div className={classNames("filter", {"filter-active": visible})}>
            <Form>
                <Form.Item>
                    <AutoComplete
                        options={options?.author?.map((item) => {return {value: item.slug, label: item.full_name}})}                       
                        onSelect={onSelectAuthor}
                        style={{height: "40px"}}
                        onChange={onChangeAuthor}
                        value={inputData.author}
                        placeholder="Введите автора"/>
                </Form.Item>
                <Form.Item>
                    <AutoComplete
                        options={options?.category?.map((item) => {return {value: item.slug, label: item.category_direction}})}        
                        onSelect={onSelectCategory}
                        onChange={onChangeCategory}
                        value={inputData.category}
                        placeholder="Введите категорию"/>
                </Form.Item>
                <Form.Item>
                    <Input  placeholder="Введите ISBN" name="isbn" value={inputData.isbn} onChange={onChangeData}/>
                </Form.Item>
                <Form.Item>
                    <AutoComplete
                        options={options?.language?.map((item) => {return {value: item.slug, label: item.language}})}        
                        onSelect={onSelectLanguage}
                        onChange={onChangeLanguage}
                        value={inputData.language}
                        placeholder="Введите язык"/>
                </Form.Item>
            </Form>
            <div className="filter-button">
                <Button onClick={handleFilter}>Применить</Button>
            </div>          
        </div>
    );
}
Filter.propTypes = {
    language: PropTypes.string,
    author: PropTypes.string,
    isbn: PropTypes.string,
    category: PropTypes.string,
    visible: PropTypes.bool,
    setVisible: PropTypes.func,
    handleFilter: PropTypes.func,
    onChangeLanguage: PropTypes.func,
    onChangeAuthor: PropTypes.func,
    onChangeCategory: PropTypes.func,
    onSelectLanguage: PropTypes.func,
    onSelectAuthor: PropTypes.func,
    onSelectCategory: PropTypes.func,
};
const mapStateToProps = state => ({
    error: state.auth.error,
    isLoading: state.book.isLoading,
    book: state.book.book,
    categories: state.category.categories.categories
});
const mapDispatchToProps = dispatch => ({
    // bookActions: bindActionCreators(bookActions, dispatch),
    // categoryActions: bindActionCreators(categoryActions, dispatch)
});
export default connect(mapStateToProps, mapDispatchToProps) (withRouter(Filter));

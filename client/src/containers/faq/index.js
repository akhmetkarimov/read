import React, {useEffect, useState} from 'react';
import Header from '../../components/header';
import { Spin, Collapse } from 'antd';
import Footer from '../../components/footer';
import * as reviewActions from '../../actions/reviewActions';
import PropTypes from "prop-types";
import {bindActionCreators} from "redux";
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import { CaretRightOutlined } from '@ant-design/icons';
import './faq.scss';

const { Panel } = Collapse;
function Faq(props) {
    const { faq, isLoading } = props;
    console.log(faq)
   useEffect(() => {
    props.reviewActions.getFaq();
   }, [])
const panels = faq.map((item, i) => (
    <Panel header={item.question} key={i} className="site-collapse-custom-panel">
      <p>{item.answer}</p>
    </Panel>
))
    return(
        <Spin spinning={isLoading}>
            <Header/>
            <div className="container-favorite">
            <h2 className="medium-roboto-text">Часто задаваемые вопросы</h2>
                <Collapse
                    bordered={false}
                    defaultActiveKey={['0']}
                    expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                    className="site-collapse-custom-collapse"
                >
                    {panels}
                </Collapse>
            </div>           
            <Footer/>
        </Spin>
    );
}
Faq.propTypes = {
    isLoading: PropTypes.bool,
    faq: PropTypes.array    
};
const mapStateToProps = state => ({
    error: state.review.error,
    isLoading: state.review.isLoading,
    faq: state.review.faq
});
const mapDispatchToProps = dispatch => ({
    reviewActions: bindActionCreators(reviewActions, dispatch)
});
export default connect(mapStateToProps, mapDispatchToProps) (withRouter(Faq));
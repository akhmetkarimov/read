import React from 'react';
import {Button, Input, Rate, Pagination, Empty} from 'antd';
import './review.scss';
const {TextArea} = Input;

function Review(props) {
    const { onChangeRate, rate, content, onChangeContent, handleReview, pagination, reviews } = props;
    const reviewItems = reviews?.map((item, i) => (
            <div key={i} className="review-item">
                <p className="review-text small-regular-text">{item.review_content}</p>
                <p className="rate-text">
                    <span className="small-bold-text current-rate">{item.star}</span>
                    <span className="small-regular-text">/5</span>
                </p>
                <p className=" rate-text small-bold-text">{`${item.user?.first_name} ${item.user?.last_name}`}</p>
            </div>
    ))
    return(
        <div className="review">
            {reviewItems?.length ? <div>{reviewItems}  <div className="pagination">
                <Pagination current={pagination.page} pageSize={`16`} onChange={pagination.onChange} total={pagination.total} />
             </div>
             </div> : <Empty description="Будьте первым, кто оставит отзыв"/>
             }
                     
            <div className="review-write">
                <TextArea value={content} onChange={onChangeContent} rows={4} placeholder="Оставить комментарий"/>
                <Rate style={{ color: "#E7411B" }} onChange={onChangeRate} allowHalf defaultValue={rate} />
                <p className="rate-text">
                    <span className="small-bold-text changing-rate">{rate}</span>
                    <span className="small-regular-text">/5</span>
                </p> 
                <Button onClick={handleReview} className="small-regular-text" type="primary">Отправить</Button>
            </div>
           
        </div>
    );
}

export default Review;
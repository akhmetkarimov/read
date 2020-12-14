import React from 'react';
import { Menu } from 'antd';
import './category.scss';
import PropTypes from "prop-types";
const { SubMenu } = Menu;

function Category(props) {
    const { categories, handleCategory } = props;
    const categoriesGroup = categories.map((item, i) => {
        return (
            <SubMenu className="category-title medium-bold-text" key={i} title={item.category_direction}>
                {item.children.map((itemSub, j) => {
                    if (itemSub.children?.length) {
                        return( <SubMenu key={`${i}${j}`} title={itemSub.category_direction}>
                            {itemSub.children.map((itemSubSub) => {
                                return (
                                    <Menu.Item key={`${itemSubSub.slug}`} title={itemSubSub.category_direction}>{itemSubSub.category_direction}</Menu.Item>
                                );
                            })
                            }
                        </SubMenu>
                        );
                    } else {
                        return( <Menu.Item key={`${itemSub.slug}`} title={itemSub.category_direction}>
                            {itemSub.category_direction}
                        </Menu.Item>);
                    }
                })}
            </SubMenu>
        );
    });
    // const openKeys = categories.map((item, i) => `${i}`);
    
    const openKeys = [];
    for (let i = 0; i < 30; i++) {
        openKeys.push(String(i));
    }
    return(
        <div className="category">
            <div className="category-header">
                <h2 className="medium-roboto-text">Категории</h2>
                <span onClick={() => handleCategory(``)} className="small-regular-text">Все</span>
            </div>
            <Menu
                onClick={handleCategory}
                className="menu-category"
                style={{ width: 256 }}
                // selectedKeys={['1']}
                // defaultOpenKeys={['sub1']}
                defaultOpenKeys={openKeys}
                // defaultOpenKeys={[...openKeys]}
                mode="inline"
            >
                {categoriesGroup}
            </Menu>
        </div>
    );
}

Category.propTypes = {
    handleCategory: PropTypes.func,
  };

export default Category;
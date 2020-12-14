import React from 'react';
import { Menu } from 'antd';
import '../category/category.scss';
import {Link} from 'react-router-dom';
import PropTypes from "prop-types";
const { SubMenu } = Menu;

function CategoryMenu(props) {
    const { categories, handleMenu, handleCategory } = props;
    const categoriesGroup = categories.map((item, i) => {
        return (
            <SubMenu className="category-title medium-bold-text" key={i} title={item.category_direction}>
                {item.children.map((itemSub, j) => {
                    if (itemSub.children?.length) {
                        return( <SubMenu  key={`${i}${j}`} title={itemSub.category_direction}>
                            {itemSub.children.map((itemSubSub) => {
                                return (
                                    <Menu.Item onClick={() => handleMenu(false)} key={`${itemSubSub.slug}`} title={itemSubSub.category_direction}><Link to={{pathname: `/`, query: {category: itemSubSub.category_direction}}}>{itemSubSub.category_direction}</Link></Menu.Item>
                                );
                            })
                            }
                        </SubMenu>
                        );
                    } else {
                        return( <Menu.Item key={`${itemSub.slug}`} onClick={() => handleMenu(false)} title={itemSub.category_direction}>
                            <Link to={{pathname: `/`, query: {category: itemSub.category_direction}}}>{itemSub.category_direction}</Link>
                        </Menu.Item>);
                    }
                })}
            </SubMenu>
        );
    });
    const openKeys = [];
    for (let i = 0; i < 30; i++) {
        openKeys.push(String(i));
    }
    return(
        <div className="category">
            <div className="category-header">
                <h2 className="medium-roboto-text">Категории</h2>
                <Link onClick={() => handleMenu(false)} to={`main`} className="small-regular-text">Все</Link>
            </div>
            <Menu
                onClick={handleCategory}
                className="menu-category"
                style={{ width: 200 }}
                selectedKeys={['1']}
                // defaultOpenKeys={['sub1']}
                // openKeys={openKeys}
                defaultOpenKeys={openKeys}
                // defaultOpenKeys={[...openKeys]}
                mode="inline"
            >
                {categoriesGroup}
            </Menu>
        </div>
    );
}

CategoryMenu.propTypes = {
    handleCategory: PropTypes.func,
};

export default CategoryMenu;
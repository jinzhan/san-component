/**
 * @file 重新定义san.Component组件
 *       向san组件进行扩展组件，注入默认的组件(如：santd)
 * @author jinzhan
*/

import {Component} from 'san';

const globalComponents = {};

export class SanComponent extends Component {
    constructor(options) {
        super(options);
        this.defaultComponents = globalComponents;
    }

    get components() {
        const components = this.customComponents || {};
        return Object.assign(components, this.defaultComponents);
    }

    set components(comp) {
        this.customComponents = comp;
    }
};

export const mixin = (Component, mixins) => {
    const keys = Object.keys(mixins);
    for (const key of keys) {
        const original = Component.prototype[key];
        const mixin = mixins[key];
        switch (key) {
            // 处理initData数据
            case 'initData':
                Component.prototype[key] = function () {
                    const originalData = original ? original.call(this) : {};
                    // initData mixin可以是对象类型，也可以是函数
                    const mixinData = typeof mixin === 'function' ? mixin.call(this) : mixin;
                    return Object.assign(mixinData, originalData);
                };
                break;

            // 处理生命周期钩子
            // @see san生命周期: https://baidu.github.io/san/tutorial/component/#%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F
            case 'compiled':
            case 'inited':
            case 'created':
            case 'attached':
            case 'detached':
            case 'disposed':
            case 'updated':
                Component.prototype[key] = function () {
                    mixin.call(this);
                    original && original.call(this);
                };
                break;

            // 处理组件成员对象
            case 'components':
                // 忽略：static属性不能被mixin
                break;
            case 'filters':
            case 'computed':
            case 'messages':
                Component.prototype[key] = Object.assign(mixin, original);
                break;

            // 无法被继承的属性和自定义方法，和default走同样的逻辑
            // case 'template':
            // case 'trimWhitespace':
            // case 'delimiters':
            //    Component.prototype[key] = original || mixin;
            // break;

            // 自定义方法
            default:
                Component.prototype[key] = original || mixin;
        }
    }
    return Component;
};

/**
 * 注入全局组件的方面
 * 
 * @param {Object} 要注册的全局components的组件键值对
 * 
 * demo: {
 *  's-button': Button
 * }
*/
export const registerComponents = components => {
    Object.assign(globalComponents, components);
};

/**
 * 往组件中添加mixin方法
 * 
 * @param {Object} mixins 要添加的mixin对象
 * @param {Object} Component 要mixin的组件，默认对SanComponent进行全局添加
*/
export const registerMixins = (mixins, Component = SanComponent) => {
    mixin(Component, mixins);
};


/**
* 类似Vue的vm.$root
*
* @param {Object} comp 组件实例
* @return {Object} 当前组件树的根实例。如果当前实例没有父实例，此实例将会是其自己
*/
const getRoot = comp => {
    let root;
    while(comp) {
        root = comp;
        comp = comp.parent;
    }
    return root;
};

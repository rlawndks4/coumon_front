import { useEffect } from "react";
import { useSettingsContext } from "src/components/settings"
import { getProductsByUser } from "./api-shop";
import { toast } from "react-hot-toast";
import _ from "lodash";
import { axiosIns } from "./axios";
import { post } from "./api-manager";

export const calculatorPrice = (item) => {// 상품별로 가격
    if (!item) {
        return 0;
    }
    let { price, select_groups = [], count = 1, estimate } = item;
    let subtotal = price;
    let option_price = _.sum(select_groups.map(group => { return group?.option_price }));
    let install_price = (estimate?.install_price ?? 0) * (estimate?.install_count ?? 0)
    let total = subtotal + option_price;
    return {
        subtotal: subtotal * count,//원책정가
        option_price: option_price * count,//옵션가
        total: total * count + install_price,//옵션적용된 가격
        install_price: install_price//배송및 설치가
    }
}
export const makePayData = (products_, payData_) => {
    let products = [...products_];
    let total_amount = _.sum(_.map(products, (item) => { return calculatorPrice(item).subtotal }));
    let payData = { ...payData_ };

    for (var i = 0; i < products.length; i++) {
        let groups = [];
        let order_name = products[i]?.product_name;
        let select_option_obj = products[i]?.select_option_obj ?? {};
        let select_option_obj_keys = Object.keys(select_option_obj);
        for (var j = 0; j < select_option_obj_keys.length; j++) {
            let key = select_option_obj_keys[j];
            let options = [];
            let option = _.find(select_option_obj[key]?.options, { id: parseInt(select_option_obj[key]?.option_id) });
            options.push({
                id: option?.id,
                option_name: option?.option_name,
                option_price: option?.option_price,
            })
            groups.push({
                id: key,
                group_name: select_option_obj[key]?.group_name,
                options: options
            })
        }
        for (var j = 0; j < groups.length; j++) {
            order_name += ` ${groups[j]?.group_name}: ${groups[j].options.map(option => { return option?.option_name }).join()} ${j == groups.length - 1 ? '' : '/ '}`;
        }
        products[i] = {
            id: products[i]?.id,
            order_name: order_name,
            order_amount: calculatorPrice(products[i])?.total,
            groups: groups,
        }
    }
    payData = {
        ...payData,
        total_amount: total_amount,
        products: products,
    }
    return payData;
}
export const onPayProductsByHand = async (products_, payData_) => { // 수기결제
    let payData = makePayData(products_, payData_);
    let ord_num = `${payData?.user_id || payData?.password}${new Date().getTime().toString().substring(0, 11)}`
    payData = {
        ...payData,
        ord_num: ord_num,
    }
    try {
        let response = await axiosIns().post(`/api/v1/shop/pay/hand`, payData);
        return response;
    } catch (err) {
        console.log(err);
        return false;
    }
}

export const getCartDataUtil = async (themeCartData) => {//장바구니 페이지에서 상품 불러오기
    let data = themeCartData ?? [];
    if (data.length > 0) {
        let products = await getProductsByUser({
            page: 1,
            page_size: 100000,
        })
        products = products?.content ?? [];
        for (var i = 0; i < data.length; i++) {
            let find_item = _.find(products, { id: data[i]?.id })
            if (find_item) {
                data[i] = {
                    ...data[i],
                    ...find_item,
                }
            }
        }
    }
    return data;
}
export const insertCartDataUtil = (product, selectProduct, themeCartData, onChangeCartData) => { //장바구니 버튼 클릭해서 넣기

    try {
        let cart_data = [...themeCartData];
        let select_product = { ...selectProduct };
        for (var i = 0; i < product?.groups.length; i++) {
            let group = product?.groups[i];
            if (!select_product.select_option_obj[group?.id]) {
                toast.error(`${group?.group_name}을(를) 선택해 주세요.`);
                return false;
            }
        }
        let option_key_list = Object.keys(select_product.select_option_obj ?? {});
        let insert_item = true;
        let find_index = -1;
        for (var i = 0; i < cart_data.length; i++) {
            if (cart_data[i]?.id == select_product.id) {
                for (var j = 0; j < option_key_list.length; j++) {
                    if (select_product.select_option_obj[option_key_list[j]]?.option_id != cart_data[i].select_option_obj[option_key_list[j]]?.option_id) {
                        break;
                    }
                }
                if (j == option_key_list.length) {
                    insert_item = false;
                    find_index = i;
                    break;
                }
            }
        }
        if (insert_item) {
            cart_data.push(select_product);
        } else {
            cart_data[find_index].count = cart_data[find_index].count + select_product.count;
        }
        onChangeCartData(cart_data);
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
}
export const selectItemOptionUtil = (group, option, selectProduct) => {//아이템 옵션 선택하기
    let select_product = {
        ...selectProduct,
        select_option_obj: {
            ...selectProduct.select_option_obj,
            [`${group?.id}`]: {
                option_id: option?.id,
                ...group
            }
        }
    };
    return select_product;
}
export const getWishDataUtil = async (themeWishData) => {//아이템찜 불러오기
    let products = await getProductsByUser({
        page: 1,
        page_size: 100000,
    })
    products = products?.content ?? [];
    let wish_list = [];
    for (var i = 0; i < products.length; i++) {
        let find_index = _.indexOf(themeWishData, products[i]?.id);
        if (find_index >= 0) {
            wish_list.push(products[i]);
        }
    }
    return wish_list;
}
export const insertWishDataUtil = (item, themeWishData, onChangeWishData) => {//아이템 찜 클릭하기
    try {
        let wish_data = [...themeWishData];
        let find_index = _.indexOf(wish_data, item?.id);
        if (find_index >= 0) {
            wish_data.splice(find_index, 1);
        } else {
            wish_data.push(item?.id);
        }
        onChangeWishData(wish_data);
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
}
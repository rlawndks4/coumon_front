import { deleteItem, get, post, put, settingParams } from "./api-manager";
import { getLocalStorage } from "./local-storage";

export const apiShop = (table, type, params) => {
    let obj = settingParams(table, type, params);
    if (!(obj?.brand_id > 0)) {
        let dns_data = getLocalStorage('themeDnsData');
        dns_data = JSON.parse(dns_data);
        obj['brand_id'] = dns_data?.id;
    }

    let base_url = '/api/shop';
    if (type == 'get') {
        return get(`${base_url}/${table}`, obj);
    }

}
export const homeItemsSetting = (column_, products) => {
    let column = column_;

    let item_list = column?.list ?? [];
    item_list = item_list.map(item_id => {
        return { ...item_id, ..._.find(products, { id: parseInt(item_id) }) }
    })
    column.list = item_list;
    return column;
}
export const homeItemsWithCategoriesSetting = (column_, products) => {
    let column = column_;
    for (var i = 0; i < column?.list.length; i++) {
        let item_list = column?.list[i]?.list;
        item_list = item_list.map(item_id => {
            return { ...item_id, ..._.find(products, { id: parseInt(item_id) }) }
        })
        column.list[i].list = item_list;
    }
    return column;
}
const statusFormat = (title, chip_color) => {
    return {
        title,
        chip_color
    }
}
export const product_status_list = [
    statusFormat('판매중','primary'),
    statusFormat('품절','warning'),
    statusFormat('중단됨','error'),
];
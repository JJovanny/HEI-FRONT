
const isArrayAndNoEmpty = (array: any) => {
    return array && Array.isArray(array) && array.length !== 0
}  

export {
    isArrayAndNoEmpty,
}

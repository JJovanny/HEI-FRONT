
const validateStringTypeField = (string: any) => {
    return string && string !== undefined ? string : ''
}  

const includeLineBreak = (string: any) => {
    return string && string.includes('/n') ? (string.split('/n').map((line, index) => (<p key={index}>{line}</p>))) : (string)
}   

export {
    validateStringTypeField,
    includeLineBreak
}

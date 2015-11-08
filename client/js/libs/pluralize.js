export default (number, lang) => {
    let { 0: one, 1: few, 2: many, 3: other } = lang
    let _ref, _ref1, _ref2, _ref3

    if (other === null) {
        other = few
    }
    if ((number % 10) === 1 && number % 100 !== 11) {
        return one
    }
    if (((_ref = number % 10) === 2 || _ref === 3 || _ref === 4) && !((_ref1 = number % 100) === 12 || _ref1 === 13 || _ref1 === 14)) {
        return few
    }
    if ((number % 10) === 0 || ((_ref2 = number % 10) === 5 || _ref2 === 6 || _ref2 === 7 || _ref2 === 8 || _ref2 === 9) || ((_ref3 = number % 100) === 11 || _ref3 === 12 || _ref3 === 13 || _ref3 === 14)) {
        return many
    }
    return other
}

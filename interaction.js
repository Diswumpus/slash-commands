module.exports.get = async function get(c, i) {
    let res = i.options?.find(c => c?.name === c);
    return res
}
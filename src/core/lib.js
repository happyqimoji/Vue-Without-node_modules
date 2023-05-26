/**
 * 扁平化数组
 * @param {*} arr 
 * @param {*} childName 
 * @returns 
 */
export const flatArray = (arr, childName = 'children') => {
  return arr.reduce((all, cur) => {
    return all.concat(...[cur, ...(Array.isArray(cur[childName]) ? flatArray(cur[childName], childName) : [])])
  }, [])
}

/**
 * 
 * @returns 生成Guid
 */
export const NewGuid = () => {
  const S4 = () => {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
  }
  return S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4()
}
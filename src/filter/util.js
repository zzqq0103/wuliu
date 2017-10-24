// 采用indexOf的实现的模糊搜索，第一个参数是目标数组，第二个参数是目标字段，第三个参数是字段
function searchByIndexOf (arr, keyWord, statement) {
  if (!(arr instanceof Array)) {
    return
  }
  let tempArr = []
  arr.forEach((element, index, arr) => {
    if (element[statement].indexOf(keyWord) >= 0) {
      tempArr.push(element)
    }
  })
  return tempArr
}

// 采用正则表达式的模糊查询，第一个参数是目标数组，第二个参数是正则表达式，第三个参数是字段

function searchByRegExp (arr, keyWord, statement) {
  if (!(arr instanceof Array)) {
    return
  }
  let reg = new RegExp(keyWord)
  let tempArr = []
  arr.forEach((element, index, arr) => {
    if (element[statement].match(reg) >= 0) {
      tempArr.push(element)
    }
  })
  return tempArr
}

// 通过传入三个参数：第一个是数组，第二个是页数显示设置，第三个是页数， 得到符合的数组
function getListDataBySize (arr, pagesize, page) {
  if (!(arr instanceof Array)) {
    return
  }
  let tempArr = arr.filter(
    (u, index) => index < pagesize * page && index >= pagesize * (page - 1)
  )
  return tempArr
}

// 通过传入 “订单（等于1)、子件（等于2）、预约单（等于3）“ （短途调度中的 切换订单、子件、预约单的状态）
function switchDisplayFormColumn (newValue) {
  let tempGridColumns = this.gridOptions.columnDefs
  if (newValue === '1') { // 订单查询
    let that = this
    tempGridColumns.forEach(function (ele, index, arr) {
      if (ele.field === 'clieOrderNote') {
        that.gridOptions.columnDefs[index].visible = true
        that.gridOptions.columnApi.setColumnVisible(that.gridOptions.columnDefs[index].field, that.gridOptions.columnDefs[index].visible)
      } else if (ele.field === 'inteOrderNote') {
        that.gridOptions.columnDefs[index].visible = true
        that.gridOptions.columnApi.setColumnVisible(that.gridOptions.columnDefs[index].field, that.gridOptions.columnDefs[index].visible)
      } else if (ele.field === 'subId') {
        that.gridOptions.columnDefs[index].visible = false
        that.gridOptions.columnApi.setColumnVisible(that.gridOptions.columnDefs[index].field, that.gridOptions.columnDefs[index].visible)
      } else {
        that.gridOptions.columnApi.setColumnVisible(that.gridOptions.columnDefs[index].field, that.gridOptions.columnDefs[index].visible)
      }
    })
  } else {
    let that = this
    tempGridColumns.forEach(function (ele, index, arr) {
      if (ele.field === 'clieOrderNote') {
        that.gridOptions.columnDefs[index].visible = false
        that.gridOptions.columnApi.setColumnVisible(that.gridOptions.columnDefs[index].field, that.gridOptions.columnDefs[index].visible)
      } else if (ele.field === 'inteOrderNote') {
        that.gridOptions.columnDefs[index].visible = false
        that.gridOptions.columnApi.setColumnVisible(that.gridOptions.columnDefs[index].field, that.gridOptions.columnDefs[index].visible)
      } else if (ele.field === 'subId') {
        that.gridOptions.columnDefs[index].visible = true
        that.gridOptions.columnApi.setColumnVisible(that.gridOptions.columnDefs[index].field, that.gridOptions.columnDefs[index].visible)
      } else {
        that.gridOptions.columnApi.setColumnVisible(that.gridOptions.columnDefs[index].field, that.gridOptions.columnDefs[index].visible)
      }
    })
  }
}
export {searchByIndexOf, searchByRegExp, getListDataBySize, switchDisplayFormColumn}

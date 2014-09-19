import("aditoTreeTable");

/**
 * This is used to build a tree without implementing recursion.
 * 
 * @param {Object} pRoot the root node.
 * @param {Number} pColumnCount the number of columns to be used for the tree table.
 * @param {function} pFnGetCellAt function to resolve the cells. 
  * <ul>
 * <li>param {Object} the corresponding node for which cells shall be resolved.</li>
 * <li>param {Number} the cells column number starting with zero.</li> 
 * <li>return (ACell) the Cell.
 * </ul>
 * @param {function} pFnGetChild function to resolve child nodes.
 * <ul>
 * <li>param {Object} the current node for which a child shall be resolved.</li>
 * <li>param {Number} the child's index starting with zero.</li> 
 * <li>return (Object) the child node.
 * </ul>
 * @param {function} pFnGetChildCount function to resolve the child count of a node.
 * <ul>
 * <li>param {Object} the node for which the child count is needed.</li>
 * <li>return (Number) the child count.
 * </ul>
 * @param {function} pFnGetId a function delivering the row id for current node.
 * <ul>
 * <li>param {Object} the node for which the row id is to be resolved.</li>
 * <li>return (Object) the id for this node.
 * </ul>
 * @param {function} pFnGetIcon a function delivering the row id for current node.
 * <ul>
 * <li>param {Object} the node for which the row id is to be resolved.</li>
 * <li>return (Object) the id for this node.
 * </ul>
 * @param {function} pFnGetOpen a function delivering the row id for current node.
 * <ul>
 * <li>param {Object} the node for which the row id is to be resolved.</li>
 * <li>return (Object) the id for this node.
 * </ul>
 * @return {ATreeTable} a ready to use tree table. 
 */
function buildTreeTable(pRoot, pColumnCount, pFnGetCellAt, pFnGetChild, pFnGetChildCount, pFnGetId, pFnGetIcon, pFnGetOpen) { 
  var getContent = function(pNode) {
    var childCount = pFnGetChildCount(pNode);
    if (childCount == 0)
      return null;
    var rows = [];
    for (var i = 0; i < childCount; i++) {
      var childNode = pFnGetChild(pNode, i);
      if (childNode != undefined) {
        var cells = [];
        for (var j = 0; j < pColumnCount; j++)
          cells[j] = pFnGetCellAt(childNode, j);
        rows[rows.length] = new ARow(pFnGetId(childNode), getContent(childNode),
          cells, pFnGetIcon(childNode), pFnGetIcon(childNode), pFnGetOpen(childNode));
      }
    }
    return rows;
  }
  var treeTable = new ATreeTable();
  treeTable.content = getContent(pRoot);
  var headerCells = [];
  for (var i = 0; i < pColumnCount; i++)
    headerCells[i] = new ACell();
  treeTable.header = headerCells;
  return treeTable; 
}

/**
 * Settings for Data in the tree table.
 *
 * @param {Number} index
 * @param {Number} fgColor
 * @param {AFont} font
 * @param {Number} alignment
 * @param {ADataType} type
 * @param {String} format
 */
function ATreeTableColumnSetting(index, fgColor, font, alignment, type, format) {
  if (index != undefined)
    this.index = index;
  if (fgColor != undefined)
    this.fgColor = fgColor;
  if (font != undefined)
    this.font = font;
  if (alignment != undefined)
    this.alignment = alignment;
  if (type != undefined)
    this.type = type;
  if (format != undefined)
    this.format = format;
}

/**
 * Creates a flat tree table.
 *
 * @param {String} id the id for this tree table.
 * @param {String[]} headerData defines the number of columns and their names.
 * @param {String[][]} tableData the data as a two dimensional array. The first
 * array contains the rows. The first element in the second array is the id the
 * rest defines the cells content.
 * @param {ATreeTableColumnSetting[]} columnSettings an optional mapping for 
 * multi rowed cells. The index in this array is the index after the id column 
 * in the table data. The value is the column index where the data shall be 
 * shown at. So several array indexes can be mapped to one column resulting in 
 * multi row cells.
 * @return {ATreeTable} a ready to use tree table.
 */
function buildSimpleTable(id, headerData, tableData, columnSettings) {
  var header = [];
  for (var i = 0; i < headerData.length; i++) {
    header[i] = new ACell([new AData(headerData[i])]);
  }
  var content = [];
  for (i = 0; i < tableData.length; i++) {
    var row = tableData[i];
    var cells = [];
    for (var j = 1; j < row.length; j++) {
      var index;
      var fgColor;
      var font;
      var alignment;
      var type;
      var format;
      if (columnSettings != undefined && columnSettings[j-1] != undefined) {
        var cm = columnSettings[j-1];
        index = cm.index;
        fgColor = cm.fgColor;
        font = cm.font;
        alignment = cm.alignment;
        type = cm.type;
        format = cm.format;
      }
      else
        index = cells[cells.length];
      var cell = cells[index];
      if (cell == undefined) {
        cell = new ACell([]);
        cells[index] = cell;
      }
      cell.data[cell.data.length] = new AData(row[j], type, format, fgColor, font, alignment);
    }
    content[i] = new ARow(row[0], null, cells);
  }  
  return new ATreeTable(id, content, header);
}


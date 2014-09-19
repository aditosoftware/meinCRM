/**
 * DO NOT MODIFY. This library is used to deliver data for the tree table 
 * component is topic to be moved in ADITO core. Scripts using a modified 
 * version of this library might not work in future releases.
 */


/**
 * Defines all available font styles for 'AFont'
 */
AFontStyle = {
  /**
   * Plain style.
   */
  PLAIN: 0,
  /**
   * Bold style.
   */
  BOLD: 1,
  /**
   * Italic style.
   */
  ITALIC: 2,
  /**
   * Both bold and italic style.
   */
  BOLD_ITALIC: 3
};

/**
 * Describes a font.
 * @param {Number} [style] the style to be used for this font. Available 
 * styles are defined at 'AFontStyle'. If no style is provided the default font 
 * style will be used. 
 * @param {Number} [size] the size for this font. When this value is not 
 * provided the default size will be used.
 * @param {String} [type] the name of the font to be used. The available font 
 * types are system dependant. Examples are "Monospaced", "Dialog", 
 * "DialogInput", "SansSerif", "Serif". If no type is defined the default font 
 * type is used.
 */
function AFont(style, size, type) {
  if (style != undefined)
    /**
     * The style for this AFont.
     * @return {Number}
     */
    this.style = style;
  if (size != undefined)
    /**
     * The size for this font
     * @return {Number}
     */    
    this.size = size;
  if (type != undefined)
    /**
     * The name of the font to be used
     * @return {String}
     */
    this.type = type;  
}
/**
 * Type of data.
 */
ADataType = {
  /**
   * Plain text.
   */
  TEXT: "TEXT",
  /**
   * Text which is html formatted.
   */
  TEXT_HTML: "TEXT_HTML",
  /**
   * Text which is richtext formatted.
   */
  TEXT_RTF: "TEXT_RTF",
  /**
   * A number. 
   */
  NUMBER: "NUMBER",
  /**
   * A timestamp. A timestamp is the time in milliseconds starting from 
   * 1. january 1970. 
   */
  TIME: "TIME",
  /**
   * An image. An image is an Id from ASYS_BINARIES or a Base64 encoded string.
   */
  IMAGE: "IMAGE",
  /**
   * True or false.
   */
  BOOLEAN: "BOOLEAN",
  /**
   * A color. A color is best expressed by a hex number like '0xff0000' for red.
   */
  COLOR: "COLOR"
};

/**
 * Describes data for a cell.
 * @param {Object} value the value this data represents. Default kinds of values 
 * are: String, Number, Boolean. On other values '#toString()' is called to get 
 * the a string representation.
 * @param {ADataType} type the type with which this data is displayed. A BOOLEAN 
 * i.e. can be displayed as checkbox while as TEXT it prints 'true' or 'false'. 
 * If the type is not defined the default type is 'TEXT'.
 * @param {String} format an string describing how to format the data. Examples 
 * are 'dd.mm.yyyy' and 'hh.mm'.
 * @param {Number} fgColor a color like '0x0000ff' for blue.
 * @param {AFont} font the font for this data. If no value is defined the 
 * default font is used.
 * @param {Number} alignment the alignment for this data. An alignment is a 
 * value from 0.0 to 1.0 where 0.0 is left, 1.0 is right and 0.5 is centered.
 */
function AData(value, type, format, fgColor, font, alignment) {
  if (value != undefined)
    /**
     * The value for this data.
     * @return {Object}
     */
    this.value = value; 
  if (type != undefined)
    /**
     * The data's type.
     * @return {ADataType}
     */
    this.type = type;
  if (format != undefined)
    /**
     * The format this data is shown in.
     * @return {String}
     */
    this.format = format;
  if (fgColor != undefined)
    /**
     * The foreground color for this data's font.
     * @return {Number}
     */
    this.fgColor = fgColor;
  if (font != undefined)
    /**
     * The font for this data. 
     * @return {AFont}
     */
    this.font = font;
  if (alignment != undefined)
    /**
     * The alignment value.
     * @return {Number}
     */
    this.alignment = alignment;
}

/**
 * Creates a cell. A cell can have a number of data. Each data is shown in it's
 * own row in this cell. 
 * @param {AData[]} data an array with data elements.
 * @param {Number} fgColor a color like '0x0000ff' for blue.
 * @param {Number} bgColor a color like '0x00ff00' for green.
 * @param {AFont} font the font for this cell. If no value is defined the 
 * default font is used.
 * @param {Number} alignment the alignment for this cell. An alignment is a 
 * value from 0.0 to 1.0 where 0.0 is left, 1.0 is right and 0.5 is centered.
 */
function ACell(data, fgColor, bgColor, font, alignment) {
  if (data != undefined)
    /**
     * The data for this cell.
     * @return {AData[]}
     */
    this.data = data; 
  if (fgColor != undefined)
    /**
     * The foreground color for this cell's font.
     * @return {Number}
     */
    this.fgColor = fgColor;
  if (bgColor != undefined)
    /**
     * The background color for this cell's font.
     * @return {Number}
     */
    this.bgColor = bgColor;
  if (font != undefined)
    /**
     * The font for this cell. 
     * @return {AFont}
     */
    this.font = font;
  if (alignment != undefined)
    /**
     * The alignment value.
     * @return {Number}
     */
    this.alignment = alignment;
}

/**
 * Creates a row. A row consists of an array of cells, one cell for each column,
 * and optional sub rows called content. If no content is supplied the row is a
 * leaf which can't be expanded. If content is supplied the the row is a node 
 * and can be expanded. An empty array is a valid content.
 * @param {String} id an unique Id identifying the current row. This id is used
 * as the current value for the tree table when a row is selected.
 * @param {ARow[]} content the child rows of the current row.
 * @param {ACell[]} cells the cells of the current row.
 * @param {String} icon an id from 'ASYS_ICONS' or a Base64 encoded icon.
 * @param {String} iconExpanded the icon for this row when it's in its expanded 
 * state. If this icon is not supplied the default icon is used for expanded 
 * state. The value is an id from 'ASYS_ICONS' or a Base64 encoded icon.
 * @param {Boolean} expanded the expanded state of this row. By default a row is 
 * not expanded.
 * @param {Number} fgColor a color like '0x0000ff' for blue.
 * @param {Number} bgColor a color like '0x00ff00' for green.
 * @param {AFont} font the font for this row. If no value is defined the 
 * default font is used.
 * @param {Number} alignment the alignment for this row. An alignment is a 
 * value from 0.0 to 1.0 where 0.0 is left, 1.0 is right and 0.5 is centered.
 */
function ARow(id, content, cells, icon, iconExpanded, expanded, fgColor, 
  bgColor, font, alignment) {
  /**
   * The id for this row.
   * @return {Object}
   */
  this.id = id;  
  if (content != undefined)
    /**
     * The child rows of the current row.
     * @return {ARow[]}
     */
    this.content = content; 
  if (cells != undefined)
    /**
     * The cells of the current row.
     * @return {ACell[]}
     */
    this.cells = cells; 
  if (icon != undefined)
    /**
     * The default icon to be used for this row.
     * @return {String}
     */
    this.icon = icon; 
  if (iconExpanded != undefined)
    /**
     * The expanded icon to be used for this row.
     * @return {String}
     */
    this.iconExpanded = iconExpanded; 
  if (expanded != undefined)
    /**
     * Wether this row is initially expanded or not.
     * @return {Boolean}
     */
    this.expanded = expanded;   
  if (fgColor != undefined)
    /**
     * The foreground color for this row's font.
     * @return {Number}
     */
    this.fgColor = fgColor;
  if (bgColor != undefined)
    /**
     * The background color for this row's font.
     * @return {Number}
     */
    this.bgColor = bgColor;
  if (font != undefined)
    /**
     * The font for this row. 
     * @return {AFont}
     */
    this.font = font;
  if (alignment != undefined)
    /**
     * The alignment value.
     * @return {Number}
     */
    this.alignment = alignment;
}

/**
 * Creates a header cell. Header cells are shown at the top of the tree table.
 * With a header cell the width of the corresponding column can be defined.
 * @param {AData[]} data an array with data elements.
 * @param {Number} width defines the width for this header.
 * @param {Number} fgColor a color like '0x0000ff' for blue.
 * @param {Number} bgColor a color like '0x00ff00' for green.
 * @param {AFont} font the font for this cell. If no value is defined the 
 * default font is used.
 * @param {Number} alignment the alignment for this cell. An alignment is a 
 * value from 0.0 to 1.0 where 0.0 is left, 1.0 is right and 0.5 is centered.
 */
function AHeaderCell(data, width, fgColor, bgColor, font, alignment) {
  if (data != undefined)
    /**
     * The data for this header cell.
     * @return {AData[]}
     */
    this.data = data; 
  if (width != undefined)
    /**
     * The width for this header cell.
     * @return {AData[]}
     */
    this.width = width; 
  if (fgColor != undefined)
    /**
     * The foreground color for this header cell's font.
     * @return {Number}
     */
    this.fgColor = fgColor;
  if (bgColor != undefined)
    /**
     * The background color for this header cell's font.
     * @return {Number}
     */
    this.bgColor = bgColor;
  if (font != undefined)
    /**
     * The font for this header cell. 
     * @return {AFont}
     */
    this.font = font;
  if (alignment != undefined)
    /**
     * The alignment value.
     * @return {Number}
     */
    this.alignment = alignment;
}

/**
 * Here the base data for the tree table is defined.<br/>
 * A tree table consists of:
 * <ul>
 * <li>a header</li>
 * <li>default values for each column</li>
 * <li>the content</li>
 * </ul>
 * The tree table's content is an array of cells of which each one can have it's 
 * own content. That way the tree can described. Each row can have a number of 
 * cells. If each row has zero cells the tree table is a simple tree whilst
 * a flat tree table wihtout sub content is a simple table.<br/><br/>
 * The tree table can be configured graphically by adding columns to the tree
 * table and rows to the columns in the gui. The shown columns are a merge 
 * of the columns defined in the gui and the columns defined in the header and
 * the columnDefaults. The header is used to define the column count and the 
 * header to be shown whilst columnDefaults sets default values to be used for 
 * each column.<br/>
 * The value of a single property is determined in the following order:<br/>
 * gui, columnDefaults, row, cell, data.<br/>
 * So i.e. when a dataType for a single data is already defined in the gui there 
 * are four places to overwrite that type.
 * @param {String} id an identifier for the current tree table. With this id
 * the tree table can be identified on new data as being the same table.
 * @param {ARow[]} content the tree tables content. The content consists of an 
 * array of rows of which each can have it's own content. 
 * @param {AHeaderCell[]} header the header to use for the tree table.
 * @param {ACell[]} columnDefaults default values for undefined values in cells. 
 * Each property will be looked up here if it is not defined in the cell itself 
 * or in the containing row. 
 */
function ATreeTable(id, content, header, columnDefaults) {
  this.id = id;
  if (content != undefined)
    /**
     * The content.
     * @return {ARow[]}
     */
    this.content = content;
  if (header != undefined)
    /**
     * An array of cells describing the header.
     * @return {AHeaderCell[]}
     */
    this.header = header;
  if (columnDefaults != undefined)
    /**
     * An array of cells describing the default values 
     * @return {ACell[]}
     */
    this.columnDefaults = columnDefaults;
}

import("lib_user")

/*
* Ersetzt im inputString den fromString in toString.
*
* @param {String} inputString req der EingabeText
* @param {String} fromString req der zu ersetztende Text
* @param {String} toString req Text mit dem fromString ausgetauscht wird
*
* @return {String} der ersetzte Text
*/

function replaceSubstring(inputString, fromString, toString) 
{
    while(inputString.indexOf(fromString)  != -1 )
        inputString=inputString.replace( fromString,toString)
    return inputString
}

/*
* Trimt den übergebenen Text vorne und hinten.
*
* @param {String} txt req der zu trimmende Text
*
* @return {String} der getrimmte Text
*/
function trim(txt) 
{
    return txt.replace(/(^\s+)|(\s+$)/g,"");
}

/*
* Strasse  und Hausnummer trennen
* 
* @param {String} pAddress req Addresse
*
* @return {String []}  [ Streed, BildingNr ]
*/
function splitAddress(pAddress) 
{
    var ret = ["",""];
    if ( pAddress != "" )
    {
        var arr = pAddress.match( /^[^0-9]+|[0-9]+.*$/g);
        ret[0] = trim(arr[0]);
        if ( arr[1] ) ret[1] = trim(arr[1]);
    }
    return ret;
}

/*
* decodiert64Based String
* 
* @param {String} input req the string 
*
* @return {String} decoded String
*/

function decode64(input) 
{
    var charset = new Configuration().getOption("Base64Charset");

    if ( charset == "" ) 	charset = "ISO-8859-15";
    return a.decodeBase64String(input, charset);
}

/*
* Sortiert ein mehrdimensionales Array nach einem bestimmten Index.
*
* @param {[]} pArray req das zu sortierende Array
* @param {String} pIndex req der Index, nach dem sortiert werden soll
* @param {Boolean} pUp req TRUE sortiert aufsteigend, FALSE sortiert absteigend
* @param {Boolean} isNumber TRUE sortiert numerisch, FALSE oder undefined sortiert alpha
* 
* @return void
*
* @throws {Error} wenn der Index ausserhalb des Arrays liegt
*/
function array_mDimSort(pArray, pIndex, pUp, isNumber)
{
    if (pArray.length == 0)
        return;

    if (pArray[0].length == 0)
        return;

    if (pIndex >= pArray[0].length)
        throw new Error("Index Out Of Bounds: " + pIndex + " >= " + pArray[0].length);
		
    /*
  * Die eigentliche Sortierfunktion
  *
  * @param {String} x req Wert 1
  * @param {String} y req Wert 2
  *
  * @return {Integer}
  */
    function array_mDimSorter(x, y) 
    {
        if ( isNumber )
        {
            xx = Number(x[pIndex]);
            yy = Number(y[pIndex]);
        }
        else
        {
            xx = x[pIndex];
            yy = y[pIndex];
        }
        if (xx == yy) 
            return 0;

        if (xx < yy) 
            return (pUp ? -1 : 1);

        return (pUp ? 1 : -1);
    }

    pArray.sort(array_mDimSorter);
}

/*

* sorts an array up to 6 columns with sortorder 
*
* @param {[]} pArray req the array with data
* @param {Integer} us req  the Sortorder for Column 1 = Param u (1=asc, -1=desc)
* @param {Integer} u req the 1 Column
* @param {Integer} vs opt  the Sortorder for Column 2 = Param v (1=asc, -1=desc)
* @param {Integer} v opt the 2 Column
* @param {Integer} ws opt  the Sortorder for Column 3 = Param w (1=asc, -1=desc)
* @param {Integer} w opt the 3 Column
* @param {Integer} xs opt  the Sortorder for Column 4 = Param x (1=asc, -1=desc)
* @param {Integer} x opt the 4 Column
* @param {Integer} ys opt  the Sortorder for Column 5 = Param y (1=asc, -1=desc)
* @param {Integer} y opt the 5 Column
* @param {Integer} zs opt  the Sortorder for Column 6 = Param z (1=asc, -1=desc)
* @param {Integer} z opt the 6 Column
*
* @example [
      sortArray(myArray, -1, 0, 1, 1, -1, 2);
			kein Rückgabewert !
]
*
* @return {void}
*/

function sortArray(pArray, us, u, vs, v, ws, w, xs, x, ys, y, zs, z)
{
    pArray.sort(Sortmulti);
    /*
	* Sortieren eines mehrdimensionalen Arrays (bis zu 6 Spalten)
	*
	* @param {String} a req Wert 1
	* @param {String} b req Wert 2
        *
	* @return {Integer}
	*/
    function Sortmulti(a, b)
    {
        var swap=0;
        if (isNaN(a[u] - b[u]))
            if((isNaN(a[u])) && (isNaN(b[u])))
                swap = (b[u] < a[u]) - (a[u] < b[u]);
            else
                swap = (isNaN(a[u]) ? 1 : -1);
        else
            swap = (a[u] - b[u]);
        if ((v == undefined) || (swap != 0))
            return swap * us;
        else
        if (isNaN(a[v] - b[v]))
            if ((isNaN(a[v])) && (isNaN(b[v])))
                swap = (b[v] < a[v]) - (a[v] < b[v]);
            else 
                swap = (isNaN(a[v]) ? 1 : -1);
        else
            swap = (a[v] - b[v]);
        if ((w == undefined) || (swap != 0))
            return swap * vs;
        else
        if (isNaN(a[w] - b[w]))
            if ((isNaN(a[w])) && (isNaN(b[w]))) 
                swap = (b[w] < a[w]) - (a[w] < b[w]);
            else
                swap = (isNaN(a[w]) ? 1 : -1);
        else
            swap = (a[w] - b[w]);
        if ((x == undefined) || (swap != 0))
            return swap * ws;
        else
        if (isNaN(a[x] - b[x]))
            if ((isNaN(a[x])) && (isNaN(b[x])))
                swap = (b[x] < a[x]) - (a[x] < b[x]);
            else
                swap = (isNaN(a[x]) ? 1 : -1);
        else
            swap = (a[x] - b[x]);
        if ((y == undefined) || (swap != 0))
            return swap * xs;
        else
        if (isNaN(a[y] - b[y]))
            if ((isNaN(a[y])) && (isNaN(b[y])))
                swap = (b[y] < a[y]) - (a[y] < b[y]);
            else 
                swap = (isNaN(a[y]) ? 1 : -1);
        else
            swap = (a[y] - b[y]);
        if ((z == undefined) || (swap != 0))
            return swap * ys;
        else
        if(isNaN(a[z] - b[z]))
            if((isNaN(a[z])) && (isNaN(b[z])))
                swap = (b[z] < a[z]) - (a[z] < b[z]);
            else
                swap = (isNaN(a[z]) ? 1 : -1);
        else
            swap = (a[z] - b[z]);
        return swap * zs;
    }
}

/*
* Entfernt aus einem Array ein Element.
*
* @param {[]} pArray req Array aus dem das Elemte entfernt werden soll
* @param {String} pElement req Element das entfernt werden soll
*
* @return {[]} ohne das entfernte Element
*/
function removeElement(pArray, pElement)
{
    var result = new Array();
    for (var i = 0; i < pArray.length; i++)
    {
        if (!pElement.equals(pArray[i]))
            result.push(pArray[i]);
    }
	
    return result;
}

/*
* Liefert alle aus pSource, die nicht in pReference sind.
*
* @param {[]} pSource req diese Elemente werden gesucht
* @param {[]} pReference req in diesem Array wird gesucht
* @param {Boolean} pIgnoreCase opt
* 
* @return {[]} result
*/
function notIn(pSource, pReference, pIgnoreCase)
{
    var result = new Array();
    for (var i = 0; i < pSource.length; i++)
    {
        if (!hasElement(pReference, pSource[i], pIgnoreCase))
            result.push(pSource[i]);
    }
	
    return result;
}

/*
* Liefert zurück, ob ein Element in einem Array enthalten ist.
* 
* @param {[]} pArray req Array in dem nach dem Element gesucht werden soll
* @param {String} pElement req Elemant nach dem gesucht werden soll
* @param {Boolean} pIgnoreCase opt
*
* @return {Boolean} TRUE wenn dies der Fall ist
*/
function hasElement(pArray, pElement, pIgnoreCase)
{
    for (var i = 0; i < pArray.length; i++)
    {
        if ( pIgnoreCase != undefined && pIgnoreCase )
        {
            if (pArray[i].toLowerCase() == pElement.toLowerCase())	return true;
        }
        else	if (pArray[i] == pElement)	return true;
    }
	
    return false;
}

/*
* format a string containing place holders for data
*
* @param {String} pString req the string containing place holders
* @param {[]} pArray req the array with data to be inserted
*
* @example [
	strFormat("Das Format ist {0:15.11}!", (42))
	strFormat("Das Format ist {0:-15.11}!", (42))
	strFormat("Das Format ist {0}!", (42))
	strFormat("Das Format ist {0:10}!", (42))
	strFormat("Das Format ist {0:-10}!", (42))
]
*
* @return {String} formatted string
*/
function strFormat(pString, pArray)
{
    var res = pString;
    try
    {
        res = pString.replace(/\{([0-9]+)(\:\-?\d+(\.\d\d?)?)?\}/ig, matchFunc );
    }
    catch (ex)
    { 
        log.log(ex); 
    }
    return res;

    /*
	* the match and parse function
	*
	* @param {String} pMatch opt
	* @param {Integer} pNumber req number of value in the array
	* @param {String} pModifier opt the modifier (e.g. modifier is ":10.4")
	*
	* @return {String} formatted string
	*/
    function matchFunc(pMatch, pNumber, pModifier)  
    { 
        // default is to replace place holder with value
        var s = pArray[pNumber].toString();

        // if we have a modifier after the place holder (e.g. {2:10.4} )
        // where 2 ist the place holder index, the modifier is ":10.4"
        if(pModifier != null)
        {
            // parse total length and number of digits
            // total length may be negative for left padding (number-style)
            pModifier = pModifier.substr(1,pModifier.length);
            var leninfo = pModifier.split(".");
            var total = leninfo[0];
            var digits = leninfo[1];

            // if we do have a number value, follow directions for number of digits
            // ignore this for anything non-numeric
            if(typeof(pArray[pNumber]) == "number")
            {
                if(digits != undefined) s = eMath.roundDec(pArray[pNumber], digits, eMath.ROUND_HALF_UP);
                s = s.toString();
                // calculate existing digits, if necessary add a decimal point for ints
                var d = s.split(".")[1];
                if(d == undefined) d = ""; 
                if(d == "" && digits != undefined) s += ".";
                d = d.length;
                // if we need more digits, add them according to digit specifier
                if(d < digits) s += "000000000000000000000000000000000000".substr(0, digits - d);
            }
			
            // check for left or right padding, then convert total length to abs value
            var padleft = (total < 0);
            total = Number(eMath.absInt(total));

            // do we need padding or do we have to cut the data?
            if(total > s.length)   // padding
            {
                // 80 spaces, any better ideas to write this?
                var pad = "                                                                                ";
                if(padleft == true) s = pad.substr(0, total - s.length) + s; else s = s + pad.substr(0, total-s.length);
            }
            else   // cutting
            {
                s = s.substr(0,total);
            }
        }
        else
        {
            s = pArray[pNumber];
        }

        return s;
    }
}

/*
* Erzeugt einen String, der angibt wann das Element von wem erstellt und wann 
* sowie wann und von wem es zuletzt editiert wurde. 
*
* @param {String} pDateNew req Datum der Neuerstellung
* @param {String} pUserNew req Name des Erstellers
* @param {String} pDateEdit req Datum der letzten Änderung
* @param {String} pUserEdit req Name des letzten Editierers
*
* @return {String} erzeugte String
*/
function label_new_edit(pDateNew, pUserNew, pDateEdit, pUserEdit)
{
    var retst = a.translate("erstellt %0 von %1", [ date.longToDate(pDateNew, "dd.MM.yyyy"), pUserNew]);
    if (pDateEdit != undefined && pDateEdit != "")  retst += " | " + a.translate("geändert %0 von %1", [ date.longToDate(pDateEdit, "dd.MM.yyyy"), pUserEdit]);
    return(retst)
}

/*
* Sortiert Tabelle
*
* @param {String} pTable req Table
* @param {String} pTableComp req Name der TabellenComponente
* @param {String} pCountField req Feldname z.B. 'SORT'
* @param {String} pDirection req 'up' oder 'down'
* @param {String} pCondition opt
* 
* @return {void}
*/
function moveRow(pTable, pTableComp, pCountField, pDirection, pCondition)
{
    sortRow(pTable, pCountField, pCondition);
    if (pCondition == undefined || pCondition == "") pCondition = "";
    else pCondition = " and " + pCondition;
    var id = a.decodeFirst(a.valueof(pTableComp));
    var col = [pCountField];
    var nextval;
    var typ = a.getColumnTypes( pTable, col);
    var oldval = a.sql("select " + pCountField + " from " + pTable + " where " + pTable + "ID = '" + id + "'");
    if (pDirection == "up")
    {
        nextval = a.sql("select max(" + pCountField + ") from " + pTable 
            + " where " + pCountField + " < " + oldval + pCondition);
    }
    else
    {
        nextval = a.sql("select min(" + pCountField + ") from " + pTable 
            + " where " + pCountField + " > " + oldval + pCondition);
    }
    if ( nextval == "" )  nextval = 0;
    var nextID = a.sql("select " + pTable + "ID from " + pTable + " where " + pCountField + " = " + nextval + pCondition); 
    a.sqlUpdate(pTable, col, typ, [oldval], pTable + "ID = '" + nextID + "'")
    a.sqlUpdate(pTable, col, typ, [nextval], pTable + "ID = '" + id + "'")
    a.refresh(pTableComp);
}

/*
* aktiviert up/Down-Buttons
*
* @param {String} pTable req Table
* @param {String} pTableComp req Name der TabellenComponente
* @param {String} pSortfield req Feldname z.B. 'SORT'
* @param {String} pDirection req 'up' oder 'down'
* @param {String} pCondition opt
* 
* @return {Boolean} true wenn aktiv
*/
function moveActive(pTable, pTableComp, pSortfield, pDirection, pCondition)
{
    var oldval = "min";
    var	minmax = "min";
    var id = a.decodeFirst(a.valueof(pTableComp));
	
    if (pCondition == undefined || pCondition == "") pCondition = "";
    else pCondition = " where " + pCondition;
    if (id != "" && a.getTableData(pTableComp, a.INSERTED ).length == 0 && a.valueof("$sys.workingmode") == a.FRAMEMODE_EDIT )
    {
        oldval = a.sql("select " + pSortfield + " from " + pTable + " where " + pTable + "ID = '" + id + "'"); 
        if (pDirection == "down")	minmax = "max";
        minmax = a.sql("select " + minmax + "(" + pSortfield + ") from " + pTable + pCondition);
    }
    return(oldval != minmax || oldval == "" || minmax == "" )
}

/*
* Sortiert Tabelle neu
* 
* @param {String} pTable req Table
* @param {String} pCountField req Feldname z.B. 'SORT'
* @param {String} pCondition opt
* @param {Boolean} pSort opt auf alle Fälle
*
* @return {void}
*/
function sortRow(pTable, pCountField, pCondition, pSort)
{
    if (pCondition == undefined || pCondition == "") pCondition = "";
    else pCondition = " where " + pCondition;
    if ( pSort == undefined ) 	pSort = false;

    if ( a.sql("select count(*) from " + pTable + pCondition + " group by " + pCountField + " having count(*) > 1 ") > 0 || pSort )
    {
        var col = [pCountField];
        var typ = a.getColumnTypes( pTable, col);
        var ids = a.sql("select " + pTable + "ID from " + pTable + pCondition + " order by " + pCountField, a.SQL_COLUMN);
        for ( var i = 0; i < ids.length; i++ )	a.sqlUpdate(pTable, col, typ, [i+1], pTable + "ID = '" + ids[i] + "'")
    }
}

/*
* liefert eine liste der laender, DE, AT und CH sind an den Anfang sortiert
* 
* @return {[]} aud ISO2 und Name
*  
*/
function getCountries()
{
    var res = [ ["DE", "Deutschland"], ["AT", "Österreich"], ["CH", "Schweiz"] ];
    var laender = a.sql("select ISO2, NAME_DE from COUNTRYINFO where iso2 not in ('DE', 'AT', 'CH')", a.SQL_COMPLETE);

    for(var i = 0; i < laender.length; i++)
    {
        laender[i][1] = a.translate(laender[i][1]);
    }

    //Sortierung nach der Übersetzung
    array_mDimSort(laender, 1, true, false);

    res = res.concat(laender);

    return res;
}

/*
* öffnet den Internetbrowser
*
* @param {String} pUrl req 
*
* @return {void}
*/
function openUrl( pUrl )
{
    if ( pUrl != "" )
    {
        var prompt = new Array();
        prompt["content"] = pUrl;
        a.openFrame("InternetFrame", pUrl, false, a.FRAMEMODE_EDIT, null, false, prompt);
    }
}
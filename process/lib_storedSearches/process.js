import("lib_frame");

/*
* uebertraegt eine gespeicherte suche von einem benutzerlogin zu einem anderen,
* angegeben werden der frame fuer die suche und der name der suche
* 
* @param {String} fromUser req -- der Login mit der gespeicherten suche
* @param {String} toUser req -- der Login, der die Suche bekommen soll
* @param {String} pFrameName req -- der Name des Frames, zu dem die Suche gehoert
* @param {String} pSearchName req -- der Name der gespeicherten Suche (als normaler String!)
* 
* @return {BOOLEAN}
*/
function transferSearch(fromUser, toUser, pFrameName, pSearchName)
{
    var searchElement;
    var newElement;
	
    // die suche pSearchName fuer den frame pFrameName von fromUser laden
    fromUser = tools.getUser(fromUser);
    var fromStores = getstores(fromUser);
    fromStores = a.decodeBase64String(fromStores);
    fromStores = new XML(fromStores);	

    // falls der name der suche nicht angegeben wurde, dann werden 
    // alle gespeicherten suchen uebertragen
    if(pSearchName == undefined)
    {
        searchElement = fromStores
        .FRAME
        .(NAME == a.encodeBase64String(pFrameName))
    .STORE.(ID == a.encodeBase64String("#STORE_SAVED")).ELEMENT;
}
else
{
    searchElement = fromStores
    .FRAME
    .(NAME == a.encodeBase64String(pFrameName))
.STORE.(ID == a.encodeBase64String("#STORE_SAVED"))
.ELEMENT.(TITLE == a.encodeBase64String(pSearchName));
}

if(searchElement == null || searchElement == "")
{
    return false;
}
else
{
    // searchElement kopieren um es spaeter in das zieluser-xml einzufuegen
    var newSearch = new XML(searchElement.toString());

    // jetzt zieluser und seine gespeicherten Suchen laden
    toUser = tools.getUser(toUser);
    var toStores = getstores(toUser);

    // falls noch gar keine einstellungen da sind, diese erzeugen
    if(toStores == undefined || toStores == "" || toStores == "undefined")
    {
        toStores = new XML("<STORES></STORES>");
    }
    else
    {
        toStores = new XML(a.decodeBase64String(toStores));
    }

    // jetzt pruefen, ob es den knoten fuer den frame gibt
    if(toStores.FRAME.(NAME == a.encodeBase64String(pFrameName)).length() == 0)
{
    newElement = new XML('<FRAME><NAME n0="">' + a.encodeBase64String(pFrameName) + '</NAME></FRAME>');

    // falls noch gar kein Frame gespeichert, dann als erstes element erzeugen,
    // sonst einfach an die collection der FRAME-Elements anhaengen
    if(toStores.FRAME.length() == 0)
    {
        toStores.FRAME[0] = newElement;
    }
    else
    {
        toStores.FRAME += newElement;
    }
}

// falls noch kein STORE-Element existiert, dieses anlegen	
if(toStores.FRAME.(NAME == a.encodeBase64String(pFrameName)).STORE.length() == 0)
{
    newElement = new XML('<STORE>' +
        '<ID n0="">' + a.encodeBase64String("#STORE_SAVED") + '</ID>' +
        '<TITLE n0="">' + a.encodeBase64String("Gespeicherte Suchen") + '</TITLE>' +
        '</STORE>');
    toStores.FRAME.(NAME == a.encodeBase64String(pFrameName)).appendChild(newElement);
}

// hier haben wir in der struktur der gespeicherten suchen auf jeden fall einen 
// brauchbaren zustand, egal ob geladen oder neu erzeugt.
// jetzt den knoten mit der zu transferierenden suche einhaengen.
toStores.FRAME.(NAME == a.encodeBase64String(pFrameName)).STORE.(ID == a.encodeBase64String("#STORE_SAVED")).appendChild(newSearch);

// speichern
toUser[tools.PARAMS]["framestoredsearches"] = a.gzip(a.encodeBase64String(toStores.toString()));
tools.updateUser(toUser);
}
return false;
}


/*
* loescht die gespeicherten suchen fuer den angegebenen benutzer. wird der name des frames mit
* angegeben, werden nur die gespeicherten suchen fuer diesen frame geloescht. wird der frame-name
* nicht angegeben oder ist undefined, werden alle gespeicherten suchen des benutzers geloescht.
* 
* @param {String} pUser req -- der Login, dessen gespeicherte Suchen geloescht werden sollen
* @param {String} pFrameName req -- der Frame, fuer den die gespeicherten suchen geloescht werden sollen
* @param {String} pSearchName req -- der Name der gespeicherten Suche (als normaler String!)
*
* @return {BOOLEAN} true = succes, false = error
*/
function clearStoredSearches(pUser, pFrameName, pSearchName)
{
    var res = true;
    try
    {		
        var fromUser = tools.getUser(pUser);
		
        if(pSearchName == undefined)
        {
            var einstellung = new XML("<STORES></STORES>");
            fromUser[tools.PARAMS]["framestoredsearches"] = a.gzip(a.encodeBase64String(einstellung.toString()));
            tools.updateUser(fromUser);	
        }
        else
        {
            var fromStores = getstores(fromUser);
            fromStores = a.decodeBase64String(fromStores);
            fromStores = new XML(fromStores);	
            if(pFrameName == undefined)
            {
                delete fromStores
                .FRAME.(NAME == a.encodeBase64String(pFrameName))
            .STORE.(ID == a.encodeBase64String("#STORE_SAVED"))[0];
    } 
    else
    {
        delete fromStores
        .FRAME.(NAME == a.encodeBase64String(pFrameName))
    .STORE.(ID == a.encodeBase64String("#STORE_SAVED"))
.ELEMENT.(TITLE == a.encodeBase64String(pSearchName))[0];
} 
			         
fromUser[tools.PARAMS]["framestoredsearches"] = a.gzip(a.encodeBase64String(fromStores.toString()));
tools.updateUser(fromUser);	
}
}
catch(ex)
{
    log.log("Exception in clearStoredSearches(), details below");
    log.log(ex);
    res = false;
}
	
return res;
}


/*
* liefert die namen der frames mit suchen als string-array
* 
* @param {String} pUser req -- der login, dessen suchen durchsucht werden sollen
* 
* @return {String()} mit den Namen der Frames
*/
function getFramesWithSearches(pUser)
{
    var fromUser = tools.getUser(pUser);
    var k;
    var fromStores = getstores(fromUser);
    fromStores = a.decodeBase64String(fromStores);
    fromStores = new XML(fromStores);	
	
    if(fromStores == undefined || fromStores == "" || fromStores == "undefined")
    {
        log.log("No stored searches");
        return [];
    }
    else
    {
        var liste = fromStores.FRAME.(STORE.ID == a.encodeBase64String("#STORE_SAVED")).NAME;
    for each(k in liste) log.log("==> " + k.text() + "  " + a.decodeBase64String(k.text()));
		
    var searchElement = fromStores
    .FRAME
    .NAME;
			         
    var res = [];
    for each(k in searchElement) 
    {
        res.push( a.decodeBase64String(k.text()) );
    }
    return res;
}
	
}

/*
* Gibt die Liste der gespeicherten Suchen zurück.
*
* @param {String} pUser req -- der login, dessen suchen durchsucht werden sollen
* @param {String} pFrameName opt -- Name des Frames
*
* @return {String []}
*/
function getStoredSelections(pUser, pFrameName)
{
    var list = [];
    var framedata = new FrameData();
    var user = tools.getUser( pUser );

    var stores = getstores( user );
    if ( stores != undefined )
    {
        stores = new XML(a.decodeBase64String(stores));
        if ( pFrameName != undefined )	stores = stores.FRAME.(NAME == a.encodeBase64String( pFrameName ));
    stores = stores.FRAME;
    for each(var frame in stores)
    {		
        var framename = a.decodeBase64String(frame.NAME);
        var frametitle = framedata.getData("name", framename, ["title"]);
        if (frametitle != "")
        {
            var title = frame.STORE.(ID == a.encodeBase64String("#STORE_SAVED")).ELEMENT.TITLE;
        for each(var value in title)
        {
            var name = a.decodeBase64String( value );
            list.push([ a.encodeMS([framename, name]), frametitle[0][0], name ]);
        }
    }
    }
}
return list;
}

/*
* Gibt die Codition einer gespeicherten Suchen zurück.
*
* @param {String} pUser req -- der Login mit der gespeicherten suche
* @param {String} pFrameName req -- der Name des Frames, zu dem die Suche gehoert
* @param {String} pSearchName req -- der Name der gespeicherten Suche (als normaler String!)
*
* @return {String} Condition  
*/
function getStoredSelectionConditon(pUser, pFrameName, pSearchName)
{
    var user = tools.getUser( pUser );
    var stores = getstores(user);

    var store =  new XML(a.decodeBase64String(stores))
    .FRAME
    .(NAME == a.encodeBase64String(pFrameName))
.STORE.(ID == a.encodeBase64String("#STORE_SAVED"))
.ELEMENT
.(TITLE == a.encodeBase64String(pSearchName));
					         
log.log("CONDITION.DBTYPE)" + store.CONDITION.DBTYPE);

return a.decodeBase64String(store.CONDITION);
}

/*

* Gibt einen XML-String der gespeicherten Suchen zurück.
*
* @param {String} pUser req -- das UserObject
*
* @return {xml-String} framestoredsearches; 
*/
function getstores(pUser)
{       
    var stores;
    try
    {
        stores = a.gunzip(pUser[tools.PARAMS]["framestoredsearches"]);
    }
    catch(ex)
    {
        var newstores = new XML("<STORES></STORES>");
        stores = a.encodeBase64String(newstores.toString());
        log.log("Exception in clearStoredSearches(), details below");
        log.log(ex);
    }	
    return stores;
}
/*
* klasse fuer distanzsuche und zum arbeiten mit orten
*
* @method getLocationsByCity
* @methoddesc sucht nach orten anhand des ortsnamens, untersützt wildcards
* 
* @methodparam {String} pCity req : der Ortsname, bei Bedarf mit "%" als Wildcard
* @methodparam {String} pCountry opt : der Landescode, wird dieser parameter weggelassen, wird "DE" angenommen
* @methodparam {Boolean} pInteractive opt : falls true, wird bei mehr als einem treffer ein dialog gezeigt, bei false wird das komplettergebnis geliefert.
* 
* @methodreturn Array : array aus arrays aus (	locationid, zip, city, district, state )

* @method getLocationsByZip
* @methoddesc sucht nach orten anhand der postleitzahl, untersützt wildcards
* 
* @methodparam String pZip req : die postleitzahl, bei Bedarf mit "%" als Wildcard
* @methodparam String pCountry opt : der Landescode, wird dieser parameter weggelassen, wird "DE" angenommen
* @methodparam Boolean pInteractive opt : falls true, wird bei mehr als einem treffer ein dialog gezeigt, bei false wird das komplettergebnis geliefert.
* 
* @methodreturn Array : array aus arrays aus (	locationid, zip, city, district, state  )

* @method getLocations  
* @methoddesc sicht nach Orten über eine Kombination aus Landeskenner, Postleitzahl, Ort
* 
* @methodparam String pZip req : die postleitzahl, bei Bedarf mit "%" als Wildcard
* @methodparam String pCity req : die postleitzahl, bei Bedarf mit "%" als Wildcard
* @methodparam String pCountry opt : der Landescode, wird dieser parameter weggelassen, wird "DE" angenommen
* @methodparam Boolean pInteractive opt : falls true, wird bei mehr als einem treffer ein dialog gezeigt, bei false wird das komplettergebnis geliefert.


* @method searchLocationDistance 
* @methoddesc sucht ausgehend von einer locationid nach orten in einer angegebenen entfernung
* 
* @methodparam String pLocationID req : eine AOSYS_LOCATION.LOCATIONID für einen Ort
* @methodparam Number pMaxDistance req : eine numerische Angabe der maximalen Entfernung
* @methodreturn Array : bestehend aus nach entfernung sortiertes array aus (plz, cc, dist )

* @method getLocationID 
* @methoddesc sucht eine locationid über PLZ und Landeskürzel (ISO2)
* 
* @methodparam String pZip req : PLZ fuer einen Ort
* @methodparam String pCountry req : ISO2 fuer ein Land
* @methodreturn String : eine AOSYS_LOCATION.LOCATIONID

* @method distHaversine 
* @methoddesc führt eine entfernungssuche über geokoordinaten nach der haversine-methode durch
* 
* @methodparam String pLocationID req : eine AOSYS_LOCATION.LOCATIONID für einen Ort
* @methodparam Number pMaxDistance req : eine numerische Angabe der maximalen Entfernung
* 
* @methodreturn Array : bestehend aus nach entfernung sortiertes array aus (plz, cc, dist)
]

@return {Object}
*/

function GeoPackage()
{
    // suche nach orten anhand des namens 
    this.getLocationsByCity = function(pCity, pCountry, pInteractive)
    {
        return this.getLocations(undefined, pCity, pCountry, pInteractive);
    }
	
    // suche nach orten anhand der postleitzahl
    this.getLocationsByZip = function(pZip, pCountry, pInteractive)
    {
        return this.getLocations(pZip, undefined, pCountry, pInteractive);
    }
	
    // allgemeine suchfunktion, wird nur intern verwendet
    this.getLocations = function(pZip, pCity, pCountry, pInteractive)
    {
        // default ist deutschland
        if(pCountry == undefined || pCountry == "") pCountry = "DE"; 
		
        // bei bedarf in echten boolean konvertieren
        // falls nicht angegeben, dann false annehmen
        if(pInteractive == undefined) pInteractive = false; 
        else
        if(pInteractive == "true") pInteractive = true;
		
        // anhand der übergebenen daten die query zusammenstellen
        var sqlbase = "select LOCATIONID, ZIP, CITY, DISTRICT, REGION, STATE from AOSYS_LOCATION";
        var sqlstr = "";
        if(pZip != undefined) sqlstr += " zip like '" + pZip + "' ";
        if(pCity != undefined) 
        {
            // bei City auch ' möglich
            pCity = pCity.replace( new RegExp("'","g"), "''");
            if(sqlstr != "") sqlstr += " AND "; 
            sqlstr += " city like '" + pCity + "' "; 
        }
		             
        if(sqlstr != "") sqlstr += " AND "; 
        sqlstr += " country = '" + pCountry + "' ";
		
        sqlstr = sqlbase + " where " + sqlstr;
		
        var data = a.sql(sqlstr, a.SQL_COMPLETE);

        // haben wir mehr als einen treffer, kommt es darauf an, ob der parameter "pInteractive"
        // auf true gesetzt wurde. falls ja, wird in einem dialog nachgefragt. falls nein, wird
        // das komplette ergebnisarray zurückgeliefert!
        if((data.length > 1) && (pInteractive == true))
        {
            a.imagevar("$image.locationsql", sqlstr);
            var dlg = a.askUserQuestion(a.translate("Bitte wählen Sie einen Ort:"), "DLG_CHOOSE_CITY");
            if(dlg != null )
            {
                // query qiederholen, da ohne zusatzbedingungen wesentlich performanter (single key seek)
                data = a.sql(sqlbase + " where locationid = '" + a.decodeFirst(dlg["DLG_CHOOSE_CITY.plzid"]) + "'", a.SQL_COMPLETE);
            }
            else
            {
                data = "";  // keine auswahl, da "abbrechen"
            }
        }
		
        // das ergebnisarray zurückliefern
        return data;
    }


    // einen ort zur ortstabelle hinzufügen
    this.addLocation = function(pCountry, pZip, pCity, pDistrict, pRegion, pState, pLatitude, pLongitude)
    {
        var spalten = ["LOCATIONID", "COUNTRY", "ZIP", "CITY", "DISTRICT", "REGION", "STATE", "LAT", "LON", "USER_NEW", "DATE_NEW"];
        var typen = a.getColumnTypes(a.getCurrentAlias(), "AOSYS_LOCATION", spalten);
        var werte = [ a.getNewUUID(), pCountry, pZip, pCity
        , pDistrict,pRegion,  pState, pLatitude, pLongitude, a.valueof("$sys.user"), date.date() ];
        a.sqlInsert("AOSYS_LOCATION", spalten, typen, werte);
    }
	

    // distanzberechnung nach haversine zwischen zwei geo-koordinaten
    this.distHaversine = function(lat1, lon1, lat2, lon2) 
    {
        var R = 6371; // earth's mean radius in km
        var dLat = (lat2-lat1) * (Math.PI / 180);
        var dLon = (lon2-lon1) * (Math.PI / 180);
        lat1 = lat1 * (Math.PI / 180), lat2 = lat2 * (Math.PI / 180);

        var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1) * Math.cos(lat2) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        var d = R * c;
        return d;
    }
	
	
    // suche nach allen orten in einer maximalen entfernung zu einer locationID
    this.searchLocationDistance = function(pLocationID, pMaxDistance)
    {
        var result = [];
        var data = a.sql("select LAT, LON from aosys_location where LOCATIONID = '" + pLocationID + "'", a.SQL_ROW);
        if(data != "")
        {
            // der max Abstand zwischen 2 Breitengraden und zwischen 2 Längengraden ist 111km. Damit kann die Suche 
            // auf ein Rechteck mit der doppelten Kantenlänge des Suchradius und dem Quellort in der Mitte eingegrenzt werden
            var diff = pMaxDistance / 111;
            var latmax = eMath.addDec(data[0], diff);
            var latmin = eMath.addDec(data[0], -diff);
            var lonmax = eMath.addDec(data[1], diff);
            var lonmin = eMath.addDec(data[1], -diff);
            var complist = a.sql("select ZIP, LAT, LON, COUNTRY, CITY from aosys_location "
                + " where LAT < " + latmax + " and LAT > " + latmin 
                + " and LON < " + lonmax + " and LON > " + lonmin, a.SQL_COMPLETE);
			
            for(var i=0; i < complist.length; i++)
            {
                var d = this.distHaversine(data[0], data[1], complist[i][1], complist[i][2]);
                if(d <= pMaxDistance)
                {
                    result.push( [ complist[i][0], complist[i][4], complist[i][3], d] );
                }
            }			
					
            result.sort( mysort );

            // hier enthält "result" ein nach entfernung sortiertes array aus [	plz, city ,cc, dist ]
            return result;			
        }
        else
        {
            return null;
        }
    }
	
    /*
    * Sortieren zweier Werte.
    *
    * @param {Integer[]} x req erster Wert
    * @param {Integer[]} y req zweiter Wert
    *
    * @return {Integer} Ergebnis; -1 wenn Wert1 < Wert2
    *				0  wenn Wert1 == Wert2 
    *				1  wenn Wert1 > Wert2
    */
    function mysort(x, y) { 
        return x[3] - y[3]; 
    }

    // liefert zu einem Ort mit Postleitzahl und Land die locationID aus AOSYS_LOCATION	
    this.getLocationID = function(pZip, pCountry)
    {
        return a.sql("select locationid from aosys_location where zip = '" + pZip + "' and country = '" + pCountry + "' ");
    }
}

/*
* Setzt die Vertriebsgebiete
* 
* @return {void}
*/
function setSalesArea()
{
    var salesarea = a.sql("select LOCATIONID, COUNTRY, ZIP, SALESAREA from AOSYS_LOCATION", a.SQL_COMPLETE)
    var col = ["SALESAREA"];
    var typ = a.getColumnTypes("AOSYS_LOCATION", col);
    var companies = a.sql("select ORGID, COUNTRY, ZIP from ORG join RELATION on ORGID = ORG_ID "
        + " join ADDRESS on RELATIONID = ADDRESS.RELATION_ID where SALESAREA is null", a.SQL_COMPLETE);

    for (i=0; i<companies.length; i++)
    {
        salesarea = a.sql("select SALESAREA from AOSYS_LOCATION where COUNTRY = '" + companies[i][1] + "' and ZIP = '" + companies[i][2] + "'");
        a.sqlUpdate("ORG", col, typ, [salesarea], "ORGID = '" + companies[i][0] + "'")
    }
    return;
}
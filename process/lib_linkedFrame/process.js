/*
* aktualisiert den superframe und schließt den linked Frame
*
* @return void
*/

function swreturn()
{
    var swid = a.valueof("$sys.superwindowid")
    if (swid != "")
    {
        var rowcount = a.valueof("$sys.datarowcount");
        // refresh von Componenten des aufrufenden Frame 
        if ( a.hasvar("$image.comp4refresh") )
        {
            var comp4refresh = a.valueofObj("$image.comp4refresh");
            if ( typeof(comp4refresh) != "object" )	comp4refresh = [ comp4refresh ];	
            for ( i = 0; i < comp4refresh.length; i++)
                try
                {
                    a.refresh( comp4refresh[i], swid, a.valueof("$sys.superimageid"));				
                } catch(err){}
        }
		
        // Werte in Componenten des aufrufenden Frames setzen
        if ( a.hasvar("$image.setValues") )
        {
            var setValues = a.valueofObj("$image.setValues");
            if ( typeof(setValues) != "object" )	setValues = [ setValues ];
            for ( i = 0; i < setValues.length; i++)	
                a.setValue( swid, a.valueof("$sys.superimageid"), setValues[i][0], a.valueof(setValues[i][1]) );
        }
        if ( a.valueof("$sys.workingmode") == a.FRAMEMODE_SEARCH && ( rowcount == 0 || rowcount == undefined ) )     a.closeCurrentTopImage();
    }
    if ( a.hasvar("$image.autoclose") && a.valueof("$image.autoclose") == "true" && ( rowcount < 2 || rowcount == undefined ))  a.closeCurrentTopImage();
}
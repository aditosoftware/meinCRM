import("lib_lead");
var duptype = a.valueof("$comp.cbx_Duplicat");
var tab = new Array()
if (duptype != "")
{
    var farbe = "-1";
    for (var i = 0; i < 6; i++)
    {
        switch(i)
        {
            case 0:
                farbe = "-10066330";
                break;
            case 1:
                farbe = "-16777216";
                break;
            case 2:
                farbe = "-16738048";
                break;
            case 3:
                farbe = "-26368"; // orange vorher gelb "-256";
                break;
            case 4:
                farbe = "-16776961";
                break;
            case 5:
                farbe = "-65536";
                break;
        }
        var str = GetLeadStatusText( i, duptype )
        tab.push(new Array( i.toString(), farbe, str ));
    }
}
a.returnobject(tab);
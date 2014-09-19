var ids =  a.decodeMS(a.valueof("$comp.tbl_Aufgabe"));

var Entry = "";
for (i=0; i<ids.length; i++)
{
    Entry = calendar.getEntry(ids[i])[0];
    Entry[calendar.STATUS] = calendar.STATUS_COMPLETED;
    calendar.update(new Array(Entry));
}
a.refresh("$comp.tbl_Aufgabe");
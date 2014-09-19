var modus = a.valueof("$sys.workingmode")
var id = a.decodeMS(a.valueof("$comp.relTree"))
a.rs( modus == a.FRAMEMODE_EDIT && id[1] != "")
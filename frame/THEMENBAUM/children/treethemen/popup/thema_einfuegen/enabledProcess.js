import("lib_themetree");

//Nur aktiv, wenn a: die Variable existiert und b: etwas im Image ist
if (a.hasvar("$image.tmpTreeNodeID"))
{
	a.rs (a.valueof("$image.tmpTreeNodeID") != "" )
}
else
	a.rs(false);
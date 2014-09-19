import("lib_selection");
if (a.valueof("$sys.workingmode") == a.FRAMEMODE_SHOW)
{
	choose("OPPORTUNITY");
}
else
{
	loadSelection("OPPORTUNITY");
}
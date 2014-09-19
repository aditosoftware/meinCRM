switch (a.valueof("$sys.superframe"))
    {
    case "ORG":
        a.refresh("$comp.Table_history", a.valueof("$sys.superwindowid"), a.valueof("$sys.superimageid"));
        break;
    case "PERS":
        a.refresh("$comp.Table_history", a.valueof("$sys.superwindowid"), a.valueof("$sys.superimageid"));
        break;
}
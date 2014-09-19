import("lib_calendar");

newEvent("Reservierung", undefined, undefined, undefined, tools.getUsersWithRole("PROJECT_Ressource"), 
         a.valueof("$comp.EVENTSTART"), eMath.subInt(a.valueof("$comp.EVENTEND"), a.valueof("$comp.EVENTSTART")));
import("lib_calendaruser");
import("lib_calendar")

var ids =  a.decodeMS(a.valueof("$comp.tbl_Aufgabe"));

var users = getUserNameList(a.valueof("$sys.user"), "write" );

var calendar_user = ""
for ( i = 0; i < users.length; i++)
{
 calendar_user += ";" + users[i][1]; 
}

var auswahl = a.askQuestion("Benutzer auswählen", a.QUESTION_COMBOBOX, calendar_user);
if (auswahl != null)
{
 for ( i = 0; i < users.length; i++)
 {
  if ( auswahl ==  users[i][1] )  break; 
 }
 var user_new = calendar.getCalendarUser(users[i][0]);

 for(i=0; i<ids.length; i++)
 {
  var entry = calendar.getEntry(ids[i]);

  var element = entry[0];

  element[calendar.USER] = user_new;
  element[calendar.AFFECTEDUSERS] = "";

  var id = element[calendar.ID];
  element[calendar.ID] = "";
  calendar.insert(new Array(element));

  calendar.remove(ids[i]);
 }

 a.showMessage(a.translate("Aufgabe(n) erfolgreich weitergegeben an: %0",[auswahl]));
// resetfilterLinkedToDo_Event();
}
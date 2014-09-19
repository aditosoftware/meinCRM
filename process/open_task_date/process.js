import("lib_user");

var cfg = new Configuration();
var fname = cfg.getOption("app.myADITO");
if(fname == "")  fname = "TASK_DATE"; 
a.openFrame(fname, null, false, a.FRAMEMODE_EDIT);
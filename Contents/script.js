//===========================================================================
// Steampunk Weathered clock widget
// Originally written and Steampunked by: Harry Whitfield & Dean Beedell
// Dean.beedell@lightquick.co.uk
// Vitality code, advice and patience from Harry Whitfield
//
//===========================================================================
/*global mainWindow, SPclock */

/*properties
    displayTime, height, interval, onPreferencesChanged, onTimerFired, reScale,
    scalePref, ticking, value, width
*/
//resizing variables
 var mainWindowheightDefault = 182;
 var mainWindowwidthDefault  = 182;
 var tingingSound = "Resources/ting.mp3";

 var scale = Number(preferences.scalePref.value) / 100;
 var theClock = new SPclock(mainWindow, 0, 0, 1, scale);
 var theClockTimer = new Timer();
 var time = new Date();
 var     hr = time.getHours(),
    mn = time.getMinutes(),
    se = time.getSeconds();
 var vitalitycnt = 0;  
  var widgetName = "steampunk weathered clock.widget";

 widget.onPreferencesChanged = function () {
  resize();
 };

 theClock.clock.onMultiClick = function () {
        log("performCommand: " + preferences.imageCmdPref.value);
        taskcommand = preferences.imageCmdPref.value;
        performCommand("click");
 };

var debugFlg = "";
//===========================================
// this function runs on startup
//===========================================
function startup() {
    debugFlg = preferences.debugflgPref.value;
    if (debugFlg === "1") {
        preferences.imageEditPref.hidden=false;
        preferences.imageCmdPref.hidden=false;
    } else {
        preferences.imageEditPref.hidden=true;		
        preferences.imageCmdPref.hidden=true;
    }		

    mainScreen();
    resize();

    // create the licence window
    createLicence(mainWindow);

    setmenu();
    settooltip();
    theClock.displayTime(new Date());
    theClockTimer.ticking = false;
    theClockTimer.interval = 1;
    theClockTimer.ticking = true;
    
    // set the widget lock status if pinned

    if (preferences.widgetLockPref.value === "1") {
                log ( "Setting the locking pin ",theClock.pin.hOffset);
                mainWindow.locked = true;
		theClock.pin.opacity = 255;
		theClock.pin.hoffset = preferences.pinhOffsetPref.value * scale;
		theClock.pin.voffset = preferences.pinvOffsetPref.value * scale;
    }

    buildVitality("Resources/dock.png",theClock.dayOfWeek.src,hr,mn);

}
//=====================
//End function
//=====================

//===========================================
// this is the main function that really does all the work
//===========================================
function updateTime() {

    //initialise the time function
    theClock.displayTime(new Date());
    var time = new Date();


    vitalitycnt = vitalitycnt + 1 ; // update the dock vitality once a minute.
    if (vitalitycnt !== 60) {
        return;
    }
        //returns the date/time in a string format
    hr = time.getHours();
    mn = time.getMinutes();
    if (hr <10) {hr="0" +hr;}
    if (mn <10) {mn="0" +mn;}
    log("building Vitality");
    buildVitality("Resources/dock.png",theClock.dayOfWeek.src,hr,mn);
    vitalitycnt = 0 ; // update the drives once a minute.

}
//=====================
//End function
//=====================



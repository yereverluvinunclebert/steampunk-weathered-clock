/*
	Steampunk Clock Object - version 1.2
	6 September, 2012
	Copyright 2012 Dean Beedell and Harry Whitfield
	mailto:g6auc@arrl.net
*/

/*properties
    appendChild, base, centreBoss, clock, clockReflection, dayOfWeek,
    displayTime, floor, frame, getDay, getHours, getMinutes, getSeconds, hOffset,
    hRegistrationPoint, height, hourHand, minuteHand, opacity, prototype, 
    reScale, rotation, round, secondHand, src, toLowerCase, vOffset, 
    vRegistrationPoint, width, zOrder
*/

var lock = "Resources/lock.mp3";

function SPclock(parent, hOffset, vOffset, zOrder, scale) {
	var  newImage = function (parent, hOffset, vOffset, width, height, src, zOrder, opacity, hRegP, vRegP) {
		var o = new Image();
		
	o.src = src;
    	o.width  = Math.round(scale * width);
    	o.height = Math.round(scale * height);
	o.zOrder = zOrder;
    	o.opacity = opacity || 0;             // opacity is an optional parameter
		
    	hRegP = hRegP || 0;                     // hRegP and vRegP are optional parameters
    	vRegP = vRegP || 0;

    	hOffset += hRegP;
    	vOffset += vRegP;

    	o.hOffset = Math.round(scale * hOffset);
    	o.vOffset = Math.round(scale * vOffset);

    	o.hRegistrationPoint =  Math.round(scale * hRegP);
    	o.vRegistrationPoint =  Math.round(scale * vRegP);

		parent.appendChild(o);
		return o;
	},
		frame = new Frame(),
		base = "Resources/SPclock/",

    	rim = newImage(frame, 0, 0, 182, 182, base + "rim.png", zOrder  ,255),
    	dayOfWeek = newImage(frame, 55, 80, 64, 37, base + "sunday.png", zOrder,255),
    	clock = newImage(frame, 0, 0, 184, 185, base + "clock.png", zOrder + 2,255),
    	hourHand = newImage(frame, 74, 29, 27, 55, base + "hourHand.png", zOrder + 2, 255, 12, 54),
    	minuteHand = newImage(frame, 78, 13, 20, 71, base + "minuteHand.png", zOrder + 3, 255, 8, 70),
    	secondHand = newImage(frame, 86, 31, 4, 21, base + "secondHand.png", zOrder + 4, 255, 2, 21),
    	centreBoss = newImage(frame, 77, 74, 25, 26, base + "centreBoss.png", zOrder,255 ),
    	clockReflection = newImage(frame, 27, 21, 122, 74, base + "clockReflection.png", zOrder + 6, 89),
    	pin = newImage(frame, 27, 21, 20, 20, base + "pin.png", zOrder + 7,0);
        rim.tooltip = "Click here to lock the widget in place";

	this.base = base;
	this.dayOfWeek = dayOfWeek;
	this.rim = rim;
	this.clock = clock;
	this.hourHand = hourHand;
	this.minuteHand = minuteHand;
	this.secondHand = secondHand;
	this.centreBoss = centreBoss;
	this.clockReflection = clockReflection;
	this.pin = pin;

	frame.hOffset = hOffset;
	frame.vOffset = vOffset;
	frame.width   = 182 * scale;
	frame.height  = 182 * scale;
	frame.zOrder  = zOrder;
	parent.appendChild(frame);
	this.frame = frame;


//==============================
// pins the widget in place
//==============================
rim.onclick = function () {
//	if (!mainWindow.locked) {
		mainWindow.locked = true;
		preferences.widgetLockPref.value = "1";
		log ( "pin.hOffset ",pin.hOffset);
		log ( "pin.vOffset ",pin.vOffset);
                pin.hOffset = system.event.hOffset - 5;
		pin.vOffset = system.event.vOffset - 5;
		preferences.pinhOffsetPref.value = pin.hOffset;
		preferences.pinvOffsetPref.value = pin.vOffset;
		pin.opacity = 255;
//	}

	if (preferences.soundpref.value === "enable") {
		play(lock, false);
	}
};



//==============================
// unlocks the widget
//==============================
pin.onMouseDown = function () {
	if (mainWindow.locked) {
                mainWindow.locked = false;
	        // this does not work yet
                pin.opacity = 0;
		preferences.widgetLockPref.value = "0";
	}
	if (preferences.soundpref.value === "enable") {
		play(lock, false);
	}
};
//==============================
//
//==============================




}

SPclock.prototype.reScale = function (scale) {
	var  scaleImage = function (o, hOffset, vOffset, width, height, hRegP, vRegP) {
    	o.width  = Math.round(scale * width);
    	o.height = Math.round(scale * height);
		
    	hRegP = hRegP || 0;                     // hRegP and vRegP are optional parameters
    	vRegP = vRegP || 0;

    	hOffset += hRegP;
    	vOffset += vRegP;

    	o.hOffset = Math.round(scale * hOffset);
    	o.vOffset = Math.round(scale * vOffset);

    	o.hRegistrationPoint =  Math.round(scale * hRegP);
    	o.vRegistrationPoint =  Math.round(scale * vRegP);
	};
	
    scaleImage(this.dayOfWeek, 55, 90, 64, 37);
    scaleImage(this.clock, 0, 0, 182, 182);
    scaleImage(this.hourHand, 74, 29, 27, 55, 12, 54);
    scaleImage(this.minuteHand, 78, 13, 20, 71, 8, 70);
    scaleImage(this.secondHand, 83, 35, 4, 21, 2, 21);
    scaleImage(this.centreBoss, 77, 73, 25, 26);
    scaleImage(this.clockReflection, 27, 21, 122, 74);
    scaleImage(this.rim, 0, 0, 182, 182);
    scaleImage(this.pin, 27, 21, 20, 20);

    this.frame.width   = 182 * scale;
	this.frame.height  = 182 * scale;

};

SPclock.prototype.displayTime = function (d) {
	function weekDayOf(d) {
    	var dow = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    	return dow[d.getDay()];
	}

    var hours = d.getHours() % 12,
        mins  = d.getMinutes(),
        secs  = d.getSeconds(),
        dow   = weekDayOf(d).toLowerCase();

    this.hourHand.rotation   = Math.floor(30 * hours + mins / 2);
    this.minuteHand.rotation = Math.floor(6 * mins + secs / 10);
    this.secondHand.rotation = 6 * secs;
    
    this.dayOfWeek.src = this.base + dow + ".png";
};


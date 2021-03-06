﻿function GetPluginSettings()
{
	return {
		"name":			"Windows + c2",				// as appears in 'insert object' dialog, can be changed as long as "id" stays the same
		"id":			"wpc2",				// this is used to identify this plugin and is saved to the project; never change it
		"version":		"1.8",					// (float in x.y format) Plugin version - C2 shows compatibility warnings based on this
		"description":	"Extend your game features when exported to a Windows Universal App",
		"author":		"@fferegrino",
		"help url":		"http://fferegrino.github.io/win-plus-c2#docs",
		"category":		"Platform specific",	// Prefer to re-use existing categories, but you can set anything here
		"type":			"object",				// either "world" (appears in layout and is drawn), else "object"
		"rotatable":	true,					// only used when "type" is "world".  Enables an angle property on the object.
		"flags":		0						// uncomment lines to enable flags...
						| pf_singleglobal		// exists project-wide, e.g. mouse, keyboard.  "type" must be "object".
	};
};

////////////////////////////////////////
// Conditions
// On window resize 0:
AddCondition(0, cf_trigger, "On window resize", "Screen", "Screen resized", "Triggered when the user resizes the screen", "OnResizec2");
// Check aspect ratio 1:
AddStringParam("Aspect ratio","The aspect ratio to check against", "\"16:9\"");
AddNumberParam("Tolerance in aspect ratio", "Enter the +/- tolerance threshold", 0.5);
AddCondition(1, cf_none, "Screen has the specified aspect ratio", "Screen", "Aspect ratio {0}", "Test if the screen has the specified aspect ratio", "CheckAspect");
// Window.OnFocus 2:
AddCondition(2, cf_trigger, "On game focus", "Application", "App OnFocus", "Triggered when the app gets focus", "OnFocus");
// Window.OnBlur 3:
AddCondition(3, cf_trigger, "On game blur", "Application", "App OnBlur", "Triggered when the app lost focus", "OnBlur");
// MessageDialog Button 1 selected:
AddCondition(4, cf_trigger, "On MessageDialog's button 1 pressed", "Messages", "MessageDialog button 1 pressed", "Triggered when the user clicks on the 1st button of message dialog", "Button1Click");
// MessageDialog Button 1 selected:
AddCondition(5, cf_trigger, "On MessageDialog's button 2 pressed", "Messages", "MessageDialog button 2 pressed", "Triggered when the user clicks on the 2nd button of message dialog", "Button2Click");
// Has touch input:
AddCondition(6, cf_none, "Device has touch input", "Device", "Device has touch input", "Test if the device where your game is running on has support for touch input", "HasTouchInput");	
// Is Windows Device:
AddCondition(7, cf_none, "Is Windows Device", "Device", "Device is a Windows Platform", "Test if the device where your game is running on is a Windows Platform", "IsWindowsDevice");
// Is Windows Phone
AddCondition(8, cf_none, "Is Windows Phone", "Device", "Device is Windows Phone", "Test if the device where your game is running on is a Windows Phone 8", "IsWindowsPhone8");
// Is Windows 
AddCondition(9, cf_none, "Is Windows 8", "Device", "Device is Windows 8", "Test if the device where your game is running on is a Windows 8", "IsWindows8");
// On Share
AddCondition(10, cf_trigger, "On share", "Sharing", "On share", "Triggered when user presses the Share charm.  Respond with a share action in this event.", "OnShare");
// End Conditions
////////////////////////////////////////

////////////////////////////////////////
// Actions
// Show MessageDialog 0:
AddStringParam("Title", "Enter a the title of the message.");
AddStringParam("Content", "Enter a the content of the message.");
AddStringParam("Button", "Enter the text to display in the button");
AddAction(0, af_none, "Show message dialog (One button)", "UI", "Show message {1} with {2} as an option", "Display a message using the MessageDialog API", "PopDialog1");
// Show MessageDialog (Two buttons) 1:
AddStringParam("Title", "Enter a the title of the message.");
AddStringParam("Content", "Enter a the content of the message.");
AddStringParam("Button 1", "Enter the text to display in the 1st the button");
AddStringParam("Button 2", "Enter the text to display in the 2nd the button");
AddAction(1, af_none, "Show message dialog (Two buttons)", "UI", "Show message {1} with {2} and {3} as options", "Display a message using the MessageDialog API", "PopDialog2");
// Show appbar
AddAction(2, af_none, "Show AppBar", "UI", "Show AppBar", "Show your Windows Store AppBar", "ShowAppBar");
// Show shareUI
AddAction(3, af_none, "Show share UI", "Sharing", "Show share UI", "Invoke the Share charm UI.", "ShowShareUI");
// Share text
AddStringParam("Title", "Title of the share.");
AddStringParam("Description", "Description of the share.");
AddStringParam("Text", "The text to share.");
AddAction(4, af_none, "Share text", "Sharing", "Share text <i>{2}</i> (title {0}, description {1})", "In an 'On share' event, share some text.", "ShareText");
AddAction(5, af_none, "Show settings pane", "Settings", "Show settings pane", "Invoke the settings pane.", "ShowSettingsUI");
AddStringParam("Text", "The text to set in the live tile.");
AddAction(6, af_none, "Update text tile", "Tiles", "Set text {0} in live tile", "Set the specified text in the live tile", "SetTextTile");
AddAction(7, af_none, "Clear tile", "Tiles", "Clear the current live tile", "Clear the content of the live tile", "ClearTile");
AddNumberParam("Badge value", "Value to show in the live tile [1 - 99+]", "1");
AddAction(8, af_none, "Set number badge", "Tiles", "Set the number {0} in the live tile", "Set a number badge in the live tile", "SetNumberBadge");
for(var ii = 0; ii < badges.length; ii++){
	AddComboParamOption(badges[ii].name);
}
AddComboParam("Glyph", "Choose the glyph for the live tile.");
AddAction(9, af_none, "Set glyph badge", "Tiles", "Set a glyph in the live tile", "Set a glyph in the live tile", "SetGlyphBadge");
AddAction(10, af_none, "Set clear badge", "Tiles", "Remove the live tile badge", "Remove the live tile badge", "SetNoBadge");
AddAction(11, af_none, "Open other publisher apps", "Publisher", "Show apps from publisher", "Open the Windows Store and shows other apps from the publisher", "OpenPublisherApps");
// End Actions
////////////////////////////////////////

////////////////////////////////////////
// Expressions
AddExpression(0, ef_return_number, "Window width", "Screen", "WindowWidth", "Get the width of the window");
AddExpression(1, ef_return_number, "Window height", "Screen", "WindowHeight", "Get the height of the window");
AddExpression(2, ef_return_string, "Windows App Version", "Application", "AppVersion", "Get the version of your Windows App");
AddExpression(3, ef_return_string, "Windows App publisher display name", "Application", "PublisherDisplayName", "Get the publisher display name of your Windows App");
// End Expressions
////////////////////////////////////////

////////////////////////////////////////
ACESDone();

var property_list = [
	new cr.Property(ept_text, "AppBar ID", "appBar", "The ID of your Windows Store AppBar"),
	new cr.Property(ept_combo, "Share content", "Yes", "Select set to 'Yes' if you will use this plugin to share", "No|Yes")
	];
	
// Called by IDE when a new object type is to be created
function CreateIDEObjectType()
{
	return new IDEObjectType();
}
function IDEObjectType() {
	assert2(this instanceof arguments.callee, "Constructor called as a function");
}

IDEObjectType.prototype.CreateInstance = function(instance) {
	return new IDEInstance(instance);
}

function IDEInstance(instance, type) {
	assert2(this instanceof arguments.callee, "Constructor called as a function");
	
	// Save the constructor parameters
	this.instance = instance;
	this.type = type;
	
	// Set the default property values from the property table
	this.properties = {};
	
	for (var i = 0; i < property_list.length; i++)
		this.properties[property_list[i].name] = property_list[i].initial_value;
}


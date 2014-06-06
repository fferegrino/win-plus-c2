function GetPluginSettings()
{
	return {
		"name":			"Windows + c2",				// as appears in 'insert object' dialog, can be changed as long as "id" stays the same
		"id":			"wpc2",				// this is used to identify this plugin and is saved to the project; never change it
		"version":		"1.2",					// (float in x.y format) Plugin version - C2 shows compatibility warnings based on this
		"description":	"Extiende las capacidades de tu juego cuando lo exportas a Windows 8",
		"author":		"@fferegrino",
		"help url":		"http://fferegrino.github.io/win-plus-c2#doc",
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
AddCondition(2, cf_trigger, "On game focus", "App state", "App OnFocus", "Triggered when the app gets focus", "OnFocus");
// Window.OnBlur 3:
AddCondition(3, cf_trigger, "On game blur", "App state", "App OnBlur", "Triggered when the app lost focus", "OnBlur");


// End Conditions
////////////////////////////////////////

////////////////////////////////////////
// Actions

/*// No actions for now
AddStringParam("Message", "Enter a string to alert.");
AddAction(0, af_none, "Alert", "My category", "Alert {0}", "Description for my action!", "MyAction");
*/
// End Actions
////////////////////////////////////////

////////////////////////////////////////
// Expressions

AddExpression(0, ef_return_number, "Window width", "Screen", "WindowWidth", "Get the width of the window");
AddExpression(0, ef_return_number, "Window height", "Screen", "WindowHeight", "Get the height of the window");

// End Expressions
////////////////////////////////////////

////////////////////////////////////////
ACESDone();

////////////////////////////////////////
// Array of property grid properties for this plugin
// new cr.Property(ept_integer,		name,	initial_value,	description)		// an integer value
// new cr.Property(ept_float,		name,	initial_value,	description)		// a float value
// new cr.Property(ept_text,		name,	initial_value,	description)		// a string
// new cr.Property(ept_color,		name,	initial_value,	description)		// a color dropdown
// new cr.Property(ept_font,		name,	"Arial,-16", 	description)		// a font with the given face name and size
// new cr.Property(ept_combo,		name,	"Item 1",		description, "Item 1|Item 2|Item 3")	// a dropdown list (initial_value is string of initially selected item)
// new cr.Property(ept_link,		name,	link_text,		description, "firstonly")		// has no associated value; simply calls "OnPropertyChanged" on click

var property_list = [];
	
// Called by IDE when a new object type is to be created
function CreateIDEObjectType()
{
	return new IDEObjectType();
}

// Class representing an object type in the IDE
function IDEObjectType()
{
	assert2(this instanceof arguments.callee, "Constructor called as a function");
}

// Called by IDE when a new object instance of this type is to be created
IDEObjectType.prototype.CreateInstance = function(instance)
{
	return new IDEInstance(instance);
}

// Class representing an individual instance of an object in the IDE
function IDEInstance(instance, type)
{
	assert2(this instanceof arguments.callee, "Constructor called as a function");
	
	// Save the constructor parameters
	this.instance = instance;
	this.type = type;
	
	// Set the default property values from the property table
	this.properties = {};
	
	for (var i = 0; i < property_list.length; i++)
		this.properties[property_list[i].name] = property_list[i].initial_value;
}

// Called when inserted via Insert Object Dialog for the first time
IDEInstance.prototype.OnInserted = function()
{
}

// Called when double clicked in layout
IDEInstance.prototype.OnDoubleClicked = function()
{
}

// Called after a property has been changed in the properties bar
IDEInstance.prototype.OnPropertyChanged = function(property_name)
{
}

// For rendered objects to load fonts or textures
IDEInstance.prototype.OnRendererInit = function(renderer)
{
}

// Called to draw self in the editor if a layout object
IDEInstance.prototype.Draw = function(renderer)
{
}

// For rendered objects to release fonts or textures
IDEInstance.prototype.OnRendererReleased = function(renderer)
{
}
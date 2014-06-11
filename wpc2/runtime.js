// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
cr.plugins_.wpc2 = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	var pluginProto = cr.plugins_.wpc2.prototype;
		
	/////////////////////////////////////
	// Object type class
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};

	var typeProto = pluginProto.Type.prototype;

	// called on startup for each object type
	typeProto.onCreate = function()
	{
	};

	/////////////////////////////////////
	// Instance class
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
	};
	
	var instanceProto = pluginProto.Instance.prototype;

	// called whenever an instance is created
	instanceProto.onCreate = function()
	{
		this.isWindows8 = this.runtime.isWindows8App;
		this.isWindowsPhone8 = this.runtime.isWindowsPhone81;
		var self = this;
		// Properties
		this.appBarId = this.properties[0];
		// Events
		if (this.isWindows8 || this.isWindowsPhone8)
		{
			window.addEventListener('resize', function(){
				self.runtime.trigger(cr.plugins_.wpc2.prototype.cnds.OnResizec2, self);
			});
			window.addEventListener("blur", function () {
				self.runtime.trigger(cr.plugins_.wpc2.prototype.cnds.OnBlur, self);
			});
			window.addEventListener("focus", function () {
				self.runtime.trigger(cr.plugins_.wpc2.prototype.cnds.OnFocus, self);
			});
		}
	};
	
	// called whenever an instance is destroyed
	// note the runtime may keep the object after this call for recycling; be sure
	// to release/recycle/reset any references to other objects in this function.
	instanceProto.onDestroy = function ()
	{
	};
	
	// called when saving the full state of the game
	instanceProto.saveToJSON = function ()
	{
		// return a Javascript object containing information about your object's state
		// note you MUST use double-quote syntax (e.g. "property": value) to prevent
		// Closure Compiler renaming and breaking the save format
		return {
			// e.g.
			//"myValue": this.myValue
		};
	};
	
	// called when loading the full state of the game
	instanceProto.loadFromJSON = function (o)
	{
		// load from the state previously saved by saveToJSON
		// 'o' provides the same object that you saved, e.g.
		// this.myValue = o["myValue"];
		// note you MUST use double-quote syntax (e.g. o["property"]) to prevent
		// Closure Compiler renaming and breaking the save format
	};
	
	// only called if a layout object - draw to a canvas 2D context
	instanceProto.draw = function(ctx)
	{
	};
	
	// only called if a layout object in WebGL mode - draw to the WebGL context
	// 'glw' is not a WebGL context, it's a wrapper - you can find its methods in GLWrap.js in the install
	// directory or just copy what other plugins do.
	instanceProto.drawGL = function (glw)
	{
	};
	
	/**BEGIN-PREVIEWONLY**/
	instanceProto.getDebuggerValues = function (propsections)
	{
		propsections.push({
			"title": "My debugger section",
			"properties": [	]
		});
	};
	
	instanceProto.onDebugValueEdited = function (header, name, value)
	{
		// Called when a non-readonly property has been edited in the debugger. Usually you only
		// will need 'name' (the property name) and 'value', but you can also use 'header' (the
		// header title for the section) to distinguish properties with the same name.
		if (name === "My property")
			this.myProperty = value;
	};
	/**END-PREVIEWONLY**/

	//////////////////////////////////////
	// Conditions
	function Cnds() {};

	// 0:
	Cnds.prototype.OnResizec2 = function ()
	{
		return true;
	};
	
	// 1:
	Cnds.prototype.CheckAspect = function (stringAspect, threshold)
	{
		var wh = stringAspect.split(":");
		if(wh.length == 2){
			var sysAspect = window.innerWidth / window.innerHeight;
			var speAspect = parseFloat(wh[0]) / parseFloat(wh[1]);
			return (Math.abs(sysAspect - speAspect) < threshold);
		}
		return false;
	};
	
	// 2:
	Cnds.prototype.OnFocus = function (){
		return true;
	};
	
	// 3:
	Cnds.prototype.OnBlur = function (){
		return true;
	};
	
	// 4:
	Cnds.prototype.Button1Click = function(){
		return true;
	}
	
	// 5:
	Cnds.prototype.Button2Click = function(){
		return true;
	}
	
	// 6:
	Cnds.prototype.HasTouchInput = function (){
		if(this.isWindows8 || this.isWindowsPhone8){
			return (new Windows["Devices"]["Input"]["TouchCapabilities"]())["touchPresent"] || this.isWindowsPhone8;
		}
		return true;
	}
	// 7:
	Cnds.prototype.IsWindowsDevice = function (){
		return this.isWindows8 || this.isWindowsPhone8;
	}
	// 8:
	Cnds.prototype.IsWindowsPhone8 = function (){
		return this.isWindowsPhone8;
	}
	// 9:
	Cnds.prototype.IsWindows8 = function (){
		return this.isWindows8;
	}
	pluginProto.cnds = new Cnds();
	
	//////////////////////////////////////
	// Actions
	function Acts() {};
	// 0:
	Acts.prototype.PopDialog1 = function (title_, content_, btext_)
	{
		if (this.isWindows8)
		{
			var self = this;
			var msg = new Windows["UI"]["Popups"]["MessageDialog"](title_, content_);
			msg["commands"]["append"](new Windows["UI"]["Popups"]["UICommand"](
				btext_, function () { 
					self.runtime.trigger(cr.plugins_.wpc2.prototype.cnds.Button1Click, self);
				}));
			msg["showAsync"]();
		}
	}
	// 1:
	Acts.prototype.PopDialog2 = function (title_, content_, btext1_, btext2_)
	{
		if (this.isWindows8)
		{
			var self = this;
			var msg = new Windows["UI"]["Popups"]["MessageDialog"](title_, content_);
			msg["commands"]["append"](new Windows["UI"]["Popups"]["UICommand"](
				btext1_, function () { 
					self.runtime.trigger(cr.plugins_.wpc2.prototype.cnds.Button1Click, self);
				}));
			msg["commands"]["append"](new Windows["UI"]["Popups"]["UICommand"](
				btext2_, function () { 
					self.runtime.trigger(cr.plugins_.wpc2.prototype.cnds.Button2Click, self);
				}));
			msg["showAsync"]();
		}
	}
	// 2:
	Acts.prototype.ShowAppBar = function ()
	{
		if (this.isWindows8 && this.appBarId)
		{
			document.getElementById(this.appBarId)["winControl"]["show"]();
		}
	};
	// 3:	
	Acts.prototype.ShowShareUI = function ()
	{
		if (this.isWindows8 || this.isWindowsPhone8)
			Windows["ApplicationModel"]["DataTransfer"]["DataTransferManager"]["showShareUI"]();
	};
	pluginProto.acts = new Acts();
	
	//////////////////////////////////////
	// Expressions
	function Exps() {};
	
	Exps.prototype.WindowWidth = function (ret){
		ret.set_int(window.innerWidth);
	};
	
	Exps.prototype.WindowHeight = function (ret){
		ret.set_int(window.innerHeight);
	};
	
	pluginProto.exps = new Exps();

}());
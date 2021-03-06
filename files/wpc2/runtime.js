﻿// ECMAScript 5 strict mode
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
	var dataRequestEvent = null;
	var wasShareHandled = false;

	instanceProto.onCreate = function()
	{
		this.isWindows8 = this.runtime.isWindows8App;
		this.isWindowsPhone8 = this.runtime.isWindowsPhone81;
		var self = this;
		// Properties
		this.appBarId = this.properties[0];
		this.shareEnabled = (this.properties[1] !== 0);
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
			// Sharing:
			if(this.shareEnabled){
				// Code from Construct's Windows 8 plugin:				
				Windows["ApplicationModel"]["DataTransfer"]["DataTransferManager"]["getForCurrentView"]().addEventListener("datarequested", function (e) {
					dataRequestEvent = e;
					wasShareHandled = false;
					self.runtime.trigger(cr.plugins_.wpc2.prototype.cnds.OnShare, self);
					dataRequestEvent = null;
					
					// Not handled: fail explicitly
					if (!wasShareHandled)
						e["request"]["failWithDisplayText"]("Try selecting a different option before sharing.");
				});
			}
		}
	};
	
	// called when saving the full state of the game
	instanceProto.saveToJSON = function ()
	{
		return { };
	};
	
	// called when loading the full state of the game
	instanceProto.loadFromJSON = function (o) { };
	
	// only called if a layout object - draw to a canvas 2D context
	instanceProto.draw = function(ctx) { };
	
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
	
	instanceProto.onDebugValueEdited = function (header, name, value) { };
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
	// 10:
	Cnds.prototype.OnShare = function ()
	{
		return true;
	};
	pluginProto.cnds = new Cnds();
	
	//////////////////////////////////////
	// Actions
	function Acts() {};
	// 0:
	Acts.prototype.PopDialog1 = function (title_, content_, btext_)
	{
		if ((this.isWindows8  || this.isWindowsPhone8))
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
		if ((this.isWindows8  || this.isWindowsPhone8))
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
	// 4:
	Acts.prototype.ShareText = function (title_, description_, text_)
	{
		if ((this.isWindows8  || this.isWindowsPhone8) && dataRequestEvent)
		{
			var request = dataRequestEvent["request"];
			request["data"]["properties"]["title"] = title_;
			request["data"]["properties"]["description"] = description_;
			request["data"]["setText"](text_);
			wasShareHandled = true;
		}
	};
	// 5:
	Acts.prototype.ShowSettingsUI = function(){
		if (this.isWindows8){
			Windows["UI"]["ApplicationSettings"]["SettingsPane"]["show"]();
		}
	}
	// 6:
	Acts.prototype.SetTextTile = function(text_){
		if(this.isWindows8  || this.isWindowsPhone8) {
			var tileXmlString =
				"<tile><visual version='3'><binding template='TileSquare150x150Text04' fallback='TileSquareText04'><text id='1'>" 
				+ text_ 
				+ "</text></binding><binding template='TileWide310x150Text03' fallback='TileWideText03'><text id='1'>" 
				+ text_ 
				+ "</text></binding><binding template='TileSquare310x310Text09'><text id='1'>" 
				+ text_ 
				+ "</text></binding></visual></tile>";
			var tileDOM = new Windows["Data"]["Xml"]["Dom"]["XmlDocument"]();
			tileDOM["loadXml"](tileXmlString);
			var tile = new Windows["UI"]["Notifications"]["TileNotification"](tileDOM);
			Windows["UI"]["Notifications"]["TileUpdateManager"]["createTileUpdaterForApplication"]()["update"](tile);
		}
	}
	// 7:
	Acts.prototype.ClearTile = function() {
		if(this.isWindows8  || this.isWindowsPhone8) {
			Windows["UI"]["Notifications"]["TileUpdateManager"]["createTileUpdaterForApplication"]()["clear"]();
		}
	}
	// 8: 
	Acts.prototype.SetNumberBadge = function (value_){
		if(this.isWindows8  || this.isWindowsPhone8) {
			var badgeString = "<badge value='" + value_ + "' />";
			var badgeDOM = new Windows["Data"]["Xml"]["Dom"]["XmlDocument"]();
            badgeDOM["loadXml"](badgeString);
            var badge = new Windows["UI"]["Notifications"]["BadgeNotification"](badgeDOM);
            Windows["UI"]["Notifications"]["BadgeUpdateManager"]["createBadgeUpdaterForApplication"]()["update"](badge);
		}
	}
	// 9: 
	Acts.prototype.SetGlyphBadge = function (value_){
		if(this.isWindows8  || this.isWindowsPhone8) {
			var badgeString = "<badge value='" + badges[value_]["value"] + "' />";
			var badgeDOM = new Windows["Data"]["Xml"]["Dom"]["XmlDocument"]();
            badgeDOM["loadXml"](badgeString);
            var badge = new Windows["UI"]["Notifications"]["BadgeNotification"](badgeDOM);
            Windows["UI"]["Notifications"]["BadgeUpdateManager"]["createBadgeUpdaterForApplication"]()["update"](badge);
		}
	}
	// 10:
	Acts.prototype.SetNoBadge = function () {
		if(this.isWindows8  || this.isWindowsPhone8) {
			var badgeString = "<badge value='none' />";
			var badgeDOM = new Windows["Data"]["Xml"]["Dom"]["XmlDocument"]();
            badgeDOM["loadXml"](badgeString);
            var badge = new Windows["UI"]["Notifications"]["BadgeNotification"](badgeDOM);
            Windows["UI"]["Notifications"]["BadgeUpdateManager"]["createBadgeUpdaterForApplication"]()["update"](badge);
		}
	}
	// 11:
	Acts.prototype.OpenPublisherApps = function (){
		if(this.isWindows8  || this.isWindowsPhone8) {
			var uri = new Windows["Foundation"]["Uri"]("ms-windows-store:Publisher?name=" + Windows["ApplicationModel"]["Package"]["current"]["publisherDisplayName"]);
			Windows["System"]["Launcher"]["launchUriAsync"](uri);
		}
	}
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
	
	Exps.prototype.AppVersion = function(ret){
		var returnVal = "";
		if(this.isWindows8  || this.isWindowsPhone8){
			var current = Windows["ApplicationModel"]["Package"]["current"]["id"]["version"];
			returnVal = current.major + "." + 
                 current.minor + "." +
                 current.build + "." +
                 current.revision;
		}	
		ret.set_string(returnVal);
	};
	
	Exps.prototype.PublisherDisplayName = function(ret) {
		var returnVal = "";
		if(this.isWindows8  || this.isWindowsPhone8){
			returnVal = Windows["ApplicationModel"]["Package"]["current"]["publisherDisplayName"];
	}
		ret.set_string(returnVal);
	};
	
	pluginProto.exps = new Exps();

}());
sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device"
], function(JSONModel, Device) {
	"use strict";

	return {

		createDeviceModel: function() {
			var oModel = new JSONModel(Device);
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		}, 

		createConfigModel: function() {
			var oModel = new JSONModel({
				"SpeechRecognitionAvailable": false, 
				"SpeechRecognitionAllowed": false, 
				"SystemDeniedAccess": false,  
				"SpeechRecognitionText": "Please speak up clearly", 
			});

			oModel.setDefaultBindingMode("TwoWay");
			return oModel;
		}

	};
});
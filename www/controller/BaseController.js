sap.ui.define([
    "sap/ui/core/mvc/Controller", 
    "com/noki_online/ui5app/util/SpeechRecognition",
    "com/noki_online/ui5app/util/formatter"    
], function (Controller, SpeechRecognition, formatter) {
    "use strict";

        return Controller.extend("com.noki_online.ui5app.controller.BaseController", {

            formatter: formatter, 

            getRouter : function () {
				return sap.ui.core.UIComponent.getRouterFor(this);
			},

            getModel : function (sName) {
				return this.getView().getModel(sName);
			},

            setModel : function (oModel, sName) {
				return this.getView().setModel(oModel, sName);
			},

            getResourceBundle : function () {
				return this.getOwnerComponent().getModel("i18n").getResourceBundle();
            }, 

            _prepareSpeechRecognition: function() {
                var oConfig = this.getOwnerComponent().getModel("config");
                SpeechRecognition.checkAvailability().then(function() {
    
                    // SpeechRecognition is available
                    oConfig.setProperty("/SpeechRecognitionAvailable", true);
    
                    SpeechRecognition.checkPermission().then(function() {
                        // SpeechRecognition permission is set
                        oConfig.setProperty("/SpeechRecognitionAllowed", true);
                    }).catch(function(sError) {
                        // We have no permission on SpeechRecognition
                        if (sError === "SystemDenied") {
                            oConfig.setProperty("/SystemDeniedAccess", true);
                        }
                        oConfig.setProperty("/SpeechRecognitionAllowed", false);
                    })
                }).catch(function(error) {
                    // no SpeechRecognition available
                    // alert("Help, no microphone available :-(");
                    console.log(error);
                    oConfig.setProperty("/SpeechRecognitionAvailable", false);
                });
            }


        }); 
    }
);
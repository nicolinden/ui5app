sap.ui.define([
    "com/noki_online/ui5app/controller/BaseController"
], function(BaseController){
    
"use strict";

return BaseController.extend("com.noki_online.ui5app.controller.Splashscreen", {
    
    onInit: function() {

        if (window.hasOwnProperty("cordova")) {
            document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        } else {
            this.getRouter().getRoute("splashscreen").attachPatternMatched(this.onDeviceReady, this);
        }        
    }, 

    onDeviceReady: function() {

        // check for availability and permission on microphone
        this._prepareSpeechRecognition();        

        this.getRouter().navTo("record");
    }
});
});

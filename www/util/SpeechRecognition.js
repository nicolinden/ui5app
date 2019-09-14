sap.ui.define([
    "com/noki_online/ui5app/util/SpeechRecognition"
], 
function(SpeechRecognition) {
    "use strict";
    return {

        checkAvailability: function() {
            return new Promise(function(resolve, reject) {
                if (window.hasOwnProperty("cordova")) {
                    window.plugins.speechRecognition.isRecognitionAvailable(function(available){
                        if (available) {
                            resolve();
                        } else {
                            reject();
                        }
                    }.bind(this), function(err){
                        // disable all plugin functionality
                        console.error(err);
                        reject(err);
                    });            
                } else {
                    // disable all plugin functionality
                    reject(err);
                }    
            });
        }, 

		checkPermission: function() {
            return new Promise(function(resolve, reject) {  

                window.plugins.speechRecognition.hasPermission(function (isGranted){
                    if (isGranted) {
                        resolve();
                    }else{
                        this.requestPermission().then(function(){
                            resolve();
                        }).catch(function(err) {
                            reject(err);
                        })
                    }
                }.bind(this), function(err){
                    console.log(err);
                    reject(err);
                });
            }.bind(this));            
        }, 

        requestPermission: function() {
            return new Promise(function(resolve, reject) {  
                var startTime = new Date();
                window.plugins.speechRecognition.requestPermission(function (){
                    resolve();
                    // Requested
                    // this.getLanguages();
                }.bind(this), function (err){
                    var stopTime = new Date()
                    var iMilliseconds = stopTime - startTime;
                    if (iMilliseconds < 500) {
                        reject("SystemDenied");
                    } else {
                        reject(err);
                    }
                });
            }); 
        }, 
        
        getLanguages: function() {
            window.plugins.speechRecognition.getSupportedLanguages(function(data){
                console.log(data); // ["es-ES","de-DE","id-ID" ........ ]
            }.bind(this), function(err){
                console.error(err);
            });
        }, 
        
        startRecording: function() {
            var settings = {
                language: "nl-NL", // use en-US for english
                showPopup: true
            };
        
            return new Promise(function(resolve, reject) {  
                window.plugins.speechRecognition.startListening(function(result){
                    console.log(result);
                    resolve(result);
                    // By default just 5 options
                    // ["Hello","Hallou", "Hellou" ...]
                }, function(err){
                    console.log(err);
                }, settings);
            });
        }, 
        
        stopRecording: function() {
            window.plugins.speechRecognition.stopListening(function(){
                // No more recognition
            }, function(err){
                console.log(err);
            });
        }        
        
    };
});
sap.ui.define([
		"com/noki_online/ui5app/controller/BaseController",
		"com/noki_online/ui5app/util/SpeechRecognition", 
		"sap/ui/model/json/JSONModel"
	], function(BaseController, SpeechRecognition, JSONModel){
		
	"use strict";
	
	return BaseController.extend("com.noki_online.ui5app.controller.Record", {
		
		onInit: function() {
			this.getRouter().getRoute("record").attachPatternMatched(this._onRouteMatched, this);
		}, 

		_onRouteMatched: function() {
			this._createViewModel([]);
		},

		onRecordText: function() {
			var bMobile = this.getModel("config").getProperty("/SpeechRecognitionAvailable");
			var bSystemDeniedAccess = this.getModel("config").getProperty("/SystemDeniedAccess"); 
			this._runRecordTimer();

			if (!bMobile || bSystemDeniedAccess) {
				this._openManualInput();
			} else {
				var bMicrophoneAccess = this.getModel("config").getProperty("/SpeechRecognitionAllowed");
				if (bMicrophoneAccess) {
					this._recordVoice();
				} else {
					this._prepareSpeechRecognition();
				}
			}
		},

		onStopVoice: function() {
			SpeechRecognition.stopRecording();
			this.getModel("viewModel").setProperty("/recordingRunning", false);
		},

		_recordVoice: function() {
			this.getModel("viewModel").setProperty("/recordingRunning", true);
			SpeechRecognition.startRecording().then(function(aResult) {
				if (aResult && aResult.length > 0) {
					this.getModel("viewModel").setProperty("/textInput", aResult[0]);
					this._createEntry();	
				}
				console.log(oResult);
			}.bind(this));
		}, 

		_openManualInput: function() {

			this.getModel("viewModel").setProperty("/textInput", "");
			this.getModel("viewModel").setProperty("/confirmEnabled", true);

			if (!this._oManualInputDialog) {
				this._oManualInputDialog = sap.ui.xmlfragment("com.noki_online.ui5app.view.fragments.EnterTextDialog", this);
				this.getView().addDependent(this._oManualInputDialog); 
			}
			this._oManualInputDialog.open();			
		}, 

		onCloseManualInput: function() {
			this._oManualInputDialog.close();			
		}, 

		onConfirmInput: function(oEvent) {
			this._oManualInputDialog.close();
			this.getModel("viewModel").setProperty("/confirmEnabled", false);

			this._createEntry();

		}, 

		_runRecordTimer: function() {
			var oViewModel = this.getModel("viewModel");
			
			this.timer = setInterval(function() {
				var currentTime = parseInt(oViewModel.getProperty("/liveTimer"), 10);
				oViewModel.setProperty("/liveTimer", currentTime + 1000);
			}.bind(this), 1000);
		}, 

		_stopRecordTimer: function() {
			clearInterval(this.timer);
		}, 

		_getDateTime: function() {
			var oDate = new Date();

			return this.formatter.formatDate(oDate);
		}, 

		_createEntry: function() {
			this._stopRecordTimer();
			
			var oViewModel = this.getModel("viewModel");
			var aTextList = oViewModel.getProperty("/textData");
			var oListCount = parseInt(aTextList.length, 10) + 1;
			var sMilliSeconds = oViewModel.getProperty("/liveTimer");
			var sTime = this.formatter.msToMinutesAndSeconds(sMilliSeconds);

			var oData = {
				"id": oListCount, 
				"title": this._getDateTime(), 
				"time": sTime, 
				"text": oViewModel.getProperty("/textInput")
			};

			aTextList.push(oData);
			this._createViewModel(aTextList);
		}, 

		_createViewModel: function(aData) { 
			
			var oData = {
				textInput: "",
				confirmEnabled: true,
				textData: aData, 
				androidDevice: sap.ui.Device.os.android ? true : false,
				recordingRunning: false,
				liveTimer: 0
			};

			this._createModel(oData, "viewModel");
		}, 

		_createModel: function(aData, sName) {
			var oModel = new JSONModel(
				aData	
			);
			
			this.setModel(oModel, sName);
		}


	});
});

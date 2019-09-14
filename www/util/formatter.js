sap.ui.define([
	"com/noki_online/ui5app/util/formatter",
], function(formatter) {
	"use strict";

	return {
		
        formatter: formatter,

        msToMinutesAndSeconds: function(ms) {
            var minutes = Math.floor(ms / 60000);
            var seconds = ((ms % 60000) / 1000).toFixed(0);
            return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
        }, 

        formatDate: function(oDate) {
          jQuery.sap.require("sap.ui.core.format.DateFormat");

          if (oDate) {
              var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
                  pattern: "dd-MM-yyyy"
              });

              var oTimeFormat = sap.ui.core.format.DateFormat.getTimeInstance({
                  pattern: "HH:mm"
              });

              var sDate = oDateFormat.format(oDate);
              var sTime = oTimeFormat.format(oDate);

             return sDate + " " + sTime;  
          }
      }       
          
    };
});
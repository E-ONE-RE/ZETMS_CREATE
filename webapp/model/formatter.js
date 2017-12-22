sap.ui.define([], function() {
	"use strict";

	return {

		/**
		 * Rounds the currency value to 2 digits
		 *
		 * @public
		 * @param {string} sValue value to be formatted
		 * @returns {string} formatted currency value with 2 digits
		 */
		currencyValue: function(sValue) {
			if (!sValue) {
				return "";
			}

			return parseFloat(sValue).toFixed(2);
		},

		formatReqStatus: function(sValue) {

			switch (sValue) {
				case "I":
					return "Warning";
					break;
				case "A":
					return "Success";
					break;
				case "R":
					return "Error";

			}

		},

		formatStatus: function(sStatus) {

			switch (sStatus) {
				case "I":
					return "Inviata";
					break;
				case "A":
					return "Approvata";
					break;
				case "R":
					return "Rifiutata";

			}

		},

		formatIconStatus: function(sValue) {

			switch (sValue) {
				case "I":
					return "sap-icon://pending";
					break;
				case "A":
					return "sap-icon://accept";
					break;
				case "R":
					return "sap-icon://decline";

			}

		},

		formatTime: function(oTime) {
			if (oTime) {

				var oTimeFormat = sap.ui.core.format.DateFormat.getTimeInstance({
					pattern: "HH:mm:ss"
				});
				var TZOffsetMs = new Date(0).getTimezoneOffset() * 60 * 1000;
				var timeStr = oTimeFormat.format(new Date(oTime.ms + TZOffsetMs));

				if (timeStr === "00:00:00") {
					timeStr = "";
				}
				return timeStr;

			} else {
				return oTime;
			}
		},

		formatDate: function(sDate) {
			var sYear,
				sMonth,
				sDay;

			if (sDate) {
				if (sDate.indexOf("-") == -1) {
					sYear = sDate.substring(0, 4);
					sMonth = sDate.substring(4, 6);
					sDay = sDate.substring(6, 8);
				} else {
					sYear = sDate.substring(0, 4);
					sMonth = sDate.substring(5, 7);
					sDay = sDate.substring(8, 10);
				}

			}
			// new Date(year, month [, date [, hours[, minutes[, seconds[, ms]]]]])
			var oDate = new Date(sYear, sMonth - 1, sDay);
			oDate.setDate(oDate.getDate() + 1);
			if (oDate) {
				var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance();
				return oDateFormat.format(oDate, 1);
			} else {
				return oDate;
			}
		},

		formatCalDate: function(sDate) {
			var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
				pattern: "dd/MM/YYYY"
			});
			return oDateFormat.format(new Date(sDate));
		},
		


		formatAbsence: function(sAbtType) {

			switch (sAbtType) {
				case "0001":
					return "Permesso";
					break;
				case "0002":
					return "Ferie";
					break;
				case "0003":
					return "Recupero";
					break;
				case "0004":
					return "ROL";

			}

		},

		formatRequestId: function(sRequestId) {

			sRequestId = +sRequestId;
			//	parseInt(sRequestId, 10);

			return sRequestId;
		},

		formatExpType: function(sExpType) {
			switch (sExpType) {
				case "00":
					return "Chilometri";
					break;
				case "01":
					return "Autostrada";
					break;
				case "02":
					return "Cena";
					break;
				case "03":
					return "Treno";
					break;
				case "04":
					return "Albergo";
					break;
				case "05":
					return "Taxi/BUS";
					break;
				case "06":
					return "Aereo";
					break;
				case "07":
					return "Parcheggio";
					break;
				case "08":
					return "Pranzo";
					break;
				case "09":
					return "Altro";

			}

		}
		
	

	};

});
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

//		formatCalDate: function(sDate) {
//			var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
//				pattern: "dd/MM/YYYY"
//			});
//			return oDateFormat.format(new Date(sDate));
//		},
		
		
				formatCalDate: function(sDate) {
//			var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
			var sYear,
				sMonth,
				sDay;
	
			
			var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: "dd/MM/yyyy"
		//		pattern: "dd/MM/YYYY" con YYYY considerava il numero settimana per calcoare l'anno quindi al 31/12 
		//se considerato come settimana 1 del nuovo anno avanzava di un anno. per es. 31/12/2018 -> 31/12/2019
			});
		
		
			var oDateReturn = oDateFormat.format(new Date(sDate));
			
		//al 31 12 avanza di un anno, devo forzare anno indietro di uno
		//è dovuto al fatto che consiedera le ore 00:00 del 31 12 come già del nuovo anno
		// avendo corretto il data pattern con yyyy al posto di YYYY non serve più questa forzatura
		//https://github.com/SAP/openui5/issues/2370
		//https://sapui5.hana.ondemand.com/sdk/#/topic/91f2eba36f4d1014b6dd926db0e91070
		/*	if (oDateReturn) {
				
					sYear = oDateReturn.substring(6, 10);
					sMonth	 = oDateReturn.substring(3, 5);
					sDay = oDateReturn.substring(0, 2);
			
				
			}
			if ((sDay=='31' || sDay=='30') && sMonth=='12') {
				
			sYear = sYear-1;
			oDateReturn = sDay +'/'+sMonth+'/'+sYear;
		
			}*/
	
			return	oDateReturn;
		//	return oDateFormat.format(new Date(sDate));
			
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
				case "0005":
					return "Lavoro agile";
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
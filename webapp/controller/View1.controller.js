sap.ui.define([
		"ZETMS_CREATE/controller/BaseController", "sap/ui/model/json/JSONModel",
		'sap/ui/unified/CalendarLegendItem',
		'sap/ui/unified/DateTypeRange',
		'sap/m/Button',
		'sap/m/Dialog',
		'sap/m/Label',
		//	'sap/m/MessageToast',
		//	'sap/m/MessageBox',
		"ZETMS_CREATE/model/formatter"
	],
	function(BaseController, JSONModel, CalendarLegendItem, DateTypeRange, Button, Dialog, Label, formatter) {
		"use strict";
		var sJson; //variabile per lo stringone Json
        var aSediResult;
		//	jQuery.sap.require("ZETMS_CREATE.utils.Formatters");
		//	jQuery.sap.require("ZETMS_CREATE.utils.UIHelper");
		jQuery.sap.require("sap.m.MessageBox");
		//	jQuery.sap.require("ZETMS_CREATE.utils.DataManager");
		//	jQuery.sap.require("ZETMS_CREATE.utils.ConcurrentEmployment");
		//	jQuery.sap.require("ZETMS_CREATE.utils.CalendarTools");
		//	jQuery.sap.require("sap.ca.ui.dialog.factory");
		//	jQuery.sap.require("sap.ca.ui.dialog.Dialog");
		jQuery.sap.require("sap.m.MessageToast");
		// jQuery.support.useFlexBoxPolyfill = false;
		//	jQuery.sap.require("sap.ca.ui.model.format.FileSizeFormat");
		//	jQuery.sap.require("sap.ca.ui.message.message");
		// jQuery.sap.require("sap.ui.thirdparty.sinon");

		return BaseController.extend("ZETMS_CREATE.controller.View1", {

			formatter: formatter,

			oFormatYyyymmdd: null,
			oFormatDaysShort: null,
			oFormatYear: null,

			onInit: function() {
				//SE			ZETMS_CREATE.utils.DataManager.init(this.oDataModel, this.resourceBundle);
				//	ZETMS_CREATE.utils.Formatters.init(this.resourceBundle);
				//	ZETMS_CREATE.utils.CalendarTools.init(this.resourceBundle);
				//	this.oRouter.attachRouteMatched(this._handleRouteMatched, this);
				//	sap.ca.scfld.md.controller.BaseFullscreenController.prototype.onInit.call(this);
				//this.oApplication = this.oApplicationFacade.oApplicationImplementation;
				//this.resourceBundle = this.oApplicationFacade.getResourceBundle();
				//this.oDataModel = this.oApplicationFacade.getODataModel();
				//ZETMS_CREATE.utils.DataManager.init(this.oDataModel, this.resourceBundle);
				//		ZETMS_CREATE.utils.Formatters.init(this.resourceBundle);
				//ZETMS_CREATE.utils.CalendarTools.init(this.resourceBundle);
				//this.oDataModel = ZETMS_CREATE.utils.DataManager.getBaseODataModel();

				//this.oRouter.attachRouteMatched(this._handleRouteMatched, this);
				//this._buildHeaderFooter();
				this._initCntrls();
				// sap.ui.getCore().getEventBus().subscribe("ZETMS_CREATE.LeaveCollection", "refresh", this._onLeaveCollRefresh, this);

				this.oFormatYyyymmdd = sap.ui.core.format.DateFormat.getInstance({
					pattern: "yyyyMMdd",
					calendarType: sap.ui.core.CalendarType.Gregorian
				});

				this.oFormatDaysShort = sap.ui.core.format.DateFormat.getInstance({
					pattern: "E",
					calendarType: sap.ui.core.CalendarType.Gregorian
				});

				this.oFormatMonth = sap.ui.core.format.DateFormat.getInstance({
					pattern: "M",
					calendarType: sap.ui.core.CalendarType.Gregorian
				});

				this.oFormatYear = sap.ui.core.format.DateFormat.getInstance({
					pattern: "Y",
					calendarType: sap.ui.core.CalendarType.Gregorian
				});

				//		this.oModel = new JSONModel({selectedDates:[]});
				//		this.getView().setModel(this.oModel);

				var oRouter = this.getRouter();
				oRouter.getRoute("view1").attachMatched(this._onRouteMatched, this);

			},

			onBeforeRendering: function() {
				var oModel = this.getView().getModel();
				var sRead = "/CommessaSet";

				oModel.read(sRead, {

					success: fnReadS,

					error: fnReadE
				});

				function fnReadS(oData, response) {
					console.log(oData);
					console.log(response);

					sJson = oData.results["0"].Json;

				}

				function fnReadE(oError) {
					console.log(oError);
				}




			},
			
			//MP: function per aprire il dialog con il form per l'inserimento dei dati di una commessa
			openDialog: function(oEvent){
				var that = this;
			this.sButtonKey = oEvent.getSource().getId(); //mi salvo il valore chiave del bottone per la gestione dei conflitti in actionTask
			if (!that.Dialog) {

				that.Dialog = sap.ui.xmlfragment("ZETMS_CREATE.view.Dialog", this, "ZETMS_CREATE.controller.Worklist");
				//to get access to the global model
				this.getView().addDependent(that.Dialog);
				if (sap.ui.Device.system.phone) {
					that.Dialog.setStretch(true);
				}
			}
			that.Dialog.open();	
			},
			
			closeDialog: function(){
			this.Dialog.close();	
			},

			//MP: funzione che richiama il fragment contenente l'albero
			showPopover: function(oEvent) {
				var that = this;

				if (!that._oPopover) {

					that._oPopover = sap.ui.xmlfragment("ZETMS_CREATE.view.Popover", this, "ZETMS_CREATE.controller.Worklist");
					//to get access to the global model
					this.getView().addDependent(that._oPopover);
				}
				var oButton = oEvent.getSource();
				jQuery.sap.delayedCall(0, this, function() {
				
		
				 // MP: logica per il binding dell'albero riportante le commesse;
				 // la lettura del modello (oModel.read) è stata effettutata nel
				 // metodo onBeforeRendering
				
					var oTree = sap.ui.getCore().byId("Tree");
					var oModelJson = new sap.ui.model.json.JSONModel();
					var oJson = JSON.parse(sJson);
					oModelJson.setData(oJson, false);

					sap.ui.getCore().setModel(oModelJson, "CommessaCollection");
					oTree.setModel(sap.ui.getCore().getModel("CommessaCollection"));
					var oTemplate = new sap.m.StandardTreeItem({
						title: "{name}",
						icon: "{icon}",
						select: true
					});
					oTemplate.setType("Active");
					oTree.bindAggregation("items",{
						path: "/CommessaCollection",
						template: oTemplate,
						   parameters: {
        numberOfExpandedLevels: 1
     }
					});
				
					this._oPopover.openBy(oButton);
				});

			},
			
			
			//MP: funzione richiamata alla selezione di una commessa
			onSelect: function(oEvent){
				var sIcon = oEvent.getSource().getSelectedItem().getProperty("icon"); 
				var oTree = sap.ui.getCore().byId("Tree");
				var oList = sap.ui.getCore().byId("List");
				 var sSede;
				// MP: non permette di selezionare i nodi radice ma solo quelli foglia, le commesse
				if(sIcon !== "sap-icon://folder-full" && sIcon !== "sap-icon://folder-blank"){
					
			var sCommessa = oEvent.getSource().getSelectedItem().getProperty("title");	
			this.sCommessaId = sCommessa.substring(0, sCommessa.indexOf(" -"));
			this.getView().byId("btnSede").setEnabled(true);
			
			this._oPopover.close();
			
				}else{
						oTree.removeSelections();
				}

			},
			
				callSediSet: function(sCommessa){
				var oModel = this.getView().getModel();
				 
				var sReadURI = oModel.sServiceUrl+"/SediSet/?$format=json&$filter=Commessa eq'"+sCommessa+"'";
                
				oModel._request({
                    
                   requestUri: sReadURI,
              method: "GET",   
	        headers: {      
	                 	"X-Requested-With" : 'XMLHttpRequest',  
	                    "Content-Type" : 'application/atom+xml',  
	                    "DataServiceVersion" : "2.0"           
	                 }
			},
			function(data,response){
				var oList = sap.ui.getCore().byId("List");
				oList.destroyItems();
				aSediResult = data.results;
				var oModel = new sap.ui.model.json.JSONModel();
				oModel.setData(data);
	               sap.ui.getCore().setModel(oModel, "results");
					oList.setModel(sap.ui.getCore().getModel("results"));
					var oTemplate = new sap.m.StandardListItem({
						title: "{Office}"
					});
					
					oList.bindAggregation("items",{
					path: "/results",
					template: oTemplate
					});
		

			});
			
			
			},
			
			//MP per visualizzare un Popover con le sedi. Al momento le sedi disponibili.
			openPopoverList: function(oEvent){
		    ////// test 
			this.callSediSet(this.sCommessaId); 
			//////
		
			var that = this;

				if (!that._oPopoverList) {

					that._oPopoverList = sap.ui.xmlfragment("ZETMS_CREATE.view.PopoverSedi", this, "ZETMS_CREATE.controller.Worklist");
					//to get access to the global model
					this.getView().addDependent(that._oPopoverList);
				}
				var oButton = oEvent.getSource();
				jQuery.sap.delayedCall(0, this, function() {
                 	this._oPopoverList.openBy(oButton);
				});

			},
	
			_onRouteMatched: function(oEvent) {

				var oView = this.getView();

				oView.bindElement({
					path: "/CalendarSet",
					//	parameters : {expand: 'ToLeaveReqPos'}, 

					events: {
						change: this._onBindingChange.bind(this),
						dataRequested: function(oEvent) {
							oView.setBusy(true);
						},
						dataReceived: function(oEvent) {
							oView.setBusy(false);

						}
					}
				});

			},

			onAfterRendering: function(oEvent) {

			},

			onUpdateFinished: function(oEvent) {

			},

			handleCalendarChange: function(oEvent) {

				this._onBindingChange();

			},
					
			

			_onBindingChange: function() {

				var oView = this.getView();
				var oModel = this.getView().getModel();
				sap.ui.getCore().setModel(oModel);

				//ripulisco i campi		
				oView.byId("LRS4_DAT_CALENDAR").removeAllSelectedDates();
				oView.byId("LRS4_DAT_CALENDAR").removeAllSpecialDates();
				oView.byId("LRS4_DAT_CALENDAR").removeAllDisabledDates();

				var oCal1 = oView.byId("LRS4_DAT_CALENDAR");

				var startDate = oCal1.getStartDate();
				var startMonth = this.oFormatMonth.format(startDate);
				var startYear = this.oFormatYear.format(startDate);

				var oLeg1 = oView.byId("legend1");
				oLeg1.destroyItems();

				//imposto la data minima selezionabile dietro di un anno
				var nowP = new Date();

				var nowF = new Date();
				nowP.setDate(nowP.getDate() - 365);
				oCal1.setMinDate(nowP);

				//imposto la data massima selezionabile avanti di un anno

				nowF.setDate(nowF.getDate() + 365);
				oCal1.setMaxDate(nowF);

				var nowForYear = new Date();
				var oYear = this.oFormatYear.format(nowForYear);

				var oYearN = Number(oYear);

				var oYear2 = oYearN + 1;

				// disabilito giorni festivi 
				oCal1.addDisabledDate(new DateTypeRange({
					startDate: this.oFormatYear.parse(oYearN + "0101")
				}));

				oCal1.addDisabledDate(new DateTypeRange({
					startDate: this.oFormatYear.parse(oYear2 + "0101")
				}));

				///// befana
				oCal1.addDisabledDate(new DateTypeRange({
					startDate: this.oFormatYear.parse(oYearN + "0106")
				}));

				oCal1.addDisabledDate(new DateTypeRange({
					startDate: this.oFormatYear.parse(oYear2 + "0106")

				}));

				///// 25 aprile
				oCal1.addDisabledDate(new DateTypeRange({
					startDate: this.oFormatYear.parse(oYearN + "0425")
				}));

				oCal1.addDisabledDate(new DateTypeRange({
					startDate: this.oFormatYear.parse(oYear2 + "0425")
				}));

				///// primo maggio
				oCal1.addDisabledDate(new DateTypeRange({
					startDate: this.oFormatYear.parse(oYearN + "0501")
				}));

				oCal1.addDisabledDate(new DateTypeRange({
					startDate: this.oFormatYear.parse(oYear2 + "0501")
				}));

				///// 2 giugno
				oCal1.addDisabledDate(new DateTypeRange({
					startDate: this.oFormatYear.parse(oYearN + "0602")
				}));

				oCal1.addDisabledDate(new DateTypeRange({
					startDate: this.oFormatYear.parse(oYear2 + "0602")
				}));

				///// ferragosto
				oCal1.addDisabledDate(new DateTypeRange({
					startDate: this.oFormatYear.parse(oYearN + "0815")
				}));

				oCal1.addDisabledDate(new DateTypeRange({
					startDate: this.oFormatYear.parse(oYear2 + "0815")
				}));

				///// tutti i santi
				oCal1.addDisabledDate(new DateTypeRange({
					startDate: this.oFormatYear.parse(oYearN + "1101")
				}));

				oCal1.addDisabledDate(new DateTypeRange({
					startDate: this.oFormatYear.parse(oYear2 + "1101")
				}));

				///// immacolata
				oCal1.addDisabledDate(new DateTypeRange({
					startDate: this.oFormatYear.parse(oYearN + "1208")
				}));

				oCal1.addDisabledDate(new DateTypeRange({
					startDate: this.oFormatYear.parse(oYear2 + "1208")
				}));

				////// natale
				oCal1.addDisabledDate(new DateTypeRange({
					startDate: this.oFormatYear.parse(oYearN + "1225")
				}));

				oCal1.addDisabledDate(new DateTypeRange({
					startDate: this.oFormatYear.parse(oYear2 + "1225")
				}));

				////// santo stefano
				oCal1.addDisabledDate(new DateTypeRange({
					startDate: this.oFormatYear.parse(oYearN + "1226")
				}));

				oCal1.addDisabledDate(new DateTypeRange({
					startDate: this.oFormatYear.parse(oYear2 + "1226")
				}));
				///////////////FINE FESTIVI////////////  
				var sOwnerId = this.getView()._sOwnerId;
		
		        
			    var sId = sOwnerId + "---view1" + "--";
                if(this.sButtonKey != undefined){
				sap.ui.getCore().byId(sId + "LRS4_DAT_STARTTIME").setValue("");
				sap.ui.getCore().byId(sId + "LRS4_DAT_STARTTIME").rerender();
				//oView.byId("LRS4_DAT_STARTTIME").setEnabled(true);

				sap.ui.getCore().byId(sId + "LRS4_DAT_ENDTIME").setValue("");
				sap.ui.getCore().byId(sId + "LRS4_DAT_ENDTIME").rerender();
				//oView.byId("LRS4_DAT_ENDTIME").setEnabled(true);

				sap.ui.getCore().byId(sId + "LRS4_TXA_NOTE").setValue("");
				sap.ui.getCore().byId(sId + "LRS4_TXA_NOTE").rerender();
				sap.ui.getCore().byId(sId + "LRS4_TXA_NOTE").setEnabled(true);

				//	oView.byId("LRS4_TXA_NOTE_RECUP").setValue("");
				//	oView.byId("LRS4_TXA_NOTE_RECUP").rerender("");
				//	oView.byId("LRS4_TXA_NOTE_RECUP").setEnabled(true);

			sap.ui.getCore().byId(sId + "LRS4_DAT_ORETOT").setValue("0");
				sap.ui.getCore().byId(sId + "LRS4_DAT_ORETOT").setEnabled(false);
				sap.ui.getCore().byId(sId + "LRS4_DAT_ORETOT").rerender();
                }
				
		
				

				var sRead = "/CalendarSet";

				oModel.read(sRead, {
					//filters: oFilter,

					filters: [new sap.ui.model.Filter({

						filters: [new sap.ui.model.Filter({
							path: "Calmonth",
							operator: sap.ui.model.FilterOperator.EQ,
							value1: startMonth

						}), new sap.ui.model.Filter({
							path: "Calyear",
							operator: sap.ui.model.FilterOperator.EQ,
							value1: startYear
						})],

						and: true

					})],

					success: fnReadS,

					error: fnReadE
				});

				function fnReadS(oData, response) {
					//	console.log(oData);
					//	console.log(response);

					// controllo che la funzione è andata a buon fine 
					if (response.statusCode == "200") {
						////////////////////////////////				

						var oFormatYYyyymmdd = sap.ui.core.format.DateFormat.getInstance({
							pattern: "yyyyMMdd",
							calendarType: sap.ui.core.CalendarType.Gregorian
						});

						var oRefDate = new Date();

						var oDateRange;

						if (oData.results.length > 0) {
							for (var i = 0; i < oData.results.length; i++) {
								//escludo richieste rifiutate
								//if (oData.results[i].ZreqStatus === 'A' || oData.results[i].ZreqStatus === 'I') {
								//						var res = oData.results[i].Zdate.substring(8);
								var res = oData.results[i].Data;

								// disabilito giorni che contengono già una richiesta   
								//    oCal1.addDisabledDate(new DateTypeRange({   
								//    startDate: oFormatYYyyymmdd.parse(res)
								//    }));

								if (oData.results[i].Ore >= 8.0) {

									oCal1.addSpecialDate(new DateTypeRange({
										startDate: oFormatYYyyymmdd.parse(res),
										type: "Type09",
										tooltip: "Ore: " + oData.results[i].Ore

									}));
								}

								if (oData.results[i].Ore < 8.0 & oData.results[i].Ore > 0.0) {

									oCal1.addSpecialDate(new DateTypeRange({
										startDate: oFormatYYyyymmdd.parse(res),
										type: "Type01",
										tooltip: "Ore: " + oData.results[i].Ore
									}));
								}

								/*	if (oData.results[i].Ore === 0.0) {
	
										oCal1.addSpecialDate(new DateTypeRange({
											startDate: oFormatYYyyymmdd.parse(res),
											type: "Type09",
											tooltip: "Ore: " + oData.results[i].Ore 
										}));
									}*/

								// }	

								// aggiungere date selezionate quando si è in modifica
								/*oCal1.addSelectedDate(new DateTypeRange({
									startDate: oFormatYYyyymmdd.parse(res)

								}));*/

							}

							oLeg1.addItem(new CalendarLegendItem({
								text: "Completo",
								id: "leg1",
								type: "Type09"

							}));

							oLeg1.addItem(new CalendarLegendItem({
								text: "Incompleto",
								id: "leg2",
								type: "Type01"
							}));

							/*	oLeg1.addItem(new CalendarLegendItem({
									text: "Da inserire",
									id: "leg3",
									type: "Type09"
								}));*/

						}

					} else {

						//jQuery.sap.require("sap.m.MessageBox");
						sap.m.MessageBox.show(
							"Error: Nessun record recuperato", {
								icon: sap.m.MessageBox.Icon.WARNING,
								title: "Error",
								actions: [sap.m.MessageBox.Action.CLOSE]

							});

					}

				} // END FUNCTION SUCCESS

				function fnReadE(oError) {
					//	console.log(oError);

					alert("Error in read: " + oError.message);
				}

			},
			
	

			/////////////////////////////////////////////////////////////////////  

			onHistoryPress: function(oEvent) {

				//this.getRouter().getTargets().display("view1s");

				this.getRouter().navTo("view1s", {});

			},

			getRouter: function() {
				return sap.ui.core.UIComponent.getRouterFor(this);

			}

		});
	});
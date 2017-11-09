sap.ui.define([
	"sap/ui/core/mvc/Controller",
	'sap/ui/unified/DateTypeRange',
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"sap/m/MessageBox",
	"ZETMS_CREATE/model/formatter"
], function(Controller, DateTypeRange, JSONModel, History, MessageBox, formatter) {
	"use strict";
     
     jQuery.sap.require("sap.m.MessageBox");
     
	return Controller.extend("ZETMS_CREATE.controller.BaseController", {
		/**
		 * Convenience method for accessing the router.
		 * @public
		 * @returns {sap.ui.core.routing.Router} the router for this component
		 */
		getRouter: function() {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},

		/**
		 * Convenience method for getting the view model by name.
		 * @public
		 * @param {string} [sName] the model name
		 * @returns {sap.ui.model.Model} the model instance
		 */
		getModel: function(sName) {
			return this.getView().getModel(sName);
		},

		/**
		 * Convenience method for setting the view model.
		 * @public
		 * @param {sap.ui.model.Model} oModel the model instance
		 * @param {string} sName the model name
		 * @returns {sap.ui.mvc.View} the view instance
		 */
		setModel: function(oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},

		/**
		 * Getter for the resource bundle.
		 * @public
		 * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
		 */
		getResourceBundle: function() {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},

		onNavBack: function (oEvent) {
			
			
		//	if(oEvent && oView!=undefined){
			////////SE su pressione tasto back faccio refresh tabella taskset
			var oView, oViewW;
			oView = this.getView();
			var sPrefix = oView.getId().substring(0, oView.getId().indexOf("---")) + "---"; 
					oViewW = sap.ui.getCore().byId(sPrefix + "V1S");
					var oTable = oViewW.byId("__table0");
					oTable.getBinding("items").refresh();
			////////
	//		}
			
			
			var oHistory, sPreviousHash;
			oHistory = History.getInstance();
			sPreviousHash = oHistory.getPreviousHash();
			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				this.getRouter().navTo("view1", {});
			}
		},
		
		
		
		
			onRefreshTable: function (oEvent) {
				
			var oView = this.getView();
			var oTable = oView.byId("__table0");
			oTable.getBinding("items").refresh();
			
		
			},
		
		
				onNavBackDirect        : function (oEvent) {
			

	 //		this.getRouter().navTo("view1s", {});
			
			var oHistory, sPreviousHash;
			oHistory = History.getInstance();
			sPreviousHash = oHistory.getPreviousHash();
			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
			//	this.getRouter().navTo("view1s", {}, true );
			    this.getRouter().navTo("view1s", {});
			}
			
		},
		

			onTimePickerChange: function() {

               	var oView ;
		     	oView = this.getView();
		     	
				var aSelectedDates = this.cale.getSelectedDates();

				var aZtimestart = this.timeFrom.getValue();
				var aZtimeend = this.timeTo.getValue();
				var aOreTot,
					aOrep;
				var aOreDay = 8.0;
				
				var tim1 = aZtimestart,
						tim2 = aZtimeend;
					var ary1 = tim1.split(':'),
						ary2 = tim2.split(':');
					var minsdiff = parseInt(ary2[0], 10) * 60 + parseInt(ary2[1], 10) - parseInt(ary1[0], 10) * 60 - parseInt(ary1[1], 10);
					var aTstart = parseInt(ary1[0], 10);
					var aTstartMin = parseInt(ary1[1], 10);
					var aTend = parseInt(ary2[0], 10);
					var aTendMin = parseInt(ary2[1], 10);
				//	var aTendMinLast = aTendMin.substring(1, 1);
					var aTstartMinLast = aZtimestart.substring(4);
						var aTendMinLast = aZtimeend.substring(4);
				
				this.timeFrom.setValueState(sap.ui.core.ValueState.None);	
				this.timeTo.setValueState(sap.ui.core.ValueState.None);
				
				var minsEnd = parseInt(ary2[0], 10) * 60 + parseInt(ary2[1], 10);
				var minsStart = parseInt(ary1[0], 10) * 60 + parseInt(ary1[1], 10);
				
					//controllo che almeno un giorno sia selezionato
				if (aSelectedDates.length === 0) {

					//jQuery.sap.require("sap.m.MessageBox");
					sap.m.MessageBox.show(
						"Selezionare prima i giorni", {
							icon: sap.m.MessageBox.Icon.ERROR,
							title: "Error",
							actions: [sap.m.MessageBox.Action.CLOSE]

						});
				
					return "KO";
				}


                //////////////////////////////////////////
                if (aZtimestart !== "") {
						//controllo correttezza inserimento intervallo ore
						if ((aTstart < 9 || aTstart > 18) || (aTstart === 13 || (aTstart === 14 & aTstartMin < 30)) ) {
							sap.m.MessageBox.show(
								"Inserimento ora inizio non corretto. Ora inizio >= 9:00, < 13:00, >= 14:30, < 18:30 ", {
									icon: sap.m.MessageBox.Icon.ERROR,
									title: "Error",
									actions: [sap.m.MessageBox.Action.CLOSE]
		
								});
								
								oView.byId("LRS4_DAT_STARTTIME").setValue("");
							this.timeFrom.setValueState(sap.ui.core.ValueState.Error);
                    
							return "KO";
						}
						
						//controllo correttezza inserimento intervallo minuti inizio
						if (aTstartMinLast !== "0") {
		
							///jQuery.sap.require("sap.m.MessageBox");
							sap.m.MessageBox.show(
								"Ora inizio, sono selezionabili solo i minuti 00 o 30.", {
									icon: sap.m.MessageBox.Icon.ERROR,
									title: "Error",
									actions: [sap.m.MessageBox.Action.CLOSE]
		
								});
								
								oView.byId("LRS4_DAT_STARTTIME").setValue("");
								this.timeFrom.setValueState(sap.ui.core.ValueState.Error);
							return "KO";
						}
				
				
                }
			
			///////////////////////////////////////	
			if (aZtimeend !== "") {
						//controllo correttezza inserimento ora fine
				if ( (aTend > 18 || aTend <= 9) || ((aTend === 13 & aTendMin > 0) || (aTend === 14 & aTendMin < 30)) ) {
					sap.m.MessageBox.show(
						"Inserimento intervallo ore non corretto. Ora fine > 9:00, <= 13:00, >= 14:30, <= 18:30", {
							icon: sap.m.MessageBox.Icon.ERROR,
							title: "Error",
							actions: [sap.m.MessageBox.Action.CLOSE]

						});
						
							oView.byId("LRS4_DAT_ENDTIME").setValue("");
							this.timeTo.setValueState(sap.ui.core.ValueState.Error);
					return "KO";
				}
				
					//controllo correttezza inserimento intervallo minuti fine
				if (aTendMinLast !== "0") {

					//jQuery.sap.require("sap.m.MessageBox");
					sap.m.MessageBox.show(
						"Ora fine, sono selezionabili solo i minuti 00 o 30.", {
							icon: sap.m.MessageBox.Icon.ERROR,
							title: "Error",
							actions: [sap.m.MessageBox.Action.CLOSE]

						});
						
					oView.byId("LRS4_DAT_ENDTIME").setValue("");
					this.timeTo.setValueState(sap.ui.core.ValueState.Error);
					return "KO"; 
				}
				
				
			}	
			
			/////////////////////////////////////
			
						//controllo correttezza inserimento intervallo ore
				if  (aZtimestart === "" & aZtimeend !== "")  {

					this.timeFrom.setValueState(sap.ui.core.ValueState.Error);
				
				}	
				
							//controllo correttezza inserimento intervallo ore
				if  (aZtimestart !== "" & aZtimeend === "")  {

					this.timeTo.setValueState(sap.ui.core.ValueState.Error);
				
				}	
			////////////////////////////////////
			
			
				if (aZtimestart === "" & aZtimeend === "") {

					aOreTot = parseFloat(aSelectedDates.length * 8);

					aOrep = 8;
					
				} else if (aZtimestart !== "" & aZtimeend !== "") {
                    
                    
		                    // controllo che inizio non sia maggiore di fine
					  if (minsStart > minsEnd) {
		
							//jQuery.sap.require("sap.m.MessageBox");
							sap.m.MessageBox.show(
								"Inserimento intervallo ore non corretto: ora inizio deve essere minore di ora fine", {
									icon: sap.m.MessageBox.Icon.ERROR,
									title: "Error",
									actions: [sap.m.MessageBox.Action.CLOSE]
		
								});
								
								oView.byId("LRS4_DAT_STARTTIME").setValue("");
							this.timeFrom.setValueState(sap.ui.core.ValueState.Error);
							this.timeTo.setValueState(sap.ui.core.ValueState.Error);
							return "KO";
						}
					
					aOrep = parseFloat(minsdiff / 60);
					Number(aOrep).toFixed(1);

					//sottraggo ore pausa in caso di assenza a cavallo tra mattina e rientro nel pome
					if (aTstart < 13 & ((aTend > 14) || (aTend === 14 & aTendMin >= 30))) {
						aOrep = aOrep - 1.5;
					}

					if (aOrep > 8) {
						aOrep = 8;
					}

					aOreTot = parseFloat(aSelectedDates.length * aOrep);
					Number(aOreTot).toFixed(1);

				}

				this.getView().byId("LRS4_DAT_ORETOT").setValue(aOreTot);
			},
			
				onTimePickerCheck: function() {

               	var oView ;
		     	oView = this.getView();
		     	
		     	var aZtimestart = this.timeFrom.getValue();
				var aZtimeend = this.timeTo.getValue();
		     	
				/////////////////////////////////////
			
						//controllo correttezza inserimento intervallo ore
				if  (aZtimestart === "" & aZtimeend !== "")  {

					//jQuery.sap.require("sap.m.MessageBox");
					sap.m.MessageBox.show(
						"Inserimento ora inizio non corretto", {
							icon: sap.m.MessageBox.Icon.ERROR,
							title: "Error",
							actions: [sap.m.MessageBox.Action.CLOSE]

						});
					oView.byId("LRS4_DAT_STARTTIME").setValue("");
					this.timeFrom.setValueState(sap.ui.core.ValueState.Error);
					return "KO";
				}	
				
							//controllo correttezza inserimento intervallo ore
				if  (aZtimestart !== "" & aZtimeend === "")  {

				//	jQuery.sap.require("sap.m.MessageBox");
					sap.m.MessageBox.show(
						"Inserimento ora fine non corretto", {
							icon: sap.m.MessageBox.Icon.ERROR,
							title: "Error",
							actions: [sap.m.MessageBox.Action.CLOSE]

						});
								oView.byId("LRS4_DAT_ENDTIME").setValue("");
					this.timeTo.setValueState(sap.ui.core.ValueState.Error);
					return "KO";
				}	
			////////////////////////////////////

				
				
				},
			
			checkCalendarSelection: function() {
			var aSelectedDates = this.cale.getSelectedDates();
			var oDate;
			var oView;
				oView = this.getView();
				
				
			//controllo che almeno un giorno sia selezionato
				if (aSelectedDates.length == 0) {

					//jQuery.sap.require("sap.m.MessageBox");
					sap.m.MessageBox.show(
						"Selezionare almeno un giorno!", {
							icon: sap.m.MessageBox.Icon.WARNING,
							title: "Error",
							actions: [sap.m.MessageBox.Action.CLOSE]

						});
				  
					return "KO";
				}
				
			    //CHECK GIORNI DI PREAVVISO///////////////////////////////
				var urgentReqLimit = new Date();
				urgentReqLimit.setDate(urgentReqLimit.getDate()+3);
				
				this.note.setValueState(sap.ui.core.ValueState.None);
				
					if (aSelectedDates.length > 0) {

					for (var i = 0; i < aSelectedDates.length; i++) {

						oDate = aSelectedDates[i].getStartDate();
						
						if (oDate <= urgentReqLimit & this.note.getValue() === "") {
							
								sap.m.MessageBox.show(
									"Attenzione: Per richieste con meno di 3 giorni di preavviso la direzione richiede la compilazione obbligatoria del campo note.", {
										icon: sap.m.MessageBox.Icon.WARNING,
										title: "Error",
										actions: [sap.m.MessageBox.Action.CLOSE]

									});
								
									this.note.setValueState(sap.ui.core.ValueState.Error);
								
							return "KO";
							
						}		

					}

				}
				
				// CHECK RECUPERO
				var absType = this.slctLvType.getSelectedKey();
				
					
							if (absType === "0003" & this.note.getValue() === "") {
							
								sap.m.MessageBox.show(
									"Attenzione: Specificare nelle note giorno/i di lavoro ai quali si riferisce il recupero. Es.: assenza del 21/09/2017 come recupero del 16/09/2017 8 ore", {
										icon: sap.m.MessageBox.Icon.WARNING,
										title: "Error",
										actions: [sap.m.MessageBox.Action.CLOSE]

									});
								
									this.note.setValueState(sap.ui.core.ValueState.Error);
								
							return "KO";
							
						}		
			
			},
			
			// NON USATA
			handleAbsTypeSelect: function(oEvent) {
				var oAbsType = oEvent.oSource;
				var aAbsTypeKey = oAbsType.getSelectedKey();
				
					if (aAbsTypeKey === "0003") {
							
								sap.m.MessageBox.show(
									"Attenzione: Specificare nelle note giorno/i di lavoro ai quali si riferisce il recupero. Es.: assenza del 21/09/2017 come recupero del 16/09/2017 8 ore", {
										icon: sap.m.MessageBox.Icon.INFORMATION,
										title: "Information",
										actions: [sap.m.MessageBox.Action.CLOSE]

									});
								
							return;
							
						}		

			},
			
			
		
			
				//SE START CUSTOM CALENDAR
			handleCalendarSelect: function(oEvent) {

				var oView;
				oView = this.getView();

				var oCalendar = oEvent.oSource;
				var aSelectedDates = oCalendar.getSelectedDates();

				var oDate;
				var oSpecialDate;
				var oDataSel = {
					selectedDates: []
				};

				var aSpecialDates = this.cale.getSpecialDates();
				
					
				var now = new Date();
				
                    //Subtract one day from it
                    now.setDate(now.getDate()-1);
                    // get current date
                    //var date = Date.parse(oEvent.oSource.getLiveValue());
                    

				if (aSelectedDates.length > 0) {

					for (var i = 0; i < aSelectedDates.length; i++) {

						oDate = aSelectedDates[i].getStartDate();
						
						///CHECK DATE PASSATE///////////////////////////////////
						// if current date lower than past dates, show error
						if (oDate < now) {
								//jQuery.sap.require("sap.m.MessageBox");
								sap.m.MessageBox.show(
									"Attenzione: Non è possibile selezionare date nel passato, " + oDate, {
										icon: sap.m.MessageBox.Icon.WARNING,
										title: "Error",
										actions: [sap.m.MessageBox.Action.CLOSE]

									});
								
								//	oCalendar.removeSelectedDate(oDater);
								oCalendar.removeAllSelectedDates();
								return;
							}
							
						//CHECK GIORNI NON LAVORATIVI///////////////////////////////
						var oDayOfWeek = this.oFormatDaysShort.format(oDate);

						if(oDayOfWeek === "sab" || oDayOfWeek === "sat" || oDayOfWeek === "dom" || oDayOfWeek=== "sun") {
						//if(oDate === sap.ui.unified.CalendarDayType.NonWorking) {
								//jQuery.sap.require("sap.m.MessageBox");
								sap.m.MessageBox.show(
									"Attenzione: Non è possibile selezionare giorni non lavorativi, rimuovere la selezione, " + oDate, {
										icon: sap.m.MessageBox.Icon.WARNING,
										title: "Error",
										actions: [sap.m.MessageBox.Action.CLOSE]

									});
								

								//oCalendar.removeAllSelectedDates();
								return;
							}
						
						
						//CHECK RIHIESTE SOVRAPPOSTE///////////////////////////////
						//	var	oDater = aSelectedDates[i].getStartDate();
						oDate = this.oFormatYyyymmdd.format(oDate);
						for (var ii = 0; ii < aSpecialDates.length; ii++) {

							oSpecialDate = aSpecialDates[ii].getStartDate();
							oSpecialDate = this.oFormatYyyymmdd.format(oSpecialDate);

							if (oDate == oSpecialDate) {

								//jQuery.sap.require("sap.m.MessageBox");
								sap.m.MessageBox.show(
									"Attenzione: Non è possibile inserire più di una richiesta per giorno, controllare giorno " + oDate, {
										icon: sap.m.MessageBox.Icon.WARNING,
										title: "Error",
										actions: [sap.m.MessageBox.Action.CLOSE]

									});
								//	alert("Errore sovrapposizione giorni");
								//	oCalendar.removeSelectedDate(oDater);
								
								oCalendar.removeAllSelectedDates();
								return;
							}

						}
						
						///////////////////////////////////////
						// servirebbe per notificare a video date selezionate, serve un nuovo model json
						//	 oDataSel.selectedDates.push({Date:oDate});

					}

				}
                
                // se seleziono più di un giorno disabilito timepicker e calcolo ore tot
				if (aSelectedDates.length > 1) {

					oView.byId("LRS4_DAT_STARTTIME").setValue("");
					oView.byId("LRS4_DAT_STARTTIME").rerender();
					oView.byId("LRS4_DAT_STARTTIME").setEnabled(false);

					oView.byId("LRS4_DAT_ENDTIME").setValue("");
					oView.byId("LRS4_DAT_ENDTIME").rerender();
					oView.byId("LRS4_DAT_ENDTIME").setEnabled(false);

					var aOreTot;

					var aOreDay = 8.0;

					aOreTot = parseFloat(aSelectedDates.length * aOreDay);
					Number(aOreTot).toFixed(1);

					oView.byId("LRS4_DAT_ORETOT").setValue(aOreTot);

				}
                 
                // se seleziono solo un giorno abilito timepicker e calcolo ore
				if (aSelectedDates.length > 0 & aSelectedDates.length < 2) {

					oView.byId("LRS4_DAT_STARTTIME").setValue("");
					oView.byId("LRS4_DAT_STARTTIME").rerender();
					oView.byId("LRS4_DAT_STARTTIME").setEnabled(true);

					oView.byId("LRS4_DAT_ENDTIME").setValue("");
					oView.byId("LRS4_DAT_ENDTIME").rerender();
					oView.byId("LRS4_DAT_ENDTIME").setEnabled(true);

					var aZtimestart = this.timeFrom.getValue();
					var aZtimeend = this.timeTo.getValue();
					var aOreTot;
					var aOreDay = 8.0;


					// se uno dei due timepicker è vuoto cancello conteggio ore
					if (aZtimestart === "" || aZtimeend === "") {

						aOreTot = "";
						oView.byId("LRS4_DAT_ORETOT").setValue(aOreTot);
					}
                    
                    // se entrambi i timepicker non sono valorizzati assumo 8 ore di default
					if (aZtimestart === "" & aZtimeend === "") {

						aOreTot = parseFloat(aSelectedDates.length * aOreDay);

					}
                    
                    // valorizzo oreTot nella vista
					this.getView().byId("LRS4_DAT_ORETOT").setValue(aOreTot);

				}
  
                // se nessun giorno è selezionato disabilito timepicker
				if (aSelectedDates.length === 0) {

					oView.byId("LRS4_DAT_STARTTIME").setValue("");
					oView.byId("LRS4_DAT_STARTTIME").setEnabled(false);
					oView.byId("LRS4_DAT_STARTTIME").rerender();
					

					oView.byId("LRS4_DAT_ENDTIME").setValue("");
					oView.byId("LRS4_DAT_ENDTIME").setEnabled(false);
					oView.byId("LRS4_DAT_ENDTIME").rerender();
					

					oView.byId("LRS4_DAT_ORETOT").setValue("0");
					oView.byId("LRS4_DAT_ORETOT").setEnabled(false);
					oView.byId("LRS4_DAT_ORETOT").rerender();

				}

			},
			
				handleRemoveSelection: function(oEvent) {
				this.getView().byId("LRS4_DAT_CALENDAR").removeAllSelectedDates();
				//	this._clearModel();
			},

			/*_clearModel: function() {
			var oData = {selectedDates:[]};
			this.oModel.setData(oData);
		},*/
		
		
			onDisplayNotFound: function(oEvent) {
				//display the "notFound" target without changing the hash
				this.getRouter().getTargets().display("notFound", {
					fromTarget: "view1"
				});
			},
			
			onActionDialog: function(oEvent) {
					
					var oView = this.getView();
					var oViewId = oView.getId();
					var that = this;
					var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
					var absType = this.slctLvType.getSelectedKey();
					var tabsType = formatter.formatAbsence(absType);
				
					this.sButtonKey = oEvent.getSource().getId();
					 
					 
		//estraggo id della view 
		var sViewIdStart = oView.getId().indexOf("---");
		sViewIdStart = sViewIdStart + 3;
		
	    //		var sPrefix = oView.getId().substring(0, oView.getId().indexOf("---");) + "---"; 
	   var sViewID = oView.getId().substring(sViewIdStart); 
	   
	   // l'alternativa è basarsi sul nome della view completa
		//	var sViewName = oView.getViewName(); 
		
		// inserisco giorni selezionati un una stringa di testo per dettagli messagebox
	                    var aSelectedDates = this.cale.getSelectedDates();
						//var oDataSel = {
						//	selectedDates: []
					//	};
	 
							var oDate;
							var oDateTxt = "";
							var oComma = "";
			
				
							if (aSelectedDates.length > 0) {
								for (var i = 0; i < aSelectedDates.length; i++) {
									oDate = aSelectedDates[i].getStartDate();
									oDate = this.oFormatYyyymmdd.format(oDate);
									oDate = formatter.formatDate(oDate);
									//oDataSel.selectedDates.push({Date:oDate});
										if (oDateTxt !== "") {
										oComma = ", ";
										}
									
									oDateTxt = oDateTxt + oComma + oDate;
								  }
								}	
	
					
			//	if (oViewId ===	"__component0---V1") {	
						if (sViewID ===	"V1") {	
					
				
						 // controllo button selezionato
					   if (this.sButtonKey === oView.byId("btn1").getId()) {
						// se bt1 eseguo controlli per azione di modifica
					
						    
						 // richiamo function in baseController per verifica calendario     
						 var calCheck =  this.checkCalendarSelection();
	                    if (calCheck === "KO") {return;}
	                    
	                       // richiamo function in baseController per verifica ore   
	                    var timeCheck = this.onTimePickerChange();
	                    if (timeCheck === "KO") {return;}
	                 
	                   // richiamo function in baseController per verifica ore campi vuoti   
	                   var timeCheckBlank = this.onTimePickerCheck();   
	                    if (timeCheckBlank === "KO") {return;}
	                    

						MessageBox.confirm("Confermi l'invio della richiesta?", {
							icon: MessageBox.Icon.QUESTION,
							title: "Invio Richiesta",
							actions: [MessageBox.Action.YES, MessageBox.Action.NO],
							initialFocus : MessageBox.Action.NO,
							id: "messageBoxId1",
							defaultAction: MessageBox.Action.NO,
							details: "Tipo di richiesta: " + tabsType + " \nApprovatore: " + this.slctApprover.getSelectedKey() + " \nOre totali: " + this.oreTot.getValue()
							+ " \nGiorno/i assenza: " + oDateTxt + " \nCliccando SI, la richiesta verrà inoltrata, riceverai una notifica via mail sul suo esito. Puoi modificare o eliminare solo le richieste in stato 'Inviata' accedendo allo storico. ",
							styleClass: bCompact ? "sapUiSizeCompact" : "",
							contentWidth: "100px",
							
							 onClose: function(oAction) {
								        if (oAction == "YES") {
								        	that.actionTask();
								            //sap.ui.controller("ZETMS_CREATE.controller.View1").actionTask(); //altro modo per richiamare function se non ci fosse un event
								        }
										        else 
										        {
										            return;
										        }
								    	}
						});
						
					   } 
				}   
				
			//	if (oViewId === "__component0---V2") {
						if (sViewID === "V2") {
					if (this.sButtonKey ===oView.byId("btn1_mod").getId()) {
					   		// se bt1_mod  eseguo controlli e modifico
					   		
					   	 // richiamo function in baseController per verifica calendario     
						 var calCheck =  this.checkCalendarSelection();
	                    if (calCheck === "KO") {return;}
	                    
	                       // richiamo function in baseController per verifica ore   
	                    var timeCheck = this.onTimePickerChange();
	                    if (timeCheck === "KO") {return;}
	                 
	                   // richiamo function in baseController per verifica ore campi vuoti   
	                   var timeCheckBlank = this.onTimePickerCheck();   
	                    if (timeCheckBlank === "KO") {return;}
					   		
					   		MessageBox.confirm("Confermi la modifica della richiesta?", {
								icon: MessageBox.Icon.QUESTION,
								title: "Modifica Richiesta",
								actions: [MessageBox.Action.YES, MessageBox.Action.NO],
								initialFocus : MessageBox.Action.NO,
								id: "messageBoxId1_mod",
								defaultAction: MessageBox.Action.NO,
								details: "Tipo di richiesta: " + tabsType + " \nApprovatore: " + this.slctApprover.getSelectedKey() + " \nOre totali: " + this.oreTot.getValue()
									+ " \nGiorno/i assenza: " + oDateTxt + " \nCliccando SI, la richiesta verrà modificata, riceverai una notifica via mail sul suo esito. Puoi modificare o eliminare solo le richieste in stato 'Inviata' accedendo allo storico. ",
						
								styleClass: bCompact ? "sapUiSizeCompact" : "",
								contentWidth: "100px",
								 onClose: function(oAction) {
									        if (oAction == "YES") {
									        	that.actionTask();
									            //sap.ui.controller("ZETMS_CREATE.controller.View1").actionTask(); //altro modo per richiamare function se non ci fosse un event
									        }
											        else 
											        {
											            return;
											        }
									    	}
							});
						
					} 
					
					else if (this.sButtonKey ===oView.byId("btn2_del").getId()) {
							// se bt2_del non eseguo controlli ed elimino, in action verrà passato il parametro sDeleted = "X";
						
								MessageBox.confirm("Confermi l'eliminazione della richiesta?", {
								icon: MessageBox.Icon.QUESTION,
								title: "Elimina Richiesta",
								actions: [MessageBox.Action.YES, MessageBox.Action.NO],
								initialFocus : MessageBox.Action.NO,
								id: "messageBoxId1_del",
								defaultAction: MessageBox.Action.NO,
								details: "Tipo di richiesta: " + tabsType + " \nApprovatore: " + this.slctApprover.getSelectedKey() + " \nOre totali: " + this.oreTot.getValue()
								+ " \nGiorno/i assenza: " + oDateTxt + " \nCliccando SI, la richiesta verrà eliminata, non potrai più visualizzarla nell'APP.",
								styleClass: bCompact ? "sapUiSizeCompact" : "",
								contentWidth: "100px",
								 onClose: function(oAction) {
									        if (oAction == "YES") {
									        	that.actionTask();
									            //sap.ui.controller("ZETMS_CREATE.controller.View1").actionTask(); //altro modo per richiamare function se non ci fosse un event
									        }
											        else 
											        {
											            return;
											        }
									    	}
							});
							
					}
				}	
					
			},
				
				
			actionTask: function(oEvent) {
		
                var oView = this.getView();
                var oViewId = oView.getId();
				var oModel = this.getView().getModel();
				sap.ui.getCore().setModel(oModel);
				
					var that = this;
                
				//causa bug di versione sono costretto a forzare xml, altrimenti i campi di tipo 
				//decimali fanno andare la chiamata post create_deep_entity in errore: CX_SXML_PARSE_ERROR
				//note sap:
				//1751991 - OData Channel - Deep Insert in JSON Format Leads to Error
				//1874920 - Error in "deep insert" case when parsing JSON
				// https://archive.sap.com/discussions/thread/3936579
				////
				oModel.oHeaders.Accept = "application/atom+xml,application/atomsvc+xml,application/xml";

				oModel.bJSON = false;
				/////  
				//          oModel.setUseBatch(false);
				//var oObject = oView.getBindingContext().getObject();
                var sButtonId = this.sButtonKey;
				var sDeleted = "";
				var sZrequestId = "";
				var sAction = "creata"; 
				
						//estraggo id della view 
				var sViewIdStart = oView.getId().indexOf("---");
				sViewIdStart = sViewIdStart + 3;
				
			    //		var sPrefix = oView.getId().substring(0, oView.getId().indexOf("---");) + "---"; 
			   var sViewID = oView.getId().substring(sViewIdStart); 
	   
	   // l'alternativa è basarsi sul nome della view completa
		//	var sViewName = oView.getViewName(); 
				
			//	if (oViewId === "__component0---V2") {	
			if (sViewID === "V2") {	
					 if (sButtonId === oView.byId("btn2_del").getId()) {
					 	var oObject = oView.getBindingContext().getObject();
					 	sZrequestId = oObject.ZrequestId;
					 	sDeleted = "X";
					 	sAction = "eliminata";
					 }
					 else if (sButtonId === oView.byId("btn1_mod").getId()) {
					    var oObject = oView.getBindingContext().getObject();
					 	sZrequestId = oObject.ZrequestId;
					 	sAction = "modificata";
					 
					 }
				}
				
				 
				var aSelectedDates = this.cale.getSelectedDates();
				var oDate;
                
                
				var aZtimestart = this.timeFrom.getValue();
				var aZtimeend = this.timeTo.getValue();
				var aOreTot = this.oreTot.getValue();
				var	aOrep = aOreTot / aSelectedDates.length;
				
				var oUrlParams = {
					ZrequestId: sZrequestId,
					Tmsapprover: this.slctApprover.getSelectedKey(),
					ZabsType: this.slctLvType.getSelectedKey(),
					ZreqStatus: "I",
					ZoreTotali: aOreTot,
					Znote: this.note.getValue(),
					Zdeleted: sDeleted

				};

				oUrlParams.ToLeaveReqPos = [];
				if (aSelectedDates.length > 0) {
					for (var i = 0; i < aSelectedDates.length; i++) {
						oDate = aSelectedDates[i].getStartDate();
						oUrlParams.ToLeaveReqPos.push({
							Zdate: this.oFormatYyyymmdd.format(oDate),
							Ztimestart: aZtimestart,
							Ztimeend: aZtimeend,
							Tmsapprover: this.slctApprover.getSelectedKey(),
							ZabsType: this.slctLvType.getSelectedKey(),
							Zorep: aOrep,
							ZreqStatus: "I"
						});

					}
					//	this.oModel.setData(oData);
				} else {
					//	this._clearModel();
				}

				//jQuery.sap.require("sap.ui.commons.MessageBox");
				oModel.create('/LeaveRequestSet', oUrlParams, {
					method: "POST",
					success: fnS,

					error: fnE
				});

				//}
				//}	
				function fnS(oData, response) {
				//	console.log(oData);
				//	console.log(response);

					// controllo che la funzione è andata a buon fine recuperando il risultato della function sap
					//	if (oData.Type == "S") {
					if (response.statusCode == "201") {

						//	var msg = "Success: "+oData.Message+", "+sTypeAction;
						var msg = "Richiesta " + sAction + " con successo.\nID: " + formatter.formatRequestId(oData.ZrequestId) + "";
						
						sap.m.MessageToast.show(msg, {
							duration: 5000,
							autoClose: true,
							closeOnBrowserNavigation: false

						});

						// ripulisco campi  	
						oView.byId("LRS4_DAT_CALENDAR").removeAllSelectedDates();

						oView.byId("LRS4_DAT_STARTTIME").setValue("");
						oView.byId("LRS4_DAT_STARTTIME").rerender();
						//oView.byId("LRS4_DAT_STARTTIME").setEnabled(true);

						oView.byId("LRS4_DAT_ENDTIME").setValue("");
						oView.byId("LRS4_DAT_ENDTIME").rerender();
						//oView.byId("LRS4_DAT_ENDTIME").setEnabled(true);

						oView.byId("LRS4_TXA_NOTE").setValue("");
						oView.byId("LRS4_TXA_NOTE").rerender();
						oView.byId("LRS4_TXA_NOTE").setEnabled(true);
						
					//	if (oViewId === "__component0---V2") {
					    if (sViewID === "V2") {	
								// faccio refresh tabella riepilogativa delle richieste
								var sPrefix = oView.getId().substring(0, oView.getId().indexOf("---")) + "---"; 
							    var oViewW = sap.ui.getCore().byId(sPrefix + "V1S");
								var oTable = oViewW.byId("__table0");
								oTable.getBinding("items").refresh();
								sap.ui.controller("ZETMS_CREATE.controller.View2").onNavBackDirect();
							//    that.onRefreshTable();
							//	that.getRouter().navTo("view1s", {});
						}
						
					//	if (oViewId === "__component0---V1") {	
						if (sViewID === "V1") {	
							
	
							that.getRouter().navTo("view1s", {});
						}
						
					} else {

						//jQuery.sap.require("sap.m.MessageBox");
						sap.m.MessageBox.show(
							"Error: " + oData.Message, {
								icon: sap.m.MessageBox.Icon.WARNING,
								title: "Error",
								actions: [sap.m.MessageBox.Action.CLOSE]

							});

					}

				} // END FUNCTION SUCCESS

				function fnE(oError) {
				//	console.log(oError);

					alert("Error in read: " + oError.message + "\n" + oError.responseText);
				}

			},
			
			
			_initCntrls: function() {
			//	this.changeMode = false;
			//	this.withdrawMode = false;
			//	this.oChangeModeData = {};
			//	this.selRange = {};
			//	this.selRange.start = null;
			//	this.selRange.end = null;
			//	this.aLeaveTypes = [];
			//	this.leaveType = {};
			//	this.iPendingRequestCount = 0;
			//	this.bSubmitOK = null;
			//	this.bApproverOK = null;
			//	this.oSubmitResult = {};
			//	this.sApprover = "";
			//	this.sApproverPernr = "";
			//	this.bSimulation = true;
			//	this._isLocalReset = false;
			//	this.oBusy = new sap.m.BusyDialog();
			//	this.formContainer = this.byId("LRS4_FRM_CNT_BALANCES");
			//	this.timeInputElem = this.byId("LRS4_FELEM_TIMEINPUT");
			//	this.balanceElem = this.byId("LRS4_FELEM_BALANCES");
			//	this.noteElem = this.byId("LRS4_FELEM_NOTE");
				this.timeFrom = this.byId("LRS4_DAT_STARTTIME");
				this.timeTo = this.byId("LRS4_DAT_ENDTIME");
				this.oreTot = this.byId("LRS4_DAT_ORETOT");
				this.legend = this.byId("LRS4_LEGEND");
			//	this.remainingVacation = this.byId("LRS4_TXT_REMAINING_DAYS");
			//	this.bookedVacation = this.byId("LRS4_TXT_BOOKED_DAYS");
				this.note = this.byId("LRS4_TXA_NOTE");
			//	this.note_rec = this.byId("LRS4_TXA_NOTE_RECUP");
				this.cale = this.byId("LRS4_DAT_CALENDAR");
				this.slctLvType = this.byId("SLCT_LEAVETYPE");
				this.slctApprover = this.byId("SLCT_APPROVER");
			//	this.calSelResetData = [];
				//SE
				//this._initCalendar();
				//		this._deviceDependantLayout();
			//	this.objectResponse = null;
			//	this.ResponseMessage = null;
			},
			
			
				
		/**
		 * Event handler when the share button has been clicked
		 * @param {sap.ui.base.Event} oEvent the butten press event
		 * @public
		 */
		onSharePress: function() {
			var oShareSheet = this.byId("shareSheet");
			jQuery.sap.syncStyleClass(this.getOwnerComponent().getContentDensityClass(), this.getView(), oShareSheet);
			oShareSheet.openBy(this.byId("shareButton"));
		},

		/**
		 * Event handler when the share by E-Mail button has been clicked
		 * @public
		 */
		onShareEmailPress: function() {
			var oViewModel = (this.getModel("objectView") || this.getModel("worklistView"));
			sap.m.URLHelper.triggerEmail(
				null,
				oViewModel.getProperty("/shareSendEmailSubject"),
				oViewModel.getProperty("/shareSendEmailMessage")
			);
		}

	});

});
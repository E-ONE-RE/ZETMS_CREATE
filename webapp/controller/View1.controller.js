sap.ui.define([
		"ZETMS_CREATE/controller/BaseController", "sap/ui/model/json/JSONModel",
		'sap/ui/unified/CalendarLegendItem',
		'sap/ui/unified/DateTypeRange',
		'sap/m/Button',
		'sap/m/GroupHeaderListItem',
		'sap/m/Dialog',
		'sap/m/Label',
		'sap/ui/model/Filter',
		'sap/ui/model/Sorter',
		"sap/m/MessageBox",

		//	'sap/m/MessageToast',
		//	'sap/m/MessageBox',
		"ZETMS_CREATE/model/formatter"
	],
	function(BaseController, JSONModel, CalendarLegendItem, DateTypeRange, Button, GroupHeaderListItem, Dialog, Label, Filter, Sorter,
		MessageBox, formatter) {
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
			_oDialog: null,

			onInit: function() {
				
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

			
                // funzioni per raggruppamento liste
				this.mGroupFunctions = {
					Giorno: function(oContext) {
						var sName = oContext.getProperty("Giorno");
						var sWeekday = oContext.getProperty("Weekday");
						var sOretot = oContext.getProperty("Oretot");
						var sImptot = oContext.getProperty("Imptot");
						var sKmtot = oContext.getProperty("Kmtot");
						return {
							key: sName,
							text: sWeekday + " " + sName + " - Ore: " + sOretot + " - Spese: " + sImptot + " - Km: " + sKmtot
						};

					},

					Descrorder: function(oContext) {
						var sName = oContext.getProperty("Descrorder");
						var sOretotcomm = oContext.getProperty("Oretotcomm");
						var sImptotcomm = oContext.getProperty("Imptotcomm");
						var sKmtotcomm = oContext.getProperty("Kmtotcomm");
						return {
							key: sName,
							text: sName + " - Ore: " + sOretotcomm + " - Spese: " + sImptotcomm + " - Km: " + sKmtotcomm
						};
					}

				};

				var oRouter = this.getRouter();
				oRouter.getRoute("view1").attachMatched(this._onRouteMatched, this);

			},
            
            //NON USATA
			getGroupHeader: function(oGroup) {
				return new GroupHeaderListItem({
					title: oGroup.key,
					upperCase: false
				});
			},
            
            // funzioni per treetable
			onCollapseAll: function() {
				var oTreeTable = this.getView().byId("TREETABLE_CONTENTS");
				//	var oTreeTable = sap.ui.getCore().byId("treeTable");
				oTreeTable.collapseAll();

			},

			onExpandFirstLevel: function() {
				var oTreeTable = this.getView().byId("TREETABLE_CONTENTS");
				oTreeTable.expandToLevel(1);
			},

			onExit: function() {
				if (this._oDialog) {
					this._oDialog.destroy();
				}

				if (this._oPopover) {
					this._oPopover.destroy();
				}

				if (this._oPopover) {
					this._oPopover.destroy();
				}

			},
            
            
             // gestione tasto HELP
			handleResponsivePopoverMultydayPress: function(oEvent) {
				if (!this._PopoverHelpMulti) {
					this._PopoverHelpMulti = sap.ui.xmlfragment("ZETMS_CREATE.view.PopoverHelpMulti", this, "ZETMS_CREATE.controller.View1");

					this.getView().addDependent(this._PopoverHelpMulti);

				}
				var oVboxM = sap.ui.getCore().byId("VboxM");
				oVboxM.destroyItems();
				var sId = oEvent.getSource().getParent().getParent().getId();
				var oHTML;
			
						oHTML = new sap.ui.core.HTML({
							content: '<strong>Inserimento commessa multi day</strong>' +
								'<ul>' +

								'<li>Nel caso di scelta commessa da quelle già utilizzate nel mese è possibile condividere la stessa commessa per' +
								' più giorni. Questo significa che la sede non può essere modificata e che la descrizione sarà condivisa per tutti i giorni'+
								' associati. Scegliendo <strong>"SI"</strong> se si modifica la descrizone di una commessa multi day la modifica sarà riportata su tutti i giorni associati. </li>' +
								' <li>Selezionare <strong>"NO"</strong> se invece si vuole inserire una commessa indipendente per poter scegliere sede ed inserire una descrizione dedicata al singolo giorno.' +
								'</li>' +
								'</ul>',
							sanitizeContent: true
						});


				oVboxM.addItem(oHTML);
				this._PopoverHelpMulti.openBy(oEvent.getSource());
			},
			
            // gestione tasto HELP
			handleResponsivePopoverPress: function(oEvent) {
				if (!this._oPopoverHelp) {
					this._oPopoverHelp = sap.ui.xmlfragment("ZETMS_CREATE.view.PopoverHelp", this, "ZETMS_CREATE.controller.View1");

					this.getView().addDependent(this._oPopoverHelp);

				}
				var oVbox = sap.ui.getCore().byId("Vbox");
				oVbox.destroyItems();
				var sId = oEvent.getSource().getParent().getParent().getId();
				var oHTML;
				switch (sId) {
					case "dialog":
						oHTML = new sap.ui.core.HTML({
							content: '<strong>Inserimento commessa ed eventuali spese</strong>' +
								'<ul>' +


								'<li><strong>Seleziona una commessa già utilizzata nel mese:</strong> in questo caso si potrà scegliere ' +
								' tra una commessa multi day (condivisa per più giorni) o una commessa per singolo giorno. ' +
								'Nel primo caso la sede non protrà essere modificata e le modifiche al campo descrizione saranno riportate ' + 
								'anche nei giorni per i quali la commessa è gia stata utilizzata. ' + 
								'Nel secondo caso invece si potrà selezionare la sede ed inserire una descrizione dedicata al singolo giorno. ' +

								'</li>' +
								'<li><strong>Seleziona una nuova commessa:</strong> in questo caso potrà essere selezionata una nuova commessa ' +
								' tra tutte quelle a disposizione indipendentemente dal fatto che sia già stata utilizzata nel mese, ' +
								'si potrà selezionare la sede ed aggiungere una nuova descrizione. ' +
								'</li>' +

							  
								'<li>Dopo aver completato tutti gli inserimenti (i campi contrassegnati da <span style="color: red">*</span> sono obbligatori) '+
								'ed aver selezionato eventuali spese, premere il tasto <strong>"Conferma"</strong> per salvare la commessa.' +


								'</li>' +
								'</ul>',
							sanitizeContent: true
						});

						break;
					case "dialogDelComm":
						oHTML = new sap.ui.core.HTML({
							content: '<strong>Modificare o eliminare una commessa</strong>' +
								'<ul>' +

								'<li>Per la commessa selezionata, è possibile: ' +
								' <br> - Modificare ore e descrizione' +
								' <br> - Inserire eventuali nuove spese espandendo la relativa sezione ' +

								'<br>Una volta terminati gli inserimenti, premere sul tasto "Modifica commessa"' +
								' per apportare le modifiche.</li>' +
								'</ul>' +
								'<ul>' +
								'<li>Per eliminare la commessa e le relative spese associate, cliccare sul tasto "Elimina commessa"</li>' +
								'</ul>' +
								'<strong>Modificare o eliminare le singole spese già presenti</strong>' +
								'<ul>' +
								'<li>Dalla tabella "Spese Inserite" è possibile eliminare o modificare/salvare singolarmente ' +
								'le spese associate alla commessa. In questo caso i bottoni da utilizzare sono quelli posti ' +
								' alla destra delle singole righe e non quelli posti in fondo alla pagina. Dopo aver modificato ' +
								' e salvato una singola spesa si può tornare nella pagina principale cliccando sul tasto "Indietro".</li>' +

								'</ul>',
							sanitizeContent: true
						});
						break;
					case "dialogSpese":
						oHTML = new sap.ui.core.HTML({
							content: '<strong>Modificare o eliminare una spesa</strong>' +
								'<ul>' +
								'<li>Per la spesa selezionata, è possibile modificare <br> l&apos; importo e la descrizione ' +
								'modificando i valori degli <br>appositi campi di input. Una volta terminata l&apos; elaborazione,  <br>' +
								'premere sul tasto "Modifica spesa" per apportare le modifiche.</li>' +
								'</ul>' +
								'<ul>' +
								'<li>Per eliminare la spesa, cliccare sul tasto "Elimina spesa"</li>' +
								'</ul>',
							sanitizeContent: true
						});

						break;

					default:
						oHTML = new sap.ui.core.HTML({
							content: '<strong>Come inserire una nuova commessa e relative spese</strong>' +
								'<ul>' +
								'<li>Selezionare il giorno o più giorni dal calendario.</li>' +
								'<li>Cliccare sul pulsante crea.</li>' +
								'</ul>' +
								'<strong>Come copiare un giorno e le relative commesse su altri giorni/o.</strong>' +
								'<ul>' +
								'<li>Selezionare il giorno da copiare dal calendario e cliccare sul tasto "Copia", selezionare poi ' +

								'dalla popup i giorni su cui copiare. E&rsquo; possibile copiare anche su un mese successivo a quello di partenza, ' +
								'ma non su più mesi contemporaneamente. ' +
								'Es. Si può copiare il 15 maggio sul 20 maggio, oppure sul 20 giugno ma non contemporaneamente sul 20 maggio e sul 20 giugno. ' +
								'In ogni caso verranno copiate solo le commesse (no spese).</li>' +
								

								'</ul>' +
								'<strong>Come modificare/eliminare una commessa e relative spese</strong>' +
								'<ul>' +
								'<li>Selezionare la commmessa da modificare/eliminare dalla lista delle commesse.</li>' +
								'</ul>' +
								'<strong>Come modificare/eliminare una spesa</strong>' +
								'<ul>' +
								'<li>Selezionare la spesa da modificare/eliminare dalla lista delle spese.</li>' +
								'</ul>' +
								'<strong>Come visualizzare i report</strong>' +
								'<ul>' +
								'<li>Cliccare sul tab "Report" e selezionare il documento da visualizzare</li>' +
								'</ul>' +
								'<strong>Come modificare ordinamento e raggruppamento delle liste</strong>' +
								'<ul>' +
								'<li>Cliccare sul pulsante in alto a destra della lista di interesse e scegliere il settaggio desiderato.</li>' +
								'</ul>' +

								'<strong>Come filtrare le lista per singoli giorni </strong>' +
		                        '<ul>' +
		                        '<li> Selezionare un giorno o più giorni dal calendario, se esistono commesse associate verranno visualizzate nelle liste in basso.</li>' +
                                 '</ul>' ,

							sanitizeContent: true
						});
				}

				oVbox.addItem(oHTML);
				this._oPopoverHelp.openBy(oEvent.getSource());
			},
            
            
            // chiude help
			handleCloseButton: function(oEvent) {
				this._oPopoverHelp.close();
			},

			handleConfirm: function(oEvent) {

				var oView = this.getView();
				var oTable;
				if (this.sButtonKey === oView.byId("btn_comm").getId()) {

					oTable = oView.byId("COMMESSE_CONTENTS");
				} else if (this.sButtonKey === oView.byId("btn_exp").getId()) {

					oTable = oView.byId("SPESE_CONTENTS");
				}
				var mParams = oEvent.getParameters();
				var oBinding = oTable.getBinding("items");

				// apply sorter to binding
				// (grouping comes before sorting)
				var aSorters = [];
				var aSortersSort = [];

				//raggruppa e ordina
				if (mParams.groupItem) {
					var sPath = mParams.groupItem.getKey();
					//   var sPath ="Giorno";
					var bDescending = mParams.groupDescending;
					// var bDescending = "false";
					var vGroup = this.mGroupFunctions[sPath];
					/*var vGroup = function(oContext) {
					    var name = oContext.getProperty("Giorno");
					    return {
					        key: name,
					        text: name
					    };
					};*/
					aSorters.push(new sap.ui.model.Sorter(sPath, bDescending, vGroup));

                   	if (oBinding.aAllKeys == null) {
						oBinding.aAllKeys = oBinding.aKeys;
					}

					oBinding.sort(aSorters);
				} else {
					// apply sorter
					var sPathSort = mParams.sortItem.getKey();
					//var sPath ="Descrorder";
					var bDescendingSort = mParams.sortDescending;
					//    var bDescending = true;
					aSortersSort.push(new sap.ui.model.Sorter(sPathSort, bDescendingSort));
					
				    if (oBinding.aAllKeys == null) {
						oBinding.aAllKeys = oBinding.aKeys;
					}
					
					oBinding.sort(aSortersSort);
				}

			},

			handleViewSettingsDialogButtonPressed: function(oEvent) {
				var that = this;
				this.sButtonKey = oEvent.getSource().getId();
				if (!that._oDialogSettings) {
					that._oDialogSettings = sap.ui.xmlfragment("ZETMS_CREATE.view.DialogTable", this, "ZETMS_CREATE.controller.View1");
					//to get access to the global model
					this.getView().addDependent(that._oDialogSettings);
					/*	if (sap.ui.Device.system.phone) {
							that._oDialog.setStretch(true);
						}*/
				}
				// toggle compact style
				jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), that._oDialogSettings);
				that._oDialogSettings.open();
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

			//MP: logica per la selezione del calendario
			handleCalendarSelect: function(oEvent) {

				var sDate, sDayFilter, oFilter, oTreeFilter;

				var oTableComm = this.getView().byId("COMMESSE_CONTENTS");
				var oTableExp = this.getView().byId("SPESE_CONTENTS");
				//var oTreeTable =  this.getView().byId("TREETABLE_CONTENTS");

				var oTableCommBinding = oTableComm.getBinding("items");
				var oTableExpBinding = oTableExp.getBinding("items");
				//var oTreeTableBinding = oTreeTable.getBinding("rows");
				//var iSelCount = oEvent.getSource().getSelectedDates().length;
				var oSelectedDate;
				var aFilters = [];
				var aSelectedDates = oEvent.getSource().getSelectedDates();
				if (aSelectedDates.length > 0) { // If the number of selected days is greater than 1 the filtering logic should be reviewed

					if (this.count == undefined) {
						oTableCommBinding.aAllKeys = oTableCommBinding.aKeys;
						oTableExpBinding.aAllKeys = oTableExpBinding.aKeys;
					}
					this.count = 1;

					for (var i = 0; i < aSelectedDates.length; i++) {

						oSelectedDate = oEvent.getSource().getSelectedDates()[i].getStartDate();
						//MP: Client side filtering. Per il momento non applicato alla treeTable
						sDate = formatter.formatCalDate(oSelectedDate.toString());
						sDayFilter = sDate.substring(0, sDate.indexOf("/"));
						oFilter = new sap.ui.model.Filter("Giorno", sap.ui.model.FilterOperator.EQ, sDayFilter);
						aFilters.push(oFilter);
						//oTreeFilter = new sap.ui.model.Filter("Giorno", sap.ui.model.FilterOperator.EQ, sDayFilter);
					}
					oTableCommBinding.filter(aFilters);
					oTableExpBinding.filter(aFilters);
					//oTreeTableBinding.filter(oTreeFilter);
				} else {
					//oTableCommBinding.filter();
					//oTableExpBinding.filter();
					//oTreeTableBinding.filter();

					//(SE)	
					this.handleRemoveSelection();
					//

				}

				//MP: il frammento di codice seguente dovrebbe essere utilizzato per abilitare il bottone solo quando si seleziona una data
				// e si possono ancora inserire delle ore (meno di 8 ore inserite per un giorno)
				var oButton = this.getView().byId("btn1");
				var oCopyButton = this.getView().byId("copyBtn");
				var oCal = oEvent.getSource();
				var oSelectedDate;
				var sSelectedDate;
				var aSpecialDates;
				var oSpecialDate;
				var bFind = false;
				var count = 0;
				var flag = 0; //flag per controllare la logica
				aSpecialDates = oCal.getSpecialDates(); //date che hanno già inserimenti
				if (oButton.getEnabled() == true) {
					if (oCal.getSelectedDates().length == 0) {
						oButton.setEnabled(false);
						oCopyButton.setEnabled(false);
					} else {
						for (var z = 0; z < oCal.getSelectedDates().length; z++) {
							oSelectedDate = oCal.getSelectedDates()[z].getStartDate();
							sSelectedDate = oSelectedDate.toString();
							for (var j = 0; j < oCal.getSelectedDates().length; j++) {
								for (var k = 0; k < aSpecialDates.length; k++) {
									oSpecialDate = oCal.getSpecialDates()[k];
									if (oSpecialDate.getStartDate().toString() == sSelectedDate) {
										flag = 1;
										bFind = true;
										oCopyButton.setEnabled(true);
										if (oSpecialDate.getProperty("type") == "Type07" || oSpecialDate.getProperty("type") == "Type01") {
											oButton.setEnabled(false);
											count++;
										} else if (oSpecialDate.getProperty("type") == "Type03") {
											oButton.setEnabled(true);
										} else {
											oCopyButton.setEnabled(false);
										}
									}

									if (bFind == false) {
										oCopyButton.setEnabled(false);
									}
									if (count > 0) {
										oButton.setEnabled(false);
									}

								}
							}
						}
						if (bFind == true && oCal.getSelectedDates().length > 1) {
							oCopyButton.setEnabled(false);
						}
					}
				} else {

					if (oCal.getSelectedDates().length == 0) {
						oButton.setEnabled(false);
						oCopyButton.setEnabled(false);
					} else {
						for (var z = 0; z < oCal.getSelectedDates().length; z++) {
							oSelectedDate = oCal.getSelectedDates()[z].getStartDate();
							sSelectedDate = oSelectedDate.toString();
							for (var i = 0; i < aSpecialDates.length; i++) {
								oSpecialDate = oCal.getSpecialDates()[i];
								if (oSpecialDate.getStartDate().toString() == sSelectedDate) {
									flag = 1;

									bFind = true;
									oCopyButton.setEnabled(true);
									if (oSpecialDate.getProperty("type") == "Type07" || oSpecialDate.getProperty("type") == "Type01") {
										count++;
										oButton.setEnabled(false);
									} else if (oSpecialDate.getProperty("type") == "Type03") {
										oButton.setEnabled(true);
									} else {
										oCopyButton.setEnabled(false);
									}
									//Controllare meglio la logica per il bottone
								}

								if (bFind == false) {
									oCopyButton.setEnabled(false);
								}
							}
							if (flag == 0 && sSelectedDate != undefined) {
								oButton.setEnabled(true);
							}
						}
					}

					if (bFind == true && oCal.getSelectedDates().length > 1) {
						oCopyButton.setEnabled(false);
					}

					if (count > 0) {
						oButton.setEnabled(false);
					}
				}

				//CHECK GIORNI NON LAVORATIVI///////////////////////////////
				/*	var aSelectedDates = oCal.getSelectedDates();
					if (aSelectedDates.length > 0) {

						for (var i = 0; i < aSelectedDates.length; i++) {

							var oDate = aSelectedDates[i].getStartDate();

							var oDayOfWeek = this.oFormatDaysShort.format(oDate);

							if (oDayOfWeek === "sab" || oDayOfWeek === "sat" || oDayOfWeek === "dom" || oDayOfWeek === "sun") {
								//if(oDate === sap.ui.unified.CalendarDayType.NonWorking) {
								//jQuery.sap.require("sap.m.MessageBox");
								sap.m.MessageBox.show(
									"Attenzione: Non è possibile selezionare giorni non lavorativi, rimuovere la selezione, " + oDate, {
										icon: sap.m.MessageBox.Icon.WARNING,
										title: "Error",
										actions: [sap.m.MessageBox.Action.CLOSE]

									});

								oCal.removeAllSelectedDates();
								oButton.setEnabled(false);
								oTableCommBinding.filter(); // per ripristinare la condizione di partenza
								oTableExpBinding.filter();
								return;
							}
						}

					}*/

			},

			handleCopyCalendarSelect: function(oEvent) {
				var oCal = oEvent.getSource();
				this.aSelectedDates = oCal.getSelectedDates();
			},

			handleRemoveSelection: function(oEvent) {
				this.getView().byId("LRS4_DAT_CALENDAR").removeAllSelectedDates();
				this.getView().byId("COMMESSE_CONTENTS").getBinding("items").filter();
				this.getView().byId("SPESE_CONTENTS").getBinding("items").filter();
				this.getView().byId("TREETABLE_CONTENTS").getBinding("rows").filter();
				this.count = undefined;
				this.byId("btn1").setEnabled(false);
				this.byId("copyBtn").setEnabled(false);
				//	this._clearModel();
			},

			openCalendar: function(oEvent) {
                var sDay, sMonth, sYear;
				var that = this;
				if (!this._oPopoverCopy) {
					this._oPopoverCopy = sap.ui.xmlfragment("ZETMS_CREATE.view.CopyOfDayPopover", this, "ZETMS_CREATE.controller.View1");
					this.getView().addDependent(this._oPopoverCopy);
				}

				this._oPopoverCopy.openBy(oEvent.getSource());

				var oCal = sap.ui.getCore().byId("CALE_ID");

				oCal.displayDate(this.startDate);
				this._onBindingCalendar();
				
				var oOriginalCal = this.getView().byId("LRS4_DAT_CALENDAR");
				var oSelectedDate = oOriginalCal.getSelectedDates()[0].getStartDate();
				
				sDay = oSelectedDate.getDate().toString();
				sMonth = (oSelectedDate.getMonth() + 1).toString();
				sYear = oSelectedDate.getFullYear().toString();
				
				if(sDay.length == 1){
					sDay = "0" + sDay;
				}
				
				if(sMonth.length == 1){
					sMonth = "0" + sMonth;
				}
				
				var sTitle = sDay + "/" + sMonth + "/" + sYear;
				
				this._oPopoverCopy.setTitle("Copia commesse del " + sTitle);
 
			},

			closePopover: function(oEvent) {

				this._oPopoverCopy.close();

			},

			handleDayCopy: function(oEvent) {

				var that = this;
				var oCal = this.getView().byId("LRS4_DAT_CALENDAR");
				var startDate = oCal.getStartDate();
				var oCopyCal = sap.ui.getCore().byId("CALE_ID");
				var aSelectedDates = this.aSelectedDates;
				var sSelectedMonth;
				var sSelectedYear;
				var oStartDate;
				var sDay;
				var startMonth = this.oFormatMonth.format(startDate);
				var oUrlCopyParams;
				var iControl = 0; // variabile di controllo per la visualizzazione del messaggio di successo

				var bFlag = false; // variabile di controllo per la gestione dell'alert per le commesse di tipo "PERMESSO", "FERIE" o "ROL"
				var sTimesheetKey; // per gestire la copia su mesi diveri da quello corrente

				if (startMonth.length === 1) {

					startMonth = "0" + startMonth;
				}

				var startYear = this.oFormatYear.format(startDate);
				var startDay = oCal.getSelectedDates()[0].getStartDate().getDate().toString();
				if (startDay.length == 1) {
					startDay = "0" + startDay;
				}

				//Lettura delle commesse nel giorno selezionato

				var oModel = this.getView().getModel();
				var sRead = "/ListaCommesseGroupSet";
				oModel.read(sRead, {
					//filters: oFilter,

					filters: [new sap.ui.model.Filter({

						filters: [new sap.ui.model.Filter({
								path: "Calmonth",
								operator: sap.ui.model.FilterOperator.EQ,
								value1: startMonth

							}), new sap.ui.model.Filter({
								path: "Giorno",
								operator: sap.ui.model.FilterOperator.EQ,
								value1: startDay

							}),
							new sap.ui.model.Filter({
								path: "Calyear",
								operator: sap.ui.model.FilterOperator.EQ,
								value1: startYear
							})
						],

						and: true

					})],

					success: fnReadS,

					error: fnReadE
				});

				function fnReadS(oData, response) {
					//	console.log(oData);
					//	console.log(response);
					// controllo che la funzione è andata a buon fine 
					if (response.statusCode == "200") { //Se lettura delle commesse in un giorno va a buon fine allora vado a copiare le commesse nei giorni selezionati
						for (var i = 0; i < aSelectedDates.length; i++) {
							oStartDate = aSelectedDates[i].getStartDate();
							sSelectedMonth = that.oFormatMonth.format(oStartDate);
							if (sSelectedMonth.length === 1) {
								sSelectedMonth = "0" + sSelectedMonth;
							}
							sSelectedYear = that.oFormatYear.format(oStartDate);
							sDay = oStartDate.getDate().toString();
							if (sDay.length == 1) {
								sDay = "0" + sDay;
							}

							for (var j = 0; j < oData.results.length; j++) {

								if (oData.results[j].Orderjob == "EON16A" ||
									oData.results[j].Orderjob == "EON16B" ||
									oData.results[j].Orderjob == "EON166") {

									if (!bFlag) {
										sap.m.MessageBox.show(
											'Attenzione: nel giorno selezionato sono contenuti degli inserimenti  di tipo "ferie", ' +
											'"permesso" o "ROL". Le commesse di questo tipo non sono state copiate', {
												icon: sap.m.MessageBox.Icon.WARNING,
												title: "Messaggio di avvertimento",
												actions: [sap.m.MessageBox.Action.CLOSE]

											});
										bFlag = true;
									}

								}

								if (oData.results[j].Orderjob != "EON16A" &&
									oData.results[j].Orderjob != "EON16B" &&
									oData.results[j].Orderjob != "EON166") {

									if (sSelectedMonth == startMonth) {
										sTimesheetKey = oData.results[j].Tmskey;
									} else {
										sTimesheetKey = undefined;
									}

									oUrlCopyParams = {
										Tmskey: sTimesheetKey,
										Orderjob: oData.results[j].Orderjob,
										Descr: oData.results[j].Descr,
										Office: oData.results[j].Office,
										Tipo: "commessa",
										Calmonth: sSelectedMonth,
										Calyear: sSelectedYear,
										Giorno: sDay,
										Ore: oData.results[j].Ore
									};

									oUrlCopyParams.FromCommToExp = [];
									oModel.setUseBatch(false);
									oModel.create('/ListaCommesseGroupSet', oUrlCopyParams, {
										method: "POST",
										success: fnS,

										error: fnE
									});

									function fnS(oData, response) {
										//	console.log(oData);
										//	console.log(response);

										// controllo che la funzione è andata a buon fine recuperando il risultato della function sap
										//	if (oData.Type == "S") {
										if (response.statusCode == "201") {

											iControl++;

											if (iControl == aSelectedDates.length) {
												var msg;

												msg = "Commesse copiate con successo";

												sap.m.MessageToast.show(msg, {
													duration: 5000,
													autoClose: true,
													closeOnBrowserNavigation: false

												});

												that._onBindingChange();
												that._onBindingCalendar();
												that.closePopover();
												iControl = 0;
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

									function fnE(oError, oData) {
										//	console.log(oError);

										alert("Error in read: " + oError.message + "\n" + oError.responseText);
									}

								}

							}

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

				function fnReadE(oError) {
					//	console.log(oError);

					alert("Error in read: " + oError.message);
				}

			},

			//MP: function per aprire il dialog con il form per l'inserimento dei dati di una commessa e la visualizzazione di una esistente
			openDialog: function(oEvent) {

				var that = this;
				this.sButtonKey = undefined; //mi salvo il valore chiave del bottone per la gestione dei conflitti in actionTask
				if (!that.Dialog) {

					that.Dialog = sap.ui.xmlfragment("ZETMS_CREATE.view.Dialog", this, "ZETMS_CREATE.controller.View1");

					//to get access to the global model
					this.getView().addDependent(that.Dialog);
					if (sap.ui.Device.system.phone) {
						that.Dialog.setStretch(true);
					}
				}
				that.Dialog.open();

				/////// giorni multipli

				  var aDatesList = [];
					var oDate;
					var oDateTxt = "";
					var oComma = "";
				 var aSelectedDates = this.cale.getSelectedDates();
				
					if (aSelectedDates.length > 0) {
								for (var i = 0; i < aSelectedDates.length; i++) {
									oDate = aSelectedDates[i].getStartDate();
									oDate = formatter.formatCalDate(oDate.toString());
							//		oDate = this.oFormatYyyymmdd.format(oDate);
							//		oDate = formatter.formatDate(oDate);
							//		oDate = formatter.formatDate(oDate);
									//oDataSel.selectedDates.push({Date:oDate});
										if (oDateTxt !== "") {
										oComma = ", ";
										}
									aDatesList.push(oDate);
									oDateTxt = oDateTxt + oComma + oDate;
								  }
								}	
            //////// giorni multipli
               this.DateTxt = 	oDateTxt;
               this.DatesList = aDatesList;
			//	this.formattedDate = formatter.formatCalDate(this.selectedDate.toString());
			//	that.Dialog.setTitle("Inserire dettaglio per il giorno " + this.formattedDate);
		    	that.Dialog.setTitle("Inserire dettaglio per il giorno " + 	this.DateTxt);
                //sap.ui.getCore().byId("dettaglio").setText("Inserire dettaglio per il giorno " + this.DateTxt);

				sap.ui.getCore().byId("sedi").setSelectedKey(""); //setting della chiave del sap.m.Select a ""

			},

			closeDialog: function() {
				this.Dialog.close();
				sap.ui.getCore().byId("commessa").setValue("");
				sap.ui.getCore().byId("commessa").setValueState("None");
				//sap.ui.getCore().byId("sedi").setEnabled(false);
				sap.ui.getCore().byId("sedi").unbindItems();
				sap.ui.getCore().byId("sedi").setValueState("None");
				sap.ui.getCore().byId("ore").setValue("");
				sap.ui.getCore().byId("ore").setValueState("None");
				sap.ui.getCore().byId("descrizione").setValue("");
				sap.ui.getCore().byId("descrizione").setValueState("None");
				sap.ui.getCore().byId("tabellaSpese").removeSelections();
				sap.ui.getCore().byId("panelSpese").setExpanded(false);
				sap.ui.getCore().byId("multidaySel").setVisible(false);
				sap.ui.getCore().byId("multidaySel").setEnabled(false);
				sap.ui.getCore().byId("label_multidaySel").setVisible(false);
				//this.byId("LRS4_DAT_CALENDAR").removeAllSelectedDates();
				this.onExpenseSelect(undefined);
				this.getView().removeDependent(this.Dialog);

				//MP: per gestire refresh
				//this._onBindingChange();
				//this.byId("LRS4_DAT_CALENDAR").rerender();

			},

			//MP: funzione che richiama il fragment contenente l'albero
			showPopoverCommessa: function(oEvent) {

				var that = this;

				if (!that._oPopover) {

					that._oPopover = sap.ui.xmlfragment("ZETMS_CREATE.view.Popover", this, "ZETMS_CREATE.controller.View1");
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
					oTree.bindAggregation("items", {
						path: "/CommessaCollection",
						template: oTemplate,
						parameters: {
							numberOfExpandedLevels: 1
						}
					});

					var oInput = sap.ui.getCore().byId("commessa");
					this._oPopover.openBy(oButton);
				});

			},

			//MP: funzione richiamata alla selezione di una commessa
			onCommessaSelect: function(oEvent) {
				this.sTimesheetKey = undefined;
				sap.ui.getCore().byId("ore").setValue("");
				sap.ui.getCore().byId("descrizione").setValue("");
				var sIcon = oEvent.getSource().getSelectedItem().getProperty("icon");
				var oTree = sap.ui.getCore().byId("Tree");
				// MP: non permette di selezionare i nodi radice ma solo quelli foglia, le commesse
				if (sIcon !== "sap-icon://folder-full" && sIcon !== "sap-icon://folder-blank") {

					var sCommessa = oEvent.getSource().getSelectedItem().getProperty("title");
					this.sCommessaId = sCommessa.substring(0, sCommessa.indexOf("-") - 1);
					sap.ui.getCore().byId("sedi").setEnabled(true);
					this.sCommessaName = sCommessa.substring(sCommessa.indexOf("-") + 2, sCommessa.length);
					sap.ui.getCore().byId("commessa").setValue(this.sCommessaName);
					sap.ui.getCore().byId("commessa").setValueState("None");
					this._oPopover.close();
					////// le sedi sono diverse dipendentemente dal cliente
					this.callSediSet(this.sCommessaId);
					//////

				} else {
					oTree.removeSelections();
				}
				
					//disabilito checkbox per selezione commessa multi day
			sap.ui.getCore().byId("multidaySel").setVisible(false);
			sap.ui.getCore().byId("multidaySel").setEnabled(false);
			sap.ui.getCore().byId("label_multidaySel").setVisible(false);

			},

			handleTableSelectDialogPress: function(oEvent) {

				//	var that = this;

				if (!this._oDialogSelComm) {

					this._oDialogSelComm = sap.ui.xmlfragment("ZETMS_CREATE.view.DialogTableSel", this, "ZETMS_CREATE.controller.View1");
				}

				// Multi-select if required
				//var bMultiSelect = !!oEvent.getSource().data("multi");
				//	this._oDialog.setMultiSelect(bMultiSelect);

				// Remember selections if required
				//	var bRemember = !!oEvent.getSource().data("remember");
				//	this._oDialog.setRememberSelections(bRemember);

				this.getView().addDependent(this._oDialogSelComm);
				var oModel = this.getView().getModel();

				var oTableCommEx = sap.ui.getCore().byId("tableCommEx"); //tabella per commesse già inserite

				oTableCommEx.setModel(oModel);

				var oTemplate = new sap.m.ColumnListItem({
					cells: [
                        new sap.m.Text({
							text: "{Tmskey}",
							wrapping: false
						}),
						
						 new sap.m.Text({
							text: "{Orderjob}",
							wrapping: false
						
						}),
						
						new sap.m.ObjectIdentifier({
							title: "{Descrorder}",
							wrapping: false
						}),

						new sap.m.Text({
							text: "{Descr}"
						}),

						new sap.m.Text({
							text: "{Office}"
						})
					]
				});

				var startDate = this.cale.getStartDate();
				var startMonth = this.oFormatMonth.format(startDate);
				if (startMonth.length === 1) {

					startMonth = "0" + startMonth;
				}

				var startYear = this.oFormatYear.format(startDate);

				//	var sDate = this.formattedDate;
				////	var	sDate = this.DatesList[0];
				//	var sMonth = sDate.substring(sDate.indexOf("/") + 1, sDate.indexOf("/") + 3);
				//	var sYear = sDate.substring(sDate.indexOf("/", 3) + 1, sDate.length);

				var fMonth = new sap.ui.model.odata.Filter('Calmonth', [{
					operator: "EQ",
					value1: startMonth
				}]);
				var fYear = new sap.ui.model.odata.Filter('Calyear', [{
					operator: "EQ",
					value1: startYear
				}]);
				var fFlag = new sap.ui.model.odata.Filter('Parentid', [{
					operator: "EQ",
					value1: "X"
				}]);

				oTableCommEx.bindItems({

					path: "/ListaCommesseGroupSet",

					template: oTemplate,
					filters: [fMonth, fYear, fFlag],
				});
                
                oTableCommEx._oSearchField.setVisible(false);
				var oBindingEx = oTableCommEx.getBinding("items");

				oBindingEx.attachDataReceived(function(oEvent) { //l'operationMode.Client viene impostato solo dopo che i dati sono stati ricevuti dal Back-end
					var oSource = oEvent.getSource();
					oSource.bClientOperation = true;
					oSource.sOperationMode = "Client"; //operationMode = Client

				});

				// toggle compact style
				jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialog);
				this._oDialogSelComm.open();
			},

			// funzione search non implementata al momento
			handleSearch: function(oEvent) {
				var sValue = oEvent.getParameter("value");
				var oBinding = oEvent.getSource().getBinding("items");
				oEvent.getSource().getBindingContext();
				if (sValue != "") {
					var oFilter = new Filter("Descrorder", sap.ui.model.FilterOperator.Contains, sValue);
					if (oBinding.aAllKeys == null) {
						oBinding.aAllKeys = oBinding.aKeys;
					}
					oBinding.filter(oFilter);
				} else {
					oBinding.filter();
				}
			},
            
            
            handleCBoxMultiDay: function(oEvent) {
            	
         // var chk = sap.ui.getCore().byId("multidaySel").getSelected();
               var chk = sap.ui.getCore().byId("multidaySel").getState();
	           if 	( !chk ) {
	            	this.sTimesheetKey = undefined;
					sap.ui.getCore().byId("ore").setValue("");
					sap.ui.getCore().byId("descrizione").setValue("");
	
						this.sCommessaId = this.sOrderjob;
						sap.ui.getCore().byId("sedi").setEnabled(true);
						
						//sap.ui.getCore().byId("commessa").setValue(this.sCommessaName);
						sap.ui.getCore().byId("commessa").setValueState("None");
					
						////// le sedi sono diverse dipendentemente dal cliente
						this.callSediSet(this.sCommessaId);
						
					//	sap.ui.getCore().byId("multidaySel").setEditable(false);
						sap.ui.getCore().byId("multidaySel").setEnabled(false);
	           }
            },
            
			handleClose: function(oEvent) {
				var aContexts = oEvent.getParameter("selectedContexts");
				var oInput = sap.ui.getCore().byId("commessa");
				var oSede = sap.ui.getCore().byId("sedi");
				var oDescr = sap.ui.getCore().byId("descrizione");
				

				oSede.setForceSelection(true);

				if (aContexts && aContexts.length) {

					oInput.setValue(aContexts.map(function(oContext) {
						return oContext.getObject().Descrorder;
					}));

					var mSede = {
						sede: [{
							Office: aContexts.map(function(oContext) {
								return oContext.getObject().Office;
							})
						}]
					};

					var oModel = new sap.ui.model.json.JSONModel();
					oModel.setData(mSede);
					sap.ui.getCore().setModel(oModel, "sede");
					oSede.setModel(sap.ui.getCore().getModel("sede"));

					var oTemplate = new sap.ui.core.Item({
						key: "{Office}",
						text: "{Office}"
					});
					oSede.bindAggregation("items", {
						path: "/sede",
						template: oTemplate
					});
					oSede.setSelectedItem(aContexts.map(function(oContext) {
						return oContext.getObject().Office;
					}));
					oSede.setValue(aContexts.map(function(oContext) {
						return oContext.getObject().Office;
					}));
					oDescr.setValue(aContexts.map(function(oContext) {
						return oContext.getObject().Descr;
					}));
					this.sTimesheetKey = aContexts.map(function(oContext) {
						return oContext.getObject().Tmskey;
					})[0];
					
					this.sOrderjob = aContexts.map(function(oContext) {
						return oContext.getObject().Orderjob;
					})[0];
				}
				oEvent.getSource().getBinding("items").filter([]);
				
			//abilito checkbox per selezione commessa multi day
			sap.ui.getCore().byId("multidaySel").setVisible(true);
			sap.ui.getCore().byId("multidaySel").setEnabled(true);
		//	sap.ui.getCore().byId("multidaySel").setSelected(true);
			sap.ui.getCore().byId("multidaySel").setState(true);
		//	sap.ui.getCore().byId("multidaySel").setEditable(true);
			sap.ui.getCore().byId("label_multidaySel").setVisible(true);
			},

			callSediSet: function(sCommessa) {
				var oModel = this.getView().getModel();

				var sReadURI = oModel.sServiceUrl + "/SediSet/?$format=json&$filter=Commessa eq'" + sCommessa + "'";

				oModel._request({

						requestUri: sReadURI,
						method: "GET",
						headers: {
							"X-Requested-With": 'XMLHttpRequest',
							"Content-Type": 'application/atom+xml',
							"DataServiceVersion": "2.0"
						}
					},
					function(data, response) {
						var oSelect = sap.ui.getCore().byId("sedi");
						oSelect.destroyItems();
						oSelect.removeAllItems();
						aSediResult = data.results;
						var oJsonModel = new sap.ui.model.json.JSONModel();
						oJsonModel.setData(data);
						sap.ui.getCore().setModel(oJsonModel, "results");
						oSelect.setModel(sap.ui.getCore().getModel("results"));
						var oTemplate = new sap.ui.core.Item({
							key: "{Office}",
							text: "{Office}"
						});

						oSelect.bindAggregation("items", {
							path: "/results",
							template: oTemplate
						});
						oSelect.setForceSelection(false);
						oSelect.setSelectedKey("");
					});
			},

			handleSelectChange: function(oEvent) {
				var oSelect = oEvent.getSource();
				var oSelectedKey = oSelect.getSelectedKey();

				if (oSelectedKey != "") {
					oSelect.setValueStateText("");
					oSelect.setValueState("None");

				}

			},

			onExpenseSelect: function(oEvent) {
				var oTable;
				if (oEvent == undefined || oEvent.getSource().getId() == "Modificaa" || oEvent.getSource().getId() == "Indietro") {
					if (oEvent == undefined) {
						oTable = sap.ui.getCore().byId("tabellaSpese");
					} else {
						oTable = sap.ui.getCore().byId("tabellaSpeseSel");
					}
				} else {
					oTable = oEvent.getSource();
				}
				var aItems = oTable.getAggregation("items");
				var oItem;
				var oInputDescr;
				var oInputImp;
				for (var i = 0; i < aItems.length; i++) {
					oItem = aItems[i];
					oInputDescr = oItem.getAggregation("cells")[1];
					oInputImp = oItem.getAggregation("cells")[2];
					if (oItem.getSelected() == true) {
						//MP: per settare i campi in input per la desrizione e l'importo modificabili
						oInputDescr.setEnabled(true);
						oInputImp.setEnabled(true);
					} else {
						oInputDescr.setEnabled(false);
						oInputDescr.setValue("");
						oInputDescr.setValueState("None");
						oInputImp.setEnabled(false);
						oInputImp.setValue("");
						oInputImp.setValueState("None");
					}

				}
			},

			openMessageDialog: function(oEvent) {
				var that;

				var sButtonName = oEvent.getSource().getId() + "a";
				that = this;
				var dialog = new Dialog({
					title: 'Attenzione',
					type: 'Message',
					state: 'Warning',
					content: new sap.m.Text({
						text: "Sei sicuro di voler confermare l'azione?"
					}),
					beginButton: new sap.m.Button(sButtonName, {
						text: 'Conferma',
						type: 'Accept',
						press: function() {
							dialog.close();
							that.onConfirmation(oEvent);
						}
					}),
					endButton: new sap.m.Button({
						text: 'Annulla',
						type: 'Reject',
						press: function() {
							dialog.close();
						}
					}),
					afterClose: function() {
						dialog.destroy();
					}
				});

				dialog.open();

			},

			//MP function per salvare riga timesheet
			onConfirmation: function(oEvent) {
				//check per completezza dati inseriti
				this.oEvent = oEvent;
				var aControls = [];
				var aParam = [];
				var oInput;
				var sValue;
				var that = this;

				this.buttonEvent = oEvent.getSource().getId();

				if (this.buttonEvent !== "Modificaa") {
					aControls.push(sap.ui.getCore().byId("commessa"), sap.ui.getCore().byId("ore"), sap.ui.getCore().byId("descrizione"), sap.ui.getCore()
						.byId("sedi"));
				} else {
					aParam.push(sap.ui.getCore().byId("commessaSelDel").getText());
					aParam.push("dummy"); //MP: controllo sulla sede non viene eseguito; creo una Entry dummy.
					aControls.push(sap.ui.getCore().byId("oreSel"), sap.ui.getCore().byId("descrizioneSel"));
					for (var k = 0; k < aControls.length; k++) {
						oInput = aControls[k];
						if (oInput.getValue() === "" || oInput.getValueState() == "Error") {
							oInput.setValueState("Error");
							oInput.setValueStateText("il campo non è valorizzato oppure il valore è errato.");
						} else {
							aParam.push(oInput.getValue());
						}
					}
				}

				if (this.buttonEvent !== "Modificaa") {
					for (var i = 0; i < aControls.length; i++) {
						oInput = aControls[i];
						if (oInput.getId() == "sedi") { //caso sap.m.select (sedi)
							sValue = oInput.getSelectedKey();
						} else { //caso sap.m.Input
							sValue = oInput.getValue();
						}
						if (sValue === "" || oInput.getValueState() == "Error") {
							oInput.setValueState("Error");
							oInput.setValueStateText("il campo non è valorizzato oppure il valore è errato.");
						} else {
							aParam.push(sValue);
						}
					}
				}

				var sOffice, sCommessaId, sOre,
					sChilometri, sDescrizione,
					sDay, sMonth, sYear, sKmDesc, sTimesheetKey;

				var aDate = [];
				var oExpenseTable;

				//MP: la chiamata viene eseguita solo se tutti i campi obbligatori sono valorizzati, 
				//altrimenti viene richiesto di inserire dei valori
				if (aParam.length === 4) {
					this.getView().byId("btn1").setEnabled(false);


					///(SE) start giorni multipli

					var datesListLenght = this.DatesList.length;
					for (var y = 0; y < this.DatesList.length; y++) {
						aDate = this.DatesList[y];
						///

						if (this.buttonEvent === "Modificaa") {
							sOffice = sap.ui.getCore().byId("sedeSel").getText();
							sOre = sap.ui.getCore().byId("oreSel").getValue();
							sDescrizione = sap.ui.getCore().byId("descrizioneSel").getValue();
							sTimesheetKey = this._DialogSel.getBindingContext().getProperty("Tmskey");
							sDay = this.sDay;
							sMonth = this.sMonth;
							sYear = this.sYear;
							sChilometri = sap.ui.getCore().byId("chilometriSel").getValue();
							sKmDesc = sap.ui.getCore().byId("descrizioneKmSel").getValue();
							oExpenseTable = sap.ui.getCore().byId("tabellaSpeseSel");
							this.sOraOriginale = sOre;
							this.sDescrOriginale = sDescrizione;
						} else {
							sCommessaId = this.sCommessaId;
							sTimesheetKey = this.sTimesheetKey;
							sOffice = sap.ui.getCore().byId("sedi").getSelectedItem().getText();
							sOre = sap.ui.getCore().byId("ore").getValue();
							sDescrizione = sap.ui.getCore().byId("descrizione").getValue();
							//	aDate = this.formattedDate.split("/");
							aDate = aDate.split("/");
							sDay = aDate[0];
							sMonth = aDate[1];
							sYear = aDate[2];
							sChilometri = sap.ui.getCore().byId("chilometri").getValue();
							sKmDesc = sap.ui.getCore().byId("descrizioneKm").getValue();
							oExpenseTable = sap.ui.getCore().byId("tabellaSpese");
						}

						//var oView = this.getView();
						var oModel = this.getView().getModel();
						//oModel.setUseBatch(false);
						var oUrlParams = {
							Tmskey: sTimesheetKey,
							Orderjob: sCommessaId,
							Descr: sDescrizione,
							Office: sOffice,
							Tipo: "commessa",
							Calmonth: sMonth,
							Calyear: sYear,
							Giorno: sDay,
							Ore: sOre
						};

						oUrlParams.FromCommToExp = [];

						// passo eventuale riga km
						if (sChilometri > 0) {
							oUrlParams.FromCommToExp.push({
								Exptype: "00",
								Expdescr: sKmDesc,
								Km: sChilometri,
								Tipo: "km",
								Calmonth: sMonth,
								Calyear: sYear,
								Giorno: sDay
							});
						}

						// passo eventuale righe spese

						var aItem = oExpenseTable.getAggregation("items");
						var sExpType, sExpDesc, sExpImp;
						for (var j = 1; j < aItem.length; j++) {
							var oItem = aItem[j];
							if (oItem.getSelected()) {
								sExpType = oItem.getAggregation("cells")[0].getTitle().substring(0, 2);
								sExpDesc = oItem.getAggregation("cells")[1].getValue();
								sExpImp = oItem.getAggregation("cells")[2].getValue();

								oUrlParams.FromCommToExp.push({
									Exptype: sExpType,
									Expdescr: sExpDesc,
									Importo: sExpImp,
									Tipo: "spesa",
									Calmonth: sMonth,
									Calyear: sYear,
									Giorno: sDay
								});
							}
						}

						if (this.buttonEvent != "Modificaa") {
							that.onExpenseSelect(undefined);
						} else {
							that.closeDialogSel(oEvent);
						}

						//		}
						//	this.oModel.setData(oData);
						//	} else {
						//	this._clearModel();
						//	}

						//    var oReqInsert = this._reqInsert(oUrlParams, y);     
						//jQuery.sap.require("sap.ui.commons.MessageBox");
						//	oModel.create('/ListaCommesseGroupSet', oUrlParams, {

						//	oModel.setUseBatch(true);
						//	oModel.create('/ListaCommesseGroupSet', oUrlParams, {changeSetId: y}, {

						if (this.DatesList.length > 1) {

							oModel.create('/ListaCommesseGroupSet', oUrlParams, {
								method: "POST",
								changeSetId: y,
								error: fnE

							});

						} else {
							oModel.create('/ListaCommesseGroupSet', oUrlParams, {
								method: "POST",

								success: fnS,

								error: fnE
							});

						}

					} // fine loop giorni multipli

				} else {
					this.getView().byId("btn1").setEnabled(true);
					//jQuery.sap.require("sap.m.MessageBox");
					sap.m.MessageBox.show(
						"Errore: controllare gli inserimenti", {
							icon: sap.m.MessageBox.Icon.WARNING,
							title: "Errore",
							actions: [sap.m.MessageBox.Action.CLOSE]
						});

				}


				if (this.DatesList.length > 1) {

					var msg;
					if (that.buttonEvent !== "Modificaa") {
						msg = "Commesse create con successo";
					} else {
						msg = "Commesse modificate con successo";
					}
					sap.m.MessageToast.show(msg, {
						duration: 5000,
						autoClose: true,
						closeOnBrowserNavigation: false

					});

					if (that.buttonEvent !== "Modificaa") {
						that._onBindingChange();
						that.closeDialog();
					} else {
						that._onBindingChange();
						that.DialogSel.close();
						sap.ui.getCore().byId("tabellaSpeseSel").removeSelections();
						sap.ui.getCore().byId("panelSpeseSel").setExpanded(false);
						that.getView().byId("COMMESSE_CONTENTS").getBinding("items").refresh();
						that.getView().byId("SPESE_CONTENTS").getBinding("items").refresh();
						that.getView().byId("TREETABLE_CONTENTS").getBinding("rows").refresh();

					}
				}

				function fnS(oData, response) {
					//	console.log(oData);
					//	console.log(response);

					// controllo che la funzione è andata a buon fine recuperando il risultato della function sap
					//	if (oData.Type == "S") {
					if (response.statusCode === "201") {

						//	var msg = "Success: "+oData.Message+", "+sTypeAction;
						//var msg = "Richiesta " + sAction + " con successo.\nID: " + formatter.formatRequestId(oData.ZrequestId) + "";
						var msg;
						if (that.buttonEvent !== "Modificaa") {
							msg = "Commessa creata con successo";
						} else {
							msg = "Commessa modificata con successo";
						}
						sap.m.MessageToast.show(msg, {
							duration: 5000,
							autoClose: true,
							closeOnBrowserNavigation: false

						});

						if (that.buttonEvent !== "Modificaa") {
							that._onBindingChange();
							that.closeDialog();
						} else {
							that._onBindingChange();
							that.DialogSel.close();
							sap.ui.getCore().byId("tabellaSpeseSel").removeSelections();
							sap.ui.getCore().byId("panelSpeseSel").setExpanded(false);
							that.getView().byId("COMMESSE_CONTENTS").getBinding("items").refresh();
							that.getView().byId("SPESE_CONTENTS").getBinding("items").refresh();
							that.getView().byId("TREETABLE_CONTENTS").getBinding("rows").refresh();

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

			/*_reqInsert: function(oUrlParams, y) {
	         var oModel = this.getView().getModel();
             //     oModel.setUseBatch(true);
           
		    
					oModel.create('/ListaCommesseGroupSet', oUrlParams, {changeSetId: y}, {
						method: "POST",
						success: fnS,

						error: fnE
					});
					
					
             },	
             */
			//MP: metodi per la gestione della modifica e cancellazione di righe del timesheet

			////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////7			
			onExpenseModify: function(oEvent) {
				var oDescrizione = sap.ui.getCore().byId("descrSpesa");
				var oImpOrKm = sap.ui.getCore().byId("ImpOrKm");
				var oExpenseTable = sap.ui.getCore().byId("speseCommessa");

				// Per disabilitare e abilitare i bottoni di eliminazione e modifica commessa
				var oDeleteButton = sap.ui.getCore().byId("EliminaSel");
				var oModifyButton = sap.ui.getCore().byId("Modifica");
				if (oDeleteButton.getEnabled() == true && oModifyButton.getEnabled() == true) {
					oDeleteButton.setEnabled(false);
					oModifyButton.setEnabled(false);
				} else {
					oDeleteButton.setEnabled(true);
					oModifyButton.setEnabled(true);
					oExpenseTable.getBinding("items").refresh(true);
					oExpenseTable.getBinding("items").resume();
				}
				//

				var aCells = oEvent.getSource().getParent().getParent().getAggregation("cells");
				var oInput, oModel;
				var oSaveButton = aCells[3].getAggregation("content")[1];
				oSaveButton.setEnabled(true);
				oModel = this.getView().getModel();
				for (var i = 1; i < 3; i++) {
					oInput = aCells[i];
					if (oInput.getEditable() == false) {
						oInput.setEditable(true);
						oInput.unbindElement();
					} else {
						oInput.setEditable(false);
						oSaveButton.setEnabled(false);
					}
				}

			},

			////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////7			
			onExpenseListModify: function(oEvent) {

				//	var that = this;
				var aCells = oEvent.getSource().getParent().getParent().getAggregation("cells");
				var oInput, oModel;
				var oSaveButton = aCells[6].getAggregation("content")[1];
				oSaveButton.setEnabled(true);

				//	oModel=this.getView().getModel();

				for (var i = 1; i < 3; i++) {
					oInput = aCells[i];
					oInput.setEditable(true);

					if (oInput.getEditable() == false) {
						oInput.setEditable(true);
						oInput.unbindElement();

					} else {
						oInput.setEditable(false);
						oSaveButton.setEnabled(false);
					}
				}
				//		oModel.updateBindings(true);
			},

			onExpenseCancelOrSave: function(oEvent) {

				// Per disabilitare e abilitare i bottoni di eliminazione e modifica commessa
				var oDeleteButton = sap.ui.getCore().byId("EliminaSel");
				var oModifyButton = sap.ui.getCore().byId("Modifica");
				//

				var oModel = sap.ui.getCore().getModel();
				var oEntry = {};
				var oContext = oEvent.getSource().getBindingContext();
				var oItem = oEvent.getSource().getParent();
				var EventType = oEvent.getSource().getType();
				var aCells;
				var oSaveButton;
				var sDialogMessage, msg;
				var that = this;
				aCells = oEvent.getSource().getParent().getParent().getAggregation("cells");
				oSaveButton = aCells[3].getAggregation("content")[1];

				if (EventType == "Reject") {
					sDialogMessage = "La spesa verrà cancellata. Continuare?";
					msg = "Spesa eliminata correttamente";
				} else {
					sDialogMessage = "La spesa verrà modificata. Continuare?";
					msg = "Spesa modificata correttamente";
				}

				var dialog = new Dialog({
					title: 'Attenzione',
					type: 'Message',
					state: 'Warning',
					content: new sap.m.Text({
						text: sDialogMessage
					}),
					beginButton: new sap.m.Button({
						text: 'Conferma',
						type: 'Accept',
						press: function() {
							dialog.close();

							oEntry.Tmskey = oContext.getProperty("Tmskey");
							oEntry.Giorno = oContext.getProperty("Giorno");
							oEntry.Expkey = oContext.getProperty("Expkey");
							oEntry.Exptype = oContext.getProperty("Exptype");

							if (EventType == "Reject") { // MP: sono in cancellazione

								//	if(oEvent.getSource().getId().indexOf("btnD") != -1){ // MP: sono in cancellazione
								oEntry.Deletionflag = "X";
							} else { // sono in modifica
								oEntry.Deletionflag = "";
								//var oInputDescr = sap.ui.getCore().byId("descrSpesa");
								//oEntry.Descr = oInputDescr.getValue();

								oEntry.Expdescr = oItem.getParent().getAggregation("cells")[1].getValue();
								// var oCell1 = oItem.getParent().mAggregations.cells[1];
								// oEntry.Expdescr = oCell1["_lastValue"];

								if (oEntry.Exptype == "00") // differenza tra i tipi spesa 
								{
									//	var oCell2 = oItem.getParent().mAggregations.cells[2];
									oEntry.Km = oItem.getParent().getAggregation("cells")[2].getValue();

									//    oEntry.Km = oCell2["_lastValue"];
									//	oEntry.Km = sap.ui.getCore().byId("ImpOrKm").getValue();
									///(SE)
									//	oEntry.Expdescr = this.getView().getModel().getProperty("Km", oEvent.getSource().getBindingContext());
									///(SE)
								} else {
									//	oEntry.Importo = sap.ui.getCore().byId("ImpOrKm").getValue();
									///(SE)
									//	oEntry.Importo = this.getView().getModel().getProperty("Importo", oEvent.getSource().getBindingContext());
									oEntry.Importo = oItem.getParent().getAggregation("cells")[2].getValue();
									//	 var oCell2 = oItem.getParent().mAggregations.cells[2];
									//     oEntry.Importo = oCell2["_lastValue"];

								}
							}

							oSaveButton.setEnabled(false);
							oDeleteButton.setEnabled(true);
							oModifyButton.setEnabled(true);
							var oInput;

							for (var i = 1; i < 3; i++) {
								oInput = aCells[i];
								oInput.setEditable(false);

							}

							oModel.update("/ListaSpeseGroupSet(Tmskey='" + oEntry.Tmskey + "',Giorno='" + oEntry.Giorno + "',Expkey='" + oEntry.Expkey +
								"',Exptype='" + oEntry.Exptype + "')",
								oEntry, {
									method: "PUT",
									success: function(data) {
										sap.m.MessageToast.show(msg, {
											duration: 5000,
											autoClose: true,
											closeOnBrowserNavigation: false

										});
										that._onBindingChange();
										sap.ui.getCore().byId("speseCommessa").getBinding("items").refresh();
									},
									error: function(e) {
										sap.m.MessageBox.show(
											"Error: " + oData.Message, {
												icon: sap.m.MessageBox.Icon.WARNING,
												title: "Error",
												actions: [sap.m.MessageBox.Action.CLOSE]

											});

									}

								});
						}
					}),
					endButton: new sap.m.Button({
						text: 'Annulla',
						type: 'Reject',
						press: function() {
							dialog.close();
						}
					}),
					afterClose: function() {
						dialog.destroy();
					}
				});

				dialog.open();

			},

			onSingleExpenseCancelOrSave: function(oEvent) {

				var oModel = sap.ui.getCore().getModel();
				var oEntry = {};
				var oContext = oEvent.getSource().getBindingContext();
				var EventType = oEvent.getSource().getType();
				var sDialogMessage, msg;
				var that = this;
				var oInputImp = sap.ui.getCore().byId("ValueSelSpese");
				var sImporto = oInputImp.getValue();

				if (EventType == "Reject") {
					sDialogMessage = "La spesa verrà cancellata. Continuare?";
					msg = "Spesa eliminata correttamente";
				} else {
					sDialogMessage = "La spesa verrà modificata. Continuare?";
					msg = "Spesa modificata correttamente";
				}

				if (EventType !== "Reject" && sImporto == "") {
					oInputImp.setValueState("Error");
					oInputImp.setValueStateText("Inserire importo");

					sap.m.MessageBox.show(
						"Errore: controllare gli inserimenti", {
							icon: sap.m.MessageBox.Icon.WARNING,
							title: "Errore",
							actions: [sap.m.MessageBox.Action.CLOSE]
						});

				} else {

					var dialog = new Dialog({
						title: 'Attenzione',
						type: 'Message',
						state: 'Warning',
						content: new sap.m.Text({
							text: sDialogMessage
						}),
						beginButton: new sap.m.Button({
							text: 'Conferma',
							type: 'Accept',
							press: function() {
								dialog.close();

								oEntry.Tmskey = oContext.getProperty("Tmskey");
								oEntry.Giorno = oContext.getProperty("Giorno");
								oEntry.Expkey = oContext.getProperty("Expkey");
								oEntry.Exptype = oContext.getProperty("Exptype");

								//	var oItem = oEvent.getSource().getParent();

								if (EventType == "Reject") { // MP: sono in cancellazione

									//	if(oEvent.getSource().getId().indexOf("btnD") != -1){ // MP: sono in cancellazione
									oEntry.Deletionflag = "X";
								} else { // sono in modifica
									oEntry.Deletionflag = "";

									oEntry.Expdescr = sap.ui.getCore().byId("descrizioneSelSpese").getValue();

									if (oEntry.Exptype == "00") // differenza tra i tipi spesa 
									{
										oEntry.Km = sap.ui.getCore().byId("ValueSelSpese").getValue();

									} else {
										oEntry.Importo = sap.ui.getCore().byId("ValueSelSpese").getValue();

									}

									that.sImportoOriginale = sap.ui.getCore().byId("ValueSelSpese").getValue();
									that.sDescrExpOriginale = sap.ui.getCore().byId("descrizioneSelSpese").getValue();
								}

								oModel.update("/ListaSpeseGroupSet(Tmskey='" + oEntry.Tmskey + "',Giorno='" + oEntry.Giorno + "',Expkey='" + oEntry.Expkey +
									"',Exptype='" + oEntry.Exptype + "')",
									oEntry, {
										method: "PUT",
										success: function(data) {
											sap.m.MessageToast.show(msg, {
												duration: 5000,
												autoClose: true,
												closeOnBrowserNavigation: false

											});

											//    oModel.refresh();
											that.closeDialogSpese();

										},
										error: function(e) {
											sap.m.MessageBox.show(
												"Error: " + oData.Message, {
													icon: sap.m.MessageBox.Icon.WARNING,
													title: "Error",
													actions: [sap.m.MessageBox.Action.CLOSE]

												});

										}

									});

							}

						}),
						endButton: new sap.m.Button({
							text: 'Annulla',
							type: 'Reject',
							press: function() {
								dialog.close();
							}
						}),
						afterClose: function() {
							dialog.destroy();

						}
					});

					dialog.open();

				}

			},

			handleDeleteComm: function(oEvent) {
				var oModel = this.getView().getModel();
				var oContext = oEvent.getSource().getBindingContext();
				var oEntry = {};
				var oDialog = this.DialogSel;
				var that = this;

				var dialog = new Dialog({
					title: 'Attenzione',
					type: 'Message',
					state: 'Warning',
					content: new sap.m.Text({
						text: "La commessa verrà eliminata. Continuare?"
					}),
					beginButton: new sap.m.Button({
						text: 'Conferma',
						type: 'Accept',
						press: function() {
							dialog.close();

							oEntry.Tmskey = oContext.getProperty("Tmskey");
							oEntry.Giorno = oContext.getProperty("Giorno");

							oModel.update("/ListaCommesseGroupSet(Tmskey='" + oEntry.Tmskey + "',Giorno='" + oEntry.Giorno + "')",
								oEntry, {
									method: "PUT",
									success: function(data) {
										var msg = "Commessa eliminata con successo";
										sap.m.MessageToast.show(msg, {
											duration: 5000,
											autoClose: true,
											closeOnBrowserNavigation: false

										});
										that._onBindingChange();
										oModel.refresh();
										oDialog.close();
									},
									error: function(e) {
										sap.m.MessageBox.show(
											"Error: " + oData.Message, {
												icon: sap.m.MessageBox.Icon.WARNING,
												title: "Error",
												actions: [sap.m.MessageBox.Action.CLOSE]

											});

									}

								});
						}
					}),
					endButton: new sap.m.Button({
						text: 'Annulla',
						type: 'Reject',
						press: function() {
							dialog.close();
						}
					}),
					afterClose: function() {
						dialog.destroy();
					}
				});

				dialog.open();

			},
			/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

			//MP: per gestire la validazione di alcuni Input field del Form (ore, chilometri e spese)
			onLiveChange: function(oEvent) {
				var oInput;
				var sNameOre;
				var sNameDescr;
				var oCal, aSpecialDates, oSpecialDate, oSelectedDate, sSelectedDate;
				oCal = this.getView().byId("LRS4_DAT_CALENDAR");
				aSpecialDates = oCal.getSpecialDates();

				if (oCal.getSelectedDates().length > 0) {
					oSelectedDate = oCal.getSelectedDates()[0].getStartDate();
					sSelectedDate = oSelectedDate.toString();
				}

				var sInsertedHours;
				var nInsertedHours;
				var nRemainingHours;
				var sTooltip;
				var flag = 0;
				if (oEvent.getSource().getId() == "ore") {
					sNameOre = "ore";
				} else {
					sNameOre = "oreSel";
				}

				if (oEvent.getSource().getId() == "descrizione") {
					sNameDescr = "descrizione";
				} else {
					sNameDescr = "descrizioneSel";
				}
				switch (oEvent.getSource().getId()) {
					case sNameOre:
						for (var i = 0; i < aSpecialDates.length; i++) {
							oSpecialDate = oCal.getSpecialDates()[i];
							if (oSpecialDate.getStartDate().toString() == sSelectedDate) {
								flag = 1;
								if (oSpecialDate.getProperty("type") == "Type03") {
									sTooltip = oSpecialDate.getAggregation("tooltip").split(": ");
									sInsertedHours = oSpecialDate.getAggregation("tooltip").split(": ")[1];
									nInsertedHours = Number(sInsertedHours);
									nRemainingHours = 8 - nInsertedHours;
								} else {
									nRemainingHours = 8;
								}
							}
						}
						if (flag == 0) {
							nRemainingHours = 8;
						}
						oInput = sap.ui.getCore().byId(sNameOre);
						if (oInput.getValue() < 1 || oInput.getValue() > nRemainingHours) {
							oInput.setValueState(sap.ui.core.ValueState.Error);
							oInput.setValueStateText("inserire un numero di ore compreso tra 1 e " + nRemainingHours);
						} else {
							oInput.setValueState(sap.ui.core.ValueState.None);
						}
						break;
					case "chilometri":
						oInput = sap.ui.getCore().byId("chilometri");
						if (oInput.getValue().length > 4) {
							oInput.setValueState(sap.ui.core.ValueState.Error);
							oInput.setValueStateText("Controllare inserimento");
						} else {
							oInput.setValueState(sap.ui.core.ValueState.None);
						}
						break;
					case sNameDescr:
						oInput = sap.ui.getCore().byId(sNameDescr);
						if (oInput.getValue() == "") {
							oInput.setValueState(sap.ui.core.ValueState.Error);
							oInput.setValueStateText("la descrizione è obbligatoria");
						} else {
							oInput.setValueState(sap.ui.core.ValueState.None);
						}
						break;

					case "ValueSelSpese":
						oInput = sap.ui.getCore().byId("ValueSelSpese");
						if (oInput.getValue() == "") {
							oInput.setValueState(sap.ui.core.ValueState.Error);
							oInput.setValueStateText("inserisci un importo");
						} else {
							oInput.setValueState(sap.ui.core.ValueState.None);
						}
						break;
					default:
						var oTable = oEvent.getSource().getParent().getParent();
						var aItems = oTable.getAggregation("items");
						var oItem;
						var oInputImp;
						for (var i = 0; i < aItems.length; i++) {
							oItem = aItems[i];
							oInputImp = oItem.getAggregation("cells")[2];
							if (oInputImp.getValue().length > 4) {
								oInputImp.setValueState(sap.ui.core.ValueState.Error);
								oInputImp.setValueStateText("Controllare inserimento");
							} else {
								oInputImp.setValueState(sap.ui.core.ValueState.None);
							}

						}

				}

			},

			handleCommessaSelection: function(oEvent) {
				this.openDialogSel(oEvent);
				var oDialog = sap.ui.getCore().byId("dialogDelComm");
				var sSelItemPath;
				oDialog.unbindElement();

				if (oEvent.getId() == "itemPress") {
					sSelItemPath = oEvent.getParameter("listItem").getBindingContext().getPath(); //MP: service path della commessa selezionata
				} else {
					sSelItemPath = oEvent.getParameter("rowContext").getPath();
					if (sSelItemPath.substring(1, sSelItemPath.indexOf("(")) == "ListaSpeseGroupSet") {
						this.handleSpeseSelection(oEvent);
						this.DialogSel.close();
						return;
					}
				}
				oDialog.bindElement({
					path: sSelItemPath,
					parameters: {
						expand: 'ToChildExpNodes'
					}
				});
				var sOrderJob = oDialog.getBindingContext().getProperty("Orderjob");
				var oButtonDel = sap.ui.getCore().byId("EliminaSel");
				var oButtonMod = sap.ui.getCore().byId("Modifica");
				var oOreSel = sap.ui.getCore().byId("oreSel");
				var oDescrSel = sap.ui.getCore().byId("descrizioneSel");
				var oPanelSpese = sap.ui.getCore().byId("panelSpeseIns");
				var oPanel = sap.ui.getCore().byId("panelSpeseSel");
				// MP: se permesso, ferie, ROL o recupero non si può cancellare o modificare
				if (sOrderJob == "EON166" || sOrderJob == "EON16A" || sOrderJob == "EON16B") {
					jQuery.sap.require("sap.m.MessageBox");
					sap.m.MessageBox.show(
						"I permessi, le ferie e le ore ROL inserite dall'apposita applicazione Fiori non possono essere cancellate e/o modificate.", {
							icon: sap.m.MessageBox.Icon.INFORMATION,
							title: "Informazioni",
							actions: [sap.m.MessageBox.Action.OK],
							onClose: function(oAction) {}
						}
					);
					oPanelSpese.setVisible(false);
					oPanel.setVisible(false);
					oOreSel.setEditable(false);
					oDescrSel.setEditable(false);
					oButtonDel.setVisible(false);
					oButtonMod.setVisible(false);
				} else {
					oPanelSpese.setVisible(true); 
					oPanel.setVisible(true);
					oOreSel.setEditable(true);
					oDescrSel.setEditable(true);
					oButtonDel.setVisible(true);
					oButtonMod.setVisible(true);
				}

				if (this.sOraOriginale == undefined || this.sDescrOriginale == undefined) {
					this.sOraOriginale = oDialog.getBindingContext().getProperty("Ore");
					this.sDescrOriginale = oDialog.getBindingContext().getProperty("Descr");
				}

				this.sDay = oDialog.getBindingContext().getProperty("Giorno");
				this.sMonth = oDialog.getBindingContext().getProperty("Calmonth");
				this.sYear = oDialog.getBindingContext().getProperty("Calyear");
				var sDate = this.sDay + "/" + this.sMonth + "/" + this.sYear;

				var sID = oDialog.getBindingContext().getProperty("Tmskey");
				oDialog.setTitle("ID Commessa: " + sID + " - " + "Giorno: " + sDate );
				

				//(SE)
				var aDatesList = [];
				aDatesList.push(sDate);
				this.DatesList = aDatesList;
				//

				var aCommesseItems = this.getView().byId("COMMESSE_CONTENTS").getBinding("items");
				var aSpeseItems = this.getView().byId("SPESE_CONTENTS").getBinding("items");
				var aTreeTableRows = this.getView().byId("TREETABLE_CONTENTS").getBinding("rows");

				//MP: utilizzato per fare il refresh delle liste nell'IconTabFilter della View
				//solo quando viene effettuata un'operazione sulle spese (cancellazione o modifica)
				var oExpenseList = sap.ui.getCore().byId("speseCommessa");
				if (oExpenseList.getBinding("items") != undefined) {
					//MP: non usato al momento.
					/*	oExpenseList.getBinding("items").attachChange(function() {
							aCommesseItems.refresh(); 
							aSpeseItems.refresh();
							aTreeTableRows.refresh();
						});*/
					oExpenseList.getBinding("items").refresh();

				}

			},

			openDialogSel: function(oEvent) {
				var that = this;

				if (!that.DialogSel) {

					that.DialogSel = sap.ui.xmlfragment("ZETMS_CREATE.view.DialogDelete", this, "ZETMS_CREATE.controller.View1");
					//to get access to the global model
					this.getView().addDependent(that.DialogSel);
					if (sap.ui.Device.system.phone) {
						that.Dialog.setStretch(true);
					}
				}
				that.DialogSel.open();
				this._DialogSel = that.DialogSel;

			},

			closeDialogSel: function(oEvent) {
				var oInputOre, oInputDescr;
				oInputOre = sap.ui.getCore().byId("oreSel");
				oInputDescr = sap.ui.getCore().byId("descrizioneSel");
				this.DialogSel.close();
				/////////////////////////////////////////////////////////////////////
				// MP: per pulire i campi della tabella nel panel e chiudere il panel
				sap.ui.getCore().byId("tabellaSpeseSel").removeSelections();
				sap.ui.getCore().byId("panelSpeseSel").setExpanded(false);

				if (oEvent.getSource().getId() == "Indietro") {
					oInputOre.setValue(this.sOraOriginale);
					oInputDescr.setValue(this.sDescrOriginale);
					oInputOre.setValueStateText("");
					oInputOre.setValueState("None");
					oInputDescr.setValueStateText("");
					oInputDescr.setValueState("None");
					this.sOraOriginale = undefined;
					this.sDescrOriginale = undefined;
				}
				this.onExpenseSelect(oEvent);
				/////////////////////////////////////////////////////////////////////

			},

			handleSpeseSelection: function(oEvent) {
				this.openDialogSpese(oEvent);
				var sSelItemPath;
				var oDialog = sap.ui.getCore().byId("dialogSpese");
				if (oEvent.getId() == "itemPress") {
					sSelItemPath = oEvent.getParameter("listItem").getBindingContext().getPath(); //MP: service path della commessa selezionata
				} else {
					sSelItemPath = oEvent.getParameter("rowContext").getPath(); // MP: caso in cui ci navigo dalla Treetable
				}

				oDialog.bindElement({
					path: sSelItemPath

				});

				var sExpType;

				if (this.sImportoOriginale == undefined || this.sDescrExpOriginale == undefined) {
					sExpType = oDialog.getBindingContext().getProperty("Exptype");
					if (sExpType == "00") {
						this.sImportoOriginale = oDialog.getBindingContext().getProperty("Km");
					} else {
						this.sImportoOriginale = oDialog.getBindingContext().getProperty("Importo");
					}
					this.sDescrExpOriginale = oDialog.getBindingContext().getProperty("Descr");
				}

				this.sDay = oDialog.getBindingContext().getProperty("Giorno");
				this.sMonth = oDialog.getBindingContext().getProperty("Calmonth");
				this.sYear = oDialog.getBindingContext().getProperty("Calyear");
				//this.sValue = oDialog.getBindingContext().getProperty("Importo");
				var sDate = this.sDay + "/" + this.sMonth + "/" + this.sYear;
				var sID = oDialog.getBindingContext().getProperty("Tmskey");
				oDialog.setTitle("ID Commessa: " + sID + " - " + "Giorno: " + sDate );
			//	oDialog.setTitle("Dettaglio spesa " + sDate);
			},

			openDialogSpese: function(oEvent) {
				var that = this;

				if (!that.DialogSpese) {

					that.DialogSpese = sap.ui.xmlfragment("ZETMS_CREATE.view.DialogSpese", this, "ZETMS_CREATE.controller.View1");
					//to get access to the global model
					this.getView().addDependent(that.DialogSpese);
					if (sap.ui.Device.system.phone) {
						that.DialogSpese.setStretch(true);
					}
				}
				that.DialogSpese.open();
				this._DialogSpese = that.DialogSpese;
			},

			closeDialogSpese: function() {

				this._onBindingChange();
				this.DialogSpese.close();

				this.getView().byId("COMMESSE_CONTENTS").getBinding("items").refresh();
				this.getView().byId("SPESE_CONTENTS").getBinding("items").refresh();
				this.getView().byId("TREETABLE_CONTENTS").getBinding("rows").refresh();
			},

			navBackDialogSpese: function(oEvent) {
				var oInputImp = sap.ui.getCore().byId("ValueSelSpese");
				var oInputExpDescr = sap.ui.getCore().byId("descrizioneSelSpese");
				this.DialogSpese.close();

				oInputImp.setValueState("None");
				oInputImp.setValueStateText("");

				if (oEvent.getSource().getId() == "IndietroExp") {
					oInputImp.setValue(this.sImportoOriginale);
					oInputExpDescr.setValue(this.sDescrExpOriginale);
					this.sImportoOriginale = undefined;
					this.sDescrExpOriginale = undefined;
				}

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

				var oIconTabFilterTree = this.getView().byId("commesseTree");
				if (sap.ui.Device.system.phone) {
					oIconTabFilterTree.setVisible(false);

				}

			},

			onUpdateFinished: function(oEvent) {

			},

			handleCalendarChange: function(oEvent) {

				this._onBindingChange();
			},

			handleCopyCalChange: function(oEvent) {

				this._onBindingCalendar();

			},

			// evento button per apertura pdf odc (SE) per apertura diretta
			onOpenDoc: function(oEvent) {
				//var OData = new sap.ui.mode.odata.ODataModel(); 
				//jQuery.sap.require("sap.ui.model.odata.datajs");
				var service = "http://newton.domain.eonegroup.it:8001";
				//	var oView = this.getView();
				//	var oObject = oView.getBindingContext().getObject();
				var oModel = this.getModel();

				//	var sRead = "/PdfdocSet(ZWfProcid='" + oObject.ZWfProcid + "',ZWfTaskid='" + oObject.ZWfTaskid + "',ZWfDocument='" + oObject.ZWfDocument + "',ZWfTipodoc='" + oObject.ZWfTipodoc + "')";

				// var sViewIdStart = oView.getId().indexOf("---");
				var sButtonId = oEvent.getSource().getId();
				var sButtonEvent = sButtonId.substring(sButtonId.indexOf("---V1--"));

				var sPrinttype = "";
				if (sButtonEvent == "---V1--btnTms") {
					sPrinttype = "T";
				} else {
					sPrinttype = "E";
				}
				var oView = this.getView();
				var oCal1 = oView.byId("LRS4_DAT_CALENDAR");

				var startDate = oCal1.getStartDate();
				var startMonth = this.oFormatMonth.format(startDate);
				if (startMonth.length === 1) {
					startMonth = "0" + startMonth;
				}

				var startYear = this.oFormatYear.format(startDate);
				var sRead = "/PdfSet(Calyear='" + startYear + "',Calmonth='" + startMonth + "',Extcall='',Printtype='" + sPrinttype + "')";
				oModel.read(sRead, {

					success: function(oData) {
						console.log(oData);
						if (!window.open(service + oData.Url, '_blank')) {
							alert("Popup blocked, please allow popup opening from your browser settings.");

						}
						//	win.focus();
					},

					/*	error: function(){
			            alert("No document available");
					}*/

					error: function() {
							jQuery.sap.require("sap.m.MessageBox");
							sap.m.MessageBox.show(
								"Error: No document available", {
									icon: sap.m.MessageBox.Icon.WARNING,
									title: "Error",
									actions: [sap.m.MessageBox.Action.CLOSE]

								}
							);
						}
						/*	error: function() {
						
						jQuery.sap.require("sap.m.MessageBox");
			            sap.m.MessageBox.show(
					      "This message should appear in the message box.", {
					          icon: sap.m.MessageBox.Icon.INFORMATION,
					          title: "My message box title",
					          actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO]
					          
					      }
					    );
			    
						}*/

				});

			},

			_onBindingCalendar: function() {
				var oView = this.getView();
				var oModel = this.getView().getModel();
				sap.ui.getCore().setModel(oModel);

				var oCal2 = sap.ui.getCore().byId("CALE_ID");

				//ripulisco i campi		
				oCal2.removeAllSelectedDates();
				oCal2.removeAllSpecialDates();
				oCal2.removeAllDisabledDates();

				var startDate = oCal2.getStartDate();
				var startMonth = this.oFormatMonth.format(startDate);
				if (startMonth.length === 1) {

					startMonth = "0" + startMonth;
				}

				var startYear = this.oFormatYear.format(startDate);

				//imposto la data minima selezionabile dietro di un anno
				var nowP = new Date();

				var nowF = new Date();
				nowP.setDate(nowP.getDate() - 365);
				oCal2.setMinDate(nowP);

				//imposto la data massima selezionabile avanti di un anno

				nowF.setDate(nowF.getDate() + 365);
				oCal2.setMaxDate(nowF);

				var nowForYear = new Date();
				var oYear = this.oFormatYear.format(nowForYear);
				var oYearN = Number(oYear);
				var oDay = nowForYear.getDate();
				var oDayN = Number(oDay);

				var oYear2 = oYearN + 1;

				// disabilito giorni festivi 
				oCal2.addDisabledDate(new DateTypeRange({
					startDate: this.oFormatYear.parse(oYearN + "0101")
				}));

				oCal2.addDisabledDate(new DateTypeRange({
					startDate: this.oFormatYear.parse(oYear2 + "0101")
				}));

				///// befana
				oCal2.addDisabledDate(new DateTypeRange({
					startDate: this.oFormatYear.parse(oYearN + "0106")
				}));

				oCal2.addDisabledDate(new DateTypeRange({
					startDate: this.oFormatYear.parse(oYear2 + "0106")

				}));

				///// 25 aprile
				oCal2.addDisabledDate(new DateTypeRange({
					startDate: this.oFormatYear.parse(oYearN + "0425")
				}));

				oCal2.addDisabledDate(new DateTypeRange({
					startDate: this.oFormatYear.parse(oYear2 + "0425")
				}));

				///// primo maggio
				oCal2.addDisabledDate(new DateTypeRange({
					startDate: this.oFormatYear.parse(oYearN + "0501")
				}));

				oCal2.addDisabledDate(new DateTypeRange({
					startDate: this.oFormatYear.parse(oYear2 + "0501")
				}));

				///// 2 giugno
				oCal2.addDisabledDate(new DateTypeRange({
					startDate: this.oFormatYear.parse(oYearN + "0602")
				}));

				oCal2.addDisabledDate(new DateTypeRange({
					startDate: this.oFormatYear.parse(oYear2 + "0602")
				}));

				///// ferragosto
				oCal2.addDisabledDate(new DateTypeRange({
					startDate: this.oFormatYear.parse(oYearN + "0815")
				}));

				oCal2.addDisabledDate(new DateTypeRange({
					startDate: this.oFormatYear.parse(oYear2 + "0815")
				}));

				///// tutti i santi
				oCal2.addDisabledDate(new DateTypeRange({
					startDate: this.oFormatYear.parse(oYearN + "1101")
				}));

				oCal2.addDisabledDate(new DateTypeRange({
					startDate: this.oFormatYear.parse(oYear2 + "1101")
				}));

				///// immacolata
				oCal2.addDisabledDate(new DateTypeRange({
					startDate: this.oFormatYear.parse(oYearN + "1208")
				}));

				oCal2.addDisabledDate(new DateTypeRange({
					startDate: this.oFormatYear.parse(oYear2 + "1208")
				}));

				////// natale
				oCal2.addDisabledDate(new DateTypeRange({
					startDate: this.oFormatYear.parse(oYearN + "1225")
				}));

				oCal2.addDisabledDate(new DateTypeRange({
					startDate: this.oFormatYear.parse(oYear2 + "1225")
				}));

				////// santo stefano
				oCal2.addDisabledDate(new DateTypeRange({
					startDate: this.oFormatYear.parse(oYearN + "1226")
				}));

				oCal2.addDisabledDate(new DateTypeRange({
					startDate: this.oFormatYear.parse(oYear2 + "1226")
				}));

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

								if (oData.results[i].Ore > 0.0) {

									oCal2.addDisabledDate(new DateTypeRange({
										startDate: oFormatYYyyymmdd.parse(res),
										tooltip: "Giorno non selezionabile"

									}));
								}

							}
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

			_onBindingChange: function() {
				//(SE
				this.showBusyIndicator();
				var that = this;
				//(SE           
				var oView = this.getView();
				var oModel = this.getView().getModel();
				sap.ui.getCore().setModel(oModel);

				//ripulisco i campi		
				oView.byId("LRS4_DAT_CALENDAR").removeAllSelectedDates();
				oView.byId("LRS4_DAT_CALENDAR").removeAllSpecialDates();
				oView.byId("LRS4_DAT_CALENDAR").removeAllDisabledDates();

				oView.byId("LRS4_TOT_ORE").setValue("");
				oView.byId("LRS4_TOT_SPESE").setValue("");
				oView.byId("LRS4_TOT_KM").setValue("");

				var oCal1 = oView.byId("LRS4_DAT_CALENDAR");

				var startDate = oCal1.getStartDate();
				this.startDate = startDate;
				var startMonth = this.oFormatMonth.format(startDate);
				if (startMonth.length === 1) {

					startMonth = "0" + startMonth;
				}

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
				var oDay = nowForYear.getDate();
				var oDayN = Number(oDay);

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
				/*	var sOwnerId = this.getView()._sOwnerId;

					var sId = sOwnerId + "---view1" + "--";
					if (this.sButtonKey != undefined) {
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
					}*/

				////TOTALI

				var sReadTot = "/TotaliMeseSet(Calyear='" + startYear + "',Calmonth='" + startMonth + "')";

				oModel.read(sReadTot, {
					success: fnReadStot,
					error: fnReadEtot
				});

				function fnReadStot(oData, response) {
					//	console.log(oData);
					//	console.log(response);

					// controllo che la funzione è andata a buon fine 
					if (response.statusCode == "200") {
						////////////////////////////////				
						oView.byId("LRS4_TOT_ORE").setValue(oData.Oretot);
						oView.byId("LRS4_TOT_SPESE").setValue(oData.Imptot);
						oView.byId("LRS4_TOT_KM").setValue(oData.Kmtot);

					}

				}

				function fnReadEtot(oError) {
					//	console.log(oError);
					//	alert("Error in read: " + oError.message);
				}

				////FINE TOTALI	

				////INIZIO LISTE

				/* filter */
				var f1 = new sap.ui.model.odata.Filter('Calmonth', [{
					operator: "EQ",
					value1: startMonth
				}]);
				var f2 = new sap.ui.model.odata.Filter('Calyear', [{
					operator: "EQ",
					value1: startYear
				}]);

				//definisco treetable
				var oTableTree = oView.byId("TREETABLE_CONTENTS");

				oTableTree.setModel(oModel);

				//navigation service binding
				oTableTree.bindRows({
					path: "/ListaCommesseGroupSet",
					parameters: {
						expand: 'ToChildExpNodes',

						navigation: {
							'ListaCommesseGroupSet': 'ToChildExpNodes'
						}
					},
					filters: [f1, f2]
				});

				// NON FUNZIONA
			
				var oTreeTableBinding = oTableTree.getBinding("rows");
			   oTreeTableBinding.attachDataReceived(function(oEvent) { //l'operationMode.Client viene impostato solo dopo che i dati sono stati ricevuti dal Back-end
					var oSource = oEvent.getSource();
					oSource.bClientOperation = true; 
					oSource.sOperationMode = "Client"; //operationMode = Client
				});

				//////////////////////////////////////
				//definisco tabella commessa

				//Per creare tabella in javascript, al momento definisco tabella e colonne in xml
				/////////////////	
				/*			 var oTableComm = new sap.m.Table({
				    mode: sap.m.ListMode.MultiSelect,
				    columns: [
				      new sap.m.Column({ header: new sap.m.Label({text: "Name"})}),
				      new sap.m.Column({ header: new sap.m.Label({text: "Value"})}),
				      new sap.m.Column({ header: new sap.m.Label({text: "Ore"})})
				    ]
				  });*/
				//////////////////	
				// definisco template listItem in riferimento alla tabella creata in vista xml

				//		var oWeekDay = this.oFormatYyyymmdd.parse(res);
				var oDateFormat = sap.ui.core.format.DateFormat.getInstance({
					pattern: "yyyy/MM/dd"
				});

				var oTableComm = oView.byId("COMMESSE_CONTENTS");

				oTableComm.setModel(oModel);

				var oTemplate = new sap.m.ColumnListItem({
					cells: [

						new sap.m.ObjectIdentifier({
							title: "{Weekday} {Giorno}",

							wrapping: false
						}),

						new sap.m.Text({

							text: "{Tmskey}"

						}),

						new sap.m.ObjectIdentifier({

							title: "{Descrorder}",
							text: "{Office}",
							//         id : "Comm_cellDescrorder",
							wrapping: false
						}),

						/*    new sap.m.Text({
						        text : "{Descr}",
						//        id : "Comm_cellDescr"
						 wrapping : true
						    }),*/

						new sap.m.Text({
							//	text: "{Office}",
							text: "{Descr}",
							//         id : "Comm_cellOffice"
						}),

						/*       new sap.m.Text({
						          text : "{Oretot}"
						  //         id : "Comm_cellOffice"
						      }),*/

						new sap.m.Text({
							text: "{Ore}"
								//         id : "Comm_cellExpdescr"
						})
					],
					type: "Active"
				});

				/////////////////////////
				//	oTableComm.bindAggregation e oTableComm.bindItems  hanno la stessa funzione
				/*			oTableComm.bindAggregation("items", {

        path : "/ListaCommesseGroupSet",

		     	filters: [f1, f2],
        template: oTemplate
    });	*/

				// esegue binding delle righe
				////////////////////////////////
				oTableComm.bindItems({

					path: "/ListaCommesseGroupSet",
					template: oTemplate,
					filters: [f1, f2]

					//	sorter: [new sap.ui.model.Sorter("Descrorder", true)
					//		groupHeaderFactory: ".getGroupHeader"
					//		]	 			 
				});

				var oBinding = oTableComm.getBinding("items");

				oBinding.attachDataReceived(function(oEvent) { //l'operationMode.Client viene impostato solo dopo che i dati sono stati ricevuti dal Back-end
					var oSource = oEvent.getSource();
					oSource.bClientOperation = true;
					oSource.sOperationMode = "Client"; //operationMode = Client

				});

				var aSorters = [];

				var sPath = "Giorno";
				var bDescending = false;

				var vGroup = this.mGroupFunctions[sPath];

				/*  var vGroup = function(oContext) {
	             var name = oContext.getProperty("Giorno");
	             return {
	                 key: name,
	                 text: name
	             };
	         };*/
				aSorters.push(new sap.ui.model.Sorter(sPath, bDescending, vGroup));
                
                	
				    if (oBinding.aAllKeys == null) {
						oBinding.aAllKeys = oBinding.aKeys;
					}
					
				oBinding.sort(aSorters);

				/////////////////////////////////////				 
				//per inserire tabella creata in javascript in vista xml
				//		oTableComm.placeAt(oView.byId("commesse"));

				//		
				/*	var aColumns = [

        new sap.m.Column({
            header : new sap.m.Label({
                text : "Expense Item No"
            })
        }),
        new sap.m.Column({
            header : new sap.m.Label({
                text : "Description"
            })
        }),
        new sap.m.Column({
            header : new sap.m.Label({
                text : "Category"
            })
        })
    ];
    */
				///////////////////////////////////

				//definisco tabella spese
				var oTableExp = oView.byId("SPESE_CONTENTS");

				var oTemplateSpese = new sap.m.ColumnListItem({
					cells: [

						new sap.m.ObjectIdentifier({
							title: "{Weekday} {Giorno}",
							//       id : "Exp_cellGiorno",

							wrapping: false
						}),

						new sap.m.Text({

							text: "{Tmskey}"

						}),
						new sap.m.ObjectIdentifier({
							title: "{Descrorder}",
							text: "{Office}",
							//         id : "Comm_cellDescrorder",
							wrapping: false
						}),

						/*	new sap.m.Text({
							text: "{Office}"
								//        id : "Exp_cellOffice"
						}),
*/
						new sap.m.Text({
							text: "{Descr}"
								//       id : "Exp_cellDescr"
						}),

						/*new sap.m.Text({
							text: "{Expdescr}"
								//        id : "Exp_cellOffice"
						}),*/

						//	<Input id="ImpOrKm" value="{= ${Exptype} === '00' ? ${Km} : ${Importo}}" editable="false"/>

						new sap.m.ObjectIdentifier({
							title: "{Expdescr}",
							text: "{= ${Exptype} === '00' ? ${Km} : ${Importo}}",
							//         id : "Comm_cellDescrorder",
							wrapping: false
						})

						/*	new sap.m.Text({
                      			
                      			text: "{= ${Exptype} === '00' ? ${Km} : ${Importo}}"
					//		text: "{Importo}"
					//			value: "{Importo}"
					//		editable: false
								//      id : "Exp_cellExpdescr"
						})*/

						/*	new sap.m.Text({

							text: "{Expdescr}"
								//      id : "Exp_cellExpdescr"
						}),
				*/

						/*	new sap.ui.layout.HorizontalLayout({content:[
							
								
										new sap.m.Button({
							//	id : "btnD" ,
								type :  sap.m.ButtonType.Default,
								icon : "sap-icon://edit" ,
								
								tooltip : "Modifica" ,
								press : this.onExpenseListModify
								}),
								
			
									
								new sap.m.Button({
							//	id : "btnD" ,
								type :  sap.m.ButtonType.Accept,
								icon : "sap-icon://save" ,
								enabled: false,
								tooltip : "Salva" ,
								press : this.onExpenseCancelOrSave
								}),
								
										new sap.m.Button({
							//	id : "btnD" ,
								type :  sap.m.ButtonType.Reject,
								icon : "sap-icon://delete" ,
								
								tooltip : "Elimina" ,
								press : this.onExpenseCancelOrSave
								})

								]})		*/

						/*			new sap.ui.layout.HorizontalLayout({
										content: [

											new sap.m.Button({
												//	id : "btnD" ,
												type: sap.m.ButtonType.Default,
												icon: "sap-icon://edit",

												tooltip: "Modifica",
												press: this.onExpenseModify
											}),

											new sap.m.Button({
												//	id : "btnD" ,
												type: sap.m.ButtonType.Accept,
												icon: "sap-icon://save",

												tooltip: "Salva",
												press: this.onExpenseCancelOrSave
											}),

											new sap.m.Button({
												//	id : "btnD" ,
												type: sap.m.ButtonType.Reject,
												icon: "sap-icon://delete",

												tooltip: "Elimina",
												press: this.onExpenseCancelOrSave
											})

										]
									})*/

					],

					type: "Active"
				});

				oTableExp.setModel(oModel);

				// esegue binding delle righe
				oTableExp.bindItems({
					path: "/ListaSpeseGroupSet",

					filters: [f1, f2],

					template: oTemplateSpese

				});

				var oBindingExp = oTableExp.getBinding("items");

				oBindingExp.attachDataReceived(function(oEvent) { //l'operationMode.Client viene impostato solo dopo che i dati sono stati ricevuti dal Back-end
					var oSource = oEvent.getSource();
					oSource.bClientOperation = true;
					oSource.sOperationMode = "Client"; //operationMode = Client
				});

				var aSortersExp = [];

				var sPathExp = "Giorno";
				var bDescendingExp = false;

				var vGroupExp = this.mGroupFunctions[sPathExp];

				/* var vGroupExp = function(oContext) {
	             var name = oContext.getProperty("Giorno");
	             return {
	                 key: name,
	                 text: name
	             };
	         };*/
				aSortersExp.push(new sap.ui.model.Sorter(sPathExp, bDescendingExp, vGroupExp));

				oBindingExp.sort(aSortersExp);

				////FINE LISTE	     
				//////////////////////////////

				//////////////////////////////

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

								if (oData.results[i].Ore == 8.0) {

									oCal1.addSpecialDate(new DateTypeRange({
										startDate: oFormatYYyyymmdd.parse(res),
										type: "Type07",
										tooltip: "Ore: " + oData.results[i].Ore

									}));
								}

								if (oData.results[i].Ore < 8.0 & oData.results[i].Ore > 0.0) {

									oCal1.addSpecialDate(new DateTypeRange({
										startDate: oFormatYYyyymmdd.parse(res),
										type: "Type03",
										tooltip: "Ore: " + oData.results[i].Ore
									}));
								}

								if (oData.results[i].Ore > 8.0) {

									oCal1.addSpecialDate(new DateTypeRange({
										startDate: oFormatYYyyymmdd.parse(res),
										type: "Type01",
										tooltip: "Ore: " + oData.results[i].Ore
									}));
								}

								// }	

								// aggiungere date selezionate quando si è in modifica
								/*oCal1.addSelectedDate(new DateTypeRange({
									startDate: oFormatYYyyymmdd.parse(res)

								}));*/

							}

							oLeg1.addItem(new CalendarLegendItem({
								text: "8 ore",
								id: "leg1",
								type: "Type07"

							}));

							oLeg1.addItem(new CalendarLegendItem({
								text: "Meno di 8 ore",
								id: "leg2",
								type: "Type03"
							}));

							oLeg1.addItem(new CalendarLegendItem({
								text: "Più di 8 ore",
								id: "leg3",
								type: "Type01"
							}));

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

					//(SE) busy indicator per pagina intera
					that.hideBusyIndicator();

					//(SE) busy indicator per singolo elemento
					//oView.byId("LRS1_BUSY_CALENDAR").setBusy(false);
				} // END FUNCTION SUCCESS

				function fnReadE(oError) {
					//	console.log(oError);

					alert("Error in read: " + oError.message);
				}

			},

			hideBusyIndicator: function() {
				sap.ui.core.BusyIndicator.hide();
			},

			//	showBusyIndicator : function (iDuration, iDelay) {
			showBusyIndicator: function() {
				sap.ui.core.BusyIndicator.show();

				/*	if (iDuration && iDuration > 0) {
								if (this._sTimeoutId) {
									jQuery.sap.clearDelayedCall(this._sTimeoutId);
									this._sTimeoutId = null;
								}
				
								this._sTimeoutId = jQuery.sap.delayedCall(iDuration, this, function() {
									this.hideBusyIndicator();
								});
							}*/
			},

			onPullToRefresh: function() {

				this._onBindingChange();

				this.getView().byId("COMMESSE_CONTENTS").getBinding("items").refresh();
				this.getView().byId("SPESE_CONTENTS").getBinding("items").refresh();
				this.getView().byId("TREETABLE_CONTENTS").getBinding("rows").refresh();

				/*	var msg = "Updated";
					sap.m.MessageToast.show(msg, {
						duration: 1500, // default
						animationTimingFunction: "ease", // default
						animationDuration: 1000, // default
						closeOnBrowserNavigation: true // default
					});*/

				this.getView().byId("pullToRefresh").hide();
			},

			onClickRefresh: function() {

				this._onBindingChange();

				this.getView().byId("COMMESSE_CONTENTS").getBinding("items").refresh();
				this.getView().byId("SPESE_CONTENTS").getBinding("items").refresh();
				this.getView().byId("TREETABLE_CONTENTS").getBinding("rows").refresh();

				/*var msg = "Updated";
			sap.m.MessageToast.show(msg, {
				duration: 1500, // default
				animationTimingFunction: "ease", // default
				animationDuration: 1000, // default
				closeOnBrowserNavigation: true // default
			});
*/
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
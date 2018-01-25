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
			    this.expdescr = this.byId("descrSpesa");
			//	this.timeFrom = this.byId("LRS4_DAT_STARTTIME");
			//	this.timeTo = this.byId("LRS4_DAT_ENDTIME");
				this.oreTot = this.byId("LRS4_DAT_ORETOT");
			//	this.legend = this.byId("LRS4_LEGEND");
			//	this.remainingVacation = this.byId("LRS4_TXT_REMAINING_DAYS");
			//	this.bookedVacation = this.byId("LRS4_TXT_BOOKED_DAYS");
				this.note = this.byId("LRS4_TXA_NOTE");
			//	this.note_rec = this.byId("LRS4_TXA_NOTE_RECUP");
				this.cale = this.byId("LRS4_DAT_CALENDAR");
		//		this.slctLvType = this.byId("SLCT_LEAVETYPE");
			//	this.slctApprover = this.byId("SLCT_APPROVER");
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
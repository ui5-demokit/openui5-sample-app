/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/model/Context"],function(t){"use strict";var e=t.extend("sap.ui.model.odata.v2.Context",{constructor:function(e,r,i){t.call(this,e,r);this.bCreated=false;this.sDeepPath=i||r;this.bForceRefresh=false;this.bPreliminary=false;this.bUpdated=false}});e.prototype.getDeepPath=function(){return this.sDeepPath};e.prototype.hasChanged=function(){return this.bUpdated||this.bForceRefresh};e.prototype.isPreliminary=function(){return this.bPreliminary};e.prototype.isRefreshForced=function(){return this.bForceRefresh};e.prototype.isUpdated=function(){return this.bUpdated};e.prototype.setDeepPath=function(t){this.sDeepPath=t};e.prototype.setForceRefresh=function(t){this.bForceRefresh=t};e.prototype.setPreliminary=function(t){this.bPreliminary=t};e.prototype.setUpdated=function(t){this.bUpdated=t};return e},false);
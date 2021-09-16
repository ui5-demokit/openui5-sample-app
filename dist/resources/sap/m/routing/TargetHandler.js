/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/base/SyncPromise","sap/m/InstanceManager","sap/m/NavContainer","sap/m/SplitContainer","sap/ui/base/Object","sap/ui/core/routing/History","sap/ui/Device","sap/base/Log"],function(e,i,t,o,a,r,n,s){"use strict";var l={onAfterShow:function(e){this.getParent().hidePlaceholder({});this.removeEventDelegate(l)}};var g=a.extend("sap.m.routing.TargetHandler",{constructor:function(e){this._aQueue=[];this._oNavigationOrderPromise=Promise.resolve();if(e===undefined){this._bCloseDialogs=true}else{this._bCloseDialogs=!!e}}});g.prototype.setCloseDialogs=function(e){this._bCloseDialogs=!!e;return this};g.prototype.getCloseDialogs=function(){return this._bCloseDialogs};g.prototype.addNavigation=function(e){this._aQueue.push(e)};g.prototype.navigate=function(e){var i=this._groupNavigation(),t=this._createResultingNavigations(e.navigationIdentifier,i),o=false,a=this._getDirection(e),r;while(t.length){r=this._applyNavigationResult(t.shift().oParams,a);o=o||r}if(o){this._closeDialogs()}};g.prototype._chainNavigation=function(e,i){var t=this._oNavigationOrderPromise.then(e);this._oNavigationOrderPromise=t.catch(function(e){s.error("The following error occurred while displaying routing target with name '"+i+"': "+e)});return t};g.prototype._getDirection=function(e){var i=e.viewLevel,t=r.getInstance(),o=false;if(e.direction==="Backwards"){o=true}else if(isNaN(i)||isNaN(this._iCurrentViewLevel)||i===this._iCurrentViewLevel){if(e.askHistory){o=t.getDirection()==="Backwards"}}else{o=i<this._iCurrentViewLevel}this._iCurrentViewLevel=i;return o};g.prototype._groupNavigation=function(){var e,i,t,o,a=[],r;while(this._aQueue.length){e=this._aQueue.shift();i=e.targetControl;t=e.aggregationName;if(!e.preservePageInSplitContainer){for(r=0;r<a.length;r++){o=a[r];if(i!==o.targetControl||t!==o.aggregationName){continue}a.splice(r,1);break}}a.push(e)}return a};g.prototype._createResultingNavigations=function(e,i){var t,a,r,s,l=[],g,c,f,h;while(i.length){a=i.shift();r=a.targetControl;c=r instanceof o;g=a.view;s={oContainer:r,oParams:a};if(c){s.bIsMasterPage=!!r.getMasterPage(g.getId())}f=c&&a.preservePageInSplitContainer&&r.getCurrentPage(s.bIsMasterPage)&&e!==a.navigationIdentifier;for(t=0;t<l.length;t++){h=l[t];if(h.oContainer!==r){continue}if(c){if(n.system.phone){l.splice(t,1);break}else if(h.bIsMasterPage===s.bIsMasterPage){if(!f){l.splice(t,1)}break}}}if(!f){l.push(s)}}return l};g.prototype._applyNavigationResult=function(e,i){var a=e.targetControl,r,n=e.eventData,g=e.transition||"",c=e.transitionParameters,f=e.view&&e.view.getId(),h=a instanceof o&&!!a.getMasterPage(f),u=(a instanceof o||a instanceof t)&&e.view,p,d;if(e.placeholderConfig){p=e.placeholderConfig.autoClose;d=e.placeholderConfig.container}if(!u){if(d&&p&&d.hidePlaceholder){d.hidePlaceholder(e.placeholderConfig)}return false}if(a.getDomRef()&&a.getCurrentPage(h).getId()===f){if(p&&d&&d.hidePlaceholder){d.hidePlaceholder(e.placeholderConfig)}s.info("navigation to view with id: "+f+" is skipped since it already is displayed by its targetControl","sap.m.routing.TargetHandler");return false}else if(p){e.view.addEventDelegate(l,e.view)}s.info("navigation to view with id: "+f+" the targetControl is "+a.getId()+" backwards is "+i);if(i){r=a.getPreviousPage(h);if(!r||r.getId()!==f){a.insertPreviousPage(f,g,n)}a.backToPage(f,n,c)}else{a.to(f,g,n,c)}return true};g.prototype._closeDialogs=function(){if(!this._bCloseDialogs){return}if(i.hasOpenPopover()){i.closeAllPopovers()}if(i.hasOpenDialog()){i.closeAllDialogs()}if(i.hasOpenLightBox()){i.closeAllLightBoxes()}};g.prototype.showPlaceholder=function(i){var t=i.container,o=true,a;if(i.object){if(i.object instanceof Promise){a=i.object}else{a=e.resolve(i.object)}a.then(function(e){if(i.container&&typeof i.container.needPlaceholder==="function"){o=i.container.needPlaceholder(i.aggregation,e)}if(o){t.showPlaceholder(i)}})}};return g});
/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/base/SyncPromise","sap/m/InstanceManager","sap/f/FlexibleColumnLayout","sap/ui/base/Object","sap/ui/core/routing/History","sap/base/Log"],function(e,t,i,o,n,a){"use strict";var r=o.extend("sap.f.routing.TargetHandler",{constructor:function(e){this._aQueue=[];this._oNavigationOrderPromise=Promise.resolve();if(e===undefined){this._bCloseDialogs=true}else{this._bCloseDialogs=!!e}}});r.prototype.setCloseDialogs=function(e){this._bCloseDialogs=!!e;return this};r.prototype.getCloseDialogs=function(){return this._bCloseDialogs};r.prototype.addNavigation=function(e){this._aQueue.push(e)};r.prototype.navigate=function(e){var t=this._createResultingNavigations(e.navigationIdentifier),i=false,o=this._getDirection(e),n;while(t.length){n=this._applyNavigationResult(t.shift().oParams,o);i=i||n}if(i){this._closeDialogs()}};r.prototype._chainNavigation=function(e,t){var i=this._oNavigationOrderPromise.then(e);this._oNavigationOrderPromise=i.catch(function(e){a.error("The following error occurred while displaying routing target with name '"+t+"': "+e)});return i};r.prototype._getDirection=function(e){var t=e.viewLevel,i=n.getInstance(),o=false;if(e.direction==="Backwards"){o=true}else if(isNaN(t)||isNaN(this._iCurrentViewLevel)||t===this._iCurrentViewLevel){if(e.askHistory){o=i.getDirection()==="Backwards"}}else{o=t<this._iCurrentViewLevel}this._iCurrentViewLevel=t;return o};r.prototype._createResultingNavigations=function(e){var t,i,o,n,a=[],r;while(this._aQueue.length){i=this._aQueue.shift();o=i.targetControl;n={oContainer:o,oParams:i,placeholderConfig:i.placeholderConfig};if(!s(o)){continue}for(t=0;t<a.length;t++){r=a[t];if(r.oContainer!==o){continue}}a.push(n)}return a};r.prototype._applyNavigationResult=function(e,t){var o=e.targetControl,n=e.eventData,r=e.transition||"",s=e.transitionParameters,l=e.view.getId(),u,g=o instanceof i,c=false,f=e.placeholderConfig;if(g){u=[o.getCurrentBeginColumnPage(),o.getCurrentMidColumnPage(),o.getCurrentEndColumnPage()];c=u.some(function(e){return e&&e.getId()===l})}if(c){if(f.autoClose){o.hidePlaceholder(f)}a.info("navigation to view with id: "+l+" is skipped since it already is displayed by its targetControl","sap.f.routing.TargetHandler");return false}a.info("navigation to view with id: "+l+" the targetControl is "+o.getId()+" backwards is "+t);if(t){o._safeBackToPage(l,r,n,s)}else{o.to(l,r,n,s)}if(f.autoClose){o.hidePlaceholder(f)}return true};r.prototype._closeDialogs=function(){if(!this._bCloseDialogs){return}if(t.hasOpenPopover()){t.closeAllPopovers()}if(t.hasOpenDialog()){t.closeAllDialogs()}if(t.hasOpenLightBox()){t.closeAllLightBoxes()}};function s(e){return e&&e.isA(["sap.m.NavContainer","sap.m.SplitContainer","sap.f.FlexibleColumnLayout"])}r.prototype.showPlaceholder=function(t){var i=t.container,o=true,n;if(t.object){if(t.object instanceof Promise){n=t.object}else{n=e.resolve(t.object)}n.then(function(e){if(t.container&&typeof t.container.needPlaceholder==="function"){o=t.container.needPlaceholder(t.aggregation,e)}if(o){i.showPlaceholder(t)}})}};return r});
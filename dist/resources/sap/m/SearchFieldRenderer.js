/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/Device","sap/ui/core/Core","sap/ui/core/InvisibleText","sap/ui/core/library"],function(e,t,a,s){"use strict";var i=s.aria.HasPopup;var r={apiVersion:2};r.render=function(s,r){if(!r.getVisible()){return}var o=r.getPlaceholder()||t.getLibraryResourceBundle("sap.m").getText("FACETFILTER_SEARCH",true),l=r.getValue(),n=r.getProperty("width"),p=r.getId(),d=r.getShowRefreshButton(),c=r.getShowSearchButton(),S={},f,u=r.getRefreshButtonTooltip(),g;s.openStart("div",r).class("sapMSF");if(n){s.style("width",n)}if(l){s.class("sapMSFVal")}if(!r.getEnabled()){s.class("sapMSFDisabled")}s.openEnd();s.openStart("form",p+"-F").class("sapMSFF");if(!c){s.class("sapMSFNS")}else if(d){s.class("sapMSFReload")}s.openEnd();s.voidStart("input",p+"-I").class("sapMSFI").attr("type","search").attr("autocomplete","off");if(r.getEnableSuggestions()){s.attr("aria-haspopup",i.ListBox.toLowerCase())}if(e.browser.safari){s.attr("autocorrect","off")}var T=r.getTooltip_AsString();if(T){s.attr("title",T)}if(r.getEnableSuggestions()&&e.system.phone){s.attr("inputmode","none")}if(!r.getEnabled()){s.attr("disabled","disabled")}if(o){s.attr("placeholder",o)}if(r.getMaxLength()){s.attr("maxLength",r.getMaxLength())}s.attr("value",l);if(r.getEnabled()&&d){var F=a.getStaticId("sap.m","SEARCHFIELD_ARIA_F5");if(F){S.describedby={value:F,append:true}}}S.disabled=null;s.accessibilityState(r,S);s.voidEnd();if(r.getEnabled()){s.openStart("div",p+"-reset").class("sapMSFR").class("sapMSFB").attr("aria-hidden",true);g=l===""?this.oSearchFieldToolTips.SEARCH_BUTTON_TOOLTIP:this.oSearchFieldToolTips.RESET_BUTTON_TOOLTIP;s.attr("title",g);if(e.browser.firefox){s.class("sapMSFBF")}if(!c){s.class("sapMSFNS")}s.openEnd().close("div");if(c){s.openStart("div",p+"-search").class("sapMSFS").class("sapMSFB").attr("aria-hidden",true);if(e.browser.firefox){s.class("sapMSFBF")}if(d){f=u===""?this.oSearchFieldToolTips.REFRESH_BUTTON_TOOLTIP:u}else{f=this.oSearchFieldToolTips.SEARCH_BUTTON_TOOLTIP}s.attr("title",f).openEnd().close("div")}}s.close("form");if(r.getEnableSuggestions()){s.openStart("span",p+"-SuggDescr").class("sapUiPseudoInvisibleText").attr("role","status").attr("aria-live","polite").openEnd().close("span")}s.close("div")};return r},true);
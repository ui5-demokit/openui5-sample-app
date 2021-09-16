/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/model/json/JSONModel"],function(e){"use strict";var t=function(t,n){var a=sap.ui.getCore().getLibraryResourceBundle("sap.m.designtime");return new Promise(function(r){var i={selectedKey:t.getTarget(),titleText:a.getText("LINK_DIALOG_TITLE_CHANGE_TARGET"),cancelBtn:a.getText("LINK_DIALOG_CANCEL_BTN"),okBtn:a.getText("LINK_DIALOG_OK_BTN")};var s=new e;s.setData(i);var o=sap.ui.xmlfragment("sap.m.designtime.LinkTargetSelectDialog",this);o.setModel(s);o.getBeginButton().attachPress(function(e){var t=sap.ui.getCore().byId("targetCombo").getValue();r(t);o.close()});o.getEndButton().attachPress(function(e){o.close()});o.attachEventOnce("afterClose",function(e){o.destroy()});o.addStyleClass(n.styleClass);o.open()}).then(function(e){return[{selectorControl:t,changeSpecificData:{changeType:"changeLinkTarget",content:e}}]})};return{name:{singular:"LINK_NAME",plural:"LINK_NAME_PLURAL"},palette:{group:"ACTION",icons:{svg:"sap/m/designtime/Link.icon.svg"}},actions:{remove:{changeType:"hideControl"},reveal:{changeType:"unhideControl"},rename:{changeType:"rename",domRef:function(e){return e.$()[0]}},settings:function(){return{changeLinkTarget:{name:"LINK_CHANGE_TARGET",isEnabled:function(e){return!!e.getHref()},handler:t}}}},templates:{create:"sap/m/designtime/Link.create.fragment.xml"}}});
/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/library"],function(t){"use strict";var e=t.Orientation;var n={};n.render=function(t,n){var i=n.getId();var a=n.getOrientation()==e.Vertical;t.write("<div");t.writeControlData(n);t.addClass("sapUiUfdSpltCont");t.addClass("sapUiUfdSpltCont"+(a?"V":"H"));if(sap.ui.getCore().getConfiguration().getAnimation()){t.addClass("sapUiUfdSpltContAnim")}if(!n.getShowSecondaryContent()){t.addClass("sapUiUfdSpltContPaneHidden")}t.writeClasses();t.write(">");var r=i+"-canvas";t.write("<section id='",r,"' class='sapUiUfdSpltContCanvas'>");this.renderContent(t,r,n.getContent(),n._bRootContent);t.write("</section>");var o=i+"-pane";var d=n.getShowSecondaryContent()?n.getSecondaryContentSize():"0";t.write("<aside id='",o,"' style='width:",d,"'");t.addClass("sapUiUfdSpltContPane");if(!n.getShowSecondaryContent()){t.addClass("sapUiUfdSplitContSecondClosed")}t.writeClasses();t.write(">");this.renderContent(t,o,n.getSecondaryContent(),n._bRootContent);t.write("</aside>");t.write("</div>")};n.renderContent=function(t,e,n,i){t.write("<div id='",e,"cntnt' class='sapUiUfdSpltContCntnt'");if(i){t.writeAttribute("data-sap-ui-root-content","true")}t.write(">");for(var a=0;a<n.length;a++){t.renderControl(n[a])}t.write("</div>")};return n},true);
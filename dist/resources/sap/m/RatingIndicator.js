/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./library","sap/ui/core/Control","sap/ui/core/theming/Parameters","./RatingIndicatorRenderer","sap/ui/events/KeyCodes","sap/base/Log","sap/ui/thirdparty/jquery"],function(e,t,a,i,s,n,o){"use strict";var u=e.RatingIndicatorVisualMode;var r=t.extend("sap.m.RatingIndicator",{metadata:{interfaces:["sap.ui.core.IFormContent"],library:"sap.m",properties:{enabled:{type:"boolean",group:"Behavior",defaultValue:true},maxValue:{type:"int",group:"Behavior",defaultValue:5},value:{type:"float",group:"Behavior",defaultValue:0,bindable:"bindable"},iconSize:{type:"sap.ui.core.CSSSize",group:"Behavior",defaultValue:null},iconSelected:{type:"sap.ui.core.URI",group:"Behavior",defaultValue:null},iconUnselected:{type:"sap.ui.core.URI",group:"Behavior",defaultValue:null},iconHovered:{type:"sap.ui.core.URI",group:"Behavior",defaultValue:null},visualMode:{type:"sap.m.RatingIndicatorVisualMode",group:"Behavior",defaultValue:u.Half},displayOnly:{type:"boolean",group:"Behavior",defaultValue:false},editable:{type:"boolean",group:"Behavior",defaultValue:true}},associations:{ariaDescribedBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaDescribedBy"},ariaLabelledBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaLabelledBy"}},events:{change:{parameters:{value:{type:"int"}}},liveChange:{parameters:{value:{type:"float"}}}},designtime:"sap/m/designtime/RatingIndicator.designtime"}});r.sizeMapppings={};r.iconPaddingMappings={};r.paddingValueMappping={};r.prototype.init=function(){this.allowTextSelection(false);this._iIconCounter=0;this._fHoverValue=0;this._oResourceBundle=sap.ui.getCore().getLibraryResourceBundle("sap.m")};r.prototype.setValue=function(e){var t=typeof e!=="string"?e:Number(e);t=this.validateProperty("value",t);if(t<0){return this}if(isNaN(t)){n.warning('Ignored new rating value "'+e+'" because it is NAN')}else if(this.$().length&&t>this.getMaxValue()){n.warning('Ignored new rating value "'+t+'" because it is out  of range (0-'+this.getMaxValue()+")")}else{t=this._roundValueToVisualMode(t);this.setProperty("value",t);this._fHoverValue=t}return this};r.prototype.onThemeChanged=function(e){this.invalidate()};r.prototype.onBeforeRendering=function(){var e=this.getValue();var t=this.getMaxValue();if(e>t){this.setValue(t);n.warning("Set value to maxValue because value is > maxValue ("+e+" > "+t+").")}else if(e<0){this.setValue(0);n.warning("Set value to 0 because value is < 0 ("+e+" < 0).")}var a=this.getIconSize();if(a){this._setRegularSizes(a)}else if(this.getDisplayOnly()){this._setDisplayOnlySizes()}else{this._setContentDensitySizes()}};r.prototype._setDisplayOnlySizes=function(){var e="sapUiRIIconSizeDisplayOnly",t="sapUiRIIconPaddingDisplayOnly";if(r.sizeMapppings[e]&&r.paddingValueMappping[t]){this._iPxIconSize=r.sizeMapppings[e];this._iPxPaddingSize=r.paddingValueMappping[t];return}var i=Object.assign({sapUiRIIconSizeDisplayOnly:"1rem",sapUiRIIconPaddingDisplayOnly:"0.125rem"},a.get({name:[e,t],callback:function(a){this.setIconAndPaddingSizes(e,t,a[e],a[t])}.bind(this)}));this.setIconAndPaddingSizes(e,t,i[e],i[t])};r.prototype._setContentDensitySizes=function(){var e=this._getDensityMode();var t="sapUiRIIconSize"+e;var i="sapUiRIIconPadding"+e;if(r.sizeMapppings[t]&&r.paddingValueMappping[i]){this._iPxIconSize=r.sizeMapppings[t];this._iPxPaddingSize=r.paddingValueMappping[i];return}var s=a.get({name:[t,i],callback:function(e){this.setIconAndPaddingSizes(t,i,e[t],e[i])}.bind(this)});if(s){this.setIconAndPaddingSizes(t,i,s[t],s[i])}};r.prototype._setRegularSizes=function(e){r.sizeMapppings[e]=r.sizeMapppings[e]||this._toPx(e);var t=r.sizeMapppings[e];r.iconPaddingMappings[t]=r.iconPaddingMappings[t]||"sapUiRIIconPadding"+this._getIconSizeLabel(t);var i=r.iconPaddingMappings[t];if(r.paddingValueMappping[i]){this._iPxIconSize=r.sizeMapppings[e];this._iPxPaddingSize=r.paddingValueMappping[i];return}var s=a.get({name:i,callback:function(t){this.setIconAndPaddingSizes(e,i,r.sizeMapppings[e],t)}.bind(this)});if(s){this.setIconAndPaddingSizes(e,i,r.sizeMapppings[e],s)}};r.prototype.setIconAndPaddingSizes=function(e,t,a,i){r.sizeMapppings[e]=this._toPx(a);r.paddingValueMappping[t]=this._toPx(i);this._iPxIconSize=r.sizeMapppings[e];this._iPxPaddingSize=r.paddingValueMappping[t]};r.prototype.onAfterRendering=function(){this._updateAriaValues()};r.prototype.exit=function(){this._iIconCounter=null;this._fStartValue=null;this._iPxIconSize=null;this._iPxPaddingSize=null;this._fHoverValue=null;this._oResourceBundle=null};r.prototype._getDensityMode=function(){var e=[{name:"Cozy",style:"sapUiSizeCozy"},{name:"Compact",style:"sapUiSizeCompact"},{name:"Condensed",style:"sapUiSizeCondensed"}],t,a,i;for(i in e){t=e[i].style;if(o("html").hasClass(t)||o("."+t).length>0){a=e[i].name}}return a||e[0].name};r.prototype._getIconSizeLabel=function(e){switch(true){case e>=32:return"L";case e>=22:return"M";case e>=16:return"S";case e>=12:return"XS";default:return"M"}};r.prototype._toPx=function(e){var t=Math.round(e),a;if(isNaN(t)){if(RegExp("^(auto|0)$|^[+-.]?[0-9].?([0-9]+)?(px|em|rem|ex|%|in|cm|mm|pt|pc)$").test(e)){a=o('<div style="display: none; width: '+e+'; margin: 0; padding:0; height: auto; line-height: 1; font-size: 1; border:0; overflow: hidden">&nbsp;</div>').appendTo(sap.ui.getCore().getStaticAreaRef());t=a.width();a.remove()}else{return false}}return Math.round(t)};r.prototype._updateUI=function(e,t){var a=this.$("sel"),i=this.$("unsel-wrapper"),s=this.$("hov"),o=this._iPxIconSize,u=this._iPxPaddingSize,r="px",l=this.getMaxValue(),p=e*o+(Math.round(e)-1)*u,h=l*(o+u)-u;this._fHoverValue=e;if(p<0){p=0}this._updateAriaValues(e);i.width(h-p+r);if(t){s.width(p+r);a.hide();s.show()}else{a.width(p+r);s.hide();a.show()}n.debug("Updated rating UI with value "+e+" and hover mode "+t)};r.prototype._updateAriaValues=function(e){var t=this.$();var a;if(e===undefined){a=this.getValue()}else{a=e}var i=this.getMaxValue();t.attr("aria-valuenow",a);t.attr("aria-valuemax",i);var s=this._oResourceBundle.getText("RATING_VALUEARIATEXT",[a,i]);t.attr("aria-valuetext",s)};r.prototype._calculateSelectedValue=function(e){var t=-1,a=0,i=this.$(),s=(i.innerWidth()-i.width())/2,n,o=sap.ui.getCore().getConfiguration().getRTL();if(e.targetTouches){n=e.targetTouches[0]}else{n=e}if(!n||!n.pageX){n=e;if((!n||!n.pageX)&&e.changedTouches){n=e.changedTouches[0]}}if(!n.pageX){return parseFloat(t)}if(n.pageX<i.offset().left){t=0}else if(n.pageX-i.offset().left>i.innerWidth()-s){t=this.getMaxValue()}else{a=(n.pageX-i.offset().left-s)/i.width();t=a*this.getMaxValue()}if(o){t=this.getMaxValue()-t}return this._roundValueToVisualMode(t,true)};r.prototype._roundValueToVisualMode=function(e,t){if(t){if(e<.25){e=0}else if(e<this.getMaxValue()-.4){e+=.4}e=Math.round(e)}else{if(this.getVisualMode()===u.Full){e=Math.round(e)}else if(this.getVisualMode()===u.Half){e=Math.round(e*2)/2}}return parseFloat(e)};r.prototype._getIncreasedValue=function(){var e=this.getMaxValue(),t=this.getValue()+this._getValueChangeStep();if(t>e){t=e}return t};r.prototype._getDecreasedValue=function(){var e=this.getValue()-this._getValueChangeStep();if(e<0){e=0}return e};r.prototype._getValueChangeStep=function(){var e=this.getVisualMode(),t;switch(e){case u.Full:t=1;break;case u.Half:if(this.getValue()%1===.5){t=.5}else{t=1}break;default:n.warning("VisualMode not supported",e)}return t};r.prototype.ontouchstart=function(e){if(e.which==2||e.which==3||!this.getEnabled()||this.getDisplayOnly()||!this.getEditable()){return}e.setMarked();if(!this._touchEndProxy){this._touchEndProxy=o.proxy(this._ontouchend,this)}if(!this._touchMoveProxy){this._touchMoveProxy=o.proxy(this._ontouchmove,this)}o(document).on("touchend.sapMRI touchcancel.sapMRI mouseup.sapMRI",this._touchEndProxy);o(document).on("touchmove.sapMRI mousemove.sapMRI",this._touchMoveProxy);this._fStartValue=this.getValue();var t=this._calculateSelectedValue(e);if(t>=0&&t<=this.getMaxValue()){this._updateUI(t,true);if(this._fStartValue!==t){this.fireLiveChange({value:t})}}};r.prototype._ontouchmove=function(e){if(e.isMarked("delayedMouseEvent")){return}e.preventDefault();if(this.getEnabled()){var t=this._calculateSelectedValue(e);if(t>=0&&t<=this.getMaxValue()){this._updateUI(t,true);if(this._fStartValue!==t){this.fireLiveChange({value:t})}}}};r.prototype._ontouchend=function(e){if(e.isMarked("delayedMouseEvent")){return}if(this.getEnabled()){var t=this._calculateSelectedValue(e);if(this.getValue()===1&&t===1){t=0}this.setProperty("value",t,true);this._updateUI(t,false);if(this._fStartValue!==t){this.fireLiveChange({value:t});this.fireChange({value:t})}o(document).off("touchend.sapMRI touchcancel.sapMRI mouseup.sapMRI",this._touchEndProxy);o(document).off("touchmove.sapMRI mousemove.sapMRI",this._touchMoveProxy);delete this._fStartValue}};r.prototype.ontouchcancel=r.prototype.ontouchend;r.prototype.onsapincrease=function(e){var t=this._getIncreasedValue();this._handleKeyboardValueChange(e,t)};r.prototype.onsapdecrease=function(e){var t=this._getDecreasedValue();this._handleKeyboardValueChange(e,t)};r.prototype.onsaphome=function(e){var t=0;this._handleKeyboardValueChange(e,t)};r.prototype.onsapend=function(e){var t=this.getMaxValue();this._handleKeyboardValueChange(e,t)};r.prototype.onsapselect=function(e){var t;if(this.getValue()===this.getMaxValue()){t=0}else{t=this._getIncreasedValue()}this._handleKeyboardValueChange(e,t)};r.prototype.onkeyup=function(e){var t=this.getMaxValue();if(!this.getEnabled()||this.getDisplayOnly()||!this.getEditable()){return false}switch(e.which){case s.DIGIT_0:case s.NUMPAD_0:this.setValue(0);break;case s.DIGIT_1:case s.NUMPAD_1:this.setValue(1);break;case s.DIGIT_2:case s.NUMPAD_2:this.setValue(Math.min(2,t));break;case s.DIGIT_3:case s.NUMPAD_3:this.setValue(Math.min(3,t));break;case s.DIGIT_4:case s.NUMPAD_4:this.setValue(Math.min(4,t));break;case s.DIGIT_5:case s.NUMPAD_5:this.setValue(Math.min(5,t));break;case s.DIGIT_6:case s.NUMPAD_6:this.setValue(Math.min(6,t));break;case s.DIGIT_7:case s.NUMPAD_7:this.setValue(Math.min(7,t));break;case s.DIGIT_8:case s.NUMPAD_8:this.setValue(Math.min(8,t));break;case s.DIGIT_9:case s.NUMPAD_9:this.setValue(Math.min(9,t));break}};r.prototype._handleKeyboardValueChange=function(e,t){if(!this.getEnabled()||this.getDisplayOnly()||!this.getEditable()){return}if(t!==this.getValue()){this.setValue(t);this.fireLiveChange({value:t});this.fireChange({value:t})}if(e){e.preventDefault();e.stopPropagation()}};r.prototype.getAccessibilityInfo=function(){var e=sap.ui.getCore().getLibraryResourceBundle("sap.m");return{role:"slider",type:e.getText("ACC_CTR_TYPE_RATING"),description:e.getText("ACC_CTR_STATE_RATING",[this.getValue(),this.getMaxValue()]),focusable:this.getEnabled()&&!this.getDisplayOnly(),enabled:this.getEnabled(),editable:this.getEditable()}};return r});
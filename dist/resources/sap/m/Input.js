/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./InputBase","./Popover","sap/ui/core/Item","./ColumnListItem","./GroupHeaderListItem","./StandardListItem","sap/ui/core/SeparatorItem","./List","./Table","./library","sap/ui/core/IconPool","sap/ui/Device","./SuggestionsPopover","./Toolbar","./ToolbarSpacer","./Button","sap/ui/core/ResizeHandler","sap/ui/dom/containsOrEquals","sap/base/assert","sap/base/util/deepEqual","sap/m/inputUtils/wordStartsWithValue","sap/m/inputUtils/inputsDefaultFilter","sap/m/inputUtils/highlightDOMElements","sap/m/inputUtils/typeAhead","sap/ui/events/KeyCodes","sap/m/inputUtils/filterItems","sap/m/inputUtils/ListHelpers","sap/m/inputUtils/calculateSelectionStart","sap/m/inputUtils/selectionRange","./InputRenderer","sap/ui/base/ManagedObject","sap/ui/base/ManagedObjectObserver","sap/ui/thirdparty/jquery","sap/ui/dom/jquery/selectText"],function(e,t,s,i,o,n,u,r,a,g,p,l,h,c,f,d,S,_,y,m,v,I,b,V,T,P,w,R,M,L,F,A,C){"use strict";var D=g.ListType;var H=g.InputTextFormatMode;var x=g.InputType;var O=g.ListMode;var B=g.ListSeparators;var E=e.extend("sap.m.Input",{metadata:{library:"sap.m",properties:{type:{type:"sap.m.InputType",group:"Data",defaultValue:x.Text},maxLength:{type:"int",group:"Behavior",defaultValue:0},dateFormat:{type:"string",group:"Misc",defaultValue:"YYYY-MM-dd",deprecated:true},showValueHelp:{type:"boolean",group:"Behavior",defaultValue:false},valueHelpIconSrc:{type:"sap.ui.core.URI",group:"Behavior",defaultValue:"sap-icon://value-help"},showSuggestion:{type:"boolean",group:"Behavior",defaultValue:false},valueHelpOnly:{type:"boolean",group:"Behavior",defaultValue:false},filterSuggests:{type:"boolean",group:"Behavior",defaultValue:true},maxSuggestionWidth:{type:"sap.ui.core.CSSSize",group:"Appearance",defaultValue:null},startSuggestion:{type:"int",group:"Behavior",defaultValue:1},showTableSuggestionValueHelp:{type:"boolean",group:"Behavior",defaultValue:true},description:{type:"string",group:"Misc",defaultValue:null},fieldWidth:{type:"sap.ui.core.CSSSize",group:"Appearance",defaultValue:"50%"},valueLiveUpdate:{type:"boolean",group:"Behavior",defaultValue:false},selectedKey:{type:"string",group:"Data",defaultValue:""},textFormatMode:{type:"sap.m.InputTextFormatMode",group:"Misc",defaultValue:H.Value},textFormatter:{type:"any",group:"Misc",defaultValue:""},suggestionRowValidator:{type:"any",group:"Misc",defaultValue:""},enableSuggestionsHighlighting:{type:"boolean",group:"Behavior",defaultValue:true},enableTableAutoPopinMode:{type:"boolean",group:"Behavior",defaultValue:false},autocomplete:{type:"boolean",group:"Behavior",defaultValue:true}},defaultAggregation:"suggestionItems",aggregations:{suggestionItems:{type:"sap.ui.core.Item",multiple:true,singularName:"suggestionItem"},suggestionColumns:{type:"sap.m.Column",multiple:true,singularName:"suggestionColumn",bindable:"bindable",forwarding:{getter:"_getSuggestionsTable",aggregation:"columns"}},suggestionRows:{type:"sap.m.ColumnListItem",altTypes:["sap.m.GroupHeaderListItem"],multiple:true,singularName:"suggestionRow",bindable:"bindable",forwarding:{getter:"_getSuggestionsTable",aggregation:"items"}},_suggestionPopup:{type:"sap.ui.core.Control",multiple:false,visibility:"hidden"},_valueHelpIcon:{type:"sap.ui.core.Icon",multiple:false,visibility:"hidden"}},associations:{selectedItem:{type:"sap.ui.core.Item",multiple:false},selectedRow:{type:"sap.m.ColumnListItem",multiple:false}},events:{liveChange:{parameters:{value:{type:"string"},escPressed:{type:"boolean"},previousValue:{type:"string"}}},valueHelpRequest:{parameters:{fromSuggestions:{type:"boolean"}}},suggest:{parameters:{suggestValue:{type:"string"},suggestionColumns:{type:"sap.m.ListBase"}}},suggestionItemSelected:{parameters:{selectedItem:{type:"sap.ui.core.Item"},selectedRow:{type:"sap.m.ColumnListItem"}}},submit:{parameters:{value:{type:"string"}}}},designtime:"sap/m/designtime/Input.designtime"}});p.insertFontFaceStyle();E._DEFAULTFILTER_TABULAR=function(e,t){var s=t.getCells(),i=0;for(;i<s.length;i++){if(s[i].getText){if(v(s[i].getText(),e)){return true}}}return false};E._DEFAULTRESULT_TABULAR=function(e){if(!e||e.isA("sap.m.GroupHeaderListItem")){return""}var t=e.getCells(),s=0;for(;s<t.length;s++){if(t[s].getText){return t[s].getText()}}return""};E.prototype.init=function(){e.prototype.init.call(this);this._iSetCount=0;this._sProposedItemText=null;this._oRb=sap.ui.getCore().getLibraryResourceBundle("sap.m");if(this.getId().indexOf("popup-input")===-1){this._createSuggestionsPopover()}this._setTypedInValue("")};E.prototype.exit=function(){e.prototype.exit.call(this);this._deregisterEvents();this.cancelPendingSuggest();if(this._iRefreshListTimeout){clearTimeout(this._iRefreshListTimeout);this._iRefreshListTimeout=null}this._destroySuggestionsTable();if(this._getSuggestionsPopover()){this._oSuggestionPopup=null;this._oSuggPopover.destroy();this._oSuggPopover=null}this.$().off("click")};E.prototype.onBeforeRendering=function(){var t=this.getSelectedKey(),s=this.getShowValueHelp()&&this.getEnabled()&&this.getEditable(),i=this.getAggregation("_endIcon")||[],o=i[0],n=this._getSuggestionsPopover(),u=n&&this._isSuggestionsPopoverOpen(),r=n&&n.getInput(),a=u?n._getValueStateHeader().getText():null,g=u?n._getValueStateHeader().getValueState():"";e.prototype.onBeforeRendering.call(this);this._deregisterEvents();if(t){this.setSelectedKey(t)}if(this.getShowSuggestion()){if(this.getShowTableSuggestionValueHelp()){this._addShowMoreButton()}else{this._removeShowMoreButton()}if(r){r.setType(this.getType())}}if(s){o=this._getValueHelpIcon();o.setProperty("visible",true,true)}else if(o){o.setProperty("visible",false,true)}if(!this.getWidth()){this.setProperty("width","100%",true)}if(this._hasTabularSuggestions()){this._getSuggestionsTable().setAutoPopinMode(this.getEnableTableAutoPopinMode());this._getSuggestionsTable().setContextualWidth(this.getEnableTableAutoPopinMode()?"Auto":"Inherit")}if(u&&(this.getValueStateText()&&a!==this.getValueStateText()||this.getValueState()!==g||this.getFormattedValueStateText())){this._updateSuggestionsPopoverValueState()}};E.prototype._getDisplayText=function(e){var t=this.getTextFormatter();if(t){return t(e)}var s=e.getText(),i=e.getKey(),o=this.getTextFormatMode();switch(o){case H.Key:return i;case H.ValueKey:return s+" ("+i+")";case H.KeyValue:return"("+i+") "+s;default:return s}};E.prototype._onValueUpdated=function(e){if(this._bSelectingItem||e===this._sSelectedValue){return}var t=this.getSelectedKey(),s,i=this._getSuggestionsPopover(),o=i&&i.getItemsContainer();if(t===""){return}if(this._hasTabularSuggestions()){s=this._getSuggestionsTable()&&!!this._getSuggestionsTable().getSelectedItem()}else{s=o&&!!o.getSelectedItem()}if(s){return}this.setProperty("selectedKey","",true);this.setAssociation("selectedRow",null,true);this.setAssociation("selectedItem",null,true);this.fireSuggestionItemSelected({selectedItem:null,selectedRow:null})};E.prototype.setSelectionItem=function(e,t){this._bSelectingItem=true;if(!e){this.setAssociation("selectedItem",null,true);this.setValue("");return}var s=this._iSetCount,i;this.setAssociation("selectedItem",e,true);this.setProperty("selectedKey",e.getKey(),true);if(t){this.fireSuggestionItemSelected({selectedItem:e})}if(s!==this._iSetCount){i=this.getValue()}else{i=this._getDisplayText(e)}this._sSelectedValue=i;this.updateInputField(i);if(this.bIsDestroyed){return}if(!(this.isMobileDevice()&&this instanceof sap.m.MultiInput)){this._closeSuggestionPopup()}this._bSelectingItem=false;this._resetTypeAhead()};E.prototype.addSuggestionRowGroup=function(e,t,s){t=t||new o({title:F.escapeSettingsValue(e.text)||F.escapeSettingsValue(e.key)});this._createSuggestionPopupContent(true);this.addAggregation("suggestionRows",t,s);return t};E.prototype.addSuggestionItemGroup=function(e,t,s){t=t||new u({text:F.escapeSettingsValue(e.text)||F.escapeSettingsValue(e.key)});this._createSuggestionPopupContent(false);this.addAggregation("suggestionItems",t,s);return t};E.prototype.setSelectedItem=function(e){if(typeof e==="string"){e=sap.ui.getCore().byId(e)}if(e!==null&&!(e instanceof s)){return this}this.setSelectionItem(e);return this};E.prototype.setSelectedKey=function(e){e=this.validateProperty("selectedKey",e);this.setProperty("selectedKey",e,true);if(this._hasTabularSuggestions()){return this}if(!e){this.setSelectionItem();return this}var t=this.getSuggestionItemByKey(e);this.setSelectionItem(t);return this};E.prototype.getSuggestionItemByKey=function(e){var t=this.getSuggestionItems()||[],s,i;for(i=0;i<t.length;i++){s=t[i];if(s.getKey()===e){return s}}};E.prototype._getFormattedValueStateText=function(){var t=this._isSuggestionsPopoverOpen(),s=t?this._getSuggestionsPopover()._getValueStateHeader().getFormattedText():null;if(t&&s){return s}else{return e.prototype.getFormattedValueStateText.call(this)}};E.prototype.setSelectionRow=function(e,t){if(!e){this.setAssociation("selectedRow",null,true);return}this._bSelectingItem=true;var i,o=this.getSuggestionRowValidator();if(o){i=o(e);if(!(i instanceof s)){i=null}}var n=this._iSetCount,u="",r;this.setAssociation("selectedRow",e,true);if(i){u=i.getKey()}this.setProperty("selectedKey",u,true);if(t){this.fireSuggestionItemSelected({selectedRow:e})}if(n!==this._iSetCount){r=this.getValue()}else{if(i){r=this._getDisplayText(i)}else{r=this._getRowResultFunction()(e)}}this._sSelectedValue=r;this.updateInputField(r);if(this.bIsDestroyed){return}if(!(this.isMobileDevice()&&this instanceof sap.m.MultiInput&&this._isMultiLineMode)){this.setSelectionUpdatedFromList(false);this._closeSuggestionPopup()}this._bSelectingItem=false};E.prototype.setSelectedRow=function(e){if(typeof e==="string"){e=sap.ui.getCore().byId(e)}if(e!==null&&!(e instanceof i)){return this}this.setSelectionRow(e);return this};E.prototype._getValueHelpIcon=function(){var e=this,t=this.getAggregation("_endIcon")||[],s=this.getValueHelpIconSrc(),i=t[0];if(!i){i=this.addEndIcon({id:this.getId()+"-vhi",src:s,useIconTooltip:false,alt:this._oRb.getText("INPUT_VALUEHELP_BUTTON"),decorative:false,noTabStop:true,press:function(t){if(!e.getValueHelpOnly()){var s=this.getParent(),i;if(l.support.touch){i=s.$("inner");i.attr("readonly","readonly");s.focus();i.removeAttr("readonly")}else{s.focus()}e.bValueHelpRequested=true;e._fireValueHelpRequest(false)}}})}else if(i.getSrc()!==s){i.setSrc(s)}return i};E.prototype._fireValueHelpRequest=function(e){var t="";if(this.getShowSuggestion()&&!this.isMobileDevice()){t=this._getTypedInValue()||""}else{t=this.getDOMValue()}this.fireValueHelpRequest({fromSuggestions:e,_userInputValue:t})};E.prototype._fireValueHelpRequestForValueHelpOnly=function(){if(this.getEnabled()&&this.getEditable()&&this.getShowValueHelp()&&this.getValueHelpOnly()){if(l.system.phone){this.focus()}this._fireValueHelpRequest(false)}};E.prototype.ontap=function(t){e.prototype.ontap.call(this,t);if(this.isValueHelpOnlyOpener(t.target)){this._fireValueHelpRequestForValueHelpOnly()}if(this.isMobileDevice()&&this.getEditable()&&this.getEnabled()&&this.getShowSuggestion()&&t.target.id!==this.getId()+"-vhi"){this._openSuggestionsPopover()}};E.prototype.setFilterFunction=function(e){if(e===null||e===undefined){this._fnFilter=I;return this}y(typeof e==="function","Input.setFilterFunction: first argument fnFilter must be a function on "+this);this._fnFilter=e;return this};E.prototype._getFilterFunction=function(e){if(typeof this._fnFilter==="function"&&!e){return this._fnFilter}return!this._hasTabularSuggestions()?I:E._DEFAULTFILTER_TABULAR};E.prototype.setRowResultFunction=function(e){var t;if(e===null||e===undefined){this._fnRowResultFilter=E._DEFAULTRESULT_TABULAR;return this}y(typeof e==="function","Input.setRowResultFunction: first argument fnFilter must be a function on "+this);this._fnRowResultFilter=e;t=this.getSelectedRow();if(t){this.setSelectedRow(t)}return this};E.prototype._getRowResultFunction=function(e){if(typeof this._fnRowResultFilter==="function"&&!e){return this._fnRowResultFilter}return E._DEFAULTRESULT_TABULAR};E.prototype.closeSuggestions=function(){this._closeSuggestionPopup()};E.prototype._doSelect=function(e,t){if(l.support.touch){return}var s=this._$input[0];if(s){var i=this._$input;s.focus();i.selectText(e?e:0,t?t:i.val().length)}return this};E.prototype._isIncrementalType=function(){var e=this.getType();if(e==="Number"||e==="Date"||e==="Datetime"||e==="Month"||e==="Time"||e==="Week"){return true}return false};E.prototype.onsapescape=function(t){if(this._isSuggestionsPopoverOpen()){t.originalEvent._sapui_handledByControl=true;this.setSelectionUpdatedFromList(false);this._closeSuggestionPopup();if(this._getTypedInValue()!==this.getValue()){this.setValue(this._getTypedInValue())}return}if(this.getValueLiveUpdate()){this.setProperty("value",this.getLastValue(),true)}if(e.prototype.onsapescape){e.prototype.onsapescape.apply(this,arguments)}};E.prototype.onsapenter=function(t){var s=this._isSuggestionsPopoverOpen(),i=!this.hasStyleClass("sapMFocus")&&s,o=this._hasTabularSuggestions()?this.getSuggestionRows():this.getSuggestionItems(),n,u;this.cancelPendingSuggest();i&&this.setSelectionUpdatedFromList(true);if(this.getShowSuggestion()&&this._bDoTypeAhead&&s){u=this._getSuggestionsPopover().getItemsContainer().getSelectedItem();if(this._hasTabularSuggestions()){u&&this.setSelectionRow(u,true)}else{u&&this.setSelectionItem(w.getItemByListItem(o,u),true)}}if(s&&!this.isComposingCharacter()){this._closeSuggestionPopup();n=this.getDOMValue()?this.getDOMValue().length:null;this.selectText(n,n)}!i&&e.prototype.onsapenter.apply(this,arguments);if(this.getEnabled()&&this.getEditable()&&!(this.getValueHelpOnly()&&this.getShowValueHelp())){this.fireSubmit({value:this.getValue()})}if(!this.isMobileDevice()){this._resetTypeAhead()}};E.prototype.onsapfocusleave=function(t){var s=this._getSuggestionsPopover(),i=s&&s.getPopover(),o=i&&i.isA("sap.m.Popover"),n=t.relatedControlId&&sap.ui.getCore().byId(t.relatedControlId),u=n&&n.getFocusDomRef(),r=i&&u&&_(i.getDomRef(),u);if(o){if(r&&!s.getValueStateActiveState()){this._bPopupHasFocus=true;if(l.system.desktop&&m(i.getFocusDomRef(),u)||n.isA("sap.m.GroupHeaderListItem")){this.focus()}}else{if(this.getDOMValue()===this._sSelectedSuggViaKeyboard){this._sSelectedSuggViaKeyboard=null}}}if(!r){e.prototype.onsapfocusleave.apply(this,arguments)}this.bValueHelpRequested=false};E.prototype.onsaptabnext=function(){if(!this.isMobileDevice()&&this._sProposedItemText){var e=this.getSuggestionItems().filter(function(e){return e.getText()===this._sProposedItemText}.bind(this))[0];if(e){this.setSelectionItem(e,true);this.selectText(0,0)}}};E.prototype.onmousedown=function(e){if(this._isSuggestionsPopoverOpen()){e.stopPropagation()}};["onsapup","onsapdown","onsappageup","onsappagedown","onsaphome","onsapend"].forEach(function(e){E.prototype[e]=function(t){if((e==="onsapup"||e==="onsapdown")&&this.isComposingCharacter()){return}if(this.getShowSuggestion()){this._getSuggestionsPopover().handleListNavigation(this,t);if(this._isIncrementalType()){t.setMarked()}this.setSelectionUpdatedFromList(true)}}});E.prototype.setSelectionUpdatedFromList=function(e){this._bSelectionUpdatedFromList=e};E.prototype.getSelectionUpdatedFromList=function(){return this._bSelectionUpdatedFromList};E.prototype.updateSelectionFromList=function(e){if(this._hasTabularSuggestions()&&this.getSelectedRow()!==e){this.setSelectionRow(e,true)}else{var t=w.getItemByListItem(this.getSuggestionItems(),e);t&&this.getSelectedItem()!==t.getId()&&this.setSelectionItem(t,true)}this.setSelectionUpdatedFromList(false)};E.prototype._deregisterEvents=function(){this._deregisterPopupResize();if(this.isMobileDevice()&&this._getSuggestionsPopover()&&this._getSuggestionsPopover().getPopover()){this.$().off("click")}};E.prototype.updateSuggestionItems=function(){this._bSuspendInvalidate=true;this.updateAggregation("suggestionItems");this._synchronizeSuggestions();this._bSuspendInvalidate=false;return this};E.prototype.invalidate=function(){if(!this._bSuspendInvalidate){e.prototype.invalidate.apply(this,arguments)}};E.prototype.cancelPendingSuggest=function(){if(this._iSuggestDelay){clearTimeout(this._iSuggestDelay);this._iSuggestDelay=null}};E.prototype._triggerSuggest=function(e){var t=this._getSuggestionsPopover().getItemsContainer();this.cancelPendingSuggest();this._bShouldRefreshListItems=true;if(!e){e=""}if(e.length>=this.getStartSuggestion()){this._iSuggestDelay=setTimeout(function(){if(this._sPrevSuggValue!==e){this._bBindingUpdated=false;this.fireSuggest({suggestValue:e});if(!this._bBindingUpdated){this._refreshItemsDelayed()}this._sPrevSuggValue=e}}.bind(this),300)}else if(this.isMobileDevice()){if(t instanceof a){t.addStyleClass("sapMInputSuggestionTableHidden")}else if(t&&t.destroyItems){t.destroyItems()}}else if(this._isSuggestionsPopoverOpen()){setTimeout(function(){var e=this.getDOMValue()||"";if(e<this.getStartSuggestion()){this._closeSuggestionPopup()}}.bind(this),0)}};E.prototype._shouldTriggerSuggest=function(){return!this._bPopupHasFocus&&!this.getStartSuggestion()&&!this.getValue()&&this.getShowSuggestion()};E.prototype.setShowTableSuggestionValueHelp=function(e){var t=this._getSuggestionsPopover();this.setProperty("showTableSuggestionValueHelp",e,true);if(!t.getPopover()){return this}if(e){this._addShowMoreButton()}else{this._removeShowMoreButton()}return this};E.prototype.onchange=function(e){if(this.getShowValueHelp()||this.getShowSuggestion()){return}this.onChange(e)};E.prototype.oninput=function(t){e.prototype.oninput.call(this,t);if(t.isMarked("invalid")){return}var s=this.getDOMValue(),i,o,n;if(this.getValueLiveUpdate()){this.setProperty("value",s,true);this._onValueUpdated(s)}this.fireLiveChange({value:s,newValue:s});this.addStyleClass("sapMFocus");if(this.getShowSuggestion()&&!this.isMobileDevice()){i=this._getSuggestionsPopover();o=i.getItemsContainer();this._triggerSuggest(s);if(o&&!i.getValueStateActiveState()){n=o&&o.getSelectedItem();o.removeStyleClass("sapMListFocus");n&&n.removeStyleClass("sapMLIBFocused")}else if(i.getValueStateActiveState()&&document.activeElement.tagName!=="A"){i._getValueStateHeader().removeStyleClass("sapMPseudoFocus")}}this._handleTypeAhead(this)};E.prototype.onkeydown=function(e){this._bDoTypeAhead=!l.os.android&&this.getAutocomplete()&&e.which!==T.BACKSPACE&&e.which!==T.DELETE};E.prototype.getValue=function(){return this.getDomRef("inner")&&this._$input?this.getDOMValue():this.getProperty("value")};E.prototype._refreshItemsDelayed=function(){clearTimeout(this._iRefreshListTimeout);this._iRefreshListTimeout=setTimeout(this._refreshListItems.bind(this),0)};E.prototype._clearSuggestionPopupItems=function(){var e=this._getSuggestionsPopover().getItemsContainer();if(!e){return}if(e instanceof a){e.removeSelections(true)}else{e.destroyItems()}};E.prototype._hideSuggestionPopup=function(){var e=this._getSuggestionsPopover(),t=e.getPopover(),s=e.getItemsContainer();if(!this.isMobileDevice()){if(this._isSuggestionsPopoverOpen()){this._sCloseTimer=setTimeout(function(){this.cancelPendingSuggest();if(this._getTypedInValue()){this.setDOMValue(this._getTypedInValue())}t.close()}.bind(this),0)}}else if(this._hasTabularSuggestions()&&s){s.addStyleClass("sapMInputSuggestionTableHidden")}this.$("SuggDescr").text("");this.$("inner").removeAttr("aria-activedescendant")};E.prototype._openSuggestionPopup=function(e){if(!this.isMobileDevice()){if(this._sCloseTimer){clearTimeout(this._sCloseTimer);this._sCloseTimer=null}if(!this._isSuggestionsPopoverOpen()&&!this._sOpenTimer&&e!==false&&this.getShowSuggestion()){this._sOpenTimer=setTimeout(function(){this._sOpenTimer=null;this._getSuggestionsPopover()&&this._openSuggestionsPopover()}.bind(this),0)}}};E.prototype._applySuggestionAcc=function(e){var t="",s=this._oRb;setTimeout(function(){if(e===1){t=s.getText("INPUT_SUGGESTIONS_ONE_HIT")}else if(e>1){t=s.getText("INPUT_SUGGESTIONS_MORE_HITS",e)}else{t=s.getText("INPUT_SUGGESTIONS_NO_HIT")}this.$("SuggDescr").text(t)}.bind(this),0)};E.prototype._refreshListItems=function(){var e=this.getShowSuggestion(),t=this._bDoTypeAhead?this._getTypedInValue():this.getDOMValue()||"",s,i;if(!e||!this._bShouldRefreshListItems||!this.getDomRef()||!this.isMobileDevice()&&!this.$().hasClass("sapMInputFocused")){return null}this._clearSuggestionPopupItems();if(t.length<this.getStartSuggestion()){this._hideSuggestionPopup();return false}s=this._getFilteredSuggestionItems(t);i=s.items.length;if(i>0){this._openSuggestionPopup(this.getValue().length>=this.getStartSuggestion())}else{this._hideSuggestionPopup()}this._applySuggestionAcc(i)};E.prototype.addSuggestionItem=function(e){this.addAggregation("suggestionItems",e,true);this._synchronizeSuggestions();this._createSuggestionPopupContent();return this};E.prototype.insertSuggestionItem=function(e,t){this.insertAggregation("suggestionItems",t,e,true);this._synchronizeSuggestions();this._createSuggestionPopupContent();return this};E.prototype.removeSuggestionItem=function(e){var t=this.removeAggregation("suggestionItems",e,true);this._synchronizeSuggestions();return t};E.prototype.removeAllSuggestionItems=function(){var e=this.removeAllAggregation("suggestionItems",true);this._synchronizeSuggestions();return e};E.prototype.destroySuggestionItems=function(){this.destroyAggregation("suggestionItems",true);this._synchronizeSuggestions();return this};E.prototype.bindAggregation=function(){if(arguments[0]==="suggestionRows"||arguments[0]==="suggestionColumns"||arguments[0]==="suggestionItems"){this._createSuggestionPopupContent(arguments[0]==="suggestionRows"||arguments[0]==="suggestionColumns");this._bBindingUpdated=true}return e.prototype.bindAggregation.apply(this,arguments)};E.prototype._closeSuggestionPopup=function(){this._bShouldRefreshListItems=false;this.cancelPendingSuggest();this._isSuggestionsPopoverOpen()&&this._getSuggestionsPopover().getPopover().close();if(!this.isMobileDevice()&&this.$().hasClass("sapMInputFocused")){this.openValueStateMessage()}this.$("SuggDescr").text("");this.$("inner").removeAttr("aria-activedescendant");this._sPrevSuggValue=null};E.prototype._synchronizeSuggestions=function(){var e=this._getSuggestionsPopover(),t=e&&e.getInput(),s=t&&t.getFocusDomRef();if(document.activeElement===this.getFocusDomRef()||document.activeElement===s){this._bShouldRefreshListItems=true;this._refreshItemsDelayed()}if(!this.getDomRef()||this._isSuggestionsPopoverOpen()){return}this._synchronizeSelection()};E.prototype._synchronizeSelection=function(){var e=this.getSelectedKey();if(!e){return}if(this.getValue()&&!this.getSelectedItem()&&!this.getSelectedRow()){return}this.setSelectedKey(e)};E.prototype.onfocusin=function(t){e.prototype.onfocusin.apply(this,arguments);this.addStyleClass("sapMInputFocused");if(!this.isMobileDevice()&&this._isSuggestionsPopoverOpen()){this.closeValueStateMessage()}if(this._shouldTriggerSuggest()){this._triggerSuggest(this.getValue())}this._bPopupHasFocus=undefined;this._sPrevSuggValue=null};E.prototype.oncompositionend=function(t){e.prototype.oncompositionend.apply(this,arguments);if(!l.browser.firefox){this._handleTypeAhead(this)}};E.prototype._handleTypeAhead=function(e){var t=this.getValue();this._setTypedInValue(t);e._sProposedItemText=null;if(!this._bDoTypeAhead||t===""||t.length<this.getStartSuggestion()||document.activeElement!==this.getFocusDomRef()){return}var s=e._hasTabularSuggestions(),i=s?e.getSuggestionRows():e.getSuggestionItems(),o=function(t){if(!t){return""}return s?e._getRowResultFunction()(t):t.getText()};var n=V(t,this,i,function(e){return this._formatTypedAheadValue(o(e))}.bind(this));e._sProposedItemText=o(n[0])};E.prototype._resetTypeAhead=function(e){e=e||this;e._sProposedItemText=null;this._setTypedInValue("")};E.prototype.onsapright=function(){var e=this.getValue();if(!this.getAutocomplete()){return}if(this._getTypedInValue()!==e){this._setTypedInValue(e);this.fireLiveChange({value:e,newValue:e})}};E.prototype._formatTypedAheadValue=function(e){var t=this._getTypedInValue();if(e.toLowerCase().indexOf(t.toLowerCase())===0){return t.concat(e.substring(t.length,e.length))}else{return e}};E.prototype.onsapshow=function(e){if(!this.getEnabled()||!this.getEditable()||!this.getShowValueHelp()){return}this.bValueHelpRequested=true;this._fireValueHelpRequest(false);e.preventDefault();e.stopPropagation()};E.prototype.onsaphide=E.prototype.onsapshow;E.prototype.onsapselect=function(e){this._fireValueHelpRequestForValueHelpOnly()};E.prototype.onfocusout=function(t){e.prototype.onfocusout.apply(this,arguments);this.removeStyleClass("sapMInputFocused");this.$("SuggDescr").text("")};E.prototype._hasTabularSuggestions=function(){return!!(this.getAggregation("suggestionColumns")&&this.getAggregation("suggestionColumns").length)};E.prototype._getSuggestionsTable=function(){if(this._bIsBeingDestroyed){return null}if(!this._oSuggestionsTable){this._oSuggestionsTable=this._createSuggestionsTable()}return this._oSuggestionsTable};E.prototype._destroySuggestionsTable=function(){if(this._oSuggestionsTable){this._oSuggestionsTable.destroy();this._oSuggestionsTable=null}};E.prototype._createSuggestionsTable=function(){var e;var t=new a(this.getId()+"-popup-table",{mode:O.SingleSelectMaster,showNoData:false,showSeparators:B.None,width:"100%",enableBusyIndicator:false,rememberSelections:false,itemPress:function(e){if(l.system.desktop){this.focus()}var t=e.getParameter("listItem");this.setSelectionRow(t,true)}.bind(this),sticky:[g.Sticky.ColumnHeaders]});t.addEventDelegate({onAfterRendering:function(){var e;if(!this.getEnableSuggestionsHighlighting()){return}e=t.$().find("tbody .sapMLabel");b(e,this._getTypedInValue())}},this);if(this.isMobileDevice()){t.addStyleClass("sapMInputSuggestionTableHidden")}t.updateItems=function(){a.prototype.updateItems.apply(this,arguments);this._refreshItemsDelayed();return this};e=new A(function(e){var t=e.mutation;var s=e.child;var i=e.name==="items";switch(t){case"insert":if(i){s.setType(D.Active);this._createSuggestionPopupContent(true);this._synchronizeSuggestions()}break;case"remove":if(i){this._synchronizeSuggestions()}break;default:break}}.bind(this));e.observe(t,{aggregations:["items","columns"]});return t};E.prototype.clone=function(){var t=e.prototype.clone.apply(this,arguments);t.setRowResultFunction(this._fnRowResultFilter);t.setValue(this.getValue());return t};E.prototype.setValue=function(t){this._iSetCount++;e.prototype.setValue.call(this,t);this._onValueUpdated(t);this._setTypedInValue("");return this};E.prototype.setDOMValue=function(e){this._$input.val(e)};E.prototype.getDOMValue=function(){return this._$input.val()};E.prototype._getInputValue=function(){var t=e.prototype._getInputValue.apply(this,arguments);if(this.getMaxLength()>0){t=t.substring(0,this.getMaxLength())}return t};E.prototype.setMaxLength=function(e){e=this.validateProperty("maxLength",e);this.setProperty("maxLength",e);this.updateDomValue(this.getProperty("value"));return this};E.prototype.updateInputField=function(e){if(this._isSuggestionsPopoverOpen()&&this.isMobileDevice()){this._getSuggestionsPopover().getInput().setValue(e)._doSelect()}else{e=this._getInputValue(e);this.setDOMValue(e);this.onChange(null,null,e)}};E.prototype.getAccessibilityInfo=function(){var t=e.prototype.getAccessibilityInfo.apply(this,arguments);t.description=((t.description||"")+" "+this.getDescription()).trim();return t};E.prototype.preventChangeOnFocusLeave=function(e){return this.bFocusoutDueRendering||this.bValueHelpRequested};E.prototype._getShowMoreButton=function(){return this._getSuggestionsPopover().getShowMoreButton()};E.prototype._getShowMoreButtonPress=function(){var e,t=this._getTypedInValue();if(this.getShowTableSuggestionValueHelp()){if(t){e=t;this.updateDomValue(e);this._resetTypeAhead();this._setTypedInValue(e)}this._fireValueHelpRequest(true);this._closeSuggestionPopup()}};E.prototype._addShowMoreButton=function(){var e=this._getSuggestionsPopover();var t=e&&e.getPopover();if(!t||!this._hasTabularSuggestions()||this._getShowMoreButton()){return}var s=new d({text:this._oRb.getText("INPUT_SUGGESTIONS_SHOW_ALL"),press:this._getShowMoreButtonPress.bind(this)});if(t.isA("sap.m.Dialog")){e.setShowMoreButton(s)}else{e.setShowMoreButton(new c({content:[new f,s]}))}};E.prototype._removeShowMoreButton=function(){var e=this._getSuggestionsPopover();var t=e&&e.getPopover();if(t&&this._hasTabularSuggestions()&&this._getShowMoreButton()){e.removeShowMoreButton()}};E.prototype._hasShowSelectedButton=function(){return false};E.prototype._createSuggestionPopupContent=function(e){var t=this._getSuggestionsPopover();var s=t.getItemsContainer();if(s&&(s.isA("sap.m.Table")&&!e||s.isA("sap.m.List")&&e)){s.destroy();s=null;this._destroySuggestionsTable()}if(this._bIsBeingDestroyed||!t||s){return}t.initContent(this.getId(),e?this._getSuggestionsTable():null);if(!this._hasTabularSuggestions()&&!e){this._decorateSuggestionsPopoverList(t.getItemsContainer())}else{this._decorateSuggestionsPopoverTable()}};E.prototype._decorateSuggestionsPopoverList=function(e){if(!e||!e.isA("sap.m.List")){return}e.addEventDelegate({onAfterRendering:function(){var t,s;if(!this.getEnableSuggestionsHighlighting()){return}t=e.$().find(".sapMSLIInfo, .sapMSLITitleOnly");s=this._bDoTypeAhead?this._getTypedInValue():this.getValue();s=(s||"").toLowerCase();b(t,s)}},this);e.attachItemPress(function(e){if(l.system.desktop){this.focus()}var t=e.getParameter("listItem");if(!t.isA("sap.m.GroupHeaderListItem")){this.setSelectionItem(w.getItemByListItem(this.getSuggestionItems(),t),true)}},this)};E.prototype._decorateSuggestionsPopoverTable=function(){if(this.getShowTableSuggestionValueHelp()){this._addShowMoreButton()}};E.prototype._decoratePopupInput=function(e){if(!e){return}e.setValueLiveUpdate(true);e.setValueState(this.getValueState());e.setShowValueHelp(this.getShowValueHelp());e.attachValueHelpRequest(function(){this.fireValueHelpRequest({fromSuggestions:true});this._getSuggestionsPopover().iPopupListSelectedIndex=-1;this._closeSuggestionPopup()}.bind(this));e.attachLiveChange(function(e){var t=e.getParameter("newValue");this.setDOMValue(this._getInputValue(this._getSuggestionsPopover().getInput().getValue()));this._triggerSuggest(t);this.fireLiveChange({value:t,newValue:t})}.bind(this));e._handleTypeAhead=function(){E.prototype._handleTypeAhead.call(e,this)}.bind(this);e._resetTypeAhead=function(){E.prototype._resetTypeAhead.call(e,this)}.bind(this);e.addEventDelegate({onsapenter:function(){this.setValue(this._sProposedItemText)}},this);return e};E.prototype.forwardEventHandlersToSuggPopover=function(e){e.setOkPressHandler(this._closeSuggestionPopup.bind(this));e.setCancelPressHandler(this._closeSuggestionPopup.bind(this))};E.prototype._getSuggestionsPopover=function(){return this._oSuggPopover};E.prototype._createSuggestionsPopover=function(){var e=this._oSuggPopover=new h(this);e.decorateParent(this);e.setInputLabels(this.getLabels.bind(this));this._createSuggestionsPopoverPopup();this.forwardEventHandlersToSuggPopover(e);e.attachEvent(h.M_EVENTS.SELECTION_CHANGE,function(e){var t=e.getParameter("newItem"),s=this.calculateNewValue(t),i=t&&t.isA("sap.m.GroupHeaderListItem"),o=this.getFocusDomRef(),n=o&&o.value.substring(0,o.selectionStart),u=e.getParameter("previousItem"),r=u&&u.isA("sap.m.GroupHeaderListItem"),a=R(M(o,r),s,n,r);if(!t){this.setDOMValue(n)}else if(i){this.setDOMValue("")}else{this.setDOMValue(s);a=a===0&&s.indexOf(n)===0?n.length:a;this._doSelect(a)}this._sSelectedSuggViaKeyboard=s},this);if(this.getShowTableSuggestionValueHelp()){this._addShowMoreButton()}return this._oSuggPopover};E.prototype.calculateNewValue=function(e){if(!e||e&&e.isA("sap.m.GroupHeaderListItem")){return""}if(e.isA("sap.m.ColumnListItem")){return this._getInputValue(this._getRowResultFunction()(e))}if(e.isA("sap.m.StandardListItem")){return this._getInputValue(e.getTitle())}};E.prototype._createSuggestionsPopoverPopup=function(){var e=this._getSuggestionsPopover();var t;e.createSuggestionPopup(this,{showSelectedButton:this._hasShowSelectedButton()});this._decoratePopupInput(e.getInput());t=e.getPopover();t.attachBeforeOpen(function(){this._updateSuggestionsPopoverValueState()},this);t.attachBeforeClose(function(){this._updateSuggestionsPopoverValueState()},this);if(this.isMobileDevice()){t.attachBeforeClose(function(){this.setDOMValue(this._getInputValue(e.getInput().getValue()));this.onChange()},this).attachAfterClose(function(){var t=e.getItemsContainer();if(!t){return}if(a&&!(t instanceof a)){t.destroyItems()}else{t.removeSelections(true)}}).attachAfterOpen(function(){this._triggerSuggest(this.getValue());this._refreshListItems()},this).attachBeforeOpen(function(){var t=e.getInput();t.setPlaceholder(this.getPlaceholder());t.setMaxLength(this.getMaxLength());t.setValue(this.getValue())},this)}else{t.attachAfterClose(function(){var e=this._getSuggestionsPopover().getItemsContainer(),t=e&&e.getSelectedItem();if(this.getSelectionUpdatedFromList()){this.updateSelectionFromList(t)}if(!e){return}if(e instanceof a){t&&t.removeStyleClass("sapMLIBFocused");e.removeSelections(true)}else{e.destroyItems()}this._deregisterPopupResize();this.addStyleClass("sapMFocus")},this).attachBeforeOpen(function(){e._sPopoverContentWidth=this.getMaxSuggestionWidth();e.resizePopup(this);this._registerPopupResize()},this)}this.setAggregation("_suggestionPopup",t);this._oSuggestionPopup=t};E.prototype._registerPopupResize=function(){var e=this._getSuggestionsPopover();this._sPopupResizeHandler=S.register(this,e.resizePopup.bind(e,this))};E.prototype._deregisterPopupResize=function(){if(this._sPopupResizeHandler){this._sPopupResizeHandler=S.deregister(this._sPopupResizeHandler)}};E.prototype.showItems=function(e){var t,s,i=this._getFilterFunction();if(!this.getEnabled()||!this.getEditable()){return}this.setFilterFunction(e||function(){return true});this._clearSuggestionPopupItems();t=this._getFilteredSuggestionItems(this.getDOMValue());s=t.items.length;if(s>0){this._openSuggestionPopup()}else{this._hideSuggestionPopup()}this._applySuggestionAcc(s);this.setFilterFunction(i)};E.prototype.shouldValueStateMessageBeOpened=function(){var t=e.prototype.shouldValueStateMessageBeOpened.apply(this,arguments);if(!t||this._isSuggestionsPopoverOpen()){return false}return true};E.prototype._isSuggestionsPopoverOpen=function(){return this._getSuggestionsPopover()&&this._getSuggestionsPopover().isOpen()};E.prototype.isMobileDevice=function(){return l.system.phone};E.prototype._openSuggestionsPopover=function(){this.closeValueStateMessage();this._updateSuggestionsPopoverValueState();this._getSuggestionsPopover().getPopover().open()};E.prototype._updateSuggestionsPopoverValueState=function(){var e=this._getSuggestionsPopover(),t=this.getValueState(),s=this.getValueState()!==e._getValueStateHeader().getValueState(),i=this.getFormattedValueStateText(),o=this.getValueStateText();if(!e){return}if(this._isSuggestionsPopoverOpen()&&!i&&!s){this.setFormattedValueStateText(e._getValueStateHeader().getFormattedText())}e.updateValueState(t,i||o,this.getShowValueStateMessage());if(this.isMobileDevice()){e.getInput().setValueState(t)}};E.prototype.setShowValueHelp=function(e){var t=this._getSuggestionsPopover()&&this._getSuggestionsPopover().getInput();this.setProperty("showValueHelp",e);if(t){t.setShowValueHelp(e)}return this};E.prototype.isValueHelpOnlyOpener=function(e){return true};E.prototype._getFilteredSuggestionItems=function(e){var t,s=this._getSuggestionsPopover().getItemsContainer();if(this._hasTabularSuggestions()){if(this.isMobileDevice()&&s){s.removeStyleClass("sapMInputSuggestionTableHidden")}t=this.filterTabularItems(this.getSuggestionRows(),e)}else{t=P(this,this.getSuggestionItems(),e,this.getFilterSuggests(),true,this._getFilterFunction());this._mapItems(t)}return t};E.prototype.filterTabularItems=function(e,t){var s,i=this.getFilterSuggests(),o=[],n=[],u=false,r=this._getFilterFunction();e.forEach(function(e){if(e.isA("sap.m.GroupHeaderListItem")){n.push({header:e,visible:false})}else{s=!i||r(t,e);e.setVisible(s);s&&o.push(e);if(!u&&s&&this._sProposedItemText===this._getRowResultFunction()(e)){e.setSelected(true);u=true}if(n.length&&s){n[n.length-1].visible=true}}},this);n.forEach(function(e){e.header.setVisible(e.visible)});this._getSuggestionsTable().invalidate();return{items:o,groups:n}};E.prototype._mapItems=function(e){var t=this.getSuggestionItems(),s=e.items,i=e.groups,o=i.map(function(e){return e.header}),n=false,u=this._getSuggestionsPopover().getItemsContainer(),r,a;t.filter(function(e){return s.indexOf(e)>-1||o.indexOf(e)>-1}).map(function(e){r=w.createListItemFromCoreItem(e,true);u.addItem(r);if(!n&&this._sProposedItemText===e.getText()){r.setSelected(true);n=true}return e},this).filter(function(e){return o.indexOf(e)>-1}).forEach(function(e){a=o.indexOf(e);if(a>-1){r=w.getListItem(e);r&&r.setVisible(i[a].visible)}})};E.prototype._setTypedInValue=function(e){this._sTypedInValue=e;return this};E.prototype._getTypedInValue=function(){return this._sTypedInValue};return E});
/*
 * ! OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["../json/JSONModel","../json/JSONPropertyBinding","../json/JSONListBinding","sap/ui/base/ManagedObject","sap/ui/base/ManagedObjectObserver","../Context","../ChangeReason","sap/base/util/uid","sap/base/Log","sap/base/util/isPlainObject","sap/base/util/deepClone"],function(e,t,i,r,n,s,o,a,g,f,p){"use strict";var h="@custom",d="--";function u(e,t,i,n){var s=i.get(t)||[],o,a;for(var g=0;g<s.length;g++){o=s[g];if(!(o instanceof r)){continue}a=true;if(n){e._oObserver.observe(o,{properties:true,aggregations:true})}else{e._oObserver.unobserve(o,{properties:true,aggregations:true})}var f=o.getMetadata().getAllAggregations();for(var p in f){u(e,o,f[p],n)}}if(a){var p=t.getId()+"/@"+i.name;if(n){if(!e._mObservedCount.aggregations[p]){e._mObservedCount.aggregations[p]=0}e._mObservedCount.aggregations[p]++}else{delete e._mObservedCount.aggregations[p]}}}function l(e){var t,i=e.length-1,n=[];while(!(e[i].node instanceof r)){if(t){n.splice(0,0,t)}t=e[i].path;i--}return[e[i].node,e[i+1],n,t]}function c(e){var t="",i;var n=typeof e;if(e==null||n!="object"&&n!="function"){t=e}else if(f(e)){t=JSON.stringify(e)}else if(e instanceof r){t=e.getId();for(i in e.mProperties){t=t+"$"+c(e.mProperties[i])}}else if(Array.isArray(e)){for(var s=0;e.length;s++){t=t+"$"+c(e)}}else{g.warning("Could not stringify object "+e);t="$"}return t}var v=i.extend("sap.ui.model.base.ManagedObjectModelAggregationBinding",{constructor:function(){i.apply(this,arguments);this._getOriginOfManagedObjectModelBinding()},_mightBeAffectedByChangesInside:function(e){while(e){if(e.getParent()===this._oOriginMO){return true}e=e.getParent()}return false},getEntryKey:function(e){var t=e.getObject();if(t instanceof r){return t.getId()}return i.prototype.getEntryKey.apply(this,arguments)},getEntryData:function(e){var t=e.getObject();if(t instanceof r){return c(t)}return i.prototype.getEntryData.apply(this,arguments)},_getContexts:function(e,t){var r;if(this._oAggregation){var n=this._oOriginMO.getBinding(this._sMember);if(n){var s=n.getModel();r=s.iSizeLimit}var o=this._oOriginMO.getBindingInfo(this._sMember);if(o&&e>=0&&t&&r&&t>r){var a=false;if(e!=o.startIndex){o.startIndex=e;a=true}if(t!=o.length){o.length=t;a=true}if(a){this._oAggregation.update(this._oOriginMO,"change")}}}return i.prototype._getContexts.apply(this,arguments)},_getOriginOfManagedObjectModelBinding:function(){if(!this._oOriginMO){var e=this.oModel,t=[];e._getObject(this.sPath,this.oContext,t);var i=l(t);this._oOriginMO=i[0];this._aPartsInJSON=i[2];this._sMember=i[3];this._oAggregation=this._oOriginMO.getMetadata().getAggregation(this._sMember)}},getLength:function(){if(this._aPartsInJSON.length==0){var e=this._oOriginMO.getBinding(this._sMember);if(e&&e.isA("sap.ui.model.ListBinding")){return e.getLength()}}return i.prototype.getLength.apply(this,arguments)},isLengthFinal:function(){if(this._aPartsInJSON.length==0){var e=this._oOriginMO.getBinding(this._sMember);if(e&&e.isA("sap.ui.model.ListBinding")){return e.isLengthFinal()}}return true}});var b=t.extend("sap.ui.model.base.ManagedObjectModelPropertyBinding");var y=e.extend("sap.ui.model.base.ManagedObjectModel",{constructor:function(t,i){if(!i&&typeof i!="object"){i={}}i[h]={};this._oObject=t;this._mObservedCount={properties:{},aggregations:{}};this.mListBinding={};e.apply(this,[i]);this._oObserver=new n(this.observerChanges.bind(this));this.setSizeLimit(1e6)}});y.prototype.getAggregation=e.prototype.getProperty;y.prototype.setData=function(t,i){var r={};r[h]=t;e.prototype.setData.apply(this,[r,i])};y.prototype.getJSON=function(){return JSON.stringify(this.oData[h])};y.prototype.setProperty=function(t,i,n,s){var o=this.resolve(t,n),a,f,d;if(!o){return false}if(o.indexOf("/"+h)===0){return e.prototype.setProperty.apply(this,arguments)}a=o.lastIndexOf("/");f=o.substring(0,a||1);d=o.substr(a+1);var u=[],c=this._getObject(f,null,u);if(c){if(c instanceof r){var v=c.getMetadata().getManagedProperty(d);if(v){if(v.get(c)!==i){v.set(c,i);var b=function(e){var t=this.resolve(e.sPath,e.oContext);return t?t.startsWith(o):false}.bind(this);this.checkUpdate(false,s,b);return true}}else{g.warning("The setProperty method only supports properties, the path "+o+" does not point to a property",null,"sap.ui.model.base.ManagedObjectModel")}}else if(c[d]!==i){var y=l(u);var O=p(y[1].node),_=y[2];var m=O;for(var M=0;M<_.length;M++){m=m[_[M]]}m[d]=i;var C="/"+d;if(_.length>0){C="/"+_.join("/")+C}var j=o.lastIndexOf(C);var B=o.substr(0,j);return this.setProperty(B,O,n)}}return false};y.prototype.addBinding=function(t){e.prototype.addBinding.apply(this,arguments);if(t instanceof v){var i=t.sPath.replace("/","");this.mListBinding[i]=t}t.checkUpdate(false)};y.prototype.removeBinding=function(t){e.prototype.removeBinding.apply(this,arguments);if(t instanceof v){var i=t.sPath.replace("/","");delete this.mListBinding[i]}this._observeBeforeEvaluating(t,false)};y.prototype.firePropertyChange=function(t){if(t.reason===o.Binding){t.resolvedPath=this.resolve(t.path,t.context)}e.prototype.firePropertyChange.call(this,t)};y.prototype.bindAggregation=function(t,i,r){return e.prototype.bindProperty.apply(this,arguments)};y.prototype.bindProperty=function(e,t,i){var r=new b(this,e,t,i);return r};y.prototype.bindList=function(e,t,i,r,n){var s=new v(this,e,t,i,r,n);return s};y.prototype.getManagedObject=function(e,t){if(e instanceof s){t=e;e=t.getPath()}var i=this.getProperty(e,t);if(i instanceof r){return i}return null};y.prototype.getRootObject=function(){return this._oObject};y.prototype._observePropertyChange=function(e,t){if(!e||!t){return}var i=e.getId()+"/@"+t.name;if(!this._oObserver.isObserved(e,{properties:[t.name]})){this._oObserver.observe(e,{properties:[t.name]});this._mObservedCount.properties[i]=1}else{this._mObservedCount.properties[i]++}};y.prototype._unobservePropertyChange=function(e,t){if(!e||!t){return}var i=e.getId()+"/@"+t.name;this._mObservedCount.properties[i]--;if(this._mObservedCount.properties[i]==0){this._oObserver.unobserve(e,{properties:[t.name]});delete this._mObservedCount.properties[i]}};y.prototype._observeAggregationChange=function(e,t){if(!e||!t){return}var i=e.getId()+"/@"+t.name;if(!this._oObserver.isObserved(e,{aggregations:[t.name]})){this._oObserver.observe(e,{aggregations:[t.name]});this._mObservedCount.aggregations[i]=1;u(this,e,t,true)}else{this._mObservedCount.aggregations[i]++}};y.prototype._unobserveAggregationChange=function(e,t){if(!e||!t){return}var i=e.getId()+"/@"+t.name;this._mObservedCount.aggregations[i]--;if(this._mObservedCount.aggregations[i]==0){this._oObserver.unobserve(e,{aggregations:[t.name]});delete this._mObservedCount.aggregations[i]}};y.prototype._createId=function(e){var t=this._oObject;if(typeof t.createId==="function"){return t.createId(e)}if(!e){return t.getId()+d+a()}if(e.indexOf(t.getId()+d)!=0){return t.getId()+d+e}return e};y.prototype._getSpecialNode=function(e,t,i,n){if(e instanceof r){if(t==="className"){if(e.getMetadata){return e.getMetadata().getName()}else{return typeof e}}else if(t==="id"){return e.getId()}else if(t==="metadataContexts"){return e._oProviderData}}else if(t==="binding"&&i&&n){return i.getBinding(n)}else if(t==="bound"&&i&&n){return i.isBound(n)}else if(t==="bindingInfo"&&i&&n){return i.getBindingInfo(n)}else if(Array.isArray(e)){if(t==="length"){return e.length}else if(t.indexOf("id=")===0){var s=t.substring(3),o=null;for(var a=0;a<e.length;a++){if(e[a].getId()===this._createId(s)||e[a].getId()===s){o=e[a];break}}return o}}return null};y.prototype._getObject=function(t,i,n){var o=this._oObject,a="",g=this;if(n){n.push({path:"/",node:o})}this.aBindings.forEach(function(e){if(!e._bAttached){g._observeBeforeEvaluating(e,true)}});if(typeof t==="string"&&t.indexOf("/")!=0&&!i){return null}if(i instanceof r){o=i;a=t}else if(!i||i instanceof s){a=this.resolve(t,i);if(!a){return o}if(a.indexOf("/"+h)===0){return e.prototype._getObject.apply(this,[t,i])}}else{o=i;a=t}if(!o){return null}var p=a.split("/"),d=0;if(!p[0]){d++}var u=null,l=null,c;while(o!==null&&p[d]){c=p[d];if(c=="id"){c="@id"}if(c.indexOf("@")===0){o=this._getSpecialNode(o,c.substring(1),u,l)}else if(o instanceof r){var v=o.getMetadata();if(v.isInstanceOf("sap.ui.core.IDScope")&&c.indexOf("#")===0){o=o.byId(c.substring(1))}else{u=o;l=c;var b=v.getManagedProperty(c);if(b){o=b.get(o)}else{var y=v.getManagedAggregation(c);if(y){o=y.get(o)}else{if(o&&o[c]&&typeof o[c]==="function"){o=o[c]()}else{o=null}}}}}else if(Array.isArray(o)||f(o)){o=o[c]}else{if(o&&o[c]&&typeof o[c]==="function"){o=o[c]()}else{o=null}}if(n){n.push({path:c,node:o})}d++}return o};y.prototype.destroy=function(){for(var t in this._mAggregationObjects){var i=this._mAggregationObjects[t];if(i.object.invalidate.fn){i.object.invalidate=i.object.invalidate.fn}}e.prototype.destroy.apply(this,arguments)};y.prototype._observeBeforeEvaluating=function(e,t){if(!e.isResolved()){return}var i=e.getPath();var n=e.getContext(),o=this._oObject,a;if(n instanceof r){o=n;a=i}else if(!n||n instanceof s){a=this.resolve(i,n);if(!a){return}if(a.indexOf("/"+h)===0){return}}else{return}var g=a.split("/");if(!g[0]){g.shift()}var f=g[0];if(o.getMetadata().isInstanceOf("sap.ui.core.IDScope")&&f.indexOf("#")===0){o=o.byId(f.substring(1));f=g[1]}if(o instanceof r){var p=o.getMetadata(),d=p.getManagedProperty(f);if(d){if(t===true){this._observePropertyChange(o,d)}else if(t===false){this._unobservePropertyChange(o,d)}}else{var u=p.getAggregation(f)||p.getAllPrivateAggregations()[f];if(u){if(t===true){this._observeAggregationChange(o,u)}else if(t===false){this._unobserveAggregationChange(o,u)}}}e._bAttached=t}};y.prototype.observerChanges=function(e){if(e.type=="aggregation"){var t={};if(e.child instanceof r){t=e.child.getMetadata().getAllAggregations()}if(e.mutation=="insert"){if(e.child instanceof r){this._oObserver.observe(e.child,{properties:true,aggregations:true})}for(var i in t){u(this,e.child,t[i],true)}if(this.mListBinding[e.name]){var n=this._oObject.getBinding(e.name);var s=this._oObject.getAggregation(e.name);if(n&&n.getCurrentContexts().length!=s.length){return}}}else{if(e.child instanceof r){this._oObserver.unobserve(e.child,{properties:true,aggregations:true})}for(var i in t){u(this,e.child,t[i],false)}}}else if(e.type==="property"){this.aBindings.forEach(function(t){if(t._mightBeAffectedByChangesInside&&t._mightBeAffectedByChangesInside(e.object)){t.checkUpdate(true)}})}this.checkUpdate()};y.prototype.checkUpdate=function(e,t,i){if(t){this.bForceUpdate=this.bForceUpdate||e;if(!this.sUpdateTimer){this.fnFilter=this.fnFilter||i;this.sUpdateTimer=setTimeout(function(){this.checkUpdate(this.bForceUpdate,false,this.fnFilter)}.bind(this),0)}else if(this.fnFilter&&this.fnFilter!==i){this.fnFilter=undefined}return}e=this.bForceUpdate||e;i=!this.fnFilter||this.fnFilter===i?i:undefined;if(this.sUpdateTimer){clearTimeout(this.sUpdateTimer);this.sUpdateTimer=null;this.bForceUpdate=undefined;this.fnFilter=undefined}var r=this.aBindings.slice(0);r.forEach(function(t){if(!i||i(t)){t.checkUpdate(e)}})};return y});
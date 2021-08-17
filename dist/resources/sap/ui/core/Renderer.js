/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/base/util/isPlainObject","sap/base/util/ObjectPath","sap/base/assert","sap/base/util/extend"],function(e,t,r,a){"use strict";var n={};var i;function s(n,i){r(this!=null,"BaseRenderer must be a non-null object");r(typeof n==="string"&&n,"Renderer.extend must be called with a non-empty name for the new renderer");r(i==null||e(i)&&Object.keys(i).every(function(e){return i[e]!==undefined}),"oRendererInfo can be omitted or must be a plain object without any undefined property values");var u=Object.create(this);u.extend=s;a(u,i);t.set(n,u);return u}n.extend=function(e,t){if(typeof e==="string"){return s.call(this,e,t)}else if(this===n){var r=Object.create(e||null);r._super=e;r.extend=s;return r}else{throw new TypeError("The signature extend(BaseRenderer) without a name can only be called on sap.ui.core.Renderer")}};n.getTextAlign=function(e,t){if(!i){i=sap.ui.requireSync("sap/ui/core/library")}var r=i.TextAlign;var a=i.TextDirection;var n="",s=sap.ui.getCore().getConfiguration().getRTL();switch(e){case r.End:switch(t){case a.LTR:n="right";break;case a.RTL:n="left";break;default:n=s?"left":"right";break}break;case r.Begin:switch(t){case a.LTR:n="left";break;case a.RTL:n="right";break;default:n=s?"right":"left";break}break;case r.Right:if(!s||t==a.LTR){n="right"}break;case r.Center:n="center";break;case r.Left:if(s||t==a.RTL){n="left"}break}return n};return n},true);
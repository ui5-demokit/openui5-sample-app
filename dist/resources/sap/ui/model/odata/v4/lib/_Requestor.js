/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./_Batch","./_GroupLock","./_Helper","./_V2Requestor","sap/base/Log","sap/ui/base/SyncPromise","sap/ui/thirdparty/jquery"],function(e,t,r,n,o,i,s){"use strict";var a={Accept:"multipart/mixed"},u="sap.ui.model.odata.v4.lib._Requestor",c=/(\$\w+)=~/g,h=/^\d+$/;function f(e){var t;e=e.toLowerCase();for(t in this.headers){if(t.toLowerCase()===e){return this.headers[t]}}}function p(e,t,n,o){this.mBatchQueue={};this.mHeaders=t||{};this.aLockedGroupLocks=[];this.oModelInterface=o;this.sQueryParams=r.buildQuery(n);this.mRunningChangeRequests={};this.oSecurityTokenPromise=null;this.iSessionTimer=0;this.iSerialNumber=0;this.sServiceUrl=e}p.prototype.mFinalHeaders={"Content-Type":"application/json;charset=UTF-8;IEEE754Compatible=true"};p.prototype.mPredefinedPartHeaders={Accept:"application/json;odata.metadata=minimal;IEEE754Compatible=true"};p.prototype.mPredefinedRequestHeaders={Accept:"application/json;odata.metadata=minimal;IEEE754Compatible=true","OData-MaxVersion":"4.0","OData-Version":"4.0","X-CSRF-Token":"Fetch"};p.prototype.mReservedHeaders={accept:true,"accept-charset":true,"content-encoding":true,"content-id":true,"content-language":true,"content-length":true,"content-transfer-encoding":true,"content-type":true,"if-match":true,"if-none-match":true,isolation:true,"odata-isolation":true,"odata-maxversion":true,"odata-version":true,prefer:true,"sap-contextid":true};p.prototype.addChangeSet=function(e){var t=[],r=this.getOrCreateBatchQueue(e);t.iSerialNumber=this.getSerialNumber();r.iChangeSet+=1;r.splice(r.iChangeSet,0,t)};p.prototype.addChangeToGroup=function(e,t){var r;if(this.getGroupSubmitMode(t)==="Direct"){e.$resolve(this.request(e.method,e.url,this.lockGroup(t,this,true,true),e.headers,e.body,e.$submit,e.$cancel))}else{r=this.getOrCreateBatchQueue(t);r[r.iChangeSet].push(e)}};p.prototype.addQueryString=function(e,t,n){var o;n=this.convertQueryOptions(t,n,false,true);e=e.replace(c,function(e,t){var o=n[t];delete n[t];return r.encodePair(t,o)});o=r.buildQuery(n);if(!o){return e}return e+(e.includes("?")?"&"+o.slice(1):o)};p.prototype.batchRequestSent=function(e,t,r){var n,o;if(r){if(!(e in this.mRunningChangeRequests)){this.mRunningChangeRequests[e]=[]}n=new i(function(e){o=e});n.$resolve=o;n.$requests=t;this.mRunningChangeRequests[e].push(n)}};p.prototype.batchResponseReceived=function(e,t,r){var n;if(r){n=this.mRunningChangeRequests[e].filter(function(e){if(e.$requests===t){e.$resolve();return false}return true});if(n.length){this.mRunningChangeRequests[e]=n}else{delete this.mRunningChangeRequests[e]}}};p.prototype.buildQueryString=function(e,t,n,o){return r.buildQuery(this.convertQueryOptions(e,t,n,o))};p.prototype.cancelChanges=function(e){if(this.mRunningChangeRequests[e]){throw new Error("Cannot cancel the changes for group '"+e+"', the batch request is running")}this.cancelChangesByFilter(function(){return true},e);this.cancelGroupLocks(e)};p.prototype.cancelChangesByFilter=function(e,t){var r=false,n=this;function o(t){var o=n.mBatchQueue[t],i,s,a,u,c;for(c=o.length-1;c>=0;c-=1){if(Array.isArray(o[c])){s=o[c];for(u=s.length-1;u>=0;u-=1){i=s[u];if(i.$cancel&&e(i)){i.$cancel();a=new Error("Request canceled: "+i.method+" "+i.url+"; group: "+t);a.canceled=true;i.$reject(a);s.splice(u,1);r=true}}}}}if(t){if(this.mBatchQueue[t]){o(t)}}else{for(t in this.mBatchQueue){o(t)}}return r};p.prototype.cancelGroupLocks=function(e){this.aLockedGroupLocks.forEach(function(t){if((!e||e===t.getGroupId())&&t.isModifying()&&t.isLocked()){t.cancel()}})};p.prototype.checkConflictingStrictRequest=function(e,t,r){function n(e,t){return r!==t&&e.some(o)}function o(e){return e.headers["Prefer"]==="handling=strict"}if(o(e)&&t.slice(0,t.iChangeSet+1).some(n)){throw new Error("All requests with strict handling must belong to the same change set")}};p.prototype.checkForOpenRequests=function(){var e=this;if(Object.keys(this.mRunningChangeRequests).length||Object.keys(this.mBatchQueue).some(function(t){return e.mBatchQueue[t].some(function(e){return Array.isArray(e)?e.length:true})})||this.aLockedGroupLocks.some(function(e){return e.isLocked()})){throw new Error("Unexpected open requests")}};p.prototype.checkHeaderNames=function(e){var t;for(t in e){if(this.mReservedHeaders[t.toLowerCase()]){throw new Error("Unsupported header: "+t)}}};p.prototype.cleanUpChangeSets=function(e){var t,n=false,o;function i(e){if(!s(e)){t.push(e)}}function s(e){if(e.method!=="PATCH"){return false}return t.some(function(t){if(t.method==="PATCH"&&t.headers["If-Match"]===e.headers["If-Match"]){r.merge(t.body,e.body);e.$resolve(t.$promise);return true}})}for(o=e.iChangeSet;o>=0;o-=1){t=[];e[o].forEach(i);if(t.length===0){e.splice(o,1)}else if(t.length===1&&this.isChangeSetOptional()){e[o]=t[0]}else{e[o]=t}n=n||t.length>0}return n};p.prototype.clearSessionContext=function(e){if(e){this.oModelInterface.fireSessionTimeout()}delete this.mHeaders["SAP-ContextId"];if(this.iSessionTimer){clearInterval(this.iSessionTimer);this.iSessionTimer=0}};p.prototype.convertExpand=function(e,t){var r,n=[],o=this;if(!e||typeof e!=="object"){throw new Error("$expand must be a valid object")}r=Object.keys(e);if(t){r=r.sort()}r.forEach(function(r){var i=e[r];if(i&&typeof i==="object"){n.push(o.convertExpandOptions(r,i,t))}else{n.push(r)}});return n.join(",")};p.prototype.convertExpandOptions=function(e,t,r){var n=[];this.doConvertSystemQueryOptions(undefined,t,function(e,t){n.push(e+"="+t)},undefined,r);return n.length?e+"("+n.join(";")+")":e};p.prototype.convertQueryOptions=function(e,t,r,n){var o={};if(!t){return undefined}this.doConvertSystemQueryOptions(e,t,function(e,t){o[e]=t},r,n);return o};p.prototype.convertResourcePath=function(e){return e};p.prototype.destroy=function(){this.clearSessionContext()};p.prototype.doCheckVersionHeader=function(e,t,r){var n=e("OData-Version"),o=!n&&e("DataServiceVersion");if(o){throw new Error("Expected 'OData-Version' header with value '4.0' but received"+" 'DataServiceVersion' header with value '"+o+"' in response for "+this.sServiceUrl+t)}if(n==="4.0"||!n&&r){return}throw new Error("Expected 'OData-Version' header with value '4.0' but received value '"+n+"' in response for "+this.sServiceUrl+t)};p.prototype.doConvertResponse=function(e,t){return e};p.prototype.doConvertSystemQueryOptions=function(e,t,r,n,o){var i=this;Object.keys(t).forEach(function(e){var s=t[e];if(n&&e[0]==="$"){return}switch(e){case"$expand":if(s!=="~"){s=i.convertExpand(s,o)}break;case"$select":if(Array.isArray(s)){s=o?s.sort().join(","):s.join(",")}break;default:}r(e,s)})};p.prototype.fetchTypeForPath=function(e,t){return this.oModelInterface.fetchMetadata(e+(t?"/$Type":"/"))};p.prototype.formatPropertyAsLiteral=function(e,t){return r.formatLiteral(e,t.$Type)};p.prototype.getGroupSubmitMode=function(e){return this.oModelInterface.getGroupProperty(e,"submit")};p.prototype.getModelInterface=function(){return this.oModelInterface};p.prototype.getOrCreateBatchQueue=function(e){var t,r=this.mBatchQueue[e];if(!r){t=[];t.iSerialNumber=0;r=this.mBatchQueue[e]=[t];r.iChangeSet=0;if(this.oModelInterface.onCreateGroup){this.oModelInterface.onCreateGroup(e)}}return r};p.prototype.getPathAndAddQueryOptions=function(e,t,r){var n=[],o,i={},s,a=this;e=e.slice(1,-5);if(t.$Parameter){t.$Parameter.forEach(function(e){i[e.$Name]=e})}if(t.$kind==="Function"){for(o in r){s=i[o];if(s){if(s.$isCollection){throw new Error("Unsupported collection-valued parameter: "+o)}n.push(encodeURIComponent(o)+"="+encodeURIComponent(a.formatPropertyAsLiteral(r[o],s)))}}e+="("+n.join(",")+")"}else{for(o in r){if(!(o in i)){delete r[o]}}}return e};p.prototype.getSerialNumber=function(){this.iSerialNumber+=1;return this.iSerialNumber};p.prototype.getServiceUrl=function(){return this.sServiceUrl};p.prototype.hasChanges=function(e,t){var r=this.mBatchQueue[e];if(r){return r.some(function(e){return Array.isArray(e)&&e.some(function(e){return e.headers["If-Match"]===t})})}return false};p.prototype.hasPendingChanges=function(e){var t=this;function r(t){if(!e){return Object.keys(t)}return e in t?[e]:[]}return r(this.mRunningChangeRequests).length>0||this.aLockedGroupLocks.some(function(t){return(e===undefined||t.getGroupId()===e)&&t.isModifying()&&t.isLocked()})||r(this.mBatchQueue).some(function(e){return t.mBatchQueue[e].some(function(e){return Array.isArray(e)&&e.some(function(e){return e.$cancel})})})};p.prototype.isActionBodyOptional=function(){return false};p.prototype.isChangeSetOptional=function(){return true};p.prototype.mergeGetRequests=function(e){var t=[],n=this;function o(e){return e.$queryOptions&&t.some(function(t){if(t.$queryOptions&&e.url===t.url){r.aggregateExpandSelect(t.$queryOptions,e.$queryOptions);e.$resolve(t.$promise);return true}return false})}e.forEach(function(e){if(!o(e)){t.push(e)}});t.forEach(function(e){if(e.$queryOptions){e.url=n.addQueryString(e.url,e.$metaPath,e.$queryOptions)}});t.iChangeSet=e.iChangeSet;return t};p.prototype.processBatch=function(e){var t,n=this.mBatchQueue[e]||[],o=this;function i(e){if(Array.isArray(e)){e.forEach(i)}else if(e.$submit){e.$submit()}}function s(e,t){if(Array.isArray(t)){t.forEach(s.bind(null,e))}else{t.$reject(e)}}function a(e,t){var n;e.forEach(function(e,i){var s,u,c,h=t[i];if(Array.isArray(h)){a(e,h)}else if(!h){s=new Error("HTTP request was not processed because the previous request failed");s.cause=n;s.$reported=true;e.$reject(s)}else if(h.status>=400){h.getResponseHeader=f;n=r.createError(h,"Communication error",e.url?o.sServiceUrl+e.url:undefined,e.$resourcePath);if(Array.isArray(e)){r.decomposeError(n,e,o.sServiceUrl).forEach(function(t,r){e[r].$reject(t)})}else{e.$reject(n)}}else{if(h.responseText){try{o.doCheckVersionHeader(f.bind(h),e.url,true);c=o.doConvertResponse(JSON.parse(h.responseText),e.$metaPath)}catch(t){e.$reject(t);return}}else{c=e.method==="GET"?null:{}}o.reportUnboundMessagesAsJSON(e.url,f.call(h,"sap-messages"));u=f.call(h,"ETag");if(u){c["@odata.etag"]=u}e.$resolve(c)}})}delete this.mBatchQueue[e];i(n);t=this.cleanUpChangeSets(n);if(n.length===0){return Promise.resolve()}n=this.mergeGetRequests(n);this.batchRequestSent(e,n,t);return this.sendBatch(n,e).then(function(e){a(n,e)}).catch(function(e){var t=new Error("HTTP request was not processed because $batch failed");t.cause=e;s(t,n);throw e}).finally(function(){o.batchResponseReceived(e,n,t)})};p.prototype.ready=function(){return i.resolve()};p.prototype.lockGroup=function(e,r,n,o,i){var s;s=new t(e,r,n,o,this.getSerialNumber(),i);if(n){this.aLockedGroupLocks.push(s)}return s};p.prototype.refreshSecurityToken=function(e){var t=this;if(!this.oSecurityTokenPromise){if(e!==this.mHeaders["X-CSRF-Token"]){return Promise.resolve()}this.oSecurityTokenPromise=new Promise(function(e,n){s.ajax(t.sServiceUrl+t.sQueryParams,{method:"HEAD",headers:Object.assign({},t.mHeaders,{"X-CSRF-Token":"Fetch"})}).then(function(r,n,o){var i=o.getResponseHeader("X-CSRF-Token");if(i){t.mHeaders["X-CSRF-Token"]=i}else{delete t.mHeaders["X-CSRF-Token"]}t.oSecurityTokenPromise=null;e()},function(e){t.oSecurityTokenPromise=null;n(r.createError(e,"Could not refresh security token"))})})}return this.oSecurityTokenPromise};p.prototype.relocate=function(e,t,r){var n=this.mBatchQueue[e],o=this,i=n&&n[0].some(function(e,i){if(e.body===t){o.addChangeToGroup(e,r);n[0].splice(i,1);return true}});if(!i){throw new Error("Request not found in group '"+e+"'")}};p.prototype.relocateAll=function(e,t,r){var n=0,o=this.mBatchQueue[e],i=this;if(o){o[0].slice().forEach(function(e){if(!r||e.headers["If-Match"]===r){i.addChangeToGroup(e,t);o[0].splice(n,1)}else{n+=1}})}};p.prototype.removePatch=function(e){var t=this.cancelChangesByFilter(function(t){return t.$promise===e});if(!t){throw new Error("Cannot reset the changes, the batch request is running")}};p.prototype.removePost=function(e,t){var n=r.getPrivateAnnotation(t,"postBody"),o=this.cancelChangesByFilter(function(e){return e.body===n},e);if(!o){throw new Error("Cannot reset the changes, the batch request is running")}};p.prototype.reportUnboundMessagesAsJSON=function(e,t){if(t){this.oModelInterface.reportUnboundMessages(JSON.parse(t),e)}};p.prototype.request=function(e,t,r,n,o,i,s,a,u,c,h){var f,p,d=r&&r.getGroupId()||"$direct",l,m=Infinity,y,g=this;if(d==="$cached"){p=new Error("Unexpected request: "+e+" "+t);p.$cached=true;throw p}if(r&&r.isCanceled()){if(s){s()}p=new Error("Request already canceled");p.canceled=true;return Promise.reject(p)}if(r){r.unlock();m=r.getSerialNumber()}t=this.convertResourcePath(t);u=u||t;if(this.getGroupSubmitMode(d)!=="Direct"){l=new Promise(function(r,p){var l=g.getOrCreateBatchQueue(d);y={method:e,url:t,headers:Object.assign({},g.mPredefinedPartHeaders,g.mHeaders,n,g.mFinalHeaders),body:o,$cancel:s,$metaPath:a,$queryOptions:h,$reject:p,$resolve:r,$resourcePath:u,$submit:i};if(e==="GET"){l.push(y)}else if(c){l[0].unshift(y)}else{f=l.iChangeSet;while(l[f].iSerialNumber>m){f-=1}g.checkConflictingStrictRequest(y,l,f);l[f].push(y)}});y.$promise=l;return l}if(h){t=g.addQueryString(t,a,h)}if(i){i()}return this.sendRequest(e,t,Object.assign({},n,this.mFinalHeaders),JSON.stringify(o),u).then(function(e){g.reportUnboundMessagesAsJSON(e.resourcePath,e.messages);return g.doConvertResponse(e.body,a)})};p.prototype.sendBatch=function(t,r){var n=e.serializeBatchRequest(t,this.getGroupSubmitMode(r)==="Auto"?"Group ID: "+r:"Group ID (API): "+r);return this.sendRequest("POST","$batch"+this.sQueryParams,Object.assign(n.headers,a),n.body).then(function(t){if(t.messages!==null){throw new Error("Unexpected 'sap-messages' response header for batch request")}return e.deserializeBatchResponse(t.contentType,t.body)})};p.prototype.sendRequest=function(e,t,n,i,a){var c=this.sServiceUrl+t,h=this;return new Promise(function(f,p){function d(l){var m=h.mHeaders["X-CSRF-Token"];return s.ajax(c,{contentType:n&&n["Content-Type"],data:i,headers:Object.assign({},h.mPredefinedRequestHeaders,h.mHeaders,r.resolveIfMatchHeader(n)),method:e}).then(function(r,n,o){var i=o.getResponseHeader("ETag"),s=o.getResponseHeader("X-CSRF-Token");try{h.doCheckVersionHeader(o.getResponseHeader,t,!r)}catch(e){p(e);return}if(s){h.mHeaders["X-CSRF-Token"]=s}h.setSessionContext(o.getResponseHeader("SAP-ContextId"),o.getResponseHeader("SAP-Http-Session-Timeout"));if(!r){r=e==="GET"?null:{}}if(i){r["@odata.etag"]=i}f({body:r,contentType:o.getResponseHeader("Content-Type"),messages:o.getResponseHeader("sap-messages"),resourcePath:t})},function(e){var t=e.getResponseHeader("SAP-ContextId"),n=e.getResponseHeader("X-CSRF-Token"),i;if(!l&&e.status===403&&n&&n.toLowerCase()==="required"){h.refreshSecurityToken(m).then(function(){d(true)},p)}else{i="Communication error";if(t){h.setSessionContext(t,e.getResponseHeader("SAP-Http-Session-Timeout"))}else if(h.mHeaders["SAP-ContextId"]){i="Session not found on server";o.error(i,undefined,u);h.clearSessionContext(true)}p(r.createError(e,i,c,a))}})}if(h.oSecurityTokenPromise&&e!=="GET"){h.oSecurityTokenPromise.then(d)}else{d()}})};p.prototype.setSessionContext=function(e,t){var r=h.test(t)?parseInt(t):0,n=Date.now()+30*60*1e3,i=this;this.clearSessionContext();if(e){i.mHeaders["SAP-ContextId"]=e;if(r>=60){this.iSessionTimer=setInterval(function(){if(Date.now()>=n){i.clearSessionContext(true)}else{s.ajax(i.sServiceUrl+i.sQueryParams,{method:"HEAD",headers:{"SAP-ContextId":i.mHeaders["SAP-ContextId"]}}).fail(function(e){if(e.getResponseHeader("SAP-Err-Id")==="ICMENOSESSION"){o.error("Session not found on server",undefined,u);i.clearSessionContext(true)}})}},(r-5)*1e3)}else if(t!==null){o.warning("Unsupported SAP-Http-Session-Timeout header",t,u)}}};p.prototype.submitBatch=function(e){var t,r,n=this;r=i.all(this.aLockedGroupLocks.map(function(t){return t.waitFor(e)}));t=r.isPending();if(t){o.info("submitBatch('"+e+"') is waiting for locks",null,u)}return r.then(function(){if(t){o.info("submitBatch('"+e+"') continues",null,u)}n.aLockedGroupLocks=n.aLockedGroupLocks.filter(function(e){return e.isLocked()});return n.processBatch(e)})};p.prototype.waitForRunningChangeRequests=function(e){var t=this.mRunningChangeRequests[e];if(t){return t.length>1?i.all(t):t[0]}return i.resolve()};p.create=function(e,t,r,o,i){var s=new p(e,r,o,t);if(i==="2.0"){n(s)}return s};return p},false);
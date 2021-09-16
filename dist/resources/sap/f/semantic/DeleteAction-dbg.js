/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(['sap/f/semantic/SemanticButton'], function(SemanticButton) {
	"use strict";

	/**
	* Constructor for a new <code>DeleteAction</code>.
	* @param {string} [sId] ID for the new control, generated automatically if no ID is given
	* @param {object} [mSettings] Optional initial settings for the new control:  a map/JSON-object with initial property values, event listeners etc. for the new object
	*
	* @class
	* A semantic-specific button, eligible for the <code>deleteAction</code> aggregation of the
	* {@link sap.f.semantic.SemanticPage} to be placed in its title.
	*
	* @extends sap.f.semantic.SemanticButton
	*
	* @author SAP SE
	* @version 1.93.0
	*
	* @constructor
	* @public
	* @since 1.46.0
	* @alias sap.f.semantic.DeleteAction
	* @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	*/
	var DeleteAction = SemanticButton.extend("sap.f.semantic.DeleteAction", /** @lends sap.f.semantic.DeleteAction.prototype */ {
		metadata: {
			library: "sap.f"
		}
	});

	return DeleteAction;
});
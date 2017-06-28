/**
 * 
 * @author: Yury Soukhotski HTML view material
 * @changes:
 * 28/06 12:25
 */

var startTime = new java.util.Date();
/*
 * Path to logger
 */
var LOGGER_MANDATOR = "Heine-PIM2";
var LOGGER_CONTAINER = "projectJS/";
var LOGGER_NAME = "HTMLShowMaterial";
var LOGGER_FILE = "/usr/local/omn/logs/" + LOGGER_MANDATOR + "/"
		+ LOGGER_CONTAINER + "/" + LOGGER_NAME + ".log";

var logger = new Packages.com.meylemueller.javascript.helper.Log.getScriptLogger(
		LOGGER_NAME, LOGGER_FILE, null, "INFO");

/*
 * Constants, Facades, Packages
 */
var basicHelper = entryFacade.lookupBean("basicJavaScriptHelper");
var pim2Utils = entryFacade.lookupBean("PIM2Utils");
var localeUtils = entryFacade.lookupBean("LocaleUtils");
var productFacade = entryFacade.lookupBean("ProductFacade");
var attributeFacade = entryFacade.lookupBean("AttributeValueFacade");
var languageFacade = entryFacade.lookupBean("LanguageFacade");

/*
 * Global variables
 */
var HTML_START = java.lang.String("<html><body bgcolor='#e0e0e0'>");
var HTML_END = java.lang.String("</body></html>");

var NEEDED_ITEM_TYPE = "Article";
var ERROR_MSG_WRONG_TYPE = "<font size=\"5\"><b>Die Ansicht wird nur auf einem Artikel erstellt</b></font>";
var ERROR_MSG_EMPTY = "<font size=\"5\"><b>Keine Komponenten gepflegt</b></font>";

var ATTRIBUTE_IDENTIFIER_MAT_COMP_START = 3001;
var ATTRIBUTE_IDENTIFIER_MAT_COMP_COUNT = 9;

var ATTRIBUTE_IDENTIFIER_MAT_MAT_START = 3010;
var ATTRIBUTE_IDENTIFIER_MAT_FRA_START = 3091;
var ATTRIBUTE_IDENTIFIER_MAT_COUNT = 9;

try {
	logger.info("Starting");

	result = main();

	logger.info("Script finished, Result: " + result);
} catch (e) {
	logger.error(e);
	if (basicHelper != null) {
		var exceptionResult = basicHelper.handleException(e);
		if (exceptionResult != null) {
			logger.error(exceptionResult.toString(), exceptionResult
					.getException());
		} else {
			logger
					.error("Could not handle the exception! Please inform the supplier of BasicJavaScriptHelper to fix this!");
		}
	} else {
		logger.error("BasicHelper not ready!", e);
	}
} finally {
	var finTime = new java.util.Date();
	var runtime = (finTime.getTime() - startTime.getTime()) / 1000;
	logger.info("ScriptExecution runtime: " + runtime);
}

/**
 * See main description
 */
function main() {
	var mainResult = "";
	var content = new java.lang.StringBuilder();

	if (productIdentities) {
		var itemId = productIdentities[0];
		var item = productFacade.findProductById(itemId); // product
		var itemType = item.getProductType().getName();

		if (itemType.equals(NEEDED_ITEM_TYPE)) {

			var components = java.util.ArrayList();
            
			/**
			 * list component with no empty material list
			 * 
			 */
			for (var i = ATTRIBUTE_IDENTIFIER_MAT_COMP_START; i < ATTRIBUTE_IDENTIFIER_MAT_COMP_START+ATTRIBUTE_IDENTIFIER_MAT_COMP_COUNT; i++) {
				if (attributeFacade.findAttributeValue(itemId, i, null).size() != 0) {
					components.add(i);
				};

			};
	
			for (var i = 0; i < components.size(); i++) {
				    content.
				append("<br><table width='800' >").
				append("<tr><td width='200'><font face='Verdana'>").
				append("<br><b>Komponente ").
				append((i+1).toFixed(0)).
				append("</b></font></td>").
				append("<td width='600'>").
				append(getTableHeader()).
				append("<table width='600'>");
                
				for ( var j = 0; j < maxLinesInRow(itemId, components.get(i)); j++) {
					
					content.
				append("<tr><td width='200'><font face='Verdana'>").
				append(attributeFacade.findAttributeValue(itemId,(components.get(i) - 0), null).get(0).getStringValue()).
				append("</font></td>");

					if (attributeFacade.findAttributeValue(itemId,((components.get(i) - 3001) * 9 + 3010 + j), null).size() != 0) {
						content.
						append(" <td width='200'><font face='Verdana'>  ").
						append(attributeFacade.findAttributeValue(itemId,((components.get(i) - 3001) * 9 + 3010 + j),null).get(0).getStringValue()).
						append("</font></td>");
					} else {
						content.append(" <td width='200'><font face='Verdana'></font></td>");
						
					};
					
					content.
					append(" <td width='50'><font face='Verdana'>(").
					append(((components.get(i) - 3001) * 9 + 3010 + j).toFixed(0)).
					append(")").
					append("</font></td>");
					
					if (attributeFacade.findAttributeValue(itemId,((components.get(i) - 3001) * 9 + 3091 + j), null).size() != 0) {
						content.
						append("<td width='150'><font face='Verdana'> ").
						append(attributeFacade.findAttributeValue(itemId,((components.get(i) - 3001) * 9 + 3091 + j),null).get(0).getStringValue()).
						append(" % </font></td>");
					}else {
						content.append(" <td width='200'><font face='Verdana'></font></td>");
					};

					content.append("</tr>");

				};

				content.append("</table></td></tr></table><br><hr align='center' width='800' color='Red' />");

			};
			
		} else {
			content = ERROR_MSG_WRONG_TYPE;
			logger.error("Item id " + itemId + " is not of type "+ NEEDED_ITEM_TYPE);
		}
	}

	mainResult = HTML_START + content + HTML_END;

	return mainResult;
};
function getElement() {
	var elem = "xxx";
	return elem;
};

function maxLinesInRow(itemId, identId ) {
	var count =0;
		for (var codId=0; codId < 9; codId++){	 
		  if (attributeFacade.findAttributeValue(itemId,((identId - 3001) * 9 + 3010 + codId), null).size()!=0){
			  count++;
		 };
		};
	return count;
};


function getTableHeader() {
	var header = new java.lang.StringBuilder();
	header.
	append("<table><tr>").
	append("<td width='200'><font face='Verdana'><b>Material type</b></font></td>").
	append("<td width='200'><font face='Verdana'><b>Material name</b></font></td>").
	append("<td width='50'><font face='Verdana'><b>Code</b></font></td>").
	append("<td width='150'><font face='Verdana'><b>%, in product</b></font></td>").
	append("</tr></table><br><br>");
	return header;
}

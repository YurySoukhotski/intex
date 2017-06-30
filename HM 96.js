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
var attributeDefinitionFacade = entryFacade.lookupBean("AttributeDefinitionFacade");
var domainFacade = entryFacade.lookupBean("DomainFacade");
var logisticsMandatorFacade = entryFacade.lookupBean("LogisticsMandatorFacade");

/*
 * Global variables
 */
var HTML_START = java.lang.String("<html><body bgcolor='#e0e0e0'>");
var HTML_END = java.lang.String("</body></html>");

var NEEDED_ITEM_TYPE = "Article";
var ERROR_MSG_WRONG_TYPE = "<font size=\"5\"><b>Die Ansicht wird nur auf einem Artikel erstellt</b></font>";
var ERROR_MSG_EMPTY = "<font size=\"5\"><b>Keine Komponenten gepflegt</b></font>";
var ERROR_MSG_EMPTY_MATERIAL = "<font size=\"5\"><b>Leeres Listenmaterial</b></font>";

var ATTRIBUTE_DOMAIN_KEY = "content.label.attribute.definition.domain.";
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
	var content = ERROR_MSG_EMPTY_MATERIAL;
	if (productIdentities) {
		var itemId = productIdentities[0];
		var item = productFacade.findProductById(itemId); // product
		var itemType = item.getProductType().getName();

		if (itemType.equals(NEEDED_ITEM_TYPE)) {

			var components = java.util.ArrayList();
			var langList = java.util.ArrayList();
            var propertyKomponentList =java.util.ArrayList();
			var propertyMaterialList =java.util.ArrayList();
				
			  /***************************
			  *  domain facade work
			  */
			  
			  langList.add(6003); 
			  mandator=logisticsMandatorFacade.findByIdentity(mandatorId);
			  propertyKomponentList=domainFacade.loadLocalizedDomainValues("PIM2", langList, ATTRIBUTE_IDENTIFIER_MAT_COMP_START, mandator);
			  propertyMaterialList=domainFacade.loadLocalizedDomainValues("PIM2", langList, ATTRIBUTE_IDENTIFIER_MAT_MAT_START, mandator);
				
			/**
			 * list component with no empty material list
			 * 
			 */
			for (var i = ATTRIBUTE_IDENTIFIER_MAT_COMP_START; i < ATTRIBUTE_IDENTIFIER_MAT_COMP_START+ATTRIBUTE_IDENTIFIER_MAT_COMP_COUNT; i++) {
				if (getElement(itemId, i)!="") {
					components.add(i);
				};

			};
		if (components.size()>0) {	
		
		content = new java.lang.StringBuilder();
		
				for (var i = 0; i < components.size(); i++) {
						content.
					append(getTableHeader()).
					append("<table width='550'>");
                
				for ( var j = 0; j < maxLinesInRow(itemId, components.get(i)); j++) {
					
						content.
					append("<tr><td width='200'><font face='Verdana'>");
						if (j==0 ) {
					content.append(findByKey(ATTRIBUTE_IDENTIFIER_MAT_COMP_START,getElement(itemId,(components.get(i) - 0)),propertyKomponentList));
						} else 
							{ 
							content.append(" ");
						};
						content.
					append("</font></td>");

						content.
					append(" <td width='200'><font face='Verdana'>  ").
					append(findByKey(ATTRIBUTE_IDENTIFIER_MAT_MAT_START,getElement(itemId,((components.get(i) - ATTRIBUTE_IDENTIFIER_MAT_COMP_START) * ATTRIBUTE_IDENTIFIER_MAT_COMP_COUNT + ATTRIBUTE_IDENTIFIER_MAT_MAT_START + j)),propertyMaterialList)).
					append("</font></td>");
					
					
						content.
					append("<td width='150'><font face='Verdana'> ").
					append(getElement(itemId,((components.get(i) - ATTRIBUTE_IDENTIFIER_MAT_COMP_START) * ATTRIBUTE_IDENTIFIER_MAT_COMP_COUNT + ATTRIBUTE_IDENTIFIER_MAT_FRA_START + j))).
					append(" % </font></td>");
					
						content.
					append("</tr>");

				};

						content.
					append("</table></td></tr><br><hr align='center' width='550' />");

			};
		  };
		  
		
		  
		} else {
			content = ERROR_MSG_WRONG_TYPE;
			logger.error("Item id " + itemId + " is not of type "+ NEEDED_ITEM_TYPE);
		}
	}

	mainResult = HTML_START + content + HTML_END;

	return mainResult;
};

function findByKey(code, key, listArg) {
	var translate = "";
	var findArg=ATTRIBUTE_DOMAIN_KEY+code+"."+key;
	
	  for (var i=0; i < listArg.size(); i++){
	   	  if (listArg.get(i).getKey().equals(findArg)){
			  return listArg.get(i).getValue();
			  };
			};
	 
	return translate;
};

function getElement(itemId, id) {
	var elem = "";
	    if (attributeFacade.findAttributeValue(itemId, id, null).size() != 0) {
			elem = attributeFacade.findAttributeValue(itemId,id,null).get(0).getStringValue();
					};
	
	return elem;
};

/**
* Function find count lines wich equals count of product material
*/
function maxLinesInRow(itemId, identId ) {
	var count =0;
		for (var codId=0; codId < ATTRIBUTE_IDENTIFIER_MAT_COMP_COUNT; codId++){	 
		  if (attributeFacade.findAttributeValue(itemId,((identId - ATTRIBUTE_IDENTIFIER_MAT_COMP_START) * ATTRIBUTE_IDENTIFIER_MAT_COMP_COUNT + ATTRIBUTE_IDENTIFIER_MAT_MAT_START + codId), null).size()!=0){
			  count++;
		 };
		};
	return count;
};


function getTableHeader() {
	var header = new java.lang.StringBuilder();
	header.
	append("<br><table><tr>").
	append("<td width='200'><font face='Verdana'><b>Komponente</b></font></td>").
	append("<td width='200'><font face='Verdana'><b>Material</b></font></td>").
	append("<td width='150'><font face='Verdana'><b>Anteil</b></font></td>").
	append("</tr></table><br>");
	return header;
}

/**
 * 
 * @author: Yury Soukhotski HTML view material
 * @changes:
 * 05/07/17 09:00
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
var languageFacade = entryFacade.lookupBean("LanguageFacade");

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
	var mainResult = "Error";
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
			  //  DE, AT, CH, FR, NL, EN  order for language
			  // German Deutsch-AT Deutsch-CH  Franzosisch-CH English/Master-Data Niederlaendisch
			  //6003 14053  14051 14050 14054  6000 -en changeв to master data
			  
			  
			  langList.add(6003); 
			  langList.add(14053); 
			  langList.add(14052); 
			  langList.add(14051); 
			  langList.add(14050); 
			  langList.add(14054); 
			  langList.add(259340);
			
			  var langArr = ["DE_de","AT_de","CH_de","CH_fr","FR_fr","NL_nl","Master Data"];

			  
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
				content.
					append(getTableHeader());
					
				for (var l=0; l<langList.size(); l++) {	
		
							for (var i = 0; i < components.size(); i++) {
								    
									content.
								append("<table width='750'>");
											
											// calculate summary of procent 
											
											var countProc=0;
											
											for (var t=0; t< maxLinesInRow(itemId, components.get(i)); t++ ){
												
												countProc=countProc+Number(getElement(itemId,((components.get(i) - ATTRIBUTE_IDENTIFIER_MAT_COMP_START) * ATTRIBUTE_IDENTIFIER_MAT_COMP_COUNT + ATTRIBUTE_IDENTIFIER_MAT_FRA_START + t)));
											};
											
											//------------------------------------------
											
											
											for ( var j = 0; j < maxLinesInRow(itemId, components.get(i)); j++) {
												
												
												content.append("<tr><td width='10'><font face='Verdana'><b></b></font></td>");
													content.
												append("<td width='200'><font face='Verdana'>");
													if (j==0 ) {
												content.append(findByKey(ATTRIBUTE_IDENTIFIER_MAT_COMP_START,getElement(itemId,(components.get(i) - 0)),propertyKomponentList, langList.get(l)));
													} else 
														{ 
														content.append(" ");
													};
													content.
												append("</font></td>");

													content.
												append(" <td width='200'><font face='Verdana'>  ").
												append(findByKey(ATTRIBUTE_IDENTIFIER_MAT_MAT_START,getElement(itemId,((components.get(i) - ATTRIBUTE_IDENTIFIER_MAT_COMP_START) * ATTRIBUTE_IDENTIFIER_MAT_COMP_COUNT + ATTRIBUTE_IDENTIFIER_MAT_MAT_START + j)),propertyMaterialList, langList.get(l))).
												append("</font></td>");
												
												if (countProc != 100){
													content.append("<td width='150'><font face='Verdana' color='red'> ");
												       } else {
														   content.append("<td width='150'><font face='Verdana'> ");
													   };
												
												content.
												append(getElement(itemId,((components.get(i) - ATTRIBUTE_IDENTIFIER_MAT_COMP_START) * ATTRIBUTE_IDENTIFIER_MAT_COMP_COUNT + ATTRIBUTE_IDENTIFIER_MAT_FRA_START + j))).
												append(" % </font></td>");
												
													content.
												append("<td width='200'><font face='Verdana'> ").
												append(langArr[l]).
												append("</font></td>");
												
													content.
												append("</tr>");

											};

									content.
								append("</table></td></tr><br>");

						};
				content.append("<hr align='center' width='750' /><br>");
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

function findByKey(code, key, listArg, lang) {
	var f = Number(lang).toFixed(0);
	var translate = "";
	var findArg=ATTRIBUTE_DOMAIN_KEY+code+"."+key;
	  for (var i=0; i < listArg.size(); i++){
	   	  if ((listArg.get(i).getKey().equals(findArg))&&(listArg.get(i).getLanguage().getIdentity()==f)){
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
	append("<td width='10'><font face='Verdana'><b></b></font></td>").
	append("<td width='200'><font face='Verdana'><b>Komponente</b></font></td>").
	append("<td width='200'><font face='Verdana'><b>Material</b></font></td>").
	append("<td width='150'><font face='Verdana'><b>Anteil</b></font></td>").
	append("<td width='200'><font face='Verdana'><b>Lokalisierung</b></font></td>").
	append("</tr></table><br>");
	return header;
}

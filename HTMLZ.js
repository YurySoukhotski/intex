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
var productFacade = entryFacade.lookupBean("ProductFacade");

/*
 * Global variables
 */
var HTML_START = java.lang.String("<html><body bgcolor='#e0e0e0'>");
var HTML_END = java.lang.String("</body></html>");


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
		var itemId = productIdentities[0];
		var content = " ";
		
			var neuQuery = "WITH rec(ID, PARENT_ID) AS (SELECT ID, parent_id FROM PIM2_PRODUCT WHERE id ="+ itemId+" UNION ALL SELECT rec1.ID, rec1.parent_id FROM PIM2_PRODUCT rec1, rec WHERE rec1.id =rec.PARENT_ID) SELECT ID FROM rec where PARENT_ID is null";
			logger.info("find Root Product:  " + neuQuery);

			var neuSQLquery = entryFacade.getOpenedSession().createSQLQuery(neuQuery);
			var list = neuSQLquery.list();

			logger.warn("Root Product finded : id of node to find - " + list.size()+ " -- " + list.get(0));
       	
			
			var findRootQuery = "WITH rec(id, identifier, parent_id) AS (SELECT id, identifier, parent_id FROM pim2_node WHERE id IN (SELECT node_id FROM pim2_product_2_node WHERE product_id ="+ list.get(0)+") UNION ALL SELECT rec1.id, rec1.identifier, rec1.parent_id FROM pim2_node rec1, rec WHERE rec1.id=rec.parent_id) SELECT identifier FROM rec where parent_id is null";
			logger.info("find Root clasificator:  " + findRootQuery);
			
			neuSQLquery = entryFacade.getOpenedSession().createSQLQuery(findRootQuery);
			var list = neuSQLquery.list();

			logger.warn("Root Klasificator finded - " + list.size()+ " - "+  list.get(0));
			if (list.get(0).equals("Heine Produkte")){
				content = "Yes product";
			} else {
				content = "Yes Outfits";
			};
	
	mainResult = HTML_START + content + HTML_END;

	return mainResult;
};

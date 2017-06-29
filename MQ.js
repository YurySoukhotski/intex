/**
 * This script will be executed on pim2 product creation.
 * It will set the user and the current date to pim2 attributes
 *
 * @author ULKurschel
 */


function processMessage(objectMessage, entryFacade) {

/*
 * Pfad zum Logger
 */
var LOGGER_MANDATOR = "omn";
var LOGGER_CONTAINER = "pim2_jms/";
var LOGGER_NAME = "createNotification";
var LOGGER_PREFIX = " " + LOGGER_NAME + " ";
var LOGGER_FILE = "/usr/local/omn/logs/" + LOGGER_MANDATOR + "/" + LOGGER_CONTAINER + "/" + LOGGER_NAME + ".log";

/*
 * Logger Konfiguration
 */
var Log4j = Packages.org.apache.log4j;
var loggerExists = Log4j.LogManager.exists( LOGGER_NAME );
var logger = Log4j.Logger.getLogger( LOGGER_NAME );

if( !loggerExists )
{

logger.setLevel( Log4j.Level.toLevel( Log4j.Level.INFO_INT ) );
logger.setAdditivity( false ); // else it's also written to tomcat.log

var rollingFileAppender = new Log4j.RollingFileAppender( );
rollingFileAppender.setFile( LOGGER_FILE );
rollingFileAppender.setAppend( true );
rollingFileAppender.setBufferedIO( false );
rollingFileAppender.setBufferSize( 4096 );
rollingFileAppender.setMaxBackupIndex( 4 );

// Default max size is 10MB...

var layout = new Log4j.PatternLayout( "%d [%t] %-5p %C.%M() %c{1} - %m%n" );
rollingFileAppender.setLayout( layout );

rollingFileAppender.activateOptions( );

logger.removeAllAppenders( );
logger.addAppender( rollingFileAppender );
}

// ----------------------------- FACADES -----------------------------
/* Constants, Facades, Packages */
var entityManager = entryFacade.getEntityManager();

var productFacade = entryFacade.lookupBean("ProductFacade");
var pim2ApiFacade = entryFacade.lookupBean("Pim2ApiFacade");
var roleFacade = entryFacade.lookupBean('MandatorRoleFacade');
var mandatorFacade = entryFacade.lookupBean("LogisticsMandatorFacade");

//var basicHelper = new Packages.com.meylemueller.javascript.helper.BasicJavaScriptHelper( entryFacade );
//var configurationHelper = basicHelper.getConfigurationHelper();

/* Variables */
//var MANDATOR_ID = configurationHelper.getConfigurationSetting("CONF_MANDATOR_ID");

var USER_NAME_LABEL = "userName";
var ITEM_IDENTIFIERS_LABEL = "itemIdentifiers";

var AI_GEAENDERT_VON = "cam_geaendertvon";
var AI_GEAENDERT_AM = "cam_geaendertam";

//logger.info("Start js on create for message" + MANDATOR_ID);

// Obtains product identities by product name
var getProductsForProcessing = function(itemIdentities) {
if (itemIdentities.length() > 0) {
var productNames = new java.util.ArrayList();
for (var index = 0; index < itemIdentities.length(); index++) {
productNames.add(itemIdentities.getString(index));
}
logger.info("productNames " + productNames);
return productNames;
}
return java.util.Collections.emptyList();
};

// create attribute value VO for using of pim2 API
var createAttributeValueVO = function(attributeIdentifier, value, languageId) {
var attributeValueVO = new Packages.com.meylemueller.pim2.api.object.AttributeValueVO();
attributeValueVO.setAttributeDefinitionIdentifier(attributeIdentifier);
attributeValueVO.setValue(value);
attributeValueVO.setLanguageId(languageId);
return attributeValueVO;
};

// process item identifier
var processProduct = function(productIdentifier, userName) {
logger.info("Product " + productIdentifier + " will be processed");

var groupedProductsForUpdate = new java.util.HashMap();
var updatedValues = new java.util.ArrayList();

// Get current date
var currentDate = new java.util.Date();
var dateAsTimestampInMilli = currentDate.getTime();

// Set date and username to product
logger.info("Set user=" + userName + " and date=" + dateAsTimestampInMilli);
updatedValues.add(createAttributeValueVO("90100", "product2", null));

// save release status attributes using pim2 API
groupedProductsForUpdate.put(new Packages.com.meylemueller.pim2.identity.ItemIdentity(productIdentifier), updatedValues);
pim2ApiFacade.updateItems(groupedProductsForUpdate);
}

// ENTRYPOINT
logger.info("Start js on create for message " + objectMessage.getObject());

// because it take some time until the item is available via API, it has to wait
java.lang.Thread.sleep(500);

// get values from json message
var jsonObject = new Packages.org.codehaus.jettison.json.JSONObject(objectMessage.getObject());
var itemIdentities = jsonObject.getJSONArray(ITEM_IDENTIFIERS_LABEL);
var userName = jsonObject.getString(USER_NAME_LABEL);

// process item identifiers
var productIdentifiers = getProductsForProcessing(itemIdentities);
for (var index = 0; index < productIdentifiers.size(); index++) {
processProduct(productIdentifiers.get(index), userName);
}

logger.info("Finished js");

return true;

}
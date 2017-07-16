/**
 * This script will be executed on pim2 product update.
 * It checks if there are attributes updated which has to be send to XFit
 *
 * @author ULKurschel
 */


function processMessage(objectMessage, entryFacade) {

/*
 * Pfad zum Logger
 */
var LOGGER_MANDATOR = "Heine-PIM2";
var LOGGER_CONTAINER = "pim2_jms";
var LOGGER_NAME = "dirtyProductsNotification";
var LOGGER_PREFIX = " " + LOGGER_NAME + " ";
var LOGGER_FILE = "/usr/local/omn/logs/" + LOGGER_MANDATOR + "/" + LOGGER_CONTAINER + "/" + LOGGER_NAME + ".log";

/*
 * Logger Konfiguration
 */
var logger = new Packages.com.meylemueller.javascript.helper.Log.getScriptLogger(LOGGER_NAME, LOGGER_FILE, null, "INFO");

// ----------------------------- FACADES -----------------------------
/* Constants, Facades, Packages */
var entityManager = entryFacade.getEntityManager();

var productFacade = entryFacade.lookupBean("ProductFacade");
var attributeDefinitionFacade = entryFacade.lookupBean("AttributeDefinitionFacade");

var basicHelper = entryFacade.lookupBean( "basicJavaScriptHelper" );
var xfitMappingUtils = entryFacade.lookupBean("XfitMappingUtils");
var xfitExportService = entryFacade.lookupBean("XfitExportService");

/* Variables */
var JSON_USER_NAME = "userName";
var JSON_ITEMS = "items";
var JSON_ITEM_IDENTIFIER = "itemIdentifier";
var JSON_CHANGED_ATTRS = "changedAttributes";
var JSON_ATTR_IDENTIFIER = "identifier";
var JSON_ATTR_OLD_VALUE = "oldValues";
var JSON_ATTR_NEW_VALUE = "newValues";

// Get all product names from json array
var getItemsForProcessing = function(items)
{
if (items.length() > 0) {

var itemNames = new java.util.ArrayList();
var itemJsonObject = null;
var itemIdentifier = null;

for (var index = 0; index < items.length(); index++)
{
itemJsonObject = items.getJSONObject(index);
itemIdentifier = itemJsonObject.getString(JSON_ITEM_IDENTIFIER);
itemNames.add(itemIdentifier);
}
logger.info("itemNames " + itemNames);
return itemNames;
}
return java.util.Collections.emptyList();
};

// parse passed json object
// jsonObject - object for parsing (org.codehaus.jettison.json.JSONObject)
// itemIdentifiers - collection for accumulation of product names (java.util.HashSet)
// changedAttributesMap - collection for accumulation of new attribute values (java.util.HashMap)
var parseJsonObject = function(jsonObject, itemIdentifiers, changedAttributesMap)
{
var items = jsonObject.getJSONArray(JSON_ITEMS);
for (var itemIndex = 0; itemIndex < items.length(); itemIndex++)
{
var itemObject = items.getJSONObject(itemIndex);
var itemIdentifier = itemObject.getString(JSON_ITEM_IDENTIFIER);
itemIdentifiers.add(itemIdentifier);
try
{
var jsonChangedAttributes = itemObject.getJSONArray(JSON_CHANGED_ATTRS);
var changedAttributes = new java.util.HashMap();
for (var attrIndex = 0; attrIndex < jsonChangedAttributes.length(); attrIndex++)
{
var changedAttr = jsonChangedAttributes.getJSONObject(attrIndex);
changedAttributes.put(changedAttr.getString(JSON_ATTR_IDENTIFIER), changedAttr.getJSONArray(JSON_ATTR_NEW_VALUE));
}
changedAttributesMap.put(itemIdentifier, changedAttributes);
}
catch(e)
{
// check for products without changed attributes
logger.info("product with identifier " + itemIdentifier + " hasn't changed attributes");
}
}
};

// process item identifier
var processProduct = function(itemIdentifier, userName, changedAttributesMap, xfitIdentifierList)
{
logger.info("Item " + itemIdentifier + " will be processed");
var exportItems = xfitExportService.processDirtyNotification(itemIdentifier, changedAttributesMap, xfitIdentifierList);
//TODO: Better logging
for(var i = 0; i < exportItems.size(); i++)
{
var attributes = exportItems.get(0).getExportNodes();

var attributeIds = "";
for(var j = 0; j < attributes.size(); j++)
{
var attribute = attributes.get(j);
attributeIds += attribute.getAttributeDefinition().getIdentifier() + ", ";
}
logger.info("Found: " + attributeIds);
}
}

// ENTRYPOINT
logger.info("Start js on create for message " + objectMessage.getObject());

// get values from json message
var jsonObject = new Packages.org.codehaus.jettison.json.JSONObject(objectMessage.getObject());
var items = jsonObject.getJSONArray(JSON_ITEMS);
var userName = jsonObject.getString(JSON_USER_NAME);

// get changed values
var itemIdentifiers = new java.util.HashSet();
var changedAttributesMap = new java.util.HashMap();
try
{
parseJsonObject(jsonObject, itemIdentifiers, changedAttributesMap);
}
catch (e)
{
logger.error("Invalid json object " + objectMessage.getObject());
return false;
}

// Get XFit Mapping
var xfitIdentifierList = xfitMappingUtils.getXfitIdentifier();

// process item identifiers
var itemsIdentifier = getItemsForProcessing(items);
for (var index = 0; index < itemsIdentifier.size(); index++)
{
processProduct(itemsIdentifier.get(index), userName, changedAttributesMap, xfitIdentifierList);
}

logger.info("Finished js");

return true;
}
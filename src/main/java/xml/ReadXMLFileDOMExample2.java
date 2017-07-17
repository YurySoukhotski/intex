package xml;


import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

import org.w3c.dom.DOMException;
import org.w3c.dom.Document;
import org.w3c.dom.NamedNodeMap;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;
import org.apache.commons.codec.binary.Base64;
 
public class ReadXMLFileDOMExample2 {
 
    private static final String FILENAME = "import.xml";
 
    public static void main(String[] args) {
        try {
            // Строим объектную модель исходного XML файла
            final File xmlFile = new File(System.getProperty("user.dir")
                    + File.separator + FILENAME);
            DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
            DocumentBuilder db = dbf.newDocumentBuilder();
            Document doc = db.parse(xmlFile);
 
            // Выполнять нормализацию не обязательно, но рекомендуется
            doc.getDocumentElement().normalize();
 
            if (doc.hasChildNodes()) {
                printNodes(doc.getChildNodes());
            }
        } catch (ParserConfigurationException | SAXException
                | IOException ex) {
            Logger.getLogger(ReadXMLFileDOMExample2.class.getName())
                    .log(Level.SEVERE, null, ex);
        }
    }
 
    private static void printNodes(NodeList nodeList) throws DOMException, IOException {
        for (int i = 0; i < nodeList.getLength(); i++) {
            Node node = nodeList.item(i);
            if (Node.ELEMENT_NODE == node.getNodeType()) {
 
                // Печатаем имя ноды и значение
            	
            	if (node.getNodeName().equals("itemdist:CompressedITM")) {
            		decompress(node.getTextContent());
            	
            		
            	
            		
            	}
            	
            	
                System.out.println();
                System.out.println("Имя ноды: " + node.getNodeName());
                System.out.println("Значение ноды: "
                        + node.getTextContent());
 
                if (node.hasAttributes()) {
                    // Есть атрибуты: печатаем и их
                    NamedNodeMap attributes = node.getAttributes();
                    for (int j = 0; j < attributes.getLength(); j++) {
                        Node attribute = attributes.item(j);
                        System.out.println("Имя атрибута: "
                                + attribute.getNodeName());
                        System.out.println("Значение атрибута: "
                                + attribute.getNodeValue());
                    }
                }
                 
                if (node.hasChildNodes()) {
                    // Есть дочерние ноды: печатаем их
                    printNodes(node.getChildNodes());
                }
            }
        }
    }

    public static void decompress(String content) throws IOException {

        byte[] decodedContent = Base64.decodeBase64(content);
        FileOutputStream fileOuputStream = null;
        
        try { 
            fileOuputStream = new FileOutputStream("export.zip"); 
           fileOuputStream.write(decodedContent);
        } finally {
         
			fileOuputStream.close();
        }
      
        String fileZip = "compressed.zip";
        byte[] buffer = new byte[1024];
        ZipInputStream zis = new ZipInputStream(new FileInputStream(fileZip));
        ZipEntry zipEntry = zis.getNextEntry();
        while(zipEntry != null){
            String fileName = zipEntry.getName();
            File newFile = new File("unzipTest/" + fileName);
            FileOutputStream fos = new FileOutputStream(newFile);
            int len;
            while ((len = zis.read(buffer)) > 0) {
                fos.write(buffer, 0, len);
            }
            fos.close();
            zipEntry = zis.getNextEntry();
        }
        zis.closeEntry();
        zis.close();
    }
    }
        
   
        
   
        
   
package model;

import org.w3c.dom.*;
import org.xml.sax.SAXException;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by roman vintonyak on 21.10.14.
 */

public class XmlDataProvider implements DataProvider<Address> {

    private final File file = new File("C:\\addresses.xml");

    //return all data from xml
    public List<Address> getAllData() {

        List<Address> list = new ArrayList<Address>();
        Document doc = null;
        try {
            doc = getDocument(file);
            doc.getDocumentElement().normalize();
            NodeList nodeList = doc.getElementsByTagName("address");
            for (int i = 0; i < nodeList.getLength(); i++) {
                Node nNode = nodeList.item(i);
                if (nNode.getNodeType() == Node.ELEMENT_NODE) {
                    Element eElement = (Element) nNode;
                    list.add(new Address(Double.valueOf(eElement.getAttribute("latitude")), Double.valueOf(eElement.getAttribute("longitude")), eElement.getAttribute("description")));
                }
            }
        } catch (Exception e) {
            System.out.println("some exception!");
        }
        return list;
    }

    //put new address into xml file
    //returns status of operation
    public String putData(Address address) {
        Document doc = null;
        try {
            doc = getDocument(file);

            addNewElement(address, doc, doc.getDocumentElement());
            writeIntoFile(doc);
            return "SUCCESS";
        } catch (Exception e) {
            return "ERROR";
        }
    }

    //clear all data from xml file
    public void clearData() {
        Document doc = null;
        try {
            if (file.exists()) {
                doc = getDocument(file);
                Element rootElement = doc.getDocumentElement();
                clearChildNodes(rootElement);
                writeIntoFile(doc);
            }
        } catch (Exception e) {
            System.out.println("some exception!");
        }
    }

    //get Document object
    private Document getDocument(File file) throws ParserConfigurationException, SAXException, IOException {
        DocumentBuilderFactory dbFactory = DocumentBuilderFactory.newInstance();
        DocumentBuilder dBuilder = dbFactory.newDocumentBuilder();
        Document doc;
        if (!file.exists()) {
            doc = dBuilder.newDocument();
            Element rootElement = doc.createElement("addresses");
            doc.appendChild(rootElement);
            return doc;

        }
        return dBuilder.parse(file);
    }

    //add new element into xml file
    private void addNewElement(Address address, Document doc, Element rootElement) throws TransformerException {

        Element addressElement = doc.createElement("address");
        rootElement.appendChild(addressElement);

        // set attributes to address element

        Attr latitude = doc.createAttribute("latitude");
        latitude.setValue(String.valueOf(address.getLatitude()));
        addressElement.setAttributeNode(latitude);

        Attr longitude = doc.createAttribute("longitude");
        longitude.setValue(String.valueOf(address.getLongitude()));
        addressElement.setAttributeNode(longitude);

        Attr description = doc.createAttribute("description");
        description.setValue(address.getDescription());
        addressElement.setAttributeNode(description);

    }

    //update xml file
    private void writeIntoFile(Document doc) throws TransformerException {
        TransformerFactory transformerFactory = TransformerFactory.newInstance();
        Transformer transformer = transformerFactory.newTransformer();
        DOMSource source = new DOMSource(doc);
        StreamResult result = new StreamResult(file);
        transformer.transform(source, result);
    }

    //clear all child nodes recursively
    private void clearChildNodes(Node node) {
        while (node.hasChildNodes()) {
            NodeList nList = node.getChildNodes();
            int index = node.getChildNodes().getLength() - 1;
            Node n = nList.item(index);
            clearChildNodes(n);
            node.removeChild(n);
        }

    }

}

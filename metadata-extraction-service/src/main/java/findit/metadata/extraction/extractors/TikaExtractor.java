package findit.metadata.extraction.extractors;

import findit.metadata.extraction.interfaces.Extract;
import findit.metadata.extraction.interfaces.Extractor;
import org.apache.tika.exception.TikaException;
import org.apache.tika.metadata.Metadata;
import org.apache.tika.parser.AutoDetectParser;
import org.apache.tika.parser.ParseContext;
import org.apache.tika.sax.BodyContentHandler;
import org.json.simple.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.xml.sax.SAXException;

import javax.xml.transform.TransformerConfigurationException;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;

@Component
public class TikaExtractor implements Extractor {
    private static Logger logger = LoggerFactory.getLogger(TikaExtractor.class);

    private AutoDetectParser autoParser;

    @Autowired
    public void setAutoParser(AutoDetectParser autoParser) {
        this.autoParser = autoParser;
    }

    @Override
    public JSONObject getAll(File file) {
        try (InputStream objectData = new FileInputStream(file)) {
            return extract(objectData, Extract.ALL);
        } catch (IOException | TransformerConfigurationException | SAXException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public JSONObject getMetadata(File file) {
        try (InputStream objectData = new FileInputStream(file)) {
            return extract(objectData, Extract.METADATA);
        } catch (IOException | SAXException | TransformerConfigurationException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public JSONObject getContent(File file) {
        try (InputStream objectData = new FileInputStream(file)) {
            return extract(objectData, Extract.CONTENT);
        } catch (IOException | SAXException | TransformerConfigurationException e) {
            throw new RuntimeException(e);
        }
    }

    private JSONObject extract(InputStream objectData, Extract extractionType) throws IOException, TransformerConfigurationException, SAXException {
        String extractedText = "";

        BodyContentHandler handler = new BodyContentHandler();
        ParseContext parseContext = new ParseContext();
        Metadata tikaMetadata = new Metadata();
        try {
            autoParser.parse(objectData, handler, tikaMetadata, parseContext);
            if (extractionType == Extract.ALL || extractionType == Extract.CONTENT) {
                extractedText = handler.toString();
            }
        } catch (TikaException e) {
            logger.error("TikaException thrown while parsing: " + e.getLocalizedMessage());
            return assembleExceptionResult(e);
        }

        logger.info("Tika parsing success");
        return assembleExtractionResult(extractedText, tikaMetadata);
    }

    private JSONObject assembleExtractionResult(String extractedText, Metadata tikaMetadata) {
        JSONObject extractJson = new JSONObject();

        String contentType = tikaMetadata.get("Content-Type");
        contentType = contentType != null ? contentType : "content/unknown";

        String contentLength = tikaMetadata.get("Content-Length");
        contentLength = contentLength != null ? contentLength : "0";

        extractJson.put("Exception", null);
        extractJson.put("Text", extractedText);
        extractJson.put("ContentType", contentType);
        extractJson.put("ContentLength", contentLength);

        JSONObject metadataJson = new JSONObject();

        for (String name : tikaMetadata.names()) {
            String[] elements = tikaMetadata.getValues(name);
            String joined = String.join(", ", elements);
            metadataJson.put(name, joined);
        }

        extractJson.put("Metadata", metadataJson);

        return extractJson;
    }

    private JSONObject assembleExceptionResult(Exception e) {
        JSONObject exceptionJson = new JSONObject();

        exceptionJson.put("Exception", e.getLocalizedMessage());
        exceptionJson.put("ContentType", "unknown");
        exceptionJson.put("ContentLength", "0");
        exceptionJson.put("Text", "");

        JSONObject metadataJson = new JSONObject();

        exceptionJson.put("Metadata", metadataJson);

        return exceptionJson;
    }
}

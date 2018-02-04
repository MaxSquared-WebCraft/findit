package findit.metadata.extraction;

import findit.metadata.extraction.interfaces.Extractor;
import org.apache.commons.io.IOUtils;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.stream.annotation.EnableBinding;
import org.springframework.cloud.stream.annotation.StreamListener;
import org.springframework.context.annotation.ImportResource;
import org.springframework.messaging.handler.annotation.SendTo;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.net.URL;

@SpringBootApplication
@ImportResource("classpath:spring.xml")
@EnableBinding(ExtractorMessaging.class)
public class MetadataExtractionServiceApplication {

    private final Extractor extractor;
    private static Logger logger = LoggerFactory.getLogger(MetadataExtractionServiceApplication.class);

    @Autowired
    public MetadataExtractionServiceApplication(Extractor extractor) {
        this.extractor = extractor;
    }

    public static void main(String[] args) {
        SpringApplication.run(MetadataExtractionServiceApplication.class, args);
    }

    private static File downloadFileFromURL(URL url) throws IOException {
        final File tempFile = File.createTempFile("tempfile", ".tmp");
        try (InputStream in = url.openStream();
             FileOutputStream out = new FileOutputStream(tempFile)) {
             IOUtils.copy(in, out);
        }
        return tempFile;
    }

    @StreamListener(ExtractorMessaging.FILE_UPLOADED)
    @SendTo(ExtractorMessaging.METADATA_EXTRACTED)
    public String handle(byte[] in) {

        JSONObject uploadedFileMsg = new JSONObject(new String(in));
        JSONObject extractionMetadata = new JSONObject();

        logger.info("Location: " + uploadedFileMsg.getString("location"));

        try {

            URL url = new URL(uploadedFileMsg.getString("location"));
            File f = downloadFileFromURL(url);
            extractionMetadata = extractor.getAll(f);

            boolean success = f.delete();

            if (!success)
                throw new IOException("File could not be deleted");

        } catch (MalformedURLException e) {
            logger.error("Malformed url exception in FILE_UPLOADED event", e);
        } catch (IOException e) {
            logger.error("IO Exception wile downloading file", e);
        }

        if (extractionMetadata != null) {

            String content = (String) extractionMetadata.get("Text");

            // Remove new lines
            content = content.replace("\n", " ");
            content = content.replace("\r", " ");

            // remove multiple spaces so only one is present between words
            content = content.replaceAll("\\s{2,}", " ").trim();

            extractionMetadata.put("metadata", content);
            extractionMetadata.put("fileUuid", uploadedFileMsg.getString("fileUuid"));
            extractionMetadata.put("userId", uploadedFileMsg.getString("userId"));
            extractionMetadata.put("originalname", uploadedFileMsg.getString("originalname"));
            extractionMetadata.put("location", uploadedFileMsg.getString("location"));
        }

        if(extractionMetadata != null) {
            logger.info(extractionMetadata.toString());
            return extractionMetadata.toString();
        } else {
            logger.error("Could not extract Metadata");
            return "";
        }
    }
}

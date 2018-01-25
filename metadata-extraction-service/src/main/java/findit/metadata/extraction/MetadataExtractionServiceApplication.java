package findit.metadata.extraction;

import findit.metadata.extraction.events.FileUploadedEvent;
import findit.metadata.extraction.events.MetadataExtractedEvent;
import findit.metadata.extraction.interfaces.Extractor;
import org.apache.commons.io.IOUtils;
import org.json.simple.JSONObject;
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
import java.net.URL;

@SpringBootApplication
@ImportResource("classpath:spring.xml")
@EnableBinding(ExtractorMessaging.class)
public class MetadataExtractionServiceApplication {
    private final Extractor extractor;

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
    public MetadataExtractedEvent receivedFileUploaded(FileUploadedEvent fileUploaded) {
        MetadataExtractedEvent metadataExtractedEvent = new MetadataExtractedEvent();
        JSONObject extractionMetadata = null;
        try {
            URL url = new URL("http://file-service/file/" + fileUploaded.getFileId());
            File f = downloadFileFromURL(url);

            extractionMetadata = extractor.getAll(f);
            f.delete();
        } catch (Exception e) {
        }

        if (extractionMetadata != null) {
            String content = (String) extractionMetadata.get("Text");
            // Remove new lines
            content = content.replace("\n", " ");
            content = content.replace("\r", " ");
            // remove multiple spaces so only one is present between words
            content = content.replaceAll("\\s{2,}", " ").trim();
            extractionMetadata.put("Text", content);

            metadataExtractedEvent.setFileId(fileUploaded.getFileId());
            metadataExtractedEvent.setUserId(fileUploaded.getUserId());
            metadataExtractedEvent.setMetadata(content);
        }
        return metadataExtractedEvent;
    }
}

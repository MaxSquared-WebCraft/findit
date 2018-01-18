package findit.metadata.extraction;

import org.springframework.cloud.stream.annotation.Input;
import org.springframework.cloud.stream.annotation.Output;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.SubscribableChannel;

public interface ExtractorMessaging {
    String FILE_UPLOADED = "FILE_UPLOADED";
    String METADATA_EXTRACTED = "METADATA_EXTRACTED";

    @Input("FILE_UPLOADED")
    SubscribableChannel fileUploaded();

    @Output("METADATA_EXTRACTED")
    MessageChannel metadataExtracted();
}

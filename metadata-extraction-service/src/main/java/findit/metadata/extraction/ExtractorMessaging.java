package findit.metadata.extraction;

import org.springframework.cloud.stream.annotation.Input;
import org.springframework.cloud.stream.annotation.Output;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.SubscribableChannel;

public interface ExtractorMessaging {
    String FILE_UPLOADED = "file-uploaded";
    String METADATA_EXTRACTED = "metadata-extracted";

    @Input("file-uploaded")
    SubscribableChannel fileUploaded();

    @Output("metadata-extracted")
    MessageChannel metadataExtracted();
}

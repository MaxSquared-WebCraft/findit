package findit.metadata.extraction.interfaces;

import org.json.simple.JSONObject;

import java.io.File;

public interface Extractor {
    JSONObject getAll(File file);

    JSONObject getMetadata(File file);

    JSONObject getContent(File file);
}

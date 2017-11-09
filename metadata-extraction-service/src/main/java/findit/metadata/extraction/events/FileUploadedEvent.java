package findit.metadata.extraction.events;

public class FileUploadedEvent {
    private String userId;
    private String fileId;

    public FileUploadedEvent(String userId, String fileId) {
        this.userId = userId;
        this.fileId = fileId;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getFileId() {
        return fileId;
    }

    public void setFileId(String fileId) {
        this.fileId = fileId;
    }
}

// models/fileModel.js (optional, for saving metadata)
class FileMetadata {
  constructor(fileName, fileUrl, region) {
    this.fileName = fileName;
    this.fileUrl = fileUrl;
    this.region = region;
  }
}

module.exports = FileMetadata;

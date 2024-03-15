// Component for uploading a zip file.
import { useState } from "react";
import PropTypes from "prop-types";
import { Upload, message } from "antd";
import { InboxOutlined } from "@ant-design/icons";

const { Dragger } = Upload;

const UploadArea = ({ onFileUpload }) => {
  const [fileList, setFileList] = useState([]);

  // Validates the uploaded file before it is uploaded.
  const beforeUpload = (file) => {
    const isZip = file.type === "application/zip";
    if (!isZip) {
      message.error(`${file.name} is not a zip file`);
    }
    return isZip || Upload.LIST_IGNORE;
  };

  const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    const uploadedFile = newFileList.find((file) => file.status === "done");
    if (uploadedFile) {
      message.success(`${uploadedFile.name} uploaded successfully.`);
      onFileUpload(uploadedFile.originFileObj);
    }
  };

  const handleCustomRequest = (options) => {
    setTimeout(() => {
      options.onSuccess("ok");
    }, 1000);
  };

  return (
    <Dragger
      fileList={fileList}
      beforeUpload={beforeUpload}
      onChange={onChange}
      multiple={false}
      maxCount={1}
      customRequest={handleCustomRequest}
    >
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>

      <p className="ant-upload-text">
        Click or drag a .zip file to this area to upload
      </p>

      <p className="ant-upload-hint">
        Only .zip files are supported. The zip should contain a single PNG
        image.
      </p>
    </Dragger>
  );
};

UploadArea.propTypes = {
  onFileUpload: PropTypes.func.isRequired,
};

export default UploadArea;

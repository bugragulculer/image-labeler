import { useState } from "react";
import { message } from "antd";
import Header from "../../components/header/Header";
import UploadArea from "../../components/upload-area/UploadArea";
import Canvas from "../../components/canvas/Canvas";
import { extractImageFromZip } from "../../utils/fileHandlers";
import "./HomePage.css";

const HomePage = () => {
  const [imageURL, setImageURL] = useState("");

  // Function to handle file upload
  const handleFileUpload = async (file) => {
    try {
      // Extracting image from the uploaded file
      // Creating object URL for the extracted image
      const imageFile = await extractImageFromZip(file);
      const imageURL = URL.createObjectURL(imageFile);
      setImageURL(imageURL);
    } catch (error) {
      message.error("Error extracting image:", error);
    }
  };

  return (
    <div className="app-wrapper">
      <div className="app">
        <Header />

        <UploadArea onFileUpload={handleFileUpload} />

        {imageURL && <Canvas imageURL={imageURL} />}
      </div>
    </div>
  );
};

export default HomePage;

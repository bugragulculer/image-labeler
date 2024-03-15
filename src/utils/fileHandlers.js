// Extracts an image file from a ZIP file.
import JSZip from "jszip";

export const extractImageFromZip = async (zipFile) => {
  const zip = await JSZip.loadAsync(zipFile);
  const fileNames = Object.keys(zip.files);

  for (let fileName of fileNames) {
    if (fileName.endsWith(".png")) {
      // Extract the file data as a blob
      // Create a new File object with the extracted file data
      const fileData = await zip.files[fileName].async("blob");
      return new File([fileData], fileName, { type: "image/png" });
    }
  }

  throw new Error("No PNG image found in zip file.");
};

// Validates whether a file is a ZIP file.
export const validateZipFile = (file) => {
  return file && file.type === "application/zip";
};

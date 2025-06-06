// Upload function for Cloudinary
const uploadImageToCloudinary = async (file: File): Promise<{url: string, public_id: string}> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "website"); // Make sure this preset exists in your Cloudinary account
  formData.append("tags", "blog_images");

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/dtxh3ew7s/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    if (result.error) {
      throw new Error(`Cloudinary error: ${result.error.message}`);
    }

    return {
      url: result.secure_url,
      public_id: result.public_id
    };
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    throw new Error("Failed to upload image to Cloudinary");
  }
}; 
export async function uploadPDFToCloudinary(pdfBlob: Blob): Promise<string> {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
  
    if (!cloudName || !uploadPreset) {
      throw new Error('Cloudinary configuration is missing.');
    }
  
    const formData = new FormData();
    formData.append('file', pdfBlob);
    formData.append('upload_preset', uploadPreset);
    formData.append('resource_type', 'auto'); // Allows uploading non-image files like PDFs
  
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
      method: 'POST',
      body: formData,
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Cloudinary upload failed: ${errorData.error.message}`);
    }
  
    const data = await response.json();
    return data.secure_url; // Public URL of the uploaded PDF
  }
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function uploadImageToS3(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Server error:", errorText);
      throw new Error("Upload failed");
    }

    const data = await response.json();
    return data.url;
  } catch (err) {
    console.error("Upload error:", err);
    throw err;
  }
}

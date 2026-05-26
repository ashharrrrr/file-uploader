const uploadForm = document.getElementById("upload-form");

uploadForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const fileInput = document.getElementById("file-input");

  const fileLabel = document.getElementById("file-label");

  fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];

    if (!file) {
      fileLabel.innerText = "Choose File";

      return;
    }

    fileLabel.innerText = file.name;
  });

  const file = fileInput.files[0];

  if (!file) {
    showToast("No file selected!");
    return;
  }

  try {
    const response = await fetch("/files/signed-upload", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        fileName: file.name,

        mimeType: file.type,

        size: file.size,

        folderId: CURRENT_FOLDER_ID,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();

      showToast(errorData.error || "Upload Failed!");
      return;
    }

    const data = await response.json();

    const uploadUrl = `${SUPABASE_URL}/storage/v1/object/upload/sign/drive-files/${data.path}?token=${data.token}`;

    const uploadResponse = await fetch(uploadUrl, {
      method: "PUT",

      headers: {
        "Content-Type": file.type,
      },

      body: file,
    });

    if (!uploadResponse.ok) {
      const text = await uploadResponse.text();

      throw new Error(text);
    }

    window.location.reload();
    fileLabel.innerText =
  "Choose File";

fileInput.value = "";
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    showToast(
        "Something went wrong!"
    )
  }
});

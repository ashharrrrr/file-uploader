const uploadForm =
  document.getElementById("upload-form");

uploadForm.addEventListener(
  "submit",
  async (e) => {

    e.preventDefault();

    console.log("FORM SUBMITTED");

    const fileInput =
      document.getElementById("file-input");

    const file =
      fileInput.files[0];

    console.log("FILE:", file);

    if (!file) {
      alert("No file selected");
      return;
    }

    try {

      console.log(
        "REQUESTING SIGNED URL"
      );

      const response =
        await fetch(
          "/files/signed-upload",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              fileName: file.name,

              mimeType: file.type,

              size: file.size,

              folderId:
                CURRENT_FOLDER_ID,
            }),
          }
        );

      console.log(
        "SIGNED URL RESPONSE:",
        response
      );

      const data =
        await response.json();

      console.log(
        "SIGNED URL DATA:",
        data
      );

      const uploadUrl =
        `${SUPABASE_URL}/storage/v1/object/upload/sign/drive-files/${data.path}?token=${data.token}`;

      console.log(
        "UPLOAD URL:",
        uploadUrl
      );

      const uploadResponse =
        await fetch(
          uploadUrl,
          {
            method: "PUT",

            headers: {
              "Content-Type":
                file.type,
            },

            body: file,
          }
        );

      console.log(
        "UPLOAD RESPONSE:",
        uploadResponse
      );

      if (!uploadResponse.ok) {

        const text =
          await uploadResponse.text();

        console.log(
          "SUPABASE ERROR:",
          text
        );

        throw new Error(text);
      }

      console.log(
        "UPLOAD SUCCESS"
      );

      window.location.reload();

    } catch (err) {

      console.error(
        "UPLOAD ERROR:",
        err
      );

      alert(err.message);
    }
});
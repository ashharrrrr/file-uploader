async function createShareLink(
  folderId
) {

  try {

    const response =
      await fetch(
        `/folders/share/${folderId}`,
        {
          method: "POST",
        }
      );

    const data =
      await response.json();

    if (!response.ok) {

      showToast(
        data.error
      );

      return;
    }

    await navigator.clipboard.writeText(data.url);

    showToast("Share link copied", "success");
} catch(err){
    console.error(err);
    showToast("Failed to create share link")

}}

window.createShareLink = createShareLink;
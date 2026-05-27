async function createShareLink(folderId) {
  try {
    const shareButton = document.getElementById("share-button");

    setButtonLoading(shareButton, "Creating...");
    const expirySeconds = document.getElementById("share-expiry").value;
    const response = await fetch(`/folders/share/${folderId}`, {
      method: "POST",
      body: JSON.stringify({ expirySeconds }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      showToast(data.error);

      return;
    }

    await navigator.clipboard.writeText(data.url);
    resetButtonLoading(shareButton);
    showToast("Share link copied", "success");
  } catch (err) {
    console.error(err);
    resetButtonLoading(shareButton);
    showToast("Failed to create share link");
  }
}

window.createShareLink = createShareLink;

function showPopup(popupId) {
  const popup = document.getElementById(popupId);
  const overlay = document.getElementById('overlay');
  popup.classList.add('active');
  overlay.classList.add('active');
}

function hidePopup(popupId) {
  const popup = document.getElementById(popupId);
  const overlay = document.getElementById('overlay');
  popup.classList.remove('active');
  overlay.classList.remove('active');
}

// Khôi phục lại sự kiện hover cho certificate để popup hiện lên khi hover và ẩn khi rời chuột.
document.querySelectorAll('.certificate').forEach((cert, index) => {
  const popupId = `cert${index + 1}Popup`;
  const popup = document.getElementById(popupId);
  let hideTimeout;

  function show() {
    clearTimeout(hideTimeout);
    showPopup(popupId);
  }
  function hide() {
    hideTimeout = setTimeout(() => hidePopup(popupId), 100);
  }

  cert.addEventListener('mouseenter', show);
  cert.addEventListener('mouseleave', hide);
  if (popup) {
    popup.addEventListener('mouseenter', show);
    popup.addEventListener('mouseleave', hide);
  }
});
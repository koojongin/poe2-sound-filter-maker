document.getElementById('action-button')?.addEventListener('click', async () => {
    const filePaths = await window.electron.openFileDialog();
    if (filePaths && filePaths.length > 0) {
        filePathElement.textContent = `Selected file: ${filePaths[0]}`;
    }
});
const state = {}

try {
    createBookmarkPanel();
    createSidebarVisibilityToggleButton();
    window.addEventListener('keydown', e => hotKeys(e))
} catch (error) {
    console.log(error)
}
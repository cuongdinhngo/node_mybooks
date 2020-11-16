<script>
const currentUrl = window.location.pathname;
const navItems = ['publishers', 'users'];
function activeNavItem() {
    let currentUri = navItems.filter(item => currentUrl.indexOf(item) !== -1).toString();
    currentUri = currentUri.charAt(0).toUpperCase() + currentUri.slice(1);
    $('#nav'+currentUri).addClass("active");
}
activeNavItem();
</script>

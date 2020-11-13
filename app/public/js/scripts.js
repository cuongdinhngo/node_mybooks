<script>
const currentUrl = window.location.pathname;
const navItems = ['publishers'];
function activeNavItem() {
    let currentUri = navItems.filter(item => currentUrl.indexOf(item)).toString();
    currentUri = currentUri.charAt(0).toUpperCase() + currentUri.slice(1);
    $('#nav'+currentUri).addClass("active");
}
activeNavItem();
</script>

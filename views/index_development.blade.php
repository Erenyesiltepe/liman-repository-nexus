<style>
    .content-wrapper {
        background: #fff
    }
</style>
<script>
    window.$user_status = () => {
        return '{{ $GLOBALS['limanData']['user']['status'] }}';;
    }
    $(".customAlert").remove();
</script>
<div id="app"></div>
<script type="module" src="https://localhost:5173/src/main.ts"></script>
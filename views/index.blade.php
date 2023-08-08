<style>
    .content-wrapper {
        background: #fff
    }
</style>
@php
$manifest = file_get_contents(getPath("/public/vite/manifest.json"));
$manifest = json_decode($manifest, true);
@endphp

<script>
    window.$user_status = () => {
        return '{{ $GLOBALS['limanData']['user']['status'] }}';;
    }
    $(".customAlert").remove();
</script>
<div id="app"></div>

@foreach($manifest as $file)
@switch (pathinfo($file['src'], PATHINFO_EXTENSION))
@case('js')
<script type="module" src='{{ publicPath("vite/" . $file["file"]) }}' defer></script>
@break
@case('ts')
<script type="module" src='{{ publicPath("vite/" . $file["file"]) }}' defer></script>
@break
@case('css')
<script>
    $.ajax({
        url: '{{ publicPath("vite/" . $file["file"]) }}',
        dataType: "text",
        success: function(cssText) {
            $("head").append("<style>" + cssText + "</style>");
        }
    });
</script>
@break
@default
@break
@endswitch
@endforeach
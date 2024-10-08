<script lang="ts">
    import { T } from "@threlte/core";
    import { AxesHelper as ThreeAxesHelper } from "three";

    export let size = 20;
</script>

<T is={ThreeAxesHelper} args={[size]} />

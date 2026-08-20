<script lang="ts">
  import logo from './assets/3ninja-lightsphere.png';

  type Props = {
    size?: number;
    alt?: string;
    class?: string;
  };

  let { size = 32, alt = '3 Ninja LLC', class: className = '' }: Props = $props();
</script>

<img src={logo} {alt} width={size} height={size} class="brand-mark {className}" loading="eager" decoding="async" />

<style>
  .brand-mark {
    display: block;
    object-fit: contain;
    flex-shrink: 0;
  }
</style>

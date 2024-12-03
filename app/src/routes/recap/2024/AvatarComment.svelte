<script>
  import Avatar from "../../../components/Avatar/Avatar.svelte";

  export let username = "azukiazusa";
  export let comment = "こんにちは、かわいい犬ですね";
</script>

<div class="flex items-start space-x-4">
  <Avatar
    alt=""
    src="https://avatars.githubusercontent.com/u/59350345?v=4"
    size="md"
  />
  <div class="min-w-0 flex-1">
    <div class="flex items-center justify-between">
      <p class="truncate text-sm font-medium text-gray-900">{username}</p>
    </div>
    <p class="mt-1 text-sm text-gray-500">{comment}</p>
  </div>
</div>

// Godot's WebAssembly engine is split into two files for static hosts with
// a 32 MiB per-file limit. Reassemble only requests for this game's engine.
(() => {
 const fetchOriginal = window.fetch.bind(window);
 window.fetch = async (input, init) => {
  const url = typeof input === 'string' ? input : input.url;
  if (!url || !new URL(url, location.href).pathname.endsWith('/index.wasm')) return fetchOriginal(input, init);
  const parts = await Promise.all(['aa', 'ab'].map(async suffix => {
   const response = await fetchOriginal(url + '.part' + suffix, init);
   if (!response.ok) throw new Error('Unable to load the Godot engine');
   return response.arrayBuffer();
  }));
  return new Response(new Blob(parts, {type:'application/wasm'}), {headers:{'Content-Type':'application/wasm'}});
 };
})();

import { PAGINATION_QUERY } from "../components/Pagination";

export default function paginationField() {
  return {
    keyArgs: false, // tells apollo we will take care of everything
    read(existing = [], { args, cache }) {
      //console.log({ existing, args, cache });
      const { skip, first } = args;
      //read the numbers of items on the page from the cache
      const data = cache.readQuery({ query: PAGINATION_QUERY });
      console.log("data back", data);
      const count = data?._allProductsMeta?.count || 0;
      console.log("count", count);
      const page = skip / first + 1;
      const pages = Math.ceil(count / first);
      console.log("page", page);
      console.log("pages", pages);
      //Check if we have existing items
      console.log("existing items", existing);
      const items = existing.slice(skip, skip + first).filter((x) => x);
      console.log("resulting items", items);

      //there are items
      //and there arent enough items to satisfy how many were requested
      //and we are on the last page

      if (items.length && items.length !== first && page === pages)
        return items;

      if (items.length && count < first) return items;

      if (items.length !== first) {
        //we dont have any items, we must go to the network to feth them
        return false;
      }

      //if there are items, just return them from the cache, and we dont need to go to the network
      if (items.length) {
        return items;
      }

      return false; // fallback to network
      //first thing it does it asks the read function for those items.
      //we can either do one of two things:
      //first things we can do is return the items because they are already in the cache
      //The other thing we can do is return a false from here (network request)
    },
    merge(existing, incoming, { args }) {
      //This runs when the apollo client comes back from the network with the items
      console.log("mergin items form the network");
      console.log("incoming", incoming);
      console.log("existing", existing);
      const { skip, first } = args;
      console.log("in merge", { skip, first });
      const merged = existing ? existing.slice(0) : [];
      for (let i = skip; i < skip + incoming.length; ++i) {
        merged[i] = incoming[i - skip];
      }
      console.log("merged", merged);
      return merged;
    },
  };
}

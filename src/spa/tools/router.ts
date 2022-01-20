export const router = {
  getUrl() {
    return window.location.hash.slice(1);
  },

  navigate(hash : string) {
    window.location.hash = hash;
  },
};
  
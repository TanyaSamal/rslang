export const router = {
  getUrl() {
    let url: string = window.location.hash.slice(1);

    if (url === 'sprint' || url === 'audiocall') {
      localStorage.removeItem('sprintState');
      localStorage.removeItem('audiocallState');
    }

    if (url === '_sprint' || url === '_audiocall') {
      url = url.slice(1);
    }

    return url;
  },

  navigate(hash: string) {
    window.location.hash = hash;
  },

};
  
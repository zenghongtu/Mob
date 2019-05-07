const download = (url: string, filename = 'unTitled', ext = '.m4a') => {
  return fetch(url)
    .then((res) => res.blob())
    .then((blob) => {
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.style.display = 'none';
      const url = window.URL.createObjectURL(blob);
      a.href = url;
      a.download = `${filename}${ext}`;
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    });
};

export default download;

import React from 'react';

export default function Duration({
  className,
  seconds,
}: {
  className?;
  seconds: number;
}) {
  return <span className={className}>{format(seconds)}</span>;
}

function format(seconds) {
  const date = new Date(seconds * 1000);
  const hh = date.getUTCHours();
  const mm = date.getUTCMinutes();
  const ss = pad(date.getUTCSeconds());
  if (hh) {
    return `${hh}:${pad(mm)}:${ss}`;
  }
  return `${mm}:${ss}`;
}

function pad(n: number) {
  return ('0' + n).slice(-2);
}

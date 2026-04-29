import md5 from "blueimp-md5";

export function getGravatar(email: string) {
  const cleanEmail = email.trim().toLowerCase();

  const hash = md5(cleanEmail);

  return `https://www.gravatar.com/avatar/${hash}?s=400&d=404`;
}

export function getHighResGoogleAvatar(url: string) {
  if (!url) return null;

  if (/=s\d+-c$/.test(url)) {
    return url.replace(/=s\d+-c$/, "=s400-c");
  }

  return `${url}=s400-c`;
}

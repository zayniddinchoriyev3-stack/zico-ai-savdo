export default function handler(req, res) {
  const p = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: process.env.SITE_URL + "/api/youtube-callback",
    response_type: "code",
    access_type: "offline",
    prompt: "consent",
    scope: "https://www.googleapis.com/auth/youtube.upload",
  });
  res.redirect("https://accounts.google.com/o/oauth2/v2/auth?" + p);
}

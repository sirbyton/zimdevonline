
import { useState } from 'react';
import { Mail, MessageCircle, Download, Loader } from 'lucide-react';

export default function App() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [videoData, setVideoData] = useState<any>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const validateTikTokUrl = (urlString: string): boolean => {
    const tiktokRegex = /^(https?:\/\/)?(www\.)?(tiktok\.com|vm\.tiktok\.com|vt\.tiktok\.com)\/[^\s]+/i;
    return tiktokRegex.test(urlString);
  };

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setVideoData(null);
    setDownloadProgress(0);

    // Validate URL
    if (!url.trim()) {
      setError('Please paste a TikTok URL');
      return;
    }

    if (!validateTikTokUrl(url)) {
      setError('Invalid TikTok URL. Please paste a valid TikTok video link (e.g., tiktok.com/video/...)');
      return;
    }

    setLoading(true);

    try {
      // Use the TikWM API
      const encodedUrl = encodeURIComponent(url);
      const response = await fetch(`https://www.tikwm.com/api/?url=${encodedUrl}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch video data');
      }

      const data = await response.json();

      if (data.code !== 0) {
        throw new Error('Video not found or URL is invalid');
      }

      if (data.data && data.data.play) {
        setVideoData(data.data);
        setDownloadProgress(100);
      } else {
        throw new Error('No video data available');
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to download video. Please check the URL and try again.'
      );
      setDownloadProgress(0);
    } finally {
      setLoading(false);
    }
  };

  const handleDirectDownload = (videoUrl: string) => {
    const link = document.createElement('a');
    link.href = videoUrl;
    link.download = `tiktok_${Date.now()}.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="min-h-screen flex flex-col items-center justify-center px-4 py-20">
          <div className="w-full max-w-5xl">
            {/* Header with logos */}
            <div className="flex justify-between items-start mb-12">
              {/* Left: Avatar and Title */}
              <div className="flex flex-col items-start gap-4">
                <img
                  src="https://files.catbox.moe/kboz3w.jpg"
                  alt="Avatar"
                  className="w-24 h-24 rounded-full border-2 border-blue-500 shadow-lg shadow-blue-500/50 object-cover"
                />
                <div className="text-4xl font-bold italic neon-blue">
                  tiktok.zimdev.online
                </div>
              </div>

              {/* Right: Developer Logo */}
              <div className="float">
                <img
                  src="https://files.catbox.moe/61xutj.jpeg"
                  alt="ZimDev Logo"
                  className="w-20 h-20 rounded-full border-2 border-pink-500 shadow-lg shadow-pink-500/50 object-cover"
                />
              </div>
            </div>

            {/* Main Content */}
            <div className="space-y-8 mb-12">
              {/* Title */}
              <div className="space-y-4">
                <h1 className="text-5xl md:text-6xl font-bold text-center mb-4">
                  <span className="neon-blue">TikTok</span>
                  <span className="text-white mx-3">HD</span>
                  <span className="neon-pink">Downloader</span>
                </h1>
                <p className="text-center text-lg text-gray-300">
                  Download TikTok videos in HD without watermark. Fast, easy, and completely free.
                </p>
              </div>

              {/* Input Section */}
              <form onSubmit={handleDownload} className="max-w-2xl mx-auto">
                <div className="space-y-4">
                  {/* URL Input */}
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-pink-500 to-purple-500 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative bg-slate-900 rounded-lg p-1">
                      <input
                        type="text"
                        value={url}
                        onChange={(e) => {
                          setUrl(e.target.value);
                          setError('');
                        }}
                        placeholder="Paste TikTok URL here... (e.g., tiktok.com/video/...)"
                        className="w-full bg-slate-800 text-white px-6 py-4 rounded-md outline-none focus:bg-slate-700 transition placeholder-gray-500"
                      />
                    </div>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-4 space-y-2">
                      <p className="text-red-400 font-semibold">⚠️ Error</p>
                      <p className="text-red-300 text-sm">{error}</p>
                      <p className="text-red-200/70 text-xs mt-2">
                        💡 Tip: Make sure the URL is from tiktok.com or vm.tiktok.com/vt.tiktok.com
                      </p>
                    </div>
                  )}

                  {/* Download Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full relative group overflow-hidden rounded-lg"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-pink-600 to-purple-600 group-hover:from-blue-500 group-hover:via-pink-500 group-hover:to-purple-500 transition duration-300"></div>
                    <div className="relative bg-slate-900 group-hover:bg-transparent px-8 py-4 text-white font-bold text-lg flex items-center justify-center gap-3 transition">
                      {loading ? (
                        <>
                          <Loader className="w-5 h-5 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Download className="w-5 h-5" />
                          Launch Download
                        </>
                      )}
                    </div>
                  </button>

                  {/* Progress Bar */}
                  {loading && (
                    <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-pink-500 transition-all duration-300"
                        style={{ width: `${downloadProgress}%` }}
                      ></div>
                    </div>
                  )}
                </div>
              </form>

              {/* Success Section */}
              {videoData && (
                <div className="max-w-2xl mx-auto space-y-6">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg blur opacity-75"></div>
                    <div className="relative bg-slate-900 rounded-lg p-6 space-y-4">
                      <h2 className="text-2xl font-bold text-green-400">✓ Success!</h2>
                      
                      {/* Video Preview */}
                      <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-800">
                        <img
                          src={videoData.cover}
                          alt="Video cover"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/20 transition">
                          <div className="w-16 h-16 rounded-full bg-pink-500/80 flex items-center justify-center">
                            <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* Video Details */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-400">Author</p>
                          <p className="text-white font-semibold">{videoData.author?.nickname || 'Unknown'}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Views</p>
                          <p className="text-white font-semibold">{videoData.play_count?.toLocaleString() || '0'}</p>
                        </div>
                      </div>

                      {/* Download Button */}
                      <button
                        onClick={() => handleDirectDownload(videoData.play)}
                        className="w-full relative group/btn overflow-hidden rounded-lg"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-blue-600 group-hover/btn:from-green-500 group-hover/btn:to-blue-500 transition duration-300"></div>
                        <div className="relative bg-slate-900 group-hover/btn:bg-transparent px-8 py-3 text-white font-bold flex items-center justify-center gap-2 transition">
                          <Download className="w-4 h-4" />
                          Download HD Video (No Watermark)
                        </div>
                      </button>

                      <button
                        onClick={() => {
                          setVideoData(null);
                          setUrl('');
                        }}
                        className="w-full py-2 text-gray-400 hover:text-gray-200 transition text-sm"
                      >
                        ← Download Another Video
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800/50 py-8 px-4 mt-20">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Left: Copyright */}
            <div className="text-gray-400 text-sm">
              ZimDev Production | 2026©
            </div>

            {/* Center: Description */}
            <div className="text-center text-gray-400 text-sm">
              Fast & Secure TikTok Video Downloader
            </div>

            {/* Right: Contact Links */}
            <div className="flex items-center gap-6">
              {/* WhatsApp */}
              <a
                href="https://wa.me/+263786443311"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-green-600 rounded-full blur opacity-0 group-hover:opacity-75 transition duration-300"></div>
                <div className="relative bg-slate-800 p-3 rounded-full border border-slate-700 group-hover:border-green-500 transition">
                  <MessageCircle className="w-5 h-5 text-green-400 group-hover:text-green-300 transition" />
                </div>
              </a>

              {/* Email */}
              <a
                href="mailto:zimdev@gmail.com"
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full blur opacity-0 group-hover:opacity-75 transition duration-300"></div>
                <div className="relative bg-slate-800 p-3 rounded-full border border-slate-700 group-hover:border-blue-500 transition">
                  <Mail className="w-5 h-5 text-blue-400 group-hover:text-blue-300 transition" />
                </div>
              </a>
            </div>
          </div>

          {/* Divider */}
          <div className="mt-8 pt-8 border-t border-slate-800/50 text-center text-xs text-gray-500">
            <p>All videos are downloaded for personal use only. Please respect copyright and creators' rights.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

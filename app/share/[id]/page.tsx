'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTeamStore } from '@/lib/store/teamStore';
import Link from 'next/link';
import { ArrowLeft, Copy, Check, Share2 } from 'lucide-react';

export default function ShareTeam() {
  const params = useParams();
  const router = useRouter();
  const { teams, exportTeam, loadTeams } = useTeamStore();
  const [team, setTeam] = useState(teams.find(t => t.id === params.id));
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [jsonCopied, setJsonCopied] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    loadTeams();
    setIsReady(true);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!isReady) return;
    const currentTeam = teams.find(t => t.id === params.id);
    if (!currentTeam) {
      router.push('/');
    } else {
      setTeam(currentTeam);
      const json = exportTeam(currentTeam.id);
      const encoded = btoa(json);
      setShareUrl(`${window.location.origin}/import?data=${encoded}`);
    }
  }, [teams, params.id, router, exportTeam, isReady]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyJSON = () => {
    if (team) {
      navigator.clipboard.writeText(exportTeam(team.id));
      setJsonCopied(true);
      setTimeout(() => setJsonCopied(false), 2000);
    }
  };

  const shareToWhatsApp = () => {
    const text = `Check out my Pokemon team "${team?.name}"!`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + shareUrl)}`, '_blank');
  };

  const shareToTwitter = () => {
    const text = `Check out my Pokemon team "${team?.name}" on @PokeStrategist!`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const shareToReddit = () => {
    const title = `My Pokemon Team: ${team?.name}`;
    window.open(`https://reddit.com/submit?title=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const shareToFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const shareToTelegram = () => {
    const text = `Check out my Pokemon team "${team?.name}"!`;
    window.open(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(text)}`, '_blank');
  };

  if (!team) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center gap-4">
          <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors p-2 hover:bg-blue-50 rounded-xl">
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-3xl font-black text-gray-900">Share Team</h1>
            <p className="text-sm text-gray-600 mt-1 font-bold">{team.name}</p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Share Link Section */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-100 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Share2 size={32} className="text-blue-600" />
            <h2 className="text-2xl font-black text-gray-900">Share Link</h2>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-xl border-2 border-gray-200 mb-6">
            <p className="text-sm text-gray-600 break-all font-mono">{shareUrl}</p>
          </div>

          <button
            onClick={copyToClipboard}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-black text-lg shadow-lg hover:shadow-xl flex items-center justify-center gap-3 mb-8"
          >
            {copied ? <Check size={24} /> : <Copy size={24} />}
            {copied ? 'Copied!' : 'Copy Link'}
          </button>

          {/* Social Media Share Buttons */}
          <div className="border-t-2 border-gray-100 pt-6">
            <h3 className="text-lg font-black text-gray-700 mb-4">Share on Social Media</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {/* WhatsApp */}
              <button
                onClick={shareToWhatsApp}
                className="flex flex-col items-center justify-center gap-2 bg-green-50 hover:bg-green-100 border-2 border-green-200 rounded-xl p-4 transition-all hover:scale-105"
                title="Share on WhatsApp"
              >
                <svg className="w-8 h-8" fill="#25D366" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                <span className="text-xs font-bold text-gray-700">WhatsApp</span>
              </button>

              {/* Twitter/X */}
              <button
                onClick={shareToTwitter}
                className="flex flex-col items-center justify-center gap-2 bg-sky-50 hover:bg-sky-100 border-2 border-sky-200 rounded-xl p-4 transition-all hover:scale-105"
                title="Share on Twitter"
              >
                <svg className="w-8 h-8" fill="#1DA1F2" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
                <span className="text-xs font-bold text-gray-700">Twitter</span>
              </button>

              {/* Facebook */}
              <button
                onClick={shareToFacebook}
                className="flex flex-col items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 rounded-xl p-4 transition-all hover:scale-105"
                title="Share on Facebook"
              >
                <svg className="w-8 h-8" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span className="text-xs font-bold text-gray-700">Facebook</span>
              </button>

              {/* Reddit */}
              <button
                onClick={shareToReddit}
                className="flex flex-col items-center justify-center gap-2 bg-orange-50 hover:bg-orange-100 border-2 border-orange-200 rounded-xl p-4 transition-all hover:scale-105"
                title="Share on Reddit"
              >
                <svg className="w-8 h-8" fill="#FF4500" viewBox="0 0 24 24">
                  <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
                </svg>
                <span className="text-xs font-bold text-gray-700">Reddit</span>
              </button>

              {/* Telegram */}
              <button
                onClick={shareToTelegram}
                className="flex flex-col items-center justify-center gap-2 bg-cyan-50 hover:bg-cyan-100 border-2 border-cyan-200 rounded-xl p-4 transition-all hover:scale-105"
                title="Share on Telegram"
              >
                <svg className="w-8 h-8" fill="#0088cc" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
                <span className="text-xs font-bold text-gray-700">Telegram</span>
              </button>
            </div>
          </div>
        </div>

        {/* Export JSON Section */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-100">
          <h2 className="text-2xl font-black text-gray-900 mb-6">Export as JSON</h2>
          <button
            onClick={copyJSON}
            className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-4 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 font-black text-lg shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
          >
            {jsonCopied ? <Check size={24} /> : <Copy size={24} />}
            {jsonCopied ? 'Copied!' : 'Copy JSON'}
          </button>
        </div>
      </main>
    </div>
  );
}

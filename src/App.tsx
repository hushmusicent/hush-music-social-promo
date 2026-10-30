import React, { useState, useEffect } from 'react';
import {
  Account,
  Post,
  PostMedia,
  MediaGalleryItem,
  BioLink,
  Timeslots,
  DayOfWeek,
} from './types';

export const ACCOUNTS: Account[] = [
  { id: 'facebook', name: 'Facebook', handle: 'Hush Music Ent' },
  { id: 'instagram', name: 'Instagram', handle: 'Hush Music Ent' },
  { id: 'tiktok', name: 'TikTok', handle: 'Hush Music Ent' },
  { id: 'youtube', name: 'YouTube', handle: 'Hush Music Ent' },
  { id: 'threads', name: 'Threads', handle: 'Hush Music Ent' },
  { id: 'snapchat', name: 'Snapchat', handle: 'Hush Music Ent' },
  { id: 'x', name: 'X', handle: 'Hush Music Ent', note: 'Account Refresh Required' },
  { id: 'bluesky', name: 'Bluesky', handle: 'Hush Music Ent' },
];

export const FILTERS = [
  'Scheduled Posts',
  'Published',
  'Drafts',
  'Ideas',
  'Awaiting Approval',
  'Not Approved',
  'Expired Approval',
  'Failed',
] as const;

type FilterType = (typeof FILTERS)[number];

const DAYS: DayOfWeek[] = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

function seedPosts(): Post[] {
  return [
    {
      id: 1,
      account: 'tiktok',
      author: 'Hush Music Ent',
      text: 'Come take over the world 1 neighborhood at a time with your friends. Available on Google Play',
      hashtags: '#TakeOverTheWorld #NeighborhoodAdventure #PlayWithFriends',
      status: 'Scheduled Posts',
      date: '',
      time: '',
      category: 'Street Legends',
      media: [],
      thread: [],
      paused: false,
    },
    {
      id: 2,
      account: 'facebook',
      author: 'Calvin King',
      text: 'Its like GTA on your GPS',
      hashtags:
        '#GTA #GPS #Gaming #OpenWorld #Navigation #Adventure #VirtualReality #MobileGaming #CityExplorer #GameOn',
      status: 'Scheduled Posts',
      date: '',
      time: '',
      category: 'Street Legends',
      media: [],
      thread: [],
      paused: false,
    },
  ];
}

function loadJSON<T>(key: string, fallback: T): T {
  try {
    if (typeof localStorage === 'undefined') return fallback;
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch (e) {
    return fallback;
  }
}

function saveJSON<T>(key: string, val: T): void {
  try {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    // Keep in-memory copy if storage quota is reached or the preview
    // iframe blocks storage access
  }
}

export function App() {
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'create' | 'queue' | 'gallery' | 'timeslots' | 'settings'
  >('dashboard');

  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = loadJSON<Post[] | null>('hushPromoPosts', null);
    if (!saved) {
      const initial = seedPosts();
      saveJSON('hushPromoPosts', initial);
      return initial;
    }
    return saved;
  });

  const [selectedAccounts, setSelectedAccounts] = useState<string[]>(() =>
    loadJSON<string[]>('hushPromoAccounts', [
      'facebook',
      'instagram',
      'tiktok',
      'youtube',
      'threads',
      'snapchat',
      'x',
      'bluesky',
    ])
  );

  const [mediaItems, setMediaItems] = useState<MediaGalleryItem[]>(() =>
    loadJSON<MediaGalleryItem[]>('hushPromoMedia', [])
  );

  const [timeslots, setTimeslots] = useState<Timeslots>(() =>
    loadJSON<Timeslots>('hushPromoTimeslots', {})
  );

  const [bioLinks, setBioLinks] = useState<BioLink[]>(() =>
    loadJSON<BioLink[]>('hushPromoBio', [])
  );

  // Queue state
  const [currentFilter, setCurrentFilter] = useState<FilterType>('Scheduled Posts');
  const [bulkSelected, setBulkSelected] = useState<number[]>([]);

  // Create Post Form state
  const [category, setCategory] = useState('Category 1');
  const [crossPost, setCrossPost] = useState(false);
  const [mainAccount, setMainAccount] = useState('facebook');

  // Network customization
  const [ytTitle, setYtTitle] = useState('');
  const [ytVisibility, setYtVisibility] = useState('Public');
  const [ytType, setYtType] = useState('Video');
  const [ytKids, setYtKids] = useState('No');
  const [ytTags, setYtTags] = useState('');

  const [threadsTopic, setThreadsTopic] = useState('');
  const [threadsSpoilerImg, setThreadsSpoilerImg] = useState(false);
  const [threadsSpoilerText, setThreadsSpoilerText] = useState(false);

  const [fbPost, setFbPost] = useState(true);
  const [fbStory, setFbStory] = useState(false);
  const [fbAI, setFbAI] = useState(false);

  const [igPost, setIgPost] = useState(true);
  const [igReel, setIgReel] = useState(false);
  const [igStory, setIgStory] = useState(false);
  const [igAI, setIgAI] = useState(false);

  const [ttDisclose, setTtDisclose] = useState(false);
  const [ttAI, setTtAI] = useState(false);
  const [ttSound, setTtSound] = useState(false);

  const [scStory, setScStory] = useState(true);
  const [scSpotlight, setScSpotlight] = useState(false);

  // Content
  const [description, setDescription] = useState('');
  const [pendingMedia, setPendingMedia] = useState<PostMedia[]>([]);
  const [threadParts, setThreadParts] = useState<string[]>(['']);

  // Repeat & Schedule
  const [repeatEnabled, setRepeatEnabled] = useState(false);
  const [repeatEvery, setRepeatEvery] = useState('Day');
  const [monthDate, setMonthDate] = useState('');
  const [monthWeekday, setMonthWeekday] = useState('');
  const [endDate, setEndDate] = useState('');
  const [stopAfter, setStopAfter] = useState<string>('');
  const [requireApproval, setRequireApproval] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [formMsg, setFormMsg] = useState('');

  // Timeslots message
  const [timeslotMsg, setTimeslotMsg] = useState('');

  // Link in bio form
  const [bioTitle, setBioTitle] = useState('');
  const [bioUrl, setBioUrl] = useState('');

  // Toast notification for user actions
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => {
      setToast(null);
    }, 2600);
  };

  // Sync to localStorage
  useEffect(() => {
    saveJSON('hushPromoPosts', posts);
  }, [posts]);

  useEffect(() => {
    saveJSON('hushPromoAccounts', selectedAccounts);
  }, [selectedAccounts]);

  useEffect(() => {
    saveJSON('hushPromoMedia', mediaItems);
  }, [mediaItems]);

  useEffect(() => {
    saveJSON('hushPromoTimeslots', timeslots);
  }, [timeslots]);

  useEffect(() => {
    saveJSON('hushPromoBio', bioLinks);
  }, [bioLinks]);

  const accountName = (id: string) => {
    const acc = ACCOUNTS.find((a) => a.id === id);
    return acc ? acc.name : id;
  };

  const toggleAccount = (id: string, on: boolean) => {
    if (on && !selectedAccounts.includes(id)) {
      setSelectedAccounts([...selectedAccounts, id]);
    } else if (!on) {
      setSelectedAccounts(selectedAccounts.filter((x) => x !== id));
    }
  };

  const toggleSelectAll = (on: boolean) => {
    setSelectedAccounts(on ? ACCOUNTS.map((a) => a.id) : []);
  };

  const handleCrossPost = (checked: boolean) => {
    setCrossPost(checked);
    if (checked) {
      setSelectedAccounts(ACCOUNTS.map((a) => a.id));
    }
  };

  // Description tool buttons
  const generatePost = () => {
    const t = description.trim();
    if (!t) {
      setDescription(
        'Street Legends — Come take over the world 1 neighborhood at a time with your friends. Available on Google Play'
      );
      return;
    }
    setDescription(
      t +
        ' — Check it out, share it with your friends, and stay tuned for more from Hush Music. Available on Google Play'
    );
  };

  const shortenText = () => {
    const t = description.trim();
    if (!t) return;
    const words = t.split(/\s+/);
    if (words.length > 25) {
      setDescription(words.slice(0, 25).join(' ') + '…');
    }
  };

  const expandText = () => {
    const t = description.trim();
    if (!t) return;
    if (t.indexOf('Share it with your friends') === -1) {
      setDescription(
        t +
          ' Share it with your friends, tag someone who needs to see this, and stay tuned for more from Hush Music.'
      );
    }
  };

  const moreCasual = () => {
    const t = description;
    if (!t.trim()) return;
    let out = t
      .replace('Check it out', 'Check this out')
      .replace(
        'Available on Google Play',
        'Available on Google Play — trust me, you do not want to miss this'
      );
    if (!out.startsWith('Yo,')) {
      out = 'Yo, ' + out;
    }
    setDescription(out);
  };

  const createHook = () => {
    const t = description;
    if (!t.trim()) {
      setDescription('You have to see this — Street Legends is here.');
      return;
    }
    if (t.indexOf('You have to see this') === -1) {
      setDescription('You have to see this — ' + t);
    }
  };

  const createCTA = () => {
    const t = description.trim();
    if (!t) return;
    if (t.indexOf('Available on Google Play') === -1) {
      setDescription(t + ' Available on Google Play');
    } else if (t.indexOf('Tap the link in bio') === -1) {
      setDescription(t + ' Tap the link in bio to check it out.');
    }
  };

  const addHashtags = () => {
    const t = description.trim();
    if (!t) return;
    const tags = '#HushMusic #StreetLegends';
    if (t.indexOf('#') === -1) {
      setDescription(t + ' ' + tags);
    }
  };

  // Media files handler
  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    files.forEach((f) => {
      const meta: PostMedia = {
        name: f.name,
        type: f.type || 'file',
        size: f.size,
        dataUrl: '',
      };

      if (f.size < 1000000) {
        const reader = new FileReader();
        reader.onload = () => {
          meta.dataUrl = reader.result as string;
          setPendingMedia((prev) => [...prev, meta]);
          setMediaItems((prev) => [
            ...prev,
            { name: meta.name, type: meta.type, size: meta.size, dataUrl: meta.dataUrl || '' },
          ]);
        };
        reader.readAsDataURL(f);
      } else {
        setPendingMedia((prev) => [...prev, meta]);
        setMediaItems((prev) => [
          ...prev,
          { name: meta.name, type: meta.type, size: meta.size, dataUrl: '' },
        ]);
      }
    });
  };

  const removePendingMedia = (index: number) => {
    setPendingMedia(pendingMedia.filter((_, i) => i !== index));
  };

  const addThreadPart = () => {
    setThreadParts([...threadParts, '']);
  };

  const updateThreadPart = (index: number, val: string) => {
    const next = [...threadParts];
    next[index] = val;
    setThreadParts(next);
  };

  const removeThreadPart = (index: number) => {
    const next = threadParts.filter((_, i) => i !== index);
    setThreadParts(next.length ? next : ['']);
  };

  const statusFor = (action: 'now' | 'schedule' | 'draft' | 'idea') => {
    if (requireApproval) return 'Awaiting Approval';
    if (action === 'now') return 'Published';
    if (action === 'schedule') return 'Scheduled Posts';
    if (action === 'draft') return 'Drafts';
    return 'Ideas';
  };

  const savePost = (action: 'now' | 'schedule' | 'draft' | 'idea') => {
    const text = description.trim();
    if (!text) {
      setFormMsg('Add a description first.');
      return;
    }
    if (!selectedAccounts.length) {
      setFormMsg('Select at least one account first.');
      return;
    }

    let parsedStopAfter: number | '' = '';
    if (stopAfter !== '') {
      const val = parseInt(stopAfter, 10);
      if (!isNaN(val)) parsedStopAfter = val;
    }

    if (repeatEnabled && repeatEvery === 'Day' && typeof parsedStopAfter === 'number' && parsedStopAfter > 20) {
      parsedStopAfter = 20;
      setStopAfter('20');
      setFormMsg('Daily repeat capped at 20 consecutive times, as shown in the screenshots.');
    }

    const thread = threadParts.map((s) => s.trim()).filter(Boolean);
    const base: Omit<Post, 'id' | 'account'> = {
      author: 'Hush Music Ent',
      text,
      hashtags: '',
      status: statusFor(action),
      date: scheduleDate || '',
      time: scheduleTime || '',
      category,
      media: pendingMedia.map((m) => m.name),
      thread,
      paused: false,
      ytTitle,
      ytVisibility,
      ytType,
      ytKids,
      ytTags,
      threadsTopic,
      threadsSpoilerImg,
      threadsSpoilerText,
      fbPost,
      fbStory,
      fbAI,
      igPost,
      igReel,
      igStory,
      igAI,
      ttDisclose,
      ttAI,
      ttSound,
      scStory,
      scSpotlight,
      repeat: repeatEnabled ? repeatEvery : '',
      endDate: endDate || '',
      stopAfter: parsedStopAfter,
    };

    const newPosts: Post[] = selectedAccounts.map((acct) => ({
      ...base,
      id: Date.now() + Math.floor(Math.random() * 100000),
      account: acct,
    }));

    setPosts((prev) => [...newPosts, ...prev]);

    setFormMsg(
      action === 'now' && !requireApproval
        ? 'Saved to Published in your local queue. Use Copy text / Share on the card to publish it manually on each network.'
        : 'Saved to the queue.'
    );

    // Reset some creation state
    setPendingMedia([]);
    setThreadParts(['']);
    setActiveTab('queue');
    setCurrentFilter(statusFor(action));
  };

  // Queue actions
  const filteredPosts = posts.filter((p) => p.status === currentFilter);

  const copyText = (text: string) => {
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          showToast('Copied! Paste it into the network app to publish.');
        })
        .catch(() => {
          showToast('Text copied to clipboard.');
        });
    } else {
      showToast('Text copied to clipboard.');
    }
  };

  const sharePost = (p: Post) => {
    const full = p.text + (p.hashtags ? ' ' + p.hashtags : '');
    if (navigator.share) {
      navigator.share({ text: full }).catch(() => {});
    } else {
      copyText(full);
    }
  };

  const duplicatePost = (id: number) => {
    const src = posts.find((p) => p.id === id);
    if (!src) return;
    const copy: Post = {
      ...src,
      id: Date.now() + Math.floor(Math.random() * 10000),
      status: 'Drafts',
    };
    setPosts([copy, ...posts]);
    showToast('Post duplicated into Drafts.');
  };

  const deletePost = (id: number) => {
    setPosts(posts.filter((p) => p.id !== id));
    setBulkSelected(bulkSelected.filter((x) => x !== id));
    showToast('Post deleted.');
  };

  const approvePost = (id: number) => {
    setPosts(
      posts.map((p) =>
        p.id === id ? { ...p, status: p.date ? 'Scheduled Posts' : 'Published' } : p
      )
    );
    showToast('Post approved.');
  };

  const rejectPost = (id: number) => {
    setPosts(
      posts.map((p) => (p.id === id ? { ...p, status: 'Not Approved' } : p))
    );
    showToast('Post marked as Not Approved.');
  };

  const togglePause = (id: number) => {
    setPosts(
      posts.map((p) => (p.id === id ? { ...p, paused: !p.paused } : p))
    );
  };

  const toggleBulk = (id: number, on: boolean) => {
    if (on && !bulkSelected.includes(id)) {
      setBulkSelected([...bulkSelected, id]);
    } else if (!on) {
      setBulkSelected(bulkSelected.filter((x) => x !== id));
    }
  };

  const toggleBulkAll = (on: boolean) => {
    setBulkSelected(on ? filteredPosts.map((p) => p.id) : []);
  };

  const bulkDuplicate = () => {
    if (!bulkSelected.length) return;
    const duplicates: Post[] = [];
    bulkSelected.forEach((id) => {
      const src = posts.find((p) => p.id === id);
      if (src) {
        duplicates.push({
          ...src,
          id: Date.now() + Math.floor(Math.random() * 100000),
          status: 'Drafts',
        });
      }
    });
    setPosts([...duplicates, ...posts]);
    setBulkSelected([]);
    showToast(`${duplicates.length} posts duplicated to Drafts.`);
  };

  const bulkDelete = () => {
    if (!bulkSelected.length) return;
    setPosts(posts.filter((p) => !bulkSelected.includes(p.id)));
    setBulkSelected([]);
    showToast('Selected posts deleted.');
  };

  // Timeslots
  const saveTimeslots = () => {
    saveJSON('hushPromoTimeslots', timeslots);
    setTimeslotMsg('Timeslots saved.');
    showToast('Timeslots saved successfully.');
  };

  // Bio links
  const addBio = () => {
    const t = bioTitle.trim();
    const u = bioUrl.trim();
    if (!t) return;
    const next = [...bioLinks, { title: t, url: u }];
    setBioLinks(next);
    setBioTitle('');
    setBioUrl('');
    showToast('Bio link added.');
  };

  // Settings
  const restoreSeeds = () => {
    const initial = seedPosts();
    setPosts(initial);
    saveJSON('hushPromoPosts', initial);
    showToast('Restored Street Legends example posts.');
  };

  const clearAll = () => {
    if (window.confirm('Clear all local posts? This cannot be undone on this device.')) {
      setPosts([]);
      saveJSON('hushPromoPosts', []);
      showToast('All local posts cleared.');
    }
  };

  // Stats calculation
  const counts = {
    total: posts.length,
    Scheduled: posts.filter((p) => p.status === 'Scheduled Posts').length,
    Published: posts.filter((p) => p.status === 'Published').length,
    Drafts: posts.filter((p) => p.status === 'Drafts').length,
    Awaiting: posts.filter((p) => p.status === 'Awaiting Approval').length,
    Failed: posts.filter(
      (p) =>
        p.status === 'Failed' ||
        p.status === 'Not Approved' ||
        p.status === 'Expired Approval'
    ).length,
  };

  return (
    <div>
      <header>
        <h1>HUSH MUSIC</h1>
        <p>Social Promo — post pictures and videos to all your networks, from one place.</p>
      </header>

      <div className="phase2">
        <strong>V1 note:</strong> V1 queues and prepares posts; live direct posting needs platform
        API connections in phase 2. Post Now moves a post to Published in your local queue and gives
        you Copy text / Share buttons so you can publish it manually on each network. No fake
        “posted to Facebook” claims are made here.
      </div>

      <nav id="tabs">
        <button
          className={activeTab === 'dashboard' ? 'active' : ''}
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </button>
        <button
          className={activeTab === 'create' ? 'active' : ''}
          onClick={() => setActiveTab('create')}
        >
          Create Post
        </button>
        <button
          className={activeTab === 'queue' ? 'active' : ''}
          onClick={() => setActiveTab('queue')}
        >
          Queue
        </button>
        <button
          className={activeTab === 'gallery' ? 'active' : ''}
          onClick={() => setActiveTab('gallery')}
        >
          Media Gallery
        </button>
        <button
          className={activeTab === 'timeslots' ? 'active' : ''}
          onClick={() => setActiveTab('timeslots')}
        >
          Timeslots
        </button>
        <button
          className={activeTab === 'settings' ? 'active' : ''}
          onClick={() => setActiveTab('settings')}
        >
          Settings
        </button>
      </nav>

      <main>
        {/* DASHBOARD */}
        {activeTab === 'dashboard' && (
          <section id="view-dashboard" className="view active">
            <div className="card">
              <h2>Dashboard</h2>
              <p className="small">
                Counts below come only from posts saved in this app on this device. They are not
                platform likes, views, or followers.
              </p>
              <div id="stats">
                <span className="stat">
                  <b>{counts.total}</b>
                  <span>Total</span>
                </span>
                <span className="stat">
                  <b>{counts.Scheduled}</b>
                  <span>Scheduled</span>
                </span>
                <span className="stat">
                  <b>{counts.Published}</b>
                  <span>Published (local)</span>
                </span>
                <span className="stat">
                  <b>{counts.Drafts}</b>
                  <span>Drafts</span>
                </span>
              </div>
              <div className="row" style={{ marginTop: '12px' }}>
                <button className="btn btn-blue" onClick={() => setActiveTab('create')}>
                  Create Post
                </button>
                <button className="btn btn-grey" onClick={() => setActiveTab('queue')}>
                  Open Queue
                </button>
              </div>
            </div>

            <div className="card">
              <h2>Recent posts</h2>
              <div id="recent">
                {posts.slice(0, 3).map((p) => (
                  <div key={p.id} className="post">
                    <span className="badge">{accountName(p.account)}</span>{' '}
                    <strong>{p.author}</strong>
                    <p>{p.text}</p>
                  </div>
                ))}
                {posts.length === 0 && <p className="small">No posts yet.</p>}
              </div>
            </div>

            <div className="card">
              <h2>Link-In-Bio</h2>
              <p className="small">
                Placeholder in V1: links saved here are stored on this device only. They are not a
                published link-in-bio page yet.
              </p>
              <div id="bioList" style={{ margin: '8px 0' }}>
                {bioLinks.length === 0 ? (
                  <p className="small">No links yet.</p>
                ) : (
                  bioLinks.map((b, i) => (
                    <div key={i} className="small" style={{ marginBottom: '4px' }}>
                      {b.title} {b.url ? `— ${b.url}` : ''}
                    </div>
                  ))
                )}
              </div>
              <label>Link title</label>
              <input
                id="bioTitle"
                type="text"
                placeholder="Street Legends"
                value={bioTitle}
                onChange={(e) => setBioTitle(e.target.value)}
              />
              <label>Link URL (text only, no Play URL is pre-filled)</label>
              <input
                id="bioUrl"
                type="url"
                placeholder="Paste a link"
                value={bioUrl}
                onChange={(e) => setBioUrl(e.target.value)}
              />
              <div className="row" style={{ marginTop: '10px' }}>
                <button className="btn btn-blue" onClick={addBio}>
                  Add link
                </button>
              </div>
            </div>

            <div className="card">
              <h2>Analytics (local queue only)</h2>
              <p className="small">
                V1 shows counts from your local queue only — scheduled, published, drafts, and by
                account. It does not show platform likes, views, comments, or reach, because no
                platform API is connected yet.
              </p>
              <div id="analytics">
                <p className="small">
                  Scheduled: {counts.Scheduled} · Published (local queue): {counts.Published} · Drafts:{' '}
                  {counts.Drafts} · Awaiting Approval: {counts.Awaiting} · Failed: {counts.Failed}
                  <br />
                  Platform likes / views / comments: not connected in V1, so none are shown.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* CREATE POST */}
        {activeTab === 'create' && (
          <section id="view-create" className="view active">
            <div className="card">
              <h2>Create Post</h2>
              <label>First, select a category for this post:</label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option>Category 1</option>
                <option>Street Legends</option>
                <option>Hush Music Radio</option>
                <option>Hush Music TV</option>
                <option>New Release</option>
                <option>General</option>
              </select>

              <h3>Click to select which accounts you want to post to:</h3>
              <div className="row" style={{ marginBottom: '8px' }}>
                <label className="toggle" style={{ margin: 0 }}>
                  <input
                    type="checkbox"
                    id="selectAll"
                    checked={
                      selectedAccounts.length === ACCOUNTS.length && ACCOUNTS.length > 0
                    }
                    onChange={(e) => toggleSelectAll(e.target.checked)}
                  />{' '}
                  Select All
                </label>
                <label className="toggle" style={{ margin: 0 }}>
                  <input
                    type="checkbox"
                    id="crossPost"
                    checked={crossPost}
                    onChange={(e) => handleCrossPost(e.target.checked)}
                  />{' '}
                  Cross-Posting: post to main account, auto-select all others
                </label>
              </div>

              <label>Main account (for cross-posting)</label>
              <select
                id="mainAccount"
                value={mainAccount}
                onChange={(e) => setMainAccount(e.target.value)}
              >
                {ACCOUNTS.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} — {a.handle}
                  </option>
                ))}
              </select>

              <div id="accountList" style={{ marginTop: '10px' }}>
                {ACCOUNTS.map((a) => {
                  const isChecked = selectedAccounts.includes(a.id);
                  return (
                    <div
                      key={a.id}
                      className="account"
                      onClick={() => toggleAccount(a.id, !isChecked)}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                          e.stopPropagation();
                          toggleAccount(a.id, e.target.checked);
                        }}
                      />
                      <div>
                        <strong>{a.name}</strong>
                        <span>{a.handle}</span>
                        {a.note && <div className="warn">{a.note}</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
              <p id="selectedCount" className="small">
                {selectedAccounts.length} Accounts Selected
              </p>

              <h3>Customize post for each network</h3>
              <details open>
                <summary>YouTube</summary>
                <label>YouTube title:</label>
                <input
                  id="ytTitle"
                  type="text"
                  placeholder="YouTube title"
                  value={ytTitle}
                  onChange={(e) => setYtTitle(e.target.value)}
                />
                <label>YouTube video visibility:</label>
                <select
                  id="ytVisibility"
                  value={ytVisibility}
                  onChange={(e) => setYtVisibility(e.target.value)}
                >
                  <option>Public</option>
                  <option>Private</option>
                  <option>Unlisted</option>
                </select>
                <label>YouTube video type:</label>
                <div className="row">
                  <label>
                    <input
                      type="radio"
                      name="ytType"
                      value="Video"
                      checked={ytType === 'Video'}
                      onChange={() => setYtType('Video')}
                    />{' '}
                    Video
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="ytType"
                      value="Shorts"
                      checked={ytType === 'Shorts'}
                      onChange={() => setYtType('Shorts')}
                    />{' '}
                    Shorts
                  </label>
                </div>
                <label>Is this video made for kids?</label>
                <div className="row">
                  <label>
                    <input
                      type="radio"
                      name="ytKids"
                      value="Yes"
                      checked={ytKids === 'Yes'}
                      onChange={() => setYtKids('Yes')}
                    />{' '}
                    Yes
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="ytKids"
                      value="No"
                      checked={ytKids === 'No'}
                      onChange={() => setYtKids('No')}
                    />{' '}
                    No
                  </label>
                </div>
                <label>YouTube thumbnail: (optional)</label>
                <input id="ytThumb" type="file" accept="image/*" />
                <label>Tags (press Enter after each tag in the app you publish to)</label>
                <input
                  id="ytTags"
                  type="text"
                  placeholder="Add tags (optional)"
                  value={ytTags}
                  onChange={(e) => setYtTags(e.target.value)}
                />
              </details>

              <details>
                <summary>Threads</summary>
                <label>Threads topic:</label>
                <input
                  id="threadsTopic"
                  type="text"
                  placeholder="Threads topic"
                  value={threadsTopic}
                  onChange={(e) => setThreadsTopic(e.target.value)}
                />
                <label className="toggle">
                  <input
                    type="checkbox"
                    id="threadsSpoilerImg"
                    checked={threadsSpoilerImg}
                    onChange={(e) => setThreadsSpoilerImg(e.target.checked)}
                  />{' '}
                  Set image as spoiler
                </label>
                <label className="toggle">
                  <input
                    type="checkbox"
                    id="threadsSpoilerText"
                    checked={threadsSpoilerText}
                    onChange={(e) => setThreadsSpoilerText(e.target.checked)}
                  />{' '}
                  Set text as spoiler
                </label>
              </details>

              <details>
                <summary>Facebook</summary>
                <label className="toggle">
                  <input
                    type="checkbox"
                    id="fbPost"
                    checked={fbPost}
                    onChange={(e) => setFbPost(e.target.checked)}
                  />{' '}
                  Facebook Post
                </label>
                <label className="toggle">
                  <input
                    type="checkbox"
                    id="fbStory"
                    checked={fbStory}
                    onChange={(e) => setFbStory(e.target.checked)}
                  />{' '}
                  Facebook Story
                </label>
                <label className="toggle">
                  <input
                    type="checkbox"
                    id="fbAI"
                    checked={fbAI}
                    onChange={(e) => setFbAI(e.target.checked)}
                  />{' '}
                  AI-generated content
                </label>
              </details>

              <details>
                <summary>Instagram</summary>
                <label className="toggle">
                  <input
                    type="checkbox"
                    id="igPost"
                    checked={igPost}
                    onChange={(e) => setIgPost(e.target.checked)}
                  />{' '}
                  Instagram Post
                </label>
                <label className="toggle">
                  <input
                    type="checkbox"
                    id="igReel"
                    checked={igReel}
                    onChange={(e) => setIgReel(e.target.checked)}
                  />{' '}
                  Post as Instagram Reel
                </label>
                <label className="toggle">
                  <input
                    type="checkbox"
                    id="igStory"
                    checked={igStory}
                    onChange={(e) => setIgStory(e.target.checked)}
                  />{' '}
                  Instagram Story
                </label>
                <label className="toggle">
                  <input
                    type="checkbox"
                    id="igAI"
                    checked={igAI}
                    onChange={(e) => setIgAI(e.target.checked)}
                  />{' '}
                  AI-generated content
                </label>
              </details>

              <details>
                <summary>TikTok</summary>
                <label className="toggle">
                  <input
                    type="checkbox"
                    id="ttDisclose"
                    checked={ttDisclose}
                    onChange={(e) => setTtDisclose(e.target.checked)}
                  />{' '}
                  Disclose post content (promotes a brand, product or service)
                </label>
                <label className="toggle">
                  <input
                    type="checkbox"
                    id="ttAI"
                    checked={ttAI}
                    onChange={(e) => setTtAI(e.target.checked)}
                  />{' '}
                  AI-generated content
                </label>
                <label className="toggle">
                  <input
                    type="checkbox"
                    id="ttSound"
                    checked={ttSound}
                    onChange={(e) => setTtSound(e.target.checked)}
                  />{' '}
                  Add sound
                </label>
              </details>

              <details>
                <summary>Snapchat</summary>
                <label className="toggle">
                  <input
                    type="checkbox"
                    id="scStory"
                    checked={scStory}
                    onChange={(e) => setScStory(e.target.checked)}
                  />{' '}
                  Snapchat Story
                </label>
                <label className="toggle">
                  <input
                    type="checkbox"
                    id="scSpotlight"
                    checked={scSpotlight}
                    onChange={(e) => setScSpotlight(e.target.checked)}
                  />{' '}
                  Snapchat Spotlight
                </label>
              </details>

              <h3>Description:</h3>
              <textarea
                id="description"
                placeholder="Type your post here, or type in a prompt and click the Generate Post button below"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <div className="row" style={{ margin: '8px 0' }}>
                <button type="button" className="toolbtn" onClick={generatePost}>
                  Generate Post
                </button>
                <button type="button" className="toolbtn" onClick={shortenText}>
                  Shorten
                </button>
                <button type="button" className="toolbtn" onClick={expandText}>
                  Expand
                </button>
                <button type="button" className="toolbtn" onClick={moreCasual}>
                  More Casual
                </button>
                <button type="button" className="toolbtn" onClick={createHook}>
                  Create Hook
                </button>
                <button type="button" className="toolbtn" onClick={createCTA}>
                  Create CTA
                </button>
                <button type="button" className="toolbtn" onClick={addHashtags}>
                  Add Hashtags
                </button>
              </div>
              <p className="small">
                X character note: X posts are shown with a 280-character guide in the queue card.
                This app does not enforce a platform limit on publish, because publishing is manual
                in V1. ({description.length}/280 characters)
              </p>

              <h3>Media — Drag &amp; Drop or Paste Media here (upload below)</h3>
              <input
                id="mediaInput"
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={handleMediaUpload}
              />
              <p className="small">
                Photo + video carousel: select more than one file and they are kept together as one
                carousel post for Instagram and Threads. Previews show in this session; only file
                name, type, and size are saved long-term, to keep local storage safe.
              </p>
              <div id="mediaPreview">
                {pendingMedia.map((m, i) => (
                  <div key={i} className="small" style={{ marginBottom: '8px' }}>
                    <div>
                      {m.name} ({m.type}, {m.size} bytes)
                    </div>
                    {m.dataUrl && m.type.startsWith('image') && (
                      <img src={m.dataUrl} alt={m.name} className="media-thumb" />
                    )}
                    {m.dataUrl && m.type.startsWith('video') && (
                      <video src={m.dataUrl} controls className="media-thumb" />
                    )}
                    <button
                      type="button"
                      className="btn btn-grey btn-small"
                      onClick={() => removePendingMedia(i)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              <h3>Multi-post thread (for X, Bluesky, Threads)</h3>
              <p className="small">Add parts in order. Leave empty if this is a single post.</p>
              <div id="threadList">
                {threadParts.map((part, i) => (
                  <div key={i} className="row" style={{ marginBottom: '6px' }}>
                    <input
                      type="text"
                      value={part}
                      placeholder={`Thread part ${i + 1}`}
                      style={{ flex: 1 }}
                      onChange={(e) => updateThreadPart(i, e.target.value)}
                    />
                    <button
                      type="button"
                      className="btn btn-grey btn-small"
                      onClick={() => removeThreadPart(i)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                className="btn btn-grey btn-small"
                onClick={addThreadPart}
              >
                Add thread part
              </button>

              <h3>Repeat this post?</h3>
              <label className="toggle">
                <input
                  type="checkbox"
                  id="repeatToggle"
                  checked={repeatEnabled}
                  onChange={(e) => setRepeatEnabled(e.target.checked)}
                />{' '}
                Repeat this post?
              </label>

              {repeatEnabled && (
                <div id="repeatBox">
                  <label>Repeat every:</label>
                  <select
                    id="repeatEvery"
                    value={repeatEvery}
                    onChange={(e) => setRepeatEvery(e.target.value)}
                  >
                    <option value="Day">Day</option>
                    <option value="Week">Week</option>
                    <option value="Month">Month</option>
                    <option value="Timeslots">Timeslots</option>
                  </select>
                  <p id="repeatNote" className="small">
                    {repeatEvery === 'Day'
                      ? 'Daily repeating posts will only be published 20 consecutive times maximum.'
                      : repeatEvery === 'Timeslots'
                      ? 'The post will repeat at the times you have selected in your timeslots.'
                      : 'Repeat uses the date and time you set above, plus the end date or stop count below.'}
                  </p>
                  <label>Repeat on (for monthly):</label>
                  <div className="row">
                    <select
                      id="monthDate"
                      value={monthDate}
                      onChange={(e) => setMonthDate(e.target.value)}
                    >
                      <option value="">Date of month</option>
                      {Array.from({ length: 28 }, (_, i) => i + 1).map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                    <select
                      id="monthWeekday"
                      value={monthWeekday}
                      onChange={(e) => setMonthWeekday(e.target.value)}
                    >
                      <option value="">Weekday</option>
                      {DAYS.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                  <label>End date (optional)</label>
                  <input
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                  <label>Stop repeating after this post plus (count)</label>
                  <input
                    id="stopAfter"
                    type="number"
                    min="1"
                    placeholder="e.g. 5"
                    value={stopAfter}
                    onChange={(e) => setStopAfter(e.target.value)}
                  />
                </div>
              )}

              <label className="toggle">
                <input
                  type="checkbox"
                  id="requireApproval"
                  checked={requireApproval}
                  onChange={(e) => setRequireApproval(e.target.checked)}
                />{' '}
                Require post approval? Post will need to be approved before they are published
              </label>

              <h3>When?</h3>
              <div className="row">
                <input
                  id="scheduleDate"
                  type="date"
                  style={{ flex: 1 }}
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                />
                <input
                  id="scheduleTime"
                  type="time"
                  style={{ flex: 1 }}
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                />
              </div>

              <div className="row" style={{ marginTop: '12px' }}>
                <button
                  type="button"
                  className="btn btn-blue"
                  onClick={() => savePost('now')}
                >
                  Post Now
                </button>
                <button
                  type="button"
                  className="btn btn-green"
                  onClick={() => savePost('schedule')}
                >
                  Schedule Post
                </button>
                <button
                  type="button"
                  className="btn btn-grey"
                  onClick={() => savePost('draft')}
                >
                  Add to Drafts
                </button>
                <button
                  type="button"
                  className="btn btn-grey"
                  onClick={() => savePost('idea')}
                >
                  Save as Idea
                </button>
              </div>
              {formMsg && <p id="formMsg" className="small" style={{ color: '#2563eb' }}>{formMsg}</p>}
            </div>
          </section>
        )}

        {/* QUEUE */}
        {activeTab === 'queue' && (
          <section id="view-queue" className="view active">
            <div className="card">
              <h2>Queue</h2>
              <div className="row" id="filterRow">
                {FILTERS.map((f) => (
                  <button
                    key={f}
                    type="button"
                    className={`filterbtn ${f === currentFilter ? 'active' : ''}`}
                    onClick={() => {
                      setCurrentFilter(f);
                      setBulkSelected([]);
                    }}
                  >
                    {f}
                  </button>
                ))}
              </div>

              <div className="row" style={{ marginTop: '10px' }}>
                <label className="toggle" style={{ margin: 0 }}>
                  <input
                    type="checkbox"
                    id="bulkAll"
                    checked={
                      filteredPosts.length > 0 &&
                      bulkSelected.length === filteredPosts.length
                    }
                    onChange={(e) => toggleBulkAll(e.target.checked)}
                  />{' '}
                  Select All
                </label>
                <button
                  type="button"
                  className="btn btn-grey btn-small"
                  onClick={bulkDuplicate}
                >
                  Bulk Duplicate Posts
                </button>
                <button
                  type="button"
                  className="btn btn-grey btn-small"
                  onClick={bulkDelete}
                >
                  Delete selected
                </button>
              </div>

              <div id="queueList" style={{ marginTop: '12px' }}>
                {filteredPosts.length === 0 ? (
                  <p className="small">No posts in this filter yet.</p>
                ) : (
                  filteredPosts.map((p) => {
                    const statusClass =
                      p.status === 'Awaiting Approval'
                        ? 'Awaiting'
                        : p.status === 'Scheduled Posts'
                        ? 'Scheduled'
                        : p.status === 'Not Approved' || p.status === 'Expired Approval'
                        ? 'Failed'
                        : p.status;
                    const when = `${p.date || ''}${p.time ? ' ' + p.time : ''}`;
                    const isChecked = bulkSelected.includes(p.id);

                    return (
                      <div key={p.id} className="post">
                        <div className="row">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => toggleBulk(p.id, e.target.checked)}
                          />
                          <span className="badge">{accountName(p.account)}</span>
                          <span className={`status ${statusClass}`}>{p.status}</span>
                          {p.paused && <span className="badge">Paused</span>}
                        </div>
                        <p>
                          <strong>{p.author}</strong>{' '}
                          <span className="small">
                            {when || 'No date set'} · {p.category}
                          </span>
                        </p>
                        <p>{p.text}</p>
                        {p.hashtags && (
                          <p style={{ color: '#2563eb' }}>{p.hashtags}</p>
                        )}
                        {p.media && p.media.length > 0 && (
                          <p className="small">
                            <strong>Media:</strong> {p.media.join(', ')}
                          </p>
                        )}
                        {p.thread && p.thread.length > 0 && (
                          <p className="small">
                            <strong>Thread:</strong> {p.thread.join(' / ')}
                          </p>
                        )}
                        <div className="row" style={{ marginTop: '8px' }}>
                          <button
                            type="button"
                            className="btn btn-grey btn-small"
                            onClick={() =>
                              copyText(p.text + (p.hashtags ? ' ' + p.hashtags : ''))
                            }
                          >
                            Copy text
                          </button>
                          <button
                            type="button"
                            className="btn btn-grey btn-small"
                            onClick={() => sharePost(p)}
                          >
                            Share
                          </button>
                          <button
                            type="button"
                            className="btn btn-grey btn-small"
                            onClick={() => duplicatePost(p.id)}
                          >
                            Duplicate
                          </button>
                          <button
                            type="button"
                            className="btn btn-grey btn-small"
                            onClick={() => togglePause(p.id)}
                          >
                            {p.paused ? 'Resume' : 'Pause'}
                          </button>
                          {p.status === 'Awaiting Approval' && (
                            <>
                              <button
                                type="button"
                                className="btn btn-green btn-small"
                                onClick={() => approvePost(p.id)}
                              >
                                Approve
                              </button>
                              <button
                                type="button"
                                className="btn btn-red btn-small"
                                onClick={() => rejectPost(p.id)}
                              >
                                Reject
                              </button>
                            </>
                          )}
                          <button
                            type="button"
                            className="btn btn-red btn-small"
                            onClick={() => deletePost(p.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </section>
        )}

        {/* MEDIA GALLERY */}
        {activeTab === 'gallery' && (
          <section id="view-gallery" className="view active">
            <div className="card">
              <h2>Media Gallery</h2>
              <p className="small">
                Media uploaded in Create Post appears here. Previews are kept for this session; file
                name, type, and size are saved. Delete removes the entry from the gallery.
              </p>
              <div id="galleryList" style={{ marginTop: '12px' }}>
                {mediaItems.length === 0 ? (
                  <p className="small">No media yet. Upload from Create Post.</p>
                ) : (
                  mediaItems.map((m, i) => (
                    <div
                      key={i}
                      className="small"
                      style={{
                        marginBottom: '10px',
                        borderBottom: '1px solid #eee',
                        paddingBottom: '8px',
                      }}
                    >
                      <div>
                        {m.name} ({m.type}, {m.size} bytes)
                      </div>
                      {m.dataUrl && m.type.startsWith('image') && (
                        <img src={m.dataUrl} alt={m.name} className="media-thumb" />
                      )}
                      {m.dataUrl && m.type.startsWith('video') && (
                        <video src={m.dataUrl} controls className="media-thumb" />
                      )}
                      <button
                        type="button"
                        className="btn btn-grey btn-small"
                        style={{ marginTop: '6px' }}
                        onClick={() => {
                          setMediaItems(mediaItems.filter((_, idx) => idx !== i));
                          showToast('Media removed from gallery.');
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>
        )}

        {/* TIMESLOTS */}
        {activeTab === 'timeslots' && (
          <section id="view-timeslots" className="view active">
            <div className="card">
              <h2>Timeslots</h2>
              <p className="small">
                Set a posting time for each day. Repeat-by-timeslots uses these times. Best Time to
                Post note: V1 has no platform analytics, so “best time” here is a guide only — pick
                times your audience is usually online, and adjust from your own results.
              </p>
              <div id="timeslotForm">
                {DAYS.map((d) => (
                  <div key={d}>
                    <label>{d}</label>
                    <input
                      type="time"
                      id={`ts-${d}`}
                      value={timeslots[d] || ''}
                      onChange={(e) =>
                        setTimeslots({ ...timeslots, [d]: e.target.value })
                      }
                    />
                  </div>
                ))}
              </div>
              <div className="row" style={{ marginTop: '10px' }}>
                <button type="button" className="btn btn-blue" onClick={saveTimeslots}>
                  Save Timeslots
                </button>
              </div>
              {timeslotMsg && (
                <p id="timeslotMsg" className="small" style={{ color: '#16a34a' }}>
                  {timeslotMsg}
                </p>
              )}
            </div>
          </section>
        )}

        {/* SETTINGS */}
        {activeTab === 'settings' && (
          <section id="view-settings" className="view active">
            <div className="card">
              <h2>Settings</h2>
              <p className="small">
                Timezone shown in the screenshots was EST. This app uses your device date and time for
                scheduling; the stored schedule date and time are shown exactly as you entered them.
              </p>
              <h3>Team Members</h3>
              <p className="small">
                Placeholder in V1: team roles and approvals are local only. “Require post approval” in
                Create Post already creates an Awaiting Approval queue item.
              </p>
              <h3>API &amp; MCP</h3>
              <p className="small">
                Placeholder in V1: no API keys are stored in this file, and no platform connection is
                made. Live direct posting is phase 2 and will need each platform’s own approval.
              </p>
              <div className="row" style={{ margin: '14px 0' }}>
                <button type="button" className="btn btn-grey" onClick={restoreSeeds}>
                  Restore Street Legends examples
                </button>
                <button type="button" className="btn btn-red" onClick={clearAll}>
                  Clear all local posts
                </button>
              </div>
              <p className="small">
                Help: use Dashboard for counts, Create Post to compose, Queue to filter, approve,
                duplicate, pause, or delete, Media Gallery for uploads, and Timeslots for repeat
                times.
              </p>
            </div>
          </section>
        )}
      </main>

      {toast && <div className="toast-msg">{toast}</div>}
    </div>
  );
}

export default App;

import { useReducer, useEffect } from 'react';
import { reducer, initialState } from './reducer';
import { STORAGE_KEY, resultOptions } from './constants';
import { Badge, StatusDot, Icon } from './components/ui';
import StatsPanel, { TalentDistribution, ApplicationHealth } from './components/StatsPanel';
import CandidateForm from './components/CandidateForm';
import EditCandidateForm from './components/EditCandidateForm';
import CandidateDetail from './components/CandidateDetail';
import type { Candidate, Level } from './types';

// Random avatars for demo
const avatars = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuD866fSCX0bf48LCtjJwY8B4qz5dDoc6ZKD3Zbj2Uu-ExzO_l0SV-61iOepKPHGZg_jqENnpnZJR4HnEKlC6oWw5AcukGzSpOaz-8_A34XqIF49jZyiSaXJ6pFPMTTde2pRJXwyVEWEUF-w9ZcjF-DmCEQAwgwVSi-qgyteJozc097wA38a7ew1KWShitG35UCAYbnCjMdtNqPwOvIYN2fdLkdHLYyGHhcvraqDCQ4nDlALwRTLZ8fY7sJGKsCBlPk83EmSqDKWzjkh',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDg0z-sdZUvkWAR15tJIK8pRiGDF7Ng-YM8mWyBuZ3x4N_xAKllf9meW9B1bIKoYWH-0-NMeVr8U7bq8L9m1QrSqphoN_gACsLR2RT8kPhB_BfkblJD2H_5gTrdTuyvKnd7dp8M2xvjMl9ugoxL_AYmxJQpzkMJieZwmzOWWvTLMdLCP0CPzFJPHdSAMfVNvNAqNL6Xh5px8KvqMzjI2EF6H9qQ_Z_Ndd8JzWmxanmNluxAYS6ajY0E_u6UMauYR9iVNs7tdNzF7d6s',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCe50Y5lqjPlw8vJWHkJWFrB4aDKRKSNSYWTZch1Y8nfYcas6MTbQyjC5OjdkqNfcEZDP7mivxh-pDlWZYaNk1W90rPBCkW8AWO24sXcg3yFzM5JUKJZ2atOSik-VM8tJTjYJ7l1OcQpEIEl7zpFmlgKQIhiil2JtbFSS6FpAu_4iSO0f_yodVcIt5ISJg-Zycff8ig6KYplSETMDDygNRP5Hps8mTeQpLMipXMRNfrI7SZAWOj17RR5wqwkzj6y5X9fJAvIQUTuowt',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuATTwxSEU-s2jtZkYPF6HFrutmYp3HdpJNTVfiT3Prrh3shciJCjhR_wGzRNuvwj8HKN94XX6OXspBom2ClDh493b4dfvuJ6Ip1UBfVE6D0WGSaTW2zUt9vzlCZB1VedEAuq-m1tEVnWqPh4lL77nDVUrpovKrSp2FhF4UGW9U0OcurAKL4oQ4MLJch0BTZy-TwpoxLirOheevppLqcnOFwD5IU5bPoSTkcZJWM5Rpd4Qo7DLhCvwO65sw8rMGe2sxtXHiL4gvpk2XO',
];

const levelBadgeConfig: Record<Level, { color: string; border: string }> = {
  Senior: { color: 'text-primary', border: 'border-primary/10' },
  Beginner: { color: 'text-on-surface-variant', border: 'border-outline-variant/30' },
  Newbie: { color: 'text-tertiary', border: 'border-tertiary/10' },
};

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { candidates, view, selectedCandidate, showForm, searchTerm } = state;

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Candidate[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          dispatch({ type: 'LOAD_CANDIDATES', payload: parsed });
        }
      }
    } catch {
      // Invalid data
    }
  }, []);

  const filtered = candidates.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.gmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex bg-surface font-body text-on-surface selection:bg-primary-container selection:text-on-primary-container">
      {/* ===== SideNavBar ===== */}
      <aside className="h-screen w-64 fixed left-0 top-0 bg-surface-container-lowest shadow-[0px_10px_30px_-5px_rgba(13,52,89,0.06)] z-50 flex flex-col p-6 gap-2 border-r border-outline-variant/10">
        <div className="mb-6">
          <h2 className="text-lg font-black text-on-surface leading-tight">Recruitment</h2>
          <p className="text-xs font-medium text-on-surface/50 tracking-widest uppercase mt-1">Editorial Precision</p>
        </div>
        <nav className="flex-1 space-y-1">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 text-primary font-bold border-r-4 border-primary bg-surface-container-low">
            <Icon name="dashboard" />
            <span className="text-sm tracking-tight">Dashboard</span>
          </div>
          <div
            className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 text-on-surface/70 hover:text-primary hover:bg-surface-container-low"
            onClick={() => dispatch({ type: 'SET_VIEW', payload: 'list' })}
          >
            <Icon name="group" />
            <span className="text-sm tracking-tight">Candidates</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 text-on-surface/70 hover:text-primary hover:bg-surface-container-low">
            <Icon name="event_note" />
            <span className="text-sm tracking-tight">Interviews</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 text-on-surface/70 hover:text-primary hover:bg-surface-container-low">
            <Icon name="settings" />
            <span className="text-sm tracking-tight">Settings</span>
          </div>
        </nav>
        <div className="mt-auto space-y-4">
          <button className="w-full py-4 bg-primary text-on-primary rounded-xl font-bold text-sm shadow-lg shadow-primary/20 active:scale-95 transition-transform" onClick={() => dispatch({ type: 'TOGGLE_FORM' })}>
            Post New Job
          </button>
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer text-on-surface/70 hover:text-primary">
            <Icon name="help_outline" />
            <span className="text-sm font-['Inter']">Help Center</span>
          </div>
        </div>
      </aside>

      {/* ===== Main Content ===== */}
      <main className="ml-64 min-h-screen w-full">
        {/* TopAppBar */}
        <header className="w-full sticky top-0 z-40 bg-surface/90 backdrop-blur-md flex justify-between items-center px-8 py-4 border-b border-outline-variant/5">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-full max-w-md">
              <Icon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface/40" />
              <input
                className="w-full pl-12 pr-4 py-2.5 bg-surface-container-lowest border-none rounded-xl focus:ring-2 focus:ring-primary/20 placeholder:text-on-surface/30 text-sm shadow-soft outline-none"
                placeholder="Search for candidates, skills..."
                value={searchTerm}
                onChange={(e) => dispatch({ type: 'SET_SEARCH', payload: e.target.value })}
              />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <button className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-full transition-colors relative">
                <Icon name="notifications" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full"></span>
              </button>
              <button className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-full transition-colors">
                <Icon name="mail" />
              </button>
            </div>
            <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-surface-container-highest cursor-pointer hover:border-primary transition-colors">
              <img alt="User profile" className="w-full h-full object-cover" src={avatars[0]} />
            </div>
          </div>
        </header>

        <div className="px-8 pb-12">
          {view === 'list' && !showForm && (
            <>
              {/* Header Title Section */}
              <div className="py-8 flex justify-between items-end">
                <div>
                  <h1 className="text-4xl font-extrabold tracking-tight text-on-surface">Candidates Overview</h1>
                  <p className="text-on-surface/60 mt-1">Reviewing the latest talent acquisition metrics and profiles.</p>
                </div>
                <div className="flex gap-3">
                  <button className="px-5 py-2.5 bg-surface-container-highest text-on-surface font-bold text-sm rounded-xl active:scale-95 transition-transform flex items-center gap-2 hover:bg-surface-container-highest/80">
                    <Icon name="filter_list" size="text-lg" /> Filter
                  </button>
                  <button
                    className="px-5 py-2.5 bg-primary text-on-primary font-bold text-sm rounded-xl active:scale-95 transition-transform flex items-center gap-2 shadow-lg shadow-primary/20 hover:bg-primary-dim"
                    onClick={() => dispatch({ type: 'TOGGLE_FORM' })}
                  >
                    <Icon name="add" size="text-lg" /> Add Candidate
                  </button>
                </div>
              </div>

              {/* Stats Panel summary cards */}
              <StatsPanel candidates={candidates} />

              {/* Main Layout Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left Side: Table */}
                <div className="lg:col-span-2">
                  <div className="bg-surface-container-lowest rounded-xl card-shadow overflow-hidden border border-outline-variant/10">
                    <div className="px-8 py-6 border-b border-outline-variant/10 flex justify-between items-center bg-white/50">
                      <h3 className="text-xl font-bold text-on-surface">Recent Candidates</h3>
                      <button className="text-primary font-bold text-sm flex items-center gap-1 hover:underline">
                        View All <Icon name="arrow_forward" size="text-xs" />
                      </button>
                    </div>
                    <div className="overflow-x-auto">
                      {filtered.length === 0 ? (
                        <div className="text-center py-16">
                          <Icon name="inbox" size="text-5xl" className="opacity-20 mb-3" />
                          <p className="text-on-surface/40 text-sm font-bold uppercase tracking-widest">No candidates found</p>
                        </div>
                      ) : (
                        <table className="w-full text-left">
                          <thead>
                            <tr className="text-[0.6875rem] uppercase tracking-widest text-on-surface/40 border-b border-outline-variant/5 bg-surface-container-lowest/50">
                              <th className="px-8 py-4 font-bold">Candidate</th>
                              <th className="px-8 py-4 font-bold">Level</th>
                              <th className="px-8 py-4 font-bold">Status</th>
                              <th className="px-8 py-4 font-bold text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-outline-variant/5">
                            {filtered.map((c, i) => {
                              const badge = levelBadgeConfig[c.level] || levelBadgeConfig.Beginner;
                              const isConfirmed = c.interviewStatus === 'Confirmed';
                              const avatar = avatars[(i + 1) % avatars.length];
                              
                              return (
                                <tr
                                  key={c.id}
                                  className="hover:bg-surface-container-low/50 transition-colors cursor-pointer group"
                                  onClick={() => dispatch({ type: 'SELECT', payload: c })}
                                >
                                  <td className="px-8 py-5">
                                    <div className="flex items-center gap-3">
                                      <div className="w-10 h-10 rounded-full bg-surface-container overflow-hidden group-hover:ring-2 ring-primary/20 transition-all">
                                        <img className="w-full h-full object-cover" src={avatar} alt="Avatar" />
                                      </div>
                                      <div>
                                        <div className="font-bold text-on-surface text-sm">{c.name}</div>
                                        <div className="text-xs text-on-surface/50">{c.gmail}</div>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-8 py-5">
                                    <span className={`px-3 py-1 glass-float rounded-md text-xs font-bold border ${badge.color} ${badge.border}`}>
                                      {c.level}
                                    </span>
                                  </td>
                                  <td className="px-8 py-5">
                                    {c.interview?.result ? (
                                      <StatusDot label={c.interview.result} color={c.interview.result === 'Hired' ? '#006d4a' : '#ac3149'} />
                                    ) : (
                                      <StatusDot
                                        label={c.interviewStatus || 'No Response'}
                                        color={isConfirmed ? '#006d4a' : '#416188'}
                                      />
                                    )}
                                  </td>
                                  <td className="px-8 py-5 text-right">
                                    <button className="p-2 text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors" onClick={(e) => { e.stopPropagation(); dispatch({ type: 'SELECT', payload: c }); }}>
                                      <Icon name="chevron_right" />
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Rail: Breakdowns */}
                <div className="space-y-8">
                  <TalentDistribution candidates={candidates} />
                  <ApplicationHealth candidates={candidates} />

                  {/* Activity Float Component */}
                  <div className="relative overflow-hidden p-6 bg-primary rounded-xl text-on-primary shadow-lg shadow-primary/20">
                    <div className="relative z-10">
                      <h4 className="text-[0.6875rem] font-bold uppercase tracking-[0.1em] opacity-80 mb-4 text-primary-container">Next Interview</h4>
                      <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10 hover:bg-white/15 transition-colors cursor-pointer">
                        <img className="w-8 h-8 rounded-full border border-white/20" src={avatars[2]} alt="User" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold truncate">New Applicant</p>
                          <p className="text-[0.65rem] opacity-70">Frontend Developer</p>
                        </div>
                        <Icon name="schedule" className="text-sm opacity-80" />
                      </div>
                    </div>
                    {/* Abstract Texture */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ===== Candidate Detail View ===== */}
          {view === 'detail' && selectedCandidate && (
            <div className="py-8 animate-fade-in max-w-4xl mx-auto">
              <CandidateDetail candidate={candidates.find((c) => c.id === selectedCandidate.id) || selectedCandidate} dispatch={dispatch} state={state} />
            </div>
          )}

          {/* ===== Add/Edit Modals ===== */}
          {showForm && (
            <div className="py-8 animate-fade-in max-w-3xl mx-auto">
              <CandidateForm dispatch={dispatch} />
            </div>
          )}
          
        </div>
      </main>
    </div>
  );
}

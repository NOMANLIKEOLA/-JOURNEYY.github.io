import { useState } from 'react';
import useTimer from './hooks/useTimer';
//import  { TimerMode, TimerConfig }from './hooks/useTimer';

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function App() {
  
  const defaultConfig: TimerConfig = {
    workMinutes: 25,
    shortBreakMinutes: 5,
    longBreakMinutes: 15,
    roundsBeforeLongBreak: 4,
  };

  const [config, setConfig] = useState<TimerConfig>(() => {
    const saved = localStorage.getItem('pomodoro-config');
    return saved ? JSON.parse(saved) : defaultConfig;
  });

  // hook exposes state + controls
  const {
    secondsLeft,
    mode,
    isRunning,
    roundsCompleted,
    start,
    pause,
    reset,
    skip,
    setConfig: setHookConfig,
  } = useTimer(config);

  // persist config
  const handleSaveConfig = (next: TimerConfig) => {
    setConfig(next);
    localStorage.setItem('pomodoro-config', JSON.stringify(next));
    setHookConfig(next);
  };

  const [showSettings, setShowSettings] = useState(false);
  const [workM, setWorkM] = useState(config.workMinutes);
  const [shortM, setShortM] = useState(config.shortBreakMinutes);
  const [longM, setLongM] = useState(config.longBreakMinutes);
  const [roundsBeforeLong, setRoundsBeforeLong] = useState(config.roundsBeforeLongBreak);

  return (
    <div className="app">
      <header>
        <h1>Pomodoro Timer</h1>
        <p className="subtitle">Focus sessions to help you stay productive</p>
      </header>

      <main>
        <div className= {`card mode-${mode}`} >
          <div className="mode-label">{mode === 'work' ? 'Work' : mode === 'short' ? 'Short Break' : 'Long Break'}</div>

          <div className="timer">
            <div className="time">{formatTime(secondsLeft)}</div>
            <div className="progress">
              <div
                className="progress-bar"
                style={{
                  width: `${100 - (secondsLeft / ( (mode === 'work' ? config.workMinutes : mode === 'short' ? config.shortBreakMinutes : config.longBreakMinutes) * 60)) * 100}%`,
                }}
              />
            </div>
          </div>

          <div className="info">
            <div>Rounds: {roundsCompleted}</div>
            <div>Running: {isRunning ? 'Yes' : 'No'}</div>
          </div>

          <div className="controls">
            {!isRunning ? (
              <button onClick={start} className="btn primary">Start</button>
            ) : (
              <button onClick={pause} className="btn secondary">Pause</button>
            )}
            <button onClick={reset} className="btn">Reset</button>
            <button onClick={skip} className="btn">Skip</button>
            <button onClick={() => setShowSettings((s) => !s)} className="btn">Settings</button>
          </div>
        </div>

        {showSettings && (
          <section className="card settings">
            <h2>Settings</h2>

            <label>
              Work minutes
              <input type="number" min={1} value={workM} onChange={(e) => setWorkM(Number(e.target.value))} />
            </label>

            <label>
              Short break minutes
              <input type="number" min={1} value={shortM} onChange={(e) => setShortM(Number(e.target.value))} />
            </label>

            <label>
              Long break minutes
              <input type="number" min={1} value={longM} onChange={(e) => setLongM(Number(e.target.value))} />
            </label>

            <label>
              Rounds before long break
              <input type="number" min={1} value={roundsBeforeLong} onChange={(e) => setRoundsBeforeLong(Number(e.target.value))} />
            </label>

            <div className="settings-actions">
              <button
                className="btn primary"
                onClick={() =>
                  handleSaveConfig({
                    workMinutes: Math.max(1, Math.floor(workM)),
                    shortBreakMinutes: Math.max(1, Math.floor(shortM)),
                    longBreakMinutes: Math.max(1, Math.floor(longM)),
                    roundsBeforeLongBreak: Math.max(1, Math.floor(roundsBeforeLong)),
                  })
                }
              >
                Save
              </button>
              <button
                className="btn"
                onClick={() => {
                  // reset UI to current config
                  setWorkM(config.workMinutes);
                  setShortM(config.shortBreakMinutes);
                  setLongM(config.longBreakMinutes);
                  setRoundsBeforeLong(config.roundsBeforeLongBreak);
                  setShowSettings(false);
                }}
              >
                Cancel
              </button>
            </div>
          </section>
        )}
      </main>

      <footer>
        <small>• Tip: use the Skip button to jump to the next session</small>
      </footer>
    </div>
  );
}

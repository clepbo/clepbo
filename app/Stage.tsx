import type { Channel } from "@/lib/types";

/* The little animated screens beside each service. Pure markup; every bit of
   motion lives in studio.css and restarts whenever the stage is re-keyed. */

export default function Stage({ channel }: { channel: Channel }) {
  switch (channel.wave) {
    case "grid": return <ProductStage channel={channel} />;
    case "vu": return <VideoStage channel={channel} />;
    case "ramp": return <SystemStage channel={channel} />;
    default: return <WebStage channel={channel} />;
  }
}

function Pointer() {
  return (
    <svg className="mk-pointer" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 3l14 8-6 1.6L10 19z" fill="#111" stroke="#fff" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}

function WebStage({ channel }: { channel: Channel }) {
  const words = channel.line.split(/\s+/).filter(Boolean);
  return (
    <div className="mk mk--web">
      <div className="mk-browser">
        <div className="mk-browser__bar">
          <span className="mk-dots"><i /><i /><i /></span>
          <span className="mk-url">yourbrand.com</span>
          <span className="mk-live"><i />Live</span>
        </div>
        <div className="mk-browser__body">
          <div className="mk-site-nav">
            <b>Brand</b>
            <span>Work</span><span>About</span><span className="mk-chip">Contact</span>
          </div>
          <p className="mk-site-head">
            {words.map((w, i) => (
              <span key={i} style={{ "--i": i } as React.CSSProperties}>{w} </span>
            ))}
          </p>
          <div className="mk-site-cta">
            <span className="mk-btn">Get started</span>
            <span className="mk-btn mk-btn--ghost">See the work</span>
          </div>
          <div className="mk-site-cards">
            {channel.tags.slice(0, 3).map((t, i) => (
              <span key={t} style={{ "--i": i } as React.CSSProperties}><i />{t}</span>
            ))}
          </div>
        </div>
        <Pointer />
      </div>
    </div>
  );
}

function ProductStage({ channel }: { channel: Channel }) {
  return (
    <div className="mk mk--product">
      <div className="mk-canvas">
        <aside className="mk-layers">
          <p>Layers</p>
          {channel.tags.slice(0, 4).map((t, i) => (
            <span key={t} style={{ "--i": i } as React.CSSProperties}>
              <i />{t}
            </span>
          ))}
        </aside>
        <div className="mk-frames">
          {[0, 1, 2].map((n) => (
            <div className="mk-frame" key={n} style={{ "--i": n } as React.CSSProperties}>
              <span className="mk-frame__name">Screen {n + 1}</span>
              <div className="mk-phone">
                <i className="b1" /><i className="b2" /><i className="b3" /><i className="b4" />
              </div>
            </div>
          ))}
          <span className="mk-flow mk-flow--a" />
          <span className="mk-flow mk-flow--b" />
        </div>
        <span className="mk-collab">
          <Pointer />
          <em>You</em>
        </span>
      </div>
    </div>
  );
}

function VideoStage({ channel }: { channel: Channel }) {
  return (
    <div className="mk mk--video">
      <div className="mk-edit">
        <div className="mk-preview">
          <span className="mk-preview__sky" />
          <span className="mk-preview__title">
            {channel.word}
            <em>{channel.sub}</em>
          </span>
          <span className="mk-rec"><i />REC</span>
          <span className="mk-tc">00:00:12:04</span>
        </div>
        <div className="mk-timeline">
          <div className="mk-track"><b>V2</b><span className="clip c-title" /></div>
          <div className="mk-track"><b>V1</b><span className="clip c1" /><span className="clip c2" /><span className="clip c3" /></div>
          <div className="mk-track mk-track--audio">
            <b>A1</b>
            <span className="mk-wave">
              {Array.from({ length: 36 }, (_, i) => (
                <i key={i} style={{ "--i": i } as React.CSSProperties} />
              ))}
            </span>
          </div>
          <span className="mk-head" />
        </div>
      </div>
    </div>
  );
}

function SystemStage({ channel }: { channel: Channel }) {
  const nodes = ["Request", "API", "Database", "Report"];
  return (
    <div className="mk mk--system">
      <div className="mk-term">
        <div className="mk-term__bar"><span className="mk-dots"><i /><i /><i /></span><span>api — {channel.tags[0] ?? "service"}</span></div>
        <pre className="mk-term__body">
          <span style={{ "--i": 0 } as React.CSSProperties}><b>$</b> curl -X POST /api/requests</span>
          <span style={{ "--i": 1 } as React.CSSProperties} className="ok">→ 201 Created · 84ms</span>
          <span style={{ "--i": 2 } as React.CSSProperties}>{"{"} "id": 1042, "status": "approved",</span>
          <span style={{ "--i": 3 } as React.CSSProperties}>{"  "}"notify": ["finance", "ops"] {"}"}</span>
        </pre>
      </div>
      <div className="mk-flowline">
        {nodes.map((n, i) => (
          <span className="mk-node" key={n} style={{ "--i": i } as React.CSSProperties}>{n}</span>
        ))}
        <span className="mk-packet" />
      </div>
    </div>
  );
}

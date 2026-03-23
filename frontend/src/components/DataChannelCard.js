import PropTypes from 'prop-types';

const dataPayloadShape = PropTypes.shape({
  timestamp: PropTypes.string.isRequired,
  random: PropTypes.string.isRequired
});

export function DataChannelCard({
  title,
  description,
  definition,
  active,
  onStart,
  onStop,
  onReset,
  statusWhenActive,
  statusWhenInactive,
  countLabel,
  count,
  data
}) {
  return (
    <div className={`card ${active ? 'active' : ''}`}>
      <div className="card-header">
        <h2>{title}</h2>
        <div className="card-info-anchor">
          <button
            type="button"
            className="card-info-btn"
            aria-label="Definition — hover or focus to read"
          >
            i
          </button>
          <section className="card-info-panel" aria-label="Method definition">
            {definition}
          </section>
        </div>
      </div>
      <p className="description">{description}</p>
      <div className="controls controls-primary">
        <button type="button" onClick={active ? onStop : onStart}>
          {active ? 'Stop' : 'Start'}
        </button>
      </div>
      <div className="stats">
        <span className={`status ${active ? 'online' : 'offline'}`}>
          {active ? statusWhenActive : statusWhenInactive}
        </span>
        <span className="count">
          {countLabel}: {count}
        </span>
      </div>
      <div className="data">
        {data ? (
          <>
            <div className="timestamp">{data.timestamp}</div>
            <div className="random">ID: {data.random}</div>
          </>
        ) : (
          <div className="placeholder">No data yet</div>
        )}
      </div>
      <div className="controls controls-reset">
        <button type="button" disabled={active || !data} onClick={onReset}>
          Reset
        </button>
      </div>
    </div>
  );
}

DataChannelCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  definition: PropTypes.string.isRequired,
  active: PropTypes.bool.isRequired,
  onStart: PropTypes.func.isRequired,
  onStop: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
  statusWhenActive: PropTypes.string.isRequired,
  statusWhenInactive: PropTypes.string.isRequired,
  countLabel: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
  data: PropTypes.oneOfType([dataPayloadShape, PropTypes.oneOf([null])])
};

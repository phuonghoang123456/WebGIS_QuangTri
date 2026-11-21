export default function DateRangeFilter({start, end, onStart, onEnd, onAnalyze, loading, label="Phân tích"}) {
  const invalid = !start || !end || start > end;
  return <section className="panel"><div className="filter-row">
    <div className="control-group"><label htmlFor="period-start">Từ ngày</label><input id="period-start" type="date" min="2013-01-01" max="2025-12-31" value={start} onChange={e=>onStart(e.target.value)} /></div>
    <div className="control-group"><label htmlFor="period-end">Đến ngày</label><input id="period-end" type="date" min="2013-01-01" max="2025-12-31" value={end} onChange={e=>onEnd(e.target.value)} /></div>
    <button type="button" className="primary-button" disabled={invalid || loading} onClick={onAnalyze}>{loading ? "Đang phân tích..." : label}</button>
  </div>{start > end && <p className="notice notice-error">Ngày bắt đầu phải trước ngày kết thúc.</p>}</section>;
}
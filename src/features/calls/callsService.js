const API_BASE = "http://localhost:4130";

function qs(params) {
  const sp = new URLSearchParams();
  Object.entries(params || {}).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
    if (v === "") return;
    sp.set(k, String(v));
  });
  const s = sp.toString();
  return s ? `?${s}` : "";
}

async function request(url, options) {
  const res = await fetch(url, options);
  if (!res.ok) {
    let msg = `Request failed (${res.status})`;
    try {
      const data = await res.json();
      msg = data?.error || msg;
    } catch {
      throw new Error(msg);
    }
  }
  return res.json();
}

export function fetchCalls({ page, limit, status, from, to, signal }) {
  return request(`${API_BASE}/calls${qs({ page, limit, status, from, to })}`, {
    signal,
  });
}
export function fetchCallById({ id, signal }) {
  return request(`${API_BASE}/calls/${id}`, { signal });
}

export function startCall({ id, signal }) {
  return request(`${API_BASE}/calls/${id}/start`, { method: "POST", signal });
}

export function finishCall({ id, signal }) {
  return request(`${API_BASE}/calls/${id}/finish`, { method: "POST", signal });
}

export function fetchTranscript({ id, signal }) {
  return request(`${API_BASE}/calls/${id}/transcript`, { signal });
}

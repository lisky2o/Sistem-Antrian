import { Monitor, RotateCcw, ShieldCheck } from 'lucide-react'
import type { Dispatch, SetStateAction } from 'react'
import type { QueueData } from '../../types/queue'

type SettingsPageProps = {
  data: QueueData
  setData: Dispatch<SetStateAction<QueueData>>
  onReset: () => void
}

export function SettingsPage({ data, setData, onReset }: SettingsPageProps) {
  const updateCounter = (id: string, field: 'name' | 'active', value: string | boolean) => {
    setData((current) => ({
      ...current,
      counters: current.counters.map((counter) => counter.id === id ? { ...counter, [field]: value } : counter),
    }))
  }

  const updateService = (id: string, field: 'name' | 'prefix', value: string) => {
    setData((current) => ({
      ...current,
      services: current.services.map((service) => service.id === id ? { ...service, [field]: value } : service),
    }))
  }

  return (
    <div className="content-page">
      <div className="page-heading">
        <div>
          <div className="eyebrow">KONFIGURASI SISTEM</div>
          <h1>Pengaturan</h1>
          <p>Sesuaikan layanan, loket, dan informasi yang ditampilkan.</p>
        </div>
        <button className="button button-danger-light" onClick={onReset}><RotateCcw size={16} /> Reset antrian</button>
      </div>

      <div className="settings-grid">
        <section className="panel settings-panel">
          <div className="panel-heading"><div><h2>Jenis Layanan</h2><p>Nama dan kode nomor antrian</p></div></div>
          {data.services.map((service) => (
            <div className="setting-row" key={service.id}>
              <label>Nama layanan<input value={service.name} onChange={(event) => updateService(service.id, 'name', event.target.value)} /></label>
              <label className="prefix-field">Kode<input maxLength={2} value={service.prefix} onChange={(event) => updateService(service.id, 'prefix', event.target.value.toUpperCase().replace(/[^A-Z]/g, ''))} /></label>
            </div>
          ))}
        </section>

        <section className="panel settings-panel">
          <div className="panel-heading"><div><h2>Loket Pelayanan</h2><p>Aktifkan loket yang beroperasi</p></div></div>
          {data.counters.map((counter) => (
            <div className="counter-setting" key={counter.id}>
              <Monitor size={17} />
              <input aria-label="Nama loket" value={counter.name} onChange={(event) => updateCounter(counter.id, 'name', event.target.value)} />
              <label className="switch">
                <input type="checkbox" checked={counter.active} onChange={(event) => updateCounter(counter.id, 'active', event.target.checked)} />
                <span />
              </label>
            </div>
          ))}
        </section>

        <section className="panel settings-panel announcement-settings">
          <div className="panel-heading"><div><h2>Pengumuman Layar TV</h2><p>Pesan berjalan pada bagian bawah layar TV</p></div></div>
          <textarea rows={3} maxLength={180} value={data.announcement} onChange={(event) => setData((current) => ({ ...current, announcement: event.target.value }))} />
          <div className="character-count">{data.announcement.length}/180 karakter</div>
        </section>

        <div className="local-note">
          <ShieldCheck size={19} />
          <div><strong>Data tersimpan secara lokal</strong><span>Pengaturan dan antrian disimpan di browser perangkat ini, tanpa akun atau koneksi server.</span></div>
        </div>
      </div>
    </div>
  )
}

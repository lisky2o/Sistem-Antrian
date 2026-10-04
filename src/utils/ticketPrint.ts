import type { QueueTicket } from '../types/queue'
import { formatTime } from './formatters'

export function printTicket(ticket: QueueTicket, serviceName: string): void {
  const printWindow = window.open('', '_blank', 'width=420,height=620')
  if (!printWindow) {
    window.alert('Izinkan pop-up untuk mencetak tiket.')
    return
  }

  printWindow.document.write(`<!doctype html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <title>Tiket ${ticket.number}</title>
  <style>
    body{font-family:Arial,sans-serif;text-align:center;padding:28px;color:#102d45}
    .brand{font-size:13px;letter-spacing:2px;font-weight:bold}
    .number{font-size:62px;font-weight:800;margin:30px 0 8px}
    .line{border-top:1px dashed #9aa9b5;margin:22px 0}
    .muted{color:#65798b;font-size:13px}
    .service{font-weight:bold;font-size:17px}
  </style>
</head>
<body>
  <div class="brand">KANTOR PELAYANAN PAJAK</div>
  <div class="line"></div>
  <div class="muted">NOMOR ANTRIAN ANDA</div>
  <div class="number">${ticket.number}</div>
  <div class="service">${serviceName}</div>
  <div class="line"></div>
  <div class="muted">Waktu cetak · ${formatTime(ticket.createdAt)}</div>
  <p class="muted">Mohon menunggu nomor Anda dipanggil.</p>
  <script>window.onload=()=>{window.print();window.onafterprint=()=>window.close()}</script>
</body>
</html>`)
  printWindow.document.close()
}

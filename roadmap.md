# 🗺️ IELC-APPS Project Roadmap

**Version**: 1.0.0  
**Last Updated**: 2026-04-15  
**Project Objective**: Sistem Manajemen Kursus Bahasa & CRM Terintegrasi untuk cabang-cabang IELC (Solo, Semarang, dsb).

---

## 📊 Module Maturity Matrix

| Module | Status | Core Features | Key Missing Items |
| :--- | :---: | :--- | :--- |
| **🔐 Authentication** | ✅ | Role-based (Superadmin, Frontdesk, Teacher, Student) | — |
| **🎯 CRM (Leads)** | ✅ | Kanban & List View, Follow-up Logging, Registration Form | **Lead Analytics (DONE)** |
| **📝 Placement Tests** | ✅ | General & IELTS Builder, Public Testing Link, Review UI | Automated Result Emails |
| **💰 Finance** | 🔄 | Invoice Management, PDF Export, WhatsApp Sending | Expense Tracking, Payment Gateway |
| **Teacher Management** | ✅ | CRUD, Specialized Skills, Assignment to Class | UI Dashboard Khusus Guru (Delayed) |
| **Scheduling** | ✅ | Drag & Drop Calendar (Planned UI), PDF Schedules | Google Calendar Sync |
| **✅ Attendance** | ✅ | Meeting & Session Logging, PDF Attendance Report | Student-side Check-in (QR) |
| **⚙️ Master Data** | ✅ | Management for Branches, Levels, Packages, Lead Sources | Multi-currency Support |

---

### 📈 CRM & Reporting
- **Leads Analytics Tab**: Implementasi tab "Reports" di CRM Dashboard dengan visualisasi distribusi Lead Source, Funnel konversi status, dan performa per cabang.
- **Automated Insights**: Sistem deteksi tren otomatis untuk memberikan rekomendasi strategi berdasarkan data lead.
- **PDF Export**: Fitur ekspor laporan ke format PDF yang siap cetak untuk kebutuhan meeting dan arsip.

### 🧪 IELTS Placement Test Workflow
- **Manual Grading Engine**: Implementasi sidebar penilaian manual di Review Modal untuk kategori IELTS.
- **Database Stability**: Migrasi perbaikan kolom `graded_by` di tabel `pt_sessions` menjadi UUID.
- **Form Builder Reliability**: Perbaikan error validasi saat menyimpan soal IELTS (Task/File Prompt).

### 🖥️ UI/UX & Quality of Life
- **Sidebar Navigation**: Perbaikan bug active state pada kategori Finance (Overview vs Price Master).
- **DataTable Integrity**: Resolusi warning `duplicate key` pada komponen tabel utama.
- **Component Polish**: Standarisasi tombol (`PrimaryButton`, dll) dengan internal loading spinner dan pembersihan React warnings.

---

## 📋 Immediate Backlog (Next Up)

### 🔴 High Priority (CRM Focus)
- [ ] **CRM Pipeline Automation**: Otomatisasi pemindahan status lead berdasarkan aktivitas terakhir (misal: otomatis 'Contacted' setelah kirim WA).
- [ ] **Lead Conversion Analytics**: Dashboard visual untuk memantau performa tiap Lead Source (Instagram vs Walk-in).
- [ ] **Advanced Follow-up Reminders**: Sistem notifikasi (WebSocket) untuk mengingatkan frontdesk melakukan follow-up yang sudah jatuh tempo.

### 🟡 Medium Priority
- [ ] **Automated Placement Score Emails**: Mengirimkan hasil tes secara otomatis ke email Lead setelah di-grade.
- [ ] **Frontdesk Daily Brief**: Ringkasan aktivitas dan tugas CRM saat login pertama kali.
- [ ] **Role-Based UI Hardening**: Memastikan elemen CRM tertentu hanya bisa diakses oleh role yang tepat.

### 🟢 Future / Secondary (Later)
- [ ] **Teacher & Student Portals**: Dashboard khusus untuk fungsionalitas pengajaran dan profil siswa.
- [ ] **Dark Mode Support**: Estetika modern untuk kenyamanan penggunaan jangka panjang.
- [ ] **Activity Log Audit UI**: Tampilan bagi Superadmin untuk audit log sistem.

---

## 🛠️ Infrastructure Status
- **Backend**: Laravel 12 + Reverb (WebSocket) + Actions Pattern.
- **Frontend**: React 18 + Inertia.js + Tailwind CSS v4.
- **Integrations**: 
    - WhatsApp (Baileys) - 🔄 Verified
    - PDF Generation (dompdf) - ✅ Verified
    - Real-time Sync - ✅ Online

---

> [!TIP]
> Dokumen ini bersifat hidup. AI Agent dan Pengembang harus memperbarui roadmap ini setiap kali ada milestone signifikan yang tercapai.

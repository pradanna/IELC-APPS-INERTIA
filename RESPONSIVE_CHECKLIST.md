# Checklist Pengerjaan Tampilan Responsif (IELC-APPS)

Dokumen checklist ini digunakan untuk memantau, menguji, dan memastikan semua modul dan halaman di **IELC-APPS** memiliki tampilan yang aman, rapi, dan fungsional di berbagai resolusi layar, terutama **layar laptop tanggung** (1366×768, 1280×800, serta 1080p dengan Windows scaling 125%/150%).

---

## 🎯 Target Breakpoints & Resolusi

| Kategori | Resolusi Target | Keterangan & Kondisi Khusus |
| :--- | :--- | :--- |
| **Laptop Tanggung / Small Desktop** *(Fokus Utama)* | **1024px – 1366px** | 1366×768 (layar 14"), 1280×800, 1080p @ 125%/150% scaling. Ruang konten efektif ~950px – 1100px. |
| **Tablet / Small Laptop** | **768px – 1023px** | iPad landscape/portrait, tablet Android. Sidebar beralih ke mobile drawer overlay. |
| **Mobile Smartphone** | **375px – 767px** | iPhone/Android. Single column stack, compact table / card view. |
| **Standard / Large Desktop** | **1440px – 1920px+** | 1080p unscaled, 2K/4K monitor. 4-5 kolom penuh, expansive dashboard. |

---

## 📐 Prinsip & Aturan Responsif (Audit Rules)

- [ ] **No Body Horizontal Scroll**: Tidak ada pergeseran layar ke samping di level browser window (`min-w-0` dan `overflow-x-hidden` pada root flex).
- [ ] **No Squished Cards**: Kartu metrik/KPI tidak boleh mengecil di bawah 170px. Gunakan `sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4` (bukan langsung `lg:grid-cols-4`).
- [ ] **Isolated Table Scroll**: Seluruh tabel dibungkus dalam container kartu dengan `overflow-x-auto min-w-0`. Scroll horizontal hanya berlaku di dalam tabel, bukan seluruh halaman.
- [ ] **Flexible Action Bar**: Header filter, input pencarian, dan tombol aksi harus menggunakan `flex-wrap gap-2.5 sm:gap-3` dan lebar fleksibel (bukan hardcoded `min-w-72` atau `min-w-50`).
- [ ] **Navigasi Tab Horizontal**: Tab bar panjang wajib memiliki `overflow-x-auto scrollbar-none flex-nowrap` agar tidak patah baris atau terpotong.
- [ ] **Modal & Drawer Height Safety**: Modal yang memiliki banyak form input harus dibatasi `max-h-[85vh]` atau `max-h-[90vh]` dengan `overflow-y-auto` agar tombol aksi tidak terpotong di layar laptop beresolusi 768px (tinggi efektif ~600px).

---

## 📋 Master Checklist per Modul

### 0. Layout Global & Shared UI
- [x] **Sidebar Adaptif (`AdminLayout.jsx`)**
  - [x] Auto-collapsed ke slim icon bar (`72px`) di layar `< 1280px`.
  - [x] Slide-over drawer dengan backdrop overlay di layar `< 1024px`.
  - [x] Tooltip native pada icon menu saat sidebar ciut.
- [x] **Navbar Header (`Navbar.jsx`)**
  - [x] Tombol hamburger menu untuk toggle sidebar manual.
  - [x] Search input adaptif (`max-w-xs sm:max-w-sm md:max-w-md`).
- [x] **Base Table Component (`DataTable.jsx`)**
  - [x] Wrapper `overflow-x-auto min-w-0`.
  - [x] Pagination footer responsif (`flex-col sm:flex-row`).
- [ ] **Base Modal (`Modal.jsx`)**
  - [ ] Pengecekan max-height scrollable pada modal form panjang di layar laptop 768px tinggi.
- [ ] **Base SlideOver (`SlideOver.jsx`)**
  - [ ] Pengecekan padding dan lebar drawer di layar mobile (`w-screen max-w-full`).

---

### 1. Modul Dashboard
- [x] **Superadmin Dashboard (`Dashboard/Superadmin.jsx`)**
  - [x] Executive KPI Cards: Grid 2x2 di laptop (`sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4`).
  - [x] Revenue Chart & CRM Pipeline: 1 kolom di laptop, 2 kolom di xl (`grid-cols-1 xl:grid-cols-2`).
  - [x] Branch Performance & Top Packages: Containment chart Recharts (`min-w-0 overflow-hidden`).
- [x] **Frontdesk Dashboard (`Dashboard/Frontdesk.jsx`)**
  - [x] KPI Cards & Daily Targets grid adaptif.
  - [x] Activity feed & pipeline stacking di layar tanggung.

---

### 2. Modul CRM & Leads
- [x] **CRM Leads Index (`Crm/Leads/Index.jsx`)**
  - [x] Navigasi tab responsif (Dashboard, Table, Kanban, Report) dengan horizontal scroll.
  - [x] Eliminasi compound padding yang membuang ruang horizontal.
- [x] **CrmDashboard Tab (`Partials/CrmDashboard.jsx`)**
  - [x] 5 KPI metric cards adaptif (`grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5`).
  - [x] Trend charts & source performance stacking di `xl`.
- [x] **LeadTable Tab (`Partials/LeadTable.jsx`)**
  - [x] Filter bar flex-wrap adaptif (mengganti hardcoded `min-w-72` dan `min-w-50`).
  - [x] Action button stack & export dropdown responsif.
  - [x] Data table scroll containment.
- [ ] **LeadKanban Tab (`Partials/LeadKanban.jsx`)**
  - [x] Horizontal scroll container untuk kolom board.
  - [ ] Uji filter board di atas kanban agar tidak overflowing pada layar sempit.
- [x] **LeadsReport Tab (`Partials/LeadsReport.jsx`)**
  - [x] Metric summary & filter dates wrapping.
- [ ] **Detail Lead Slider (`Partials/Detail/*`)**
  - [ ] Drawer profile, history, dan quick WhatsApp di laptop 1366px.
- [ ] **CRM Modals**
  - [ ] `CreateLeadModal.jsx` (Form input panjang: cek scrolling vertikal).
  - [ ] `EditLeadModal.jsx`.
  - [ ] `FollowupLeadModal.jsx`.
  - [ ] `PtScheduleModal.jsx`.
  - [ ] `DeleteLeadModal.jsx`.
- [x] **Follow-Up Index (`Crm/FollowUp/Index.jsx`)**
  - [x] Layout containment dan data table follow-up.

---

### 3. Modul Finance
- [x] **Finance Dashboard (`Finance/Dashboard.jsx`)**
  - [x] KPI Cards Finance (`FinanceKpiCards.jsx`): grid 2x2 di laptop.
  - [x] Finance Charts (`FinanceCharts.jsx`): Recharts containment, stack di `xl:grid-cols-2`.
  - [x] Finance Action Tables (`FinanceActionTables.jsx`): Recent transactions & pending actions stack di `xl:grid-cols-2`.
- [ ] **Invoices Table Tab (`Partials/InvoiceTableTab.jsx`)**
  - [ ] Filter invoice (status, branch, tanggal) wrapping.
  - [ ] Tabel invoice scroll containment.
- [ ] **Finance Modals**
  - [ ] `InvoiceFormModal.jsx` (Input multi-item invoice).
  - [ ] `PaymentModal.jsx` (Form pembayaran cepat).
  - [ ] `InvoicesListModal.jsx`.
  - [ ] `PendingInvoicesModal.jsx`.
  - [ ] `AddPackageModal.jsx`.

---

### 4. Modul Students
- [x] **Students Index (`Students/Index.jsx`)**
  - [x] Header action bar dan tab navigation horizontal scroll.
- [x] **Dashboard Tab (`Partials/DashboardTab.jsx`)**
  - [x] Student demographics & enrollment statistics containment.
- [x] **StudentTableTab (`Partials/StudentTableTab.jsx`)**
  - [x] Filter bar student wrapping.
  - [x] Perbaikan `overflow-visible` menjadi `overflow-x-auto min-w-0`.
- [ ] **Student Detail Slider (`Partials/StudentDetailSlider.jsx`)**
  - [ ] Academic Tab di dalam slider.
  - [ ] Profile Tab di dalam slider.
- [ ] **Student Modals**
  - [ ] `StudentEditModal.jsx`.
  - [ ] `ClassPlacementModal.jsx`.
  - [ ] `StudentScoreModal.jsx`.

---

### 5. Modul Study Classes & Schedules
- [x] **StudyClasses Index (`StudyClasses/Index.jsx`)**
  - [x] Tab bar dan container card containment.
  - [x] Class list card grid & status badges.
- [ ] **StudyClass Detail Slider (`Partials/StudyClassDetailSlider.jsx`)**
  - [ ] Detail Tab, Schedule Tab, dan Students Tab dalam slider.
- [ ] **Class Modals**
  - [ ] `ClassFormModal.jsx` (Form pembuatan kelas baru).
  - [ ] `AddScheduleModal.jsx`.
  - [ ] `StudentAcademicModal.jsx`.
- [x] **Admin Schedules Index (`Admin/Schedules/Index.jsx`)**
  - [x] Calendar / schedule grid containment.
- [ ] **ManageScheduleModal (`Admin/Schedules/Modals/ManageScheduleModal.jsx`)**
  - [ ] Form jadwal mingguan di resolusi pendek.

---

### 6. Modul Teachers & Academic
- [x] **Teachers Index (`Teachers/Index.jsx`)**
  - [x] Teacher Dashboard & TeacherTable containment.
- [ ] **Teacher Detail Slider & Modal**
  - [ ] `TeacherDetailSlider.jsx`.
  - [ ] `TeacherFormModal.jsx`.
- [x] **Academic Index (`Admin/Academic/Index.jsx`)**
  - [x] Tab navigasi nilai & evaluasi.
- [ ] **Academic MassEntry (`Admin/Academic/MassEntry.jsx`)**
  - [ ] Tabel input nilai massal (banyak input form per baris, uji horizontal scroll table).
- [ ] **Academic Report (`Admin/Academic/Report.jsx`)**
  - [ ] Report preview & print view responsif.
- [x] **Attendances Index & Show (`Admin/Attendances/Index.jsx`, `Show.jsx`)**
  - [x] Table absensi siswa/guru containment.

---

### 7. Modul Master Data
- [x] **Master Index (`Master/Index.jsx`) & Tabs (`Master/Partials/Tabs.jsx`)**
  - [x] Tab navigasi (Branches, Levels, Packages, Sources, Statuses, Targets) horizontal scrollable.
- [ ] **Sub-tabel Master Data**
  - [ ] `BranchesTable.jsx` (Tabel cabang & modal edit).
  - [ ] `LevelsTable.jsx` (Tabel level & modal edit).
  - [ ] `PackagesTable.jsx` (Tabel paket kelas & harga).
  - [ ] `LeadSourcesTable.jsx`.
  - [ ] `LeadStatusesTable.jsx`.
  - [ ] `MonthlyTargetTable.jsx`.

---

### 8. Modul Placement Tests
- [x] **Placement Tests Index (`PlacementTests/Index.jsx`)**
  - [x] Stacking 2 kolom ke 1 kolom di laptop (`xl:grid-cols-3 min-w-0`).
  - [x] Placement Stats & PlacementTable containment.
- [x] **Placement Tests Show (`PlacementTests/Show.jsx`)**
  - [x] Detail soal & sidebar management stacking di `xl`.
- [ ] **Placement Test Modals**
  - [ ] `CreatePackageModal.jsx`.
  - [ ] `EnrollStudentModal.jsx`.

---

### 9. Halaman Publik (Student & Candidate Facing)
- [ ] **Public Lead Profile Form (`Public/Lead/ProfileForm.jsx`)**
  - [ ] Form registrasi online siswa di smartphone (375px) dan tablet.
- [ ] **Placement Test Landing (`Public/PlacementTest/Landing.jsx`)**
  - [ ] Halaman instruksi ujian online.
- [ ] **Placement Test Exam Page (`Public/PlacementTest/Exam.jsx`)**
  - [ ] Interface pengerjaan tes (soal, pilihan ganda, timer, navigasi nomor) di smartphone & laptop.
- [ ] **Placement Test Result (`Public/PlacementTest/Result.jsx`)**
  - [ ] Tampilan skor & rekomendasi level.

---

### 10. Modul Auth & User Profile
- [ ] **Auth Pages (`Auth/*.jsx`)**
  - [ ] `Login.jsx` (Card login di tengah, responsif di mobile & laptop).
  - [ ] `Register.jsx`.
  - [ ] `ForgotPassword.jsx` & `ResetPassword.jsx`.
  - [ ] `VerifyEmail.jsx` & `ConfirmPassword.jsx`.
- [ ] **Profile Edit (`Profile/Edit.jsx`)**
  - [ ] `UpdateProfileInformationForm.jsx`.
  - [ ] `UpdatePasswordForm.jsx`.
  - [ ] `DeleteUserForm.jsx`.

---

## 🛠️ Rekomendasi Urutan Pengerjaan Berikutnya

1. **Sprint 1 (Modals & Forms Height Optimization)**:
   - Evaluasi `Modal.jsx` dan modal-modal yang memiliki form panjang (`CreateLeadModal`, `InvoiceFormModal`, `TeacherFormModal`, `StudentEditModal`) agar memiliki `max-h-[85vh]` dan internal scroll, memastikan tombol submit tidak terpotong di layar 768px tinggi.
2. **Sprint 2 (Data-Dense Pages)**:
   - Audit `Admin/Academic/MassEntry.jsx` (input nilai siswa massal) dan `Master/Partials/PackagesTable.jsx`.
3. **Sprint 3 (Public Facing Pages)**:
   - Uji coba `Public/PlacementTest/Exam.jsx` dan `Public/Lead/ProfileForm.jsx` pada viewport smartphone (375px – 420px).

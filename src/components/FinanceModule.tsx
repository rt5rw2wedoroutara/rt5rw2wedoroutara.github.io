import React, { useState, useMemo } from 'react';
import { CashTransaction, RTConfig } from '../types';
import { formatDateIndo, formatMonthYearIndo, formatRupiah } from '../utils/formatters';
import { 
  TrendingUp, 
  TrendingDown, 
  Search, 
  Printer, 
  ArrowUpRight, 
  ArrowDownRight, 
  PieChart as PieIcon, 
  BarChart3, 
  Calendar,
  Wallet
} from 'lucide-react';

interface FinanceModuleProps {
  transactions: CashTransaction[];
  baseBalance: number;
  config: RTConfig;
  onOpenReportModal: () => void;
  isSeniorMode: boolean;
}

export const FinanceModule: React.FC<FinanceModuleProps> = ({
  transactions,
  baseBalance,
  config,
  onOpenReportModal,
  isSeniorMode,
}) => {
  const [selectedMonth, setSelectedMonth] = useState<string>('2026-09');
  const [chartView, setChartView] = useState<'trend' | 'categories'>('trend');
  const [activeTypeFilter, setActiveTypeFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Calculate Real-time Overall Balance
  const totalAllIncome = useMemo(() => {
    return transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const totalAllExpense = useMemo(() => {
    return transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const realTimeBalance = baseBalance + totalAllIncome - totalAllExpense;

  // Calculate stats for the selected month
  const currentMonthTransactions = useMemo(() => {
    return transactions.filter((t) => t.date.startsWith(selectedMonth));
  }, [transactions, selectedMonth]);

  const monthIncome = useMemo(() => {
    return currentMonthTransactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [currentMonthTransactions]);

  const monthExpense = useMemo(() => {
    return currentMonthTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [currentMonthTransactions]);

  const monthSurplus = monthIncome - monthExpense;

  // Monthly trend series (Past 6 months: Apr - Sep 2026)
  const monthList = ['2026-04', '2026-05', '2026-06', '2026-07', '2026-08', '2026-09'];
  
  const monthlyTrendData = useMemo(() => {
    let runningBalance = baseBalance;
    
    return monthList.map((mStr) => {
      const monthTx = transactions.filter((t) => t.date.startsWith(mStr));
      const inc = monthTx.filter((t) => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
      const exp = monthTx.filter((t) => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
      runningBalance += (inc - exp);
      
      const [year, month] = mStr.split('-');
      const shortName = new Intl.DateTimeFormat('id-ID', { month: 'short' }).format(
        new Date(parseInt(year), parseInt(month) - 1, 1)
      );

      return {
        monthKey: mStr,
        label: `${shortName} ${year.slice(2)}`,
        income: inc,
        expense: exp,
        balance: runningBalance,
      };
    });
  }, [transactions, baseBalance]);

  // Max value for bar scaling
  const maxBarValue = useMemo(() => {
    const highest = Math.max(
      ...monthlyTrendData.map((d) => Math.max(d.income, d.expense)),
      2000000
    );
    return highest * 1.15;
  }, [monthlyTrendData]);

  // Spending categories breakdown for selected month (or past 6 months if current month has few)
  const expenseCategoriesBreakdown = useMemo(() => {
    const targetTransactions = currentMonthTransactions.filter((t) => t.type === 'expense');
    const categoryTotals: Record<string, number> = {};

    targetTransactions.forEach((t) => {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
    });

    const items = Object.entries(categoryTotals).map(([cat, total]) => ({
      category: cat,
      amount: total,
      percentage: monthExpense > 0 ? Math.round((total / monthExpense) * 100) : 0,
    }));

    return items.sort((a, b) => b.amount - a.amount);
  }, [currentMonthTransactions, monthExpense]);

  // Filtered transactions for the ledger table
  const filteredLedger = useMemo(() => {
    return transactions.filter((t) => {
      const matchesMonth = selectedMonth === 'all' || t.date.startsWith(selectedMonth);
      const matchesType = activeTypeFilter === 'all' || t.type === activeTypeFilter;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.recorder.toLowerCase().includes(q);
      return matchesMonth && matchesType && matchesSearch;
    }).sort((a, b) => (a.date < b.date ? 1 : -1));
  }, [transactions, selectedMonth, activeTypeFilter, searchQuery]);

  return (
    <div className="space-y-8">
      
      {/* Top Header & Month Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className={`font-bold tracking-tight text-slate-900 ${isSeniorMode ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'}`}>
            Keuangan & Kas Transparan RT {config.rtNumber}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Laporan pertanggungjawaban dana warga secara real-time dan terbuka.
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2.5">
          {/* Month Selector */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-300 rounded-lg px-3 py-1.5 shadow-2xs">
            <Calendar className="w-4 h-4 text-slate-500" />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent text-sm font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="2026-09">September 2026</option>
              <option value="2026-08">Agustus 2026</option>
              <option value="2026-07">Juli 2026</option>
              <option value="2026-06">Juni 2026</option>
              <option value="2026-05">Mei 2026</option>
              <option value="2026-04">April 2026</option>
              <option value="all">Semua Periode</option>
            </select>
          </div>

          {/* Printable Report Button */}
          <button
            type="button"
            onClick={onOpenReportModal}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg shadow-2xs transition-colors"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>Cetak Laporan</span>
          </button>

          {/* Add Transaction Button (Admin Only) */}
          {isAdmin && (
            <button
              type="button"
              onClick={() => {
                setNewTxType('expense');
                setFormCategory('Kebersihan & Angkut Sampah');
                setIsAddModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-2xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Catat Kas</span>
            </button>
          )}
        </div>
      </div>

      {/* 4 Primary Financial Metric Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Saldo Real-Time */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            <span>Total Saldo Kas RT</span>
            <Wallet className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
            {formatRupiah(realTimeBalance)}
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Termasuk saldo awal tersimpan di rekening kas lingkungan.
          </div>
        </div>

        {/* Pemasukan Bulan Ini */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-2">
            <span>Pemasukan ({selectedMonth === 'all' ? 'Semua' : formatMonthYearIndo(selectedMonth)})</span>
            <ArrowUpRight className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700 tabular-nums">
            {formatRupiah(monthIncome)}
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Iuran bulanan warga, donasi, dan penerimaan lainnya.
          </div>
        </div>

        {/* Pengeluaran Bulan Ini */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-semibold text-rose-700 uppercase tracking-wider mb-2">
            <span>Pengeluaran ({selectedMonth === 'all' ? 'Semua' : formatMonthYearIndo(selectedMonth)})</span>
            <ArrowDownRight className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-rose-700 tabular-nums">
            {formatRupiah(monthExpense)}
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Gaji satpam, retribusi sampah, lampu PJU & operasional.
          </div>
        </div>

        {/* Surplus / Arus Kas Bersih */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            <span>Surplus / Arus Kas</span>
            {monthSurplus >= 0 ? (
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            ) : (
              <TrendingDown className="w-4 h-4 text-rose-600" />
            )}
          </div>
          <div className={`text-2xl sm:text-3xl font-extrabold tabular-nums ${
            monthSurplus >= 0 ? 'text-emerald-700' : 'text-rose-700'
          }`}>
            {monthSurplus >= 0 ? `+${formatRupiah(monthSurplus)}` : formatRupiah(monthSurplus)}
          </div>
          <div className="mt-2 text-xs text-slate-500">
            {monthSurplus >= 0 ? 'Kondisi kas surplus & sehat.' : 'Pengeluaran melebihi pemasukan bulan ini.'}
          </div>
        </div>

      </div>

      {/* Chart Visualization Section */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-2xs space-y-5">
        
        {/* Chart Header & Segmented Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className={`font-bold text-slate-900 ${isSeniorMode ? 'text-xl' : 'text-lg'}`}>
              Visualisasi Perkembangan Keuangan Kas
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              Grafik perbandingan arus kas masuk, beban pengeluaran, dan saldo kas per bulan.
            </p>
          </div>

          {/* Segmented Tab Controls */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setChartView('trend')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                chartView === 'trend'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Tren Bulanan</span>
            </button>
            <button
              type="button"
              onClick={() => setChartView('categories')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                chartView === 'categories'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <PieIcon className="w-3.5 h-3.5" />
              <span>Kemana Uang Digunakan?</span>
            </button>
          </div>
        </div>

        {/* View 1: Monthly Trend Bar & Line Chart (Custom SVG for pristine rendering) */}
        {chartView === 'trend' && (
          <div className="space-y-4">
            
            {/* Chart Legend */}
            <div className="flex items-center flex-wrap gap-4 sm:gap-6 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-xs bg-emerald-700" />
                <span>Pemasukan (Iuran & Donasi)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-xs bg-rose-600" />
                <span>Pengeluaran (Operasional)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-0.5 bg-blue-600" />
                <span>Akumulasi Saldo Kas</span>
              </div>
            </div>

            {/* Responsive Interactive SVG Chart Container */}
            <div className="w-full overflow-x-auto pb-2">
              <div className="min-w-[620px] h-64 sm:h-72 relative flex flex-col justify-end pt-6">
                
                {/* Horizontal Grid lines */}
                <div className="absolute inset-x-0 top-6 bottom-8 flex flex-col justify-between pointer-events-none opacity-30">
                  <div className="border-b border-dashed border-slate-300 w-full" />
                  <div className="border-b border-dashed border-slate-300 w-full" />
                  <div className="border-b border-dashed border-slate-300 w-full" />
                  <div className="border-b border-slate-300 w-full" />
                </div>

                {/* Bars & Labels */}
                <div className="grid grid-cols-6 gap-3 sm:gap-6 h-full items-end z-10 px-4">
                  {monthlyTrendData.map((item) => {
                    const incHeightPct = Math.min(100, Math.round((item.income / maxBarValue) * 100));
                    const expHeightPct = Math.min(100, Math.round((item.expense / maxBarValue) * 100));
                    const isCurrent = item.monthKey === selectedMonth;

                    return (
                      <div
                        key={item.monthKey}
                        onClick={() => setSelectedMonth(item.monthKey)}
                        className={`group relative flex flex-col items-center justify-end h-full cursor-pointer p-1.5 rounded-lg transition-colors ${
                          isCurrent ? 'bg-slate-50 ring-1 ring-emerald-500/40' : 'hover:bg-slate-50/80'
                        }`}
                      >
                        {/* Hover Tooltip */}
                        <div className="opacity-0 group-hover:opacity-100 pointer-events-none absolute -top-12 bg-slate-900 text-white text-[11px] rounded-md px-2.5 py-1.5 whitespace-nowrap shadow-lg transition-opacity z-30 tabular-nums">
                          <div>Pemasukan: {formatRupiah(item.income)}</div>
                          <div>Pengeluaran: {formatRupiah(item.expense)}</div>
                          <div className="text-emerald-300 font-semibold">Saldo: {formatRupiah(item.balance)}</div>
                        </div>

                        {/* Bar Columns Container */}
                        <div className="w-full flex items-end justify-center gap-1.5 sm:gap-2.5 h-[170px] mb-2">
                          
                          {/* Income Bar (Green) */}
                          <div
                            style={{ height: `${incHeightPct}%` }}
                            className="w-1/2 max-w-[28px] bg-emerald-700 hover:bg-emerald-800 rounded-t-xs transition-all relative group/bar"
                          >
                            <span className="sr-only">Pemasukan: {formatRupiah(item.income)}</span>
                          </div>

                          {/* Expense Bar (Rose) */}
                          <div
                            style={{ height: `${expHeightPct}%` }}
                            className="w-1/2 max-w-[28px] bg-rose-600 hover:bg-rose-700 rounded-t-xs transition-all relative group/bar"
                          >
                            <span className="sr-only">Pengeluaran: {formatRupiah(item.expense)}</span>
                          </div>

                        </div>

                        {/* X-Axis Month Label */}
                        <div className="text-center pt-1 border-t border-slate-200 w-full">
                          <span className={`text-xs font-semibold ${isCurrent ? 'text-emerald-800' : 'text-slate-600'}`}>
                            {item.label}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>
            </div>

            <p className="text-xs text-slate-500 text-center italic">
              Klik pada salah satu kolom bulan untuk memfilter data rincian di tabel transaksi di bawah.
            </p>
          </div>
        )}

        {/* View 2: Spending Category Breakdown */}
        {chartView === 'categories' && (
          <div className="space-y-4">
            <div className="text-xs font-medium text-slate-500">
              Rincian alokasi biaya pengeluaran kas RT untuk periode:{' '}
              <span className="font-semibold text-slate-800">
                {selectedMonth === 'all' ? 'Seluruh Periode' : formatMonthYearIndo(selectedMonth)}
              </span>
            </div>

            {expenseCategoriesBreakdown.length === 0 ? (
              <div className="py-8 text-center text-slate-500 text-sm">
                Belum ada catatan pengeluaran pada bulan ini.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {expenseCategoriesBreakdown.map((item) => (
                  <div
                    key={item.category}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-sm font-semibold text-slate-800">
                        {item.category}
                      </span>
                      <span className="text-xs font-bold text-rose-700 tabular-nums">
                        {item.percentage}%
                      </span>
                    </div>

                    {/* Visual Progress Bar */}
                    <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-rose-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>

                    <div className="flex justify-between items-center text-xs text-slate-500 tabular-nums">
                      <span>Total Biaya:</span>
                      <span className="font-semibold text-slate-900">
                        {formatRupiah(item.amount)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* Transaction Ledger Table Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        
        {/* Table Controls Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className={`font-bold text-slate-900 ${isSeniorMode ? 'text-xl' : 'text-lg'}`}>
                Buku Kas Transaksi (Ledger)
              </h3>
              <p className="text-xs text-slate-500">
                Menampilkan {filteredLedger.length} catatan transaksi keuangan
              </p>
            </div>

            {/* Type Segmented Filter */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
              <button
                type="button"
                onClick={() => setActiveTypeFilter('all')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  activeTypeFilter === 'all'
                    ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Semua
              </button>
              <button
                type="button"
                onClick={() => setActiveTypeFilter('income')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  activeTypeFilter === 'income'
                    ? 'bg-white text-emerald-800 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Pemasukan
              </button>
              <button
                type="button"
                onClick={() => setActiveTypeFilter('expense')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  activeTypeFilter === 'expense'
                    ? 'bg-white text-rose-800 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Pengeluaran
              </button>
            </div>
          </div>

          {/* Search bar inside table header */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari deskripsi transaksi, nama pencatat, atau kategori..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-colors"
            />
          </div>
        </div>

        {/* Responsive Table Body */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                <th className="py-3 px-4">Tanggal</th>
                <th className="py-3 px-4">Kategori & Keterangan</th>
                <th className="py-3 px-4 hidden sm:table-cell">Metode</th>
                <th className="py-3 px-4 hidden md:table-cell">Pencatat</th>
                <th className="py-3 px-4 text-right">Nominal (Rp)</th>
                {isAdmin && <th className="py-3 px-4 text-center w-16">Aksi</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLedger.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 6 : 5} className="py-12 text-center text-slate-500 text-sm">
                    Tidak ada catatan transaksi yang sesuai dengan filter.
                  </td>
                </tr>
              ) : (
                filteredLedger.map((tx) => {
                  const isIncome = tx.type === 'income';
                  return (
                    <tr key={tx.id} className="hover:bg-slate-50/60 transition-colors">
                      
                      {/* Date */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-xs sm:text-sm font-medium text-slate-600">
                        {tx.date}
                      </td>

                      {/* Category & Description */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900 text-sm">
                          {tx.category}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                          {tx.description}
                        </div>
                        {tx.receiptNo && (
                          <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                            Bukti: {tx.receiptNo}
                          </div>
                        )}
                      </td>

                      {/* Payment Method */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-xs text-slate-600 hidden sm:table-cell">
                        {tx.paymentMethod || 'Tunai'}
                      </td>

                      {/* Recorder */}
                      <td className="py-3.5 px-4 text-xs text-slate-600 hidden md:table-cell">
                        {tx.recorder}
                      </td>

                      {/* Amount */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap font-bold tabular-nums">
                        <span className={isIncome ? 'text-emerald-700' : 'text-rose-700'}>
                          {isIncome ? '+ ' : '- '}
                          {formatRupiah(tx.amount)}
                        </span>
                      </td>

                      {/* Admin Actions */}
                      {isAdmin && (
                        <td className="py-3.5 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Hapus transaksi "${tx.description}"?`)) {
                                onDeleteTransaction(tx.id);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md transition-colors"
                            title="Hapus transaksi"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      )}

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* Modal: Add New Transaction (Admin Only) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-lg text-slate-900">
                Catat Transaksi Kas RT Baru
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="mt-4 space-y-4">
              
              {/* Type Switcher */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                  Jenis Transaksi
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setNewTxType('income');
                      setFormCategory('Iuran Wajib Bulanan');
                    }}
                    className={`py-2 px-3 text-sm font-semibold rounded-lg border transition-colors ${
                      newTxType === 'income'
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-800'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    + Pemasukan (Kas Masuk)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setNewTxType('expense');
                      setFormCategory('Kebersihan & Angkut Sampah');
                    }}
                    className={`py-2 px-3 text-sm font-semibold rounded-lg border transition-colors ${
                      newTxType === 'expense'
                        ? 'bg-rose-50 border-rose-600 text-rose-800'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    - Pengeluaran (Biaya)
                  </button>
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                  Kategori
                </label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="w-full p-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {newTxType === 'expense'
                    ? expenseCategoryOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)
                    : incomeCategoryOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                  Nominal Rupiah (Rp)
                </label>
                <input
                  type="number"
                  required
                  min="1000"
                  step="1000"
                  value={formAmount}
                  onChange={(e) => setFormAmount(e.target.value)}
                  placeholder="Contoh: 150000"
                  className="w-full p-2.5 text-base font-bold text-slate-900 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                  Deskripsi / Keterangan Keperluan
                </label>
                <input
                  type="text"
                  required
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Contoh: Beli semen 2 sak untuk tambal jalan depan Blok B"
                  className="w-full p-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Date */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                    Tanggal
                  </label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full p-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Method */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                    Metode Pembayaran
                  </label>
                  <select
                    value={formMethod}
                    onChange={(e) => setFormMethod(e.target.value as any)}
                    className="w-full p-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Tunai">Tunai</option>
                    <option value="Transfer Bank">Transfer Bank</option>
                    <option value="QRIS">QRIS</option>
                  </select>
                </div>
              </div>

              {/* Recorder */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                  Nama Petugas Pencatat
                </label>
                <input
                  type="text"
                  value={formRecorder}
                  onChange={(e) => setFormRecorder(e.target.value)}
                  className="w-full p-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg transition-colors shadow-2xs"
                >
                  Simpan Transaksi
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

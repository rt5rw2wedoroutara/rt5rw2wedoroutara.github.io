import React, { useState } from 'react';
import { CashTransaction, RTConfig } from '../types';
import { formatDateIndo, formatMonthYearIndo, formatRupiah } from '../utils/formatters';
import { Printer, X, FileText } from 'lucide-react';

interface FinancialReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: CashTransaction[];
  baseBalance: number;
  config: RTConfig;
}

export const FinancialReportModal: React.FC<FinancialReportModalProps> = ({
  isOpen,
  onClose,
  transactions,
  baseBalance,
  config,
}) => {
  const [reportMonth, setReportMonth] = useState('2026-09');

  if (!isOpen) return null;

  // Transactions before report month
  const priorTransactions = transactions.filter((t) => t.date < `${reportMonth}-01`);
  const priorIncome = priorTransactions.filter((t) => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const priorExpense = priorTransactions.filter((t) => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
  const startingBalance = baseBalance + priorIncome - priorExpense;

  // Month transactions
  const monthTransactions = transactions.filter((t) => t.date.startsWith(reportMonth));
  const incomes = monthTransactions.filter((t) => t.type === 'income');
  const expenses = monthTransactions.filter((t) => t.type === 'expense');

  const totalMonthIncome = incomes.reduce((acc, t) => acc + t.amount, 0);
  const totalMonthExpense = expenses.reduce((acc, t) => acc + t.amount, 0);
  const endingBalance = startingBalance + totalMonthIncome - totalMonthExpense;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl border border-slate-300 relative my-8">
        
        {/* Top Control Bar (Hidden on print) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-200 no-print">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
            <FileText className="w-5 h-5 text-emerald-700" />
            <span>Format Cetak Laporan Kas Bulanan RT</span>
          </div>

          <div className="flex items-center gap-2.5">
            <select
              value={reportMonth}
              onChange={(e) => setReportMonth(e.target.value)}
              className="text-xs sm:text-sm font-semibold border border-slate-300 rounded-lg px-3 py-1.5 bg-slate-50 text-slate-800"
            >
              <option value="2026-09">September 2026</option>
              <option value="2026-08">Agustus 2026</option>
              <option value="2026-07">Juli 2026</option>
              <option value="2026-06">Juni 2026</option>
            </select>

            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-2xs transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Laporan</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              aria-label="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Statement */}
        <div className="border border-slate-300 rounded-xl p-6 sm:p-8 bg-white text-slate-900 printable-area text-xs sm:text-sm">
          
          {/* Header */}
          <div className="text-center border-b-2 border-slate-900 pb-4 mb-6">
            <div className="text-xs font-bold uppercase tracking-widest text-slate-600">
              LAPORAN PERTANGGUNGJAWABAN KEUANGAN KAS
            </div>
            <div className="text-lg sm:text-2xl font-black uppercase tracking-tight text-slate-950">
              RUKUN TETANGGA {config.rtNumber} / RUKUN WARGA {config.rwNumber} {config.neighbourhoodName.toUpperCase()}
            </div>
            <div className="text-xs text-slate-600 mt-1">
              Kelurahan {config.villageName}, Kecamatan {config.districtName}, {config.city} · Periode: {formatMonthYearIndo(reportMonth)}
            </div>
          </div>

          {/* Balance Summary Box */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 border border-slate-200 rounded-lg mb-6 tabular-nums">
            <div>
              <div className="text-[11px] text-slate-500 font-semibold uppercase">Saldo Awal Bulan</div>
              <div className="text-base sm:text-lg font-bold text-slate-900">{formatRupiah(startingBalance)}</div>
            </div>
            <div>
              <div className="text-[11px] text-emerald-700 font-semibold uppercase">Total Pemasukan</div>
              <div className="text-base sm:text-lg font-bold text-emerald-700">+{formatRupiah(totalMonthIncome)}</div>
            </div>
            <div>
              <div className="text-[11px] text-rose-700 font-semibold uppercase">Total Pengeluaran</div>
              <div className="text-base sm:text-lg font-bold text-rose-700">-{formatRupiah(totalMonthExpense)}</div>
            </div>
            <div>
              <div className="text-[11px] text-slate-900 font-semibold uppercase">Saldo Akhir Tersimpan</div>
              <div className="text-base sm:text-lg font-extrabold text-slate-900">{formatRupiah(endingBalance)}</div>
            </div>
          </div>

          {/* Incomes Table */}
          <div className="mb-6">
            <h4 className="font-bold text-slate-900 mb-2 border-b border-slate-300 pb-1 flex justify-between">
              <span>I. RINCIAN PENERIMAAN / PEMASUKAN KAS</span>
              <span className="text-emerald-800 tabular-nums">Subtotal: {formatRupiah(totalMonthIncome)}</span>
            </h4>
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="py-1.5">Tgl</th>
                  <th className="py-1.5">Kategori</th>
                  <th className="py-1.5">Keterangan</th>
                  <th className="py-1.5 text-right">Nominal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {incomes.map((tx) => (
                  <tr key={tx.id}>
                    <td className="py-1.5 font-medium whitespace-nowrap">{tx.date}</td>
                    <td className="py-1.5">{tx.category}</td>
                    <td className="py-1.5">{tx.description}</td>
                    <td className="py-1.5 text-right font-bold text-emerald-800 tabular-nums">
                      {formatRupiah(tx.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Expenses Table */}
          <div className="mb-8">
            <h4 className="font-bold text-slate-900 mb-2 border-b border-slate-300 pb-1 flex justify-between">
              <span>II. RINCIAN PENGELUARAN / BELANJA KAS</span>
              <span className="text-rose-800 tabular-nums">Subtotal: {formatRupiah(totalMonthExpense)}</span>
            </h4>
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="py-1.5">Tgl</th>
                  <th className="py-1.5">Kategori</th>
                  <th className="py-1.5">Keterangan</th>
                  <th className="py-1.5 text-right">Nominal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {expenses.map((tx) => (
                  <tr key={tx.id}>
                    <td className="py-1.5 font-medium whitespace-nowrap">{tx.date}</td>
                    <td className="py-1.5">{tx.category}</td>
                    <td className="py-1.5">{tx.description}</td>
                    <td className="py-1.5 text-right font-bold text-rose-800 tabular-nums">
                      {formatRupiah(tx.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Signatures */}
          <div className="pt-6 grid grid-cols-2 gap-8 text-center text-xs">
            <div>
              <div className="text-slate-500">Mengetahui,</div>
              <div className="font-semibold text-slate-800">Ketua RT {config.rtNumber}</div>
              <div className="h-20 flex items-end justify-center">
                <span className="font-bold border-b border-slate-800 px-6">
                  ( Pengurus Ketua RT {config.rtNumber} )
                </span>
              </div>
            </div>

            <div>
              <div className="text-slate-500">{config.city}, {formatDateIndo(new Date().toISOString().slice(0, 10))}</div>
              <div className="font-semibold text-slate-800">Bendahara RT {config.rtNumber}</div>
              <div className="h-20 flex items-end justify-center">
                <span className="font-bold border-b border-slate-800 px-6">
                  ( Pengurus Bendahara RT {config.rtNumber} )
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

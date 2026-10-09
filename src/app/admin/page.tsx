'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatPrice, formatDate } from '@/lib/utils';
import {
  DollarSign,
  ShoppingBag,
  Users,
  AlertTriangle,
  TrendingUp,
  ArrowRight,
  ExternalLink,
  Shield,
  Clock,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<any>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((res) => res.json())
      .then((data) => {
        if (data.metrics) setMetrics(data.metrics);
        if (data.chartData) setChartData(data.chartData);
        if (data.recentOrders) setRecentOrders(data.recentOrders);
        if (data.lowStockProducts) setLowStockProducts(data.lowStockProducts);
        if (data.topProducts) setTopProducts(data.topProducts);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-12 text-center text-xs text-neutral-400">
        Aggregating atelier performance metrics...
      </div>
    );
  }

  const maxRevenueInChart = chartData.length > 0 ? Math.max(...chartData.map((d) => d.revenue)) : 300000;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Welcome & Atelier Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#222226]">
        <div>
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#C9A24B] font-semibold block mb-1">
            EXECUTIVE CONTROL DECK
          </span>
          <h1 className="font-serif text-3xl text-white font-normal">
            Atelier Command & Analytics
          </h1>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/admin/products"
            className="px-4 py-2 bg-[#C9A24B] hover:bg-[#DFBF73] text-black text-xs uppercase tracking-widest font-semibold transition-colors"
          >
            + New Piece
          </Link>
          <Link
            href="/admin/orders"
            className="px-4 py-2 bg-[#1A1A22] border border-[#2A2A30] text-neutral-300 hover:text-white text-xs uppercase tracking-widest transition-colors"
          >
            Manage Orders
          </Link>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue */}
        <div className="bg-[#121215] border border-[#222226] p-6 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-[11px] uppercase tracking-widest font-medium">Gross Revenue</span>
            <DollarSign className="w-4 h-4 text-[#C9A24B]" />
          </div>
          <p className="font-serif text-2xl sm:text-3xl text-white font-medium">
            {formatPrice(metrics?.totalRevenue || 0)}
          </p>
          <p className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
            <TrendingUp className="w-3 h-3" /> +18.4% vs previous salon quarter
          </p>
        </div>

        {/* Total Orders */}
        <div className="bg-[#121215] border border-[#222226] p-6 space-y-2">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-[11px] uppercase tracking-widest font-medium">Acquisitions Registered</span>
            <ShoppingBag className="w-4 h-4 text-[#C9A24B]" />
          </div>
          <p className="font-serif text-2xl sm:text-3xl text-white font-medium">
            {metrics?.totalOrders || 0} Orders
          </p>
          <p className="text-[10px] text-neutral-400 font-mono">
            Avg Order: {formatPrice(metrics?.averageOrderValue || 0)}
          </p>
        </div>

        {/* Registered Clients */}
        <div className="bg-[#121215] border border-[#222226] p-6 space-y-2">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-[11px] uppercase tracking-widest font-medium">Private VIP Patrons</span>
            <Users className="w-4 h-4 text-[#C9A24B]" />
          </div>
          <p className="font-serif text-2xl sm:text-3xl text-white font-medium">
            {metrics?.totalCustomers || 0} Patrons
          </p>
          <p className="text-[10px] text-neutral-400 font-mono">
            Registered & authenticated profiles
          </p>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-[#121215] border border-[#222226] p-6 space-y-2">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-[11px] uppercase tracking-widest font-medium">Low Stock Alerts</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <p className="font-serif text-2xl sm:text-3xl text-white font-medium">
            {metrics?.lowStockCount || 0} Pieces
          </p>
          <p className="text-[10px] text-amber-400/90 font-mono">
            ≤ 3 items remaining in reserve
          </p>
        </div>
      </div>

      {/* Visual Revenue Performance Chart */}
      <div className="bg-[#121215] border border-[#222226] p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#C9A24B] font-semibold">
              ANNUAL SALON TRAJECTORY
            </span>
            <h3 className="font-serif text-xl text-white">Revenue Inflow Over Time</h3>
          </div>
          <span className="text-xs text-neutral-400 font-mono">Currency: USD</span>
        </div>

        {/* Simple elegant CSS bar chart */}
        <div className="pt-8 pb-4">
          <div className="flex items-end justify-between gap-2 sm:gap-4 h-52 border-b border-[#222226] pb-2">
            {chartData.map((d) => {
              const heightPercent = Math.max(12, Math.round((d.revenue / maxRevenueInChart) * 100));
              return (
                <div key={d.month} className="flex-1 flex flex-col items-center h-full justify-end group">
                  <div className="text-[10px] font-mono text-neutral-400 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    ${Math.round(d.revenue / 1000)}k
                  </div>
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className="w-full max-w-[40px] bg-gradient-to-t from-[#8E7234] via-[#C9A24B] to-[#DFBF73] hover:brightness-110 transition-all cursor-pointer"
                  />
                  <span className="text-[11px] font-mono text-neutral-400 mt-2">{d.month}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Two Columns: Recent Orders & Top-Tier Pieces */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Orders Table */}
        <div className="lg:col-span-8 bg-[#121215] border border-[#222226] p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#222226]">
            <h3 className="font-serif text-lg text-white">Recent Client Acquisitions</h3>
            <Link href="/admin/orders" className="text-xs text-[#C9A24B] hover:underline">
              View All Orders →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#222226] text-neutral-500 uppercase tracking-widest text-[10px]">
                  <th className="py-2.5">Order Ref</th>
                  <th className="py-2.5">Client</th>
                  <th className="py-2.5">Status</th>
                  <th className="py-2.5 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1C1C20]">
                {recentOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-[#16161C]">
                    <td className="py-3 font-mono text-white">{ord.orderNumber}</td>
                    <td className="py-3 text-neutral-300">{ord.customerName}</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 text-[9px] uppercase tracking-wider bg-[#1E1E24] text-[#DFBF73] border border-[#2A2A30]">
                        {ord.status}
                      </span>
                    </td>
                    <td className="py-3 text-right font-mono text-[#DFBF73]">
                      {formatPrice(ord.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top-Selling / High-Value Products */}
        <div className="lg:col-span-4 bg-[#121215] border border-[#222226] p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#222226]">
            <h3 className="font-serif text-lg text-white">Pinnacle Masterpieces</h3>
            <Link href="/admin/products" className="text-xs text-[#C9A24B] hover:underline">
              Inventory →
            </Link>
          </div>

          <div className="space-y-3">
            {topProducts.map((p) => (
              <div key={p.id} className="flex items-center space-x-3 text-xs">
                {p.image && (
                  <img src={p.image} alt="" className="w-10 h-12 object-cover border border-[#222226] flex-shrink-0" />
                )}
                <div className="flex-1 truncate">
                  <p className="font-serif text-white truncate">{p.name}</p>
                  <p className="text-[11px] text-neutral-500 font-mono">Stock: {p.stock} units</p>
                </div>
                <span className="font-mono text-[#DFBF73] text-right flex-shrink-0">
                  {formatPrice(p.price)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

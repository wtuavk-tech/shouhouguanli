import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { createPortal } from 'react-dom';
import { 
  Copy, 
  FileText, 
  CheckCircle, 
  Info, 
  Search, 
  AlertTriangle, 
  Trash2, 
  DollarSign, 
  Filter,
  ChevronDown,
  ChevronUp,
  X,
  Plus,
  Upload,
  Image as ImageIcon,
  Calendar,
  MessageCircle,
  Send,
  Smile,
  Video,
  Paperclip,
  User,
  ListFilter,
  SlidersHorizontal,
  Activity,
  Zap,
  LayoutDashboard,
  Wallet,
  ClipboardList,
  Megaphone,
  Bell,
  Check,
  Users,
  Settings,
  MapPin,
  Clock,
  Tag,
  Eye,
  Phone,
  Image,
  PauseCircle,
  Archive,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

// --- 类型定义 ---

enum OrderStatus {
  PendingDispatch = '待处理',
  Completed = '已完成',
  Void = '作废',
  Returned = '已退回',
  Error = '报错'
}

interface Order {
  id: number;
  // --- New Fields Layout ---
  remainingTime: number;         // 剩余时间（小时）
  isMallOrder: boolean;          // 商城订单
  orderNo: string;               // 订单号 (工单号)
  originalOrderNo: string;       // 原始订单号 (New)
  mobile: string;                // 手机号
  initiator: string;             // 发起人
  createTime: string;            // 创建时间
  orderTime: string;             // 订单时间 (New)
  customerName: string;          // 客户名称
  source: string;                // 订单来源
  status: OrderStatus;           // 状态
  cashierPaymentAmount: number;  // 出纳付款金额
  customerRequest: string;       // 客户诉求
  remark: string;                // 备注
  recorderName: string;          // 录单人
  masterName: string;            // 师傅
  revenue: number;               // 业绩
  responsibleParty: string;      // 责任方
  totalRefund: number;           // 总退款
  refundMethod: string;          // 退款方式
  masterRefund: number;          // 师傅退款
  entryStatus: string;           // 入账状态
  companyRefund: number;         // 公司退款
  masterCost: number;            // 师傅成本
  customerPaymentCode: boolean;  // 顾客收款码 (模拟是否存在)
  invalidVoucher: boolean;       // 不可凭证 -> 改为 补款凭证
  paymentVoucher: boolean;       // 付款凭证 (模拟是否存在)
  completerName: string;         // 办结人
  completionType: string;        // 办结类型
  completionTime: string;        // 办结时间
  completionNote: string;        // 完结说明
  voiderName: string;            // 作废人
  voidReason: string;            // 作废原因
  masterRefundTime: string;      // 师傅退款时间
  companyRefundTime: string;     // 公司退款时间
  masterCostTime: string;        // 师傅成本时间
  platformRefund: number;        // 平台退款
  overtimeAlert: number;         // 超时提醒（小时）
  isSuspended: boolean;          // 是否挂起 (New)
  
  // Legacy fields kept for compatibility with existing modals/logic if needed, 
  // though they might not be shown in the table anymore.
  totalAmount: number;           
  details: string;
  region: string;
  address: string;
  serviceItem: string;
}

// --- 辅助函数 ---
const formatCurrency = (amount: number) => {
  return Number.isInteger(amount) ? amount.toString() : amount.toFixed(1);
};

const formatDate = (date: Date) => {
  return `${date.getMonth() + 1}-${date.getDate()} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
};

// --- Mock 数据生成 ---
const generateMockData = (): Order[] => {
  const sources = ['小程序', '电话', '美团', '转介绍', '抖音', '58同城'];
  const names = ['张三', '李四', '王五', '赵六', '孙七', '周八', '吴九', '郑十'];
  const masters = ['王师傅', '李师傅', '张师傅', '刘师傅', '陈师傅'];
  const dispatchers = ['客服A', '客服B', '客服C', '系统自动'];
  const initiators = ['用户自发', '系统生成', '客服代客'];
  const refundMethods = ['原路退回', '微信转账', '支付宝', '线下现金'];
  const entryStatuses = ['已入账', '未入账', '挂账', '异常'];
  const completionTypes = ['正常完结', '强制完结', '异常完结'];
  
  let pendingCount = 0;

  return Array.from({ length: 128 }).map((_, i) => {
    const id = i + 1;
    let status = OrderStatus.Completed;

    if (pendingCount < 10 && i % 10 === 0) { 
      status = OrderStatus.PendingDispatch;
      pendingCount++;
    } else if (i % 15 === 1) {
      status = OrderStatus.Void;
    } else if (i % 15 === 2) {
      status = OrderStatus.Returned;
    } else if (i % 15 === 3) {
      status = OrderStatus.Error;
    } else {
      status = OrderStatus.Completed;
    }

    const amount = 150 + (i % 20) * 20;
    
    // Random dates
    const now = new Date();
    const createDate = new Date(now.getTime() - Math.random() * 86400000 * 5);
    const orderDate = new Date(createDate.getTime() - Math.random() * 3600000 * 4); // Order time is 0-4 hours before create time
    const completeDate = new Date(createDate.getTime() + Math.random() * 86400000);
    const refundDate = new Date(completeDate.getTime() + Math.random() * 86400000);

    return {
      id,
      remainingTime: Math.floor(Math.random() * 48),
      isMallOrder: Math.random() > 0.8,
      orderNo: `ORD-${20230000 + i}`,
      originalOrderNo: `ORI-${String(90000000 + i)}`,
      mobile: `13${i % 9 + 1}****${String(1000 + i).slice(-4)}`,
      initiator: initiators[i % initiators.length],
      createTime: formatDate(createDate),
      orderTime: formatDate(orderDate),
      customerName: names[i % names.length],
      source: sources[i % sources.length],
      status,
      cashierPaymentAmount: Math.random() > 0.5 ? amount : 0,
      customerRequest: i % 5 === 0 ? '加急处理' : '无特殊要求。此单需要特别注意客户的时间安排，请务必提前联系确认。',
      remark: i % 8 === 0 ? '客户要求下午上门' : '',
      recorderName: dispatchers[i % dispatchers.length],
      masterName: masters[i % masters.length],
      revenue: amount * 0.3,
      responsibleParty: i % 10 === 0 ? '师傅' : '公司',
      totalRefund: i % 20 === 0 ? 50 : 0,
      refundMethod: i % 20 === 0 ? refundMethods[i % refundMethods.length] : '-',
      masterRefund: i % 30 === 0 ? 20 : 0,
      entryStatus: entryStatuses[i % entryStatuses.length],
      companyRefund: i % 40 === 0 ? 30 : 0,
      masterCost: amount * 0.6,
      customerPaymentCode: Math.random() > 0.5,
      invalidVoucher: Math.random() > 0.9,
      paymentVoucher: Math.random() > 0.5,
      completerName: dispatchers[(i + 2) % dispatchers.length],
      completionType: completionTypes[i % completionTypes.length],
      completionTime: status === OrderStatus.Completed ? formatDate(completeDate) : '-',
      completionNote: status === OrderStatus.Completed ? '服务完成，客户满意' : '',
      voiderName: status === OrderStatus.Void ? '管理员' : '-',
      voidReason: status === OrderStatus.Void ? '客户取消' : '-',
      masterRefundTime: i % 30 === 0 ? formatDate(refundDate) : '-',
      companyRefundTime: i % 40 === 0 ? formatDate(refundDate) : '-',
      masterCostTime: formatDate(completeDate),
      platformRefund: i % 50 === 0 ? 10 : 0,
      overtimeAlert: parseFloat((Math.random() * 24).toFixed(1)),
      isSuspended: Math.random() < 0.05, // 5% chance of being suspended initially
      
      // Legacy
      totalAmount: amount,
      details: '无',
      region: '默认区域',
      address: '默认地址',
      serviceItem: '默认服务'
    };
  });
};

const FULL_MOCK_DATA = generateMockData();

// --- 组件定义 ---

const NotificationBar = () => {
  return (
    <div className="mb-3 bg-orange-50 border border-orange-100 rounded-lg px-4 py-2 flex items-center gap-3 overflow-hidden relative">
      <div className="flex items-center gap-1.5 text-orange-600 font-bold whitespace-nowrap z-10 bg-orange-50 pr-2">
        <Megaphone size={16} className="animate-pulse" />
        <span className="text-xs">通知公告</span>
      </div>
      <div className="flex-1 overflow-hidden relative h-5 group">
        <div className="absolute whitespace-nowrap animate-marquee group-hover:pause-animation text-xs text-orange-800 flex items-center">
          <span className="mr-8">📢 系统升级通知：今晚 24:00 将进行系统维护，预计耗时 30 分钟。</span>
          <span className="mr-8">🔥 10月业绩pk赛圆满结束，恭喜华东大区获得冠军！</span>
          <span className="mr-8">⚠️ 请各位接单员注意：近期客户反馈电话未接通率较高，请保持电话畅通。</span>
          <span>💡 新功能上线：现已支持批量导出财务报表，欢迎试用。</span>
        </div>
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .group-hover\\:pause-animation:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

// --- 重构：SearchPanel (数据概览 + 高级筛选) ---
const SearchPanel = ({ suspendedCount }: { suspendedCount: number }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Mock stats for the overview
  const pendingCount = FULL_MOCK_DATA.filter(o => o.status === OrderStatus.PendingDispatch).length;
  const processedCount = FULL_MOCK_DATA.filter(o => o.status === OrderStatus.Completed).length;
  
  // Calculate new metrics
  const pending24h = Math.floor(pendingCount * 0.75); // Mock derived
  const pending48h = Math.floor(pendingCount * 0.45); // Mock derived
  const pending72h = Math.floor(pendingCount * 0.2); // Mock derived
  const overtimeCount = FULL_MOCK_DATA.filter(o => o.overtimeAlert > 0 && ![OrderStatus.Completed, OrderStatus.Void, OrderStatus.Returned].includes(o.status)).length;

  const stats = {
    todayNew: 15, // Mock data for demo
    pending: pendingCount,
    processed: processedCount,
    refundTodayCount: 3,
    refundTodayAmount: 450.5,
    lastWeekRate: '98.5%',
    processed24h: 42,
    pending24h,
    pending48h,
    pending72h,
    overtimeCount
  };

  return (
    <div className="flex flex-col gap-2 mb-3">
      {/* 1. Data Overview Bar (Always Visible) 
          Changes: 
          - py-3 -> py-5 (Increase height by ~30%)
          - text-xs -> text-base (Increase font by ~30%)
          - text-base (numbers) -> text-xl (Increase font by ~30%)
          - Title text-sm -> text-lg
      */}
      <div className="bg-[#F0F7FF] border border-blue-200 rounded-lg px-4 py-5 flex items-center justify-between shadow-sm">
         <div className="flex items-center gap-6 overflow-x-auto scrollbar-hide flex-1">
            {/* Title */}
            <div className="flex items-center gap-2 text-blue-800 font-bold whitespace-nowrap mr-2 select-none border-r border-blue-200 pr-4">
              <Activity size={24} className="text-blue-600" />
              <span className="text-lg">数据概览</span>
            </div>
            
            {/* Metrics */}
            <div className="flex items-center gap-8 text-base whitespace-nowrap">
               <div className="flex flex-col sm:flex-row sm:items-baseline gap-1.5">
                  <span className="text-slate-500 font-medium">今日新增售后</span>
                  <span className="font-bold text-slate-800 text-xl">{stats.todayNew}</span>
               </div>
               <div className="flex flex-col sm:flex-row sm:items-baseline gap-1.5">
                  <span className="text-slate-500 font-medium">待处理</span>
                  <span className="font-bold text-orange-600 text-xl">{stats.pending}</span>
               </div>
               <div className="flex flex-col sm:flex-row sm:items-baseline gap-1.5">
                  <span className="text-slate-500 font-medium">24h待处理</span>
                  <span className="font-bold text-orange-600 text-xl">{stats.pending24h}</span>
               </div>
               <div className="flex flex-col sm:flex-row sm:items-baseline gap-1.5">
                  <span className="text-slate-500 font-medium">48h待处理</span>
                  <span className="font-bold text-orange-700 text-xl">{stats.pending48h}</span>
               </div>
               <div className="flex flex-col sm:flex-row sm:items-baseline gap-1.5">
                  <span className="text-slate-500 font-medium">72h待处理</span>
                  <span className="font-bold text-red-600 text-xl">{stats.pending72h}</span>
               </div>
               <div className="flex flex-col sm:flex-row sm:items-baseline gap-1.5">
                  <span className="text-slate-500 font-medium">超时售后</span>
                  <span className="font-bold text-red-500 text-xl animate-pulse">{stats.overtimeCount}</span>
               </div>
               <div className="flex flex-col sm:flex-row sm:items-baseline gap-1.5">
                  <span className="text-slate-500 font-medium">已处理</span>
                  <span className="font-bold text-emerald-600 text-xl">{stats.processed}</span>
               </div>
               <div className="flex flex-col sm:flex-row sm:items-baseline gap-1.5">
                  <span className="text-slate-500 font-medium">今日退款(数量/金额)</span>
                  <div className="flex items-baseline gap-1">
                     <span className="font-bold text-red-500 text-xl">{stats.refundTodayCount}</span>
                     <span className="text-slate-400 text-sm">/</span>
                     <span className="font-bold text-slate-700 text-lg">¥{stats.refundTodayAmount}</span>
                  </div>
               </div>
               <div className="flex flex-col sm:flex-row sm:items-baseline gap-1.5">
                  <span className="text-slate-500 font-medium">上周完结率</span>
                  <span className="font-bold text-blue-600 text-xl">{stats.lastWeekRate}</span>
               </div>
               <div className="flex flex-col sm:flex-row sm:items-baseline gap-1.5">
                  <span className="text-slate-500 font-medium">24小时处理数</span>
                  <span className="font-bold text-slate-800 text-xl">{stats.processed24h}</span>
               </div>
            </div>
         </div>

         {/* Toggle Button */}
         <button 
           onClick={() => setIsExpanded(!isExpanded)}
           className={`flex items-center gap-1.5 text-sm font-bold px-3 py-1.5 rounded transition-all whitespace-nowrap ml-4 border ${isExpanded ? 'bg-blue-600 text-white border-blue-600' : 'text-blue-600 hover:bg-blue-100 border-transparent hover:border-blue-200'}`}
         >
           {isExpanded ? <ChevronUp size={16} /> : <Search size={16} />}
           {isExpanded ? '收起筛选' : '点这高级筛选'}
         </button>
      </div>

      {/* 2. Expanded Filter Section (Conditionally Rendered) 
          Changes:
          - p-4 -> p-2 (Reduce padding)
          - gap-4 -> gap-2 (Reduce grid gap)
          - h-8 -> h-6 (Reduce input height by ~30% from 32px to 24px)
          - gap-1.5 -> gap-0.5 (Reduce label spacing)
      */}
      {isExpanded && (
        <div className="bg-white border border-slate-200 rounded-lg p-2 shadow-sm animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {/* 1. 订单号/手机号 */}
              <div className="flex flex-col gap-0.5">
                  <label className="text-xs text-slate-500 font-medium">订单号/手机号</label>
                  <input type="text" placeholder="请输入" className="h-6 px-2 border border-slate-300 rounded text-xs focus:border-blue-500 focus:outline-none" />
              </div>
              
              {/* 2. 师傅 */}
              <div className="flex flex-col gap-0.5">
                  <label className="text-xs text-slate-500 font-medium">师傅</label>
                  <input type="text" placeholder="请输入" className="h-6 px-2 border border-slate-300 rounded text-xs focus:border-blue-500 focus:outline-none" />
              </div>
              
              {/* 3. 订单来源 */}
              <div className="flex flex-col gap-0.5">
                  <label className="text-xs text-slate-500 font-medium">订单来源</label>
                  <select className="h-6 px-2 border border-slate-300 rounded text-xs focus:border-blue-500 focus:outline-none text-slate-600">
                    <option>请选择</option>
                  </select>
              </div>

              {/* 4. 派单员 */}
              <div className="flex flex-col gap-0.5">
                  <label className="text-xs text-slate-500 font-medium">派单员</label>
                  <input type="text" placeholder="请输入" className="h-6 px-2 border border-slate-300 rounded text-xs focus:border-blue-500 focus:outline-none" />
              </div>

              {/* 5. 办结类型 */}
              <div className="flex flex-col gap-0.5">
                  <label className="text-xs text-slate-500 font-medium">办结类型</label>
                  <select className="h-6 px-2 border border-slate-300 rounded text-xs focus:border-blue-500 focus:outline-none text-slate-600">
                    <option>请选择</option>
                  </select>
              </div>

              {/* 6. 是否入账 */}
              <div className="flex flex-col gap-0.5">
                  <label className="text-xs text-slate-500 font-medium">是否入账</label>
                  <select className="h-6 px-2 border border-slate-300 rounded text-xs focus:border-blue-500 focus:outline-none text-slate-600">
                    <option>请选择</option>
                  </select>
              </div>

              {/* 7. 退款方式 */}
              <div className="flex flex-col gap-0.5">
                  <label className="text-xs text-slate-500 font-medium">退款方式</label>
                  <select className="h-6 px-2 border border-slate-300 rounded text-xs focus:border-blue-500 focus:outline-none text-slate-600">
                    <option>请选择</option>
                  </select>
              </div>

              {/* 8. 状态 */}
              <div className="flex flex-col gap-0.5">
                  <label className="text-xs text-slate-500 font-medium">状态</label>
                  <select className="h-6 px-2 border border-slate-300 rounded text-xs focus:border-blue-500 focus:outline-none text-slate-600">
                    <option>请选择</option>
                  </select>
              </div>

              {/* 9. 创建人 (New) */}
              <div className="flex flex-col gap-0.5">
                  <label className="text-xs text-slate-500 font-medium">创建人</label>
                  <input type="text" placeholder="请输入" className="h-6 px-2 border border-slate-300 rounded text-xs focus:border-blue-500 focus:outline-none" />
              </div>
              
              {/* 10. 时间筛选 (Span 2 cols) */}
              <div className="flex flex-col gap-0.5 col-span-2">
                   <label className="text-xs text-slate-500 font-medium">时间筛选</label>
                   <div className="flex items-center gap-0 border border-slate-300 rounded bg-white overflow-hidden h-6">
                       <select className="h-full px-2 text-xs text-slate-500 font-medium border-r border-slate-200 bg-slate-50 focus:outline-none cursor-pointer hover:bg-slate-100">
                          <option>创建时间</option>
                          <option>付款时间</option>
                       </select>
                       <div className="flex items-center px-2 gap-2 flex-1">
                           <div className="relative flex-1">
                              <input type="text" placeholder="开始日期" className="w-full text-xs outline-none placeholder:text-slate-400 text-center" />
                           </div>
                           <span className="text-slate-300">-</span>
                           <div className="relative flex-1">
                              <input type="text" placeholder="结束日期" className="w-full text-xs outline-none placeholder:text-slate-400 text-center" />
                           </div>
                       </div>
                  </div>
              </div>
              
              {/* Buttons (Compressed to col-span-1 on large screens to fit row) */}
              <div className="flex items-end gap-2 col-span-2 lg:col-span-1">
                  <button className="h-6 px-4 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded transition-colors shadow-sm font-medium flex-1 flex items-center justify-center gap-1">
                      <Search size={14} /> 搜索
                  </button>
                  <button className="h-6 px-4 bg-white text-slate-600 hover:text-blue-600 hover:border-blue-400 text-xs rounded transition-colors border border-slate-300 shadow-sm font-medium flex-1">
                      重置
                  </button>
              </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Modals & Cells ---

const TooltipCell = ({ content }: { content: string }) => {
  const [show, setShow] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setCoords({
        x: rect.left + rect.width / 2,
        y: rect.top
      });
      setShow(true);
    }
  };

  return (
    <>
      <div 
        ref={triggerRef}
        className="max-w-[120px] truncate cursor-help text-slate-600 hover:text-blue-600 transition-colors" 
        onMouseEnter={handleMouseEnter} 
        onMouseLeave={() => setShow(false)}
      >
        {content}
      </div>
      {show && createPortal(
        <div 
            className="fixed z-[9999] bg-slate-800 text-white text-xs p-3 rounded-lg shadow-xl max-w-xs break-words pointer-events-none transition-all duration-200 animate-in fade-in zoom-in-95"
            style={{ 
              top: coords.y - 8, 
              left: coords.x, 
              transform: 'translate(-50%, -100%)' 
            }}
        >
          {content}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
        </div>,
        document.body
      )}
    </>
  );
};

const RecordOrderModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  return null; // Simplified for this update as requested logic is mainly table
}

const StatusCell = ({ order }: { order: Order }) => {
  const getStatusStyle = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PendingDispatch: return 'bg-orange-100 text-orange-700 border border-orange-200';
      case OrderStatus.Returned: return 'bg-red-100 text-red-700 border border-red-200';
      case OrderStatus.Error: return 'bg-yellow-100 text-yellow-700 border border-yellow-200';
      case OrderStatus.Void: return 'bg-gray-100 text-gray-500 border border-gray-200';
      case OrderStatus.Completed: return 'bg-green-100 text-green-700 border border-green-200';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <span className={`px-2 py-0.5 rounded text-xs font-semibold whitespace-nowrap ${getStatusStyle(order.status)}`}>
        {order.status}
      </span>
    </div>
  );
};

const CompleteOrderModal = ({ isOpen, onClose, order }: { isOpen: boolean; onClose: () => void; order: Order | null }) => {
  if (!isOpen || !order) return null;
  return createPortal(
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center backdrop-blur-sm animate-in fade-in duration-200">
       <div className="bg-white w-[500px] rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white"><h3 className="text-xl font-bold">完成订单</h3></div>
          <div className="p-6 space-y-4">
             <div className="flex justify-between text-sm"><span className="text-slate-500">应收金额</span><span className="font-bold text-lg text-emerald-600">¥{order.totalAmount}</span></div>
             <input type="number" defaultValue={order.totalAmount} className="w-full border border-slate-300 rounded-lg p-2" />
          </div>
          <div className="p-6 border-t bg-slate-50 flex justify-end gap-3">
             <button onClick={onClose} className="px-4 py-2 text-slate-600">取消</button>
             <button onClick={onClose} className="px-6 py-2 bg-green-600 text-white rounded-lg">确认完成</button>
          </div>
       </div>
    </div>,
    document.body
  );
};

const ActionCell = ({ order, onAction }: { order: Order; onAction: (action: string, id: number) => void }) => {
  return (
    <div className="flex items-center justify-center gap-2">
        <button 
          onClick={() => onAction('修改', order.id)} 
          className="text-xs text-blue-500 hover:text-blue-700 whitespace-nowrap"
        >
          修改
        </button>
        <button 
          onClick={() => onAction('完结', order.id)} 
          className="text-xs text-blue-500 hover:text-blue-700 whitespace-nowrap"
        >
          完结
        </button>
        <button 
          onClick={() => onAction('复制', order.id)} 
          className="text-xs text-blue-500 hover:text-blue-700 whitespace-nowrap"
        >
          复制
        </button>
        <button 
          onClick={() => onAction('作废', order.id)} 
          className="text-xs text-red-500 hover:text-red-700 whitespace-nowrap"
        >
          作废
        </button>
        <button 
          onClick={() => onAction('挂起', order.id)} 
          className={`text-xs whitespace-nowrap ${order.isSuspended ? 'text-orange-600 font-bold' : 'text-slate-500 hover:text-orange-500'}`}
        >
          {order.isSuspended ? '已挂起' : '挂起'}
        </button>
    </div>
  );
};

const App = () => {
  const [completeModalOpen, setCompleteModalOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [showSuspendedOnly, setShowSuspendedOnly] = useState(false); // New state for filtering

  const [orders, setOrders] = useState<Order[]>(FULL_MOCK_DATA);
  
  // Calculate suspended count dynamically
  const suspendedCount = orders.filter(o => o.isSuspended).length;

  // Sort logic
  const sortedData = [...orders].sort((a, b) => {
    // Helper: Completed/Void/Returned are inactive, treat as lowest priority for overtime
    const isInactive = (status: OrderStatus) => 
      [OrderStatus.Completed, OrderStatus.Void, OrderStatus.Returned].includes(status);

    const aInactive = isInactive(a.status);
    const bInactive = isInactive(b.status);

    // Inactive orders get lowest priority (-9999)
    const aOvertime = aInactive ? -9999 : a.overtimeAlert;
    const bOvertime = bInactive ? -9999 : b.overtimeAlert;

    // 1. Overtime Alert Descending (Longest overtime first)
    if (aOvertime !== bOvertime) {
      return bOvertime - aOvertime;
    }
    
    // 2. Pending Status Priority
    const isAPending = a.status === OrderStatus.PendingDispatch;
    const isBPending = b.status === OrderStatus.PendingDispatch;
    
    if (isAPending && !isBPending) return -1;
    if (!isAPending && isBPending) return 1;
    
    // 3. Remaining Time (Ascending)
    return a.remainingTime - b.remainingTime;
  });

  // Filter Data based on showSuspendedOnly
  const displayData = showSuspendedOnly 
      ? sortedData.filter(o => o.isSuspended) 
      : sortedData;

  const totalItems = displayData.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const currentData = displayData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleAction = (action: string, id: number) => {
    if (action === '挂起') {
      setOrders(prev => prev.map(o => o.id === id ? { ...o, isSuspended: !o.isSuspended } : o));
      return;
    }

    const order = sortedData.find(o => o.id === id);
    if (!order) return;
    if (action === '完单') { setCurrentOrder(order); setCompleteModalOpen(true); } 
    else { alert(`已执行操作：${action} (订单ID: ${id})`); }
  };

  const handleNextPage = () => { if (currentPage < totalPages) setCurrentPage(prev => prev + 1); };
  const handlePrevPage = () => { if (currentPage > 1) setCurrentPage(prev => prev - 1); };
  const handlePageChange = (p: number) => { if(p >= 1 && p <= totalPages) setCurrentPage(p); }

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [showSuspendedOnly]);

  // Helper to render image icon state
  const ImageState = ({ hasImage }: { hasImage: boolean }) => (
    hasImage 
      ? <div className="flex justify-center"><ImageIcon size={14} className="text-blue-500"/></div> 
      : <div className="flex justify-center text-gray-300">-</div>
  );

  // Pagination Logic
  const renderPagination = () => {
    const range = [];
    // Always show 1
    // Show last
    // Show current +/- range
    
    if (totalPages <= 7) {
        for(let i=1; i<=totalPages; i++) range.push(i);
    } else {
        range.push(1);
        if (currentPage > 4) range.push('...');
        
        let start = Math.max(2, currentPage - 2);
        let end = Math.min(totalPages - 1, currentPage + 2);
        
        // Adjust if close to ends
        if (currentPage <= 4) {
            end = 6;
            start = 2;
        } else if (currentPage >= totalPages - 3) {
            start = totalPages - 5;
            end = totalPages - 1;
        }
        
        for (let i = start; i <= end; i++) {
            range.push(i);
        }
        
        if (currentPage < totalPages - 3) range.push('...');
        range.push(totalPages);
    }
    
    return range;
  };
  
  const paginationRange = renderPagination();

  return (
    <div className="h-screen bg-gradient-to-br from-slate-200 to-slate-300 p-6 flex flex-col overflow-hidden relative">
      <style>{`
        /* 
         * 核心优化：强制覆盖表格层级和背景，解决右侧固定列穿插问题
         * 使用 !important 确保样式优先级最高
         */

        /* 1. 全局单元格层级重置 */
        td, th {
          z-index: 1;
          position: relative;
        }

        /* 2. 右侧固定列：最高层级 */
        .sticky-col {
          position: sticky !important;
          z-index: 100 !important; 
          background-clip: padding-box;
        }
        
        /* 表头固定列层级更高 */
        thead th.sticky-col {
          z-index: 110 !important;
        }
        
        /* 普通表头 */
        thead th:not(.sticky-col) {
          z-index: 50; 
        }

        /* --- 3. 背景色 (必须100%不透明) --- */
        
        /* 表头背景 */
        th.sticky-th-solid {
          background-color: #f8fafc !important; /* slate-50 */
        }

        /* 表体背景 - 默认 */
        tr td.sticky-bg-solid {
          background-color: #ffffff !important;
        }
        
        /* 表体背景 - 偶数行 */
        tr:nth-child(even) td.sticky-bg-solid {
          background-color: #eff6ff !important; 
        }
        
        /* 表体背景 - 鼠标悬停 */
        tr:hover td.sticky-bg-solid {
          background-color: #dbeafe !important; 
        }

        /* --- 4. 定位与视觉分割 --- */
        
        /* 超时提醒列 (最左边的固定列) */
        .sticky-right-alert {
          right: 240px !important; /* Width of Action column - Updated to 240px to fit single line text links */
          border-left: 1px solid #cbd5e1 !important; /* 左侧实体分割线 */
          box-shadow: -6px 0 10px -4px rgba(0,0,0,0.15); /* 左侧投影 */
          background-color: #38bdf8 !important; /* Sky Blue - 天蓝色背景 */
        }

        /* Ensure data cells in this column always have sky blue background, overriding even/hover stripes */
        tr td.sticky-right-alert,
        tr:nth-child(even) td.sticky-right-alert,
        tr:hover td.sticky-right-alert {
          background-color: #38bdf8 !important;
        }
        
        /* 操作列 */
        .sticky-right-action {
          right: 0px !important;
        }
      `}</style>
      <div className="max-w-[1800px] mx-auto w-full flex-1 flex flex-col h-full">
        
        <NotificationBar />
        <SearchPanel suspendedCount={suspendedCount} />
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex-1 flex flex-col overflow-hidden min-h-0">
          <div className="overflow-x-auto flex-1 overflow-y-auto relative">
            <table className="w-full text-left border-collapse relative">
              <thead className="sticky top-0 z-40 shadow-sm">
                <tr className="bg-slate-50 border-b-2 border-gray-300 text-xs font-bold uppercase text-slate-700 tracking-wider">
                  <th className="px-3 py-2 whitespace-nowrap bg-slate-50 text-center sticky top-0 z-30">商城订单</th>
                  <th className="px-3 py-2 whitespace-nowrap bg-slate-50 sticky top-0 z-30 min-w-[180px]">工单号/订单号</th>
                  <th className="px-3 py-2 whitespace-nowrap bg-slate-50 sticky top-0 z-30">手机号</th>
                  <th className="px-3 py-2 whitespace-nowrap bg-slate-50 sticky top-0 z-30">服务项目</th>
                  <th className="px-3 py-2 whitespace-nowrap bg-slate-50 sticky top-0 z-30">发起人</th>
                  <th className="px-3 py-2 whitespace-nowrap bg-slate-50 sticky top-0 z-30 min-w-[120px]">订单/创建时间</th>
                  <th className="px-3 py-2 whitespace-nowrap bg-slate-50 sticky top-0 z-30">客户名称</th>
                  <th className="px-3 py-2 whitespace-nowrap bg-slate-50 sticky top-0 z-30">订单来源</th>
                  <th className="px-3 py-2 whitespace-nowrap bg-slate-50 text-center sticky top-0 z-30">状态</th>
                  <th className="px-3 py-2 whitespace-nowrap bg-slate-50 text-center sticky top-0 z-30">出纳付款金额</th>
                  <th className="px-3 py-2 whitespace-nowrap bg-slate-50 sticky top-0 z-30 max-w-[120px]">客户诉求</th>
                  <th className="px-3 py-2 whitespace-nowrap bg-slate-50 sticky top-0 z-30 max-w-[120px]">备注</th>
                  <th className="px-3 py-2 whitespace-nowrap bg-slate-50 sticky top-0 z-30">录单人</th>
                  <th className="px-3 py-2 whitespace-nowrap bg-slate-50 sticky top-0 z-30">师傅</th>
                  <th className="px-3 py-2 whitespace-nowrap bg-slate-50 text-center sticky top-0 z-30">业绩</th>
                  <th className="px-3 py-2 whitespace-nowrap bg-slate-50 sticky top-0 z-30">责任方</th>
                  <th className="px-3 py-2 whitespace-nowrap bg-slate-50 text-center sticky top-0 z-30">总退款</th>
                  <th className="px-3 py-2 whitespace-nowrap bg-slate-50 text-center sticky top-0 z-30">退款方式</th>
                  <th className="px-3 py-2 whitespace-nowrap bg-slate-50 text-center sticky top-0 z-30">师傅退款</th>
                  <th className="px-3 py-2 whitespace-nowrap bg-slate-50 text-center sticky top-0 z-30">入账状态</th>
                  <th className="px-3 py-2 whitespace-nowrap bg-slate-50 text-center sticky top-0 z-30">公司退款</th>
                  <th className="px-3 py-2 whitespace-nowrap bg-slate-50 text-center sticky top-0 z-30">师傅成本</th>
                  <th className="px-3 py-2 whitespace-nowrap bg-slate-50 text-center sticky top-0 z-30">顾客收款码</th>
                  <th className="px-3 py-2 whitespace-nowrap bg-slate-50 text-center sticky top-0 z-30">补款凭证</th>
                  <th className="px-3 py-2 whitespace-nowrap bg-slate-50 text-center sticky top-0 z-30">付款凭证</th>
                  <th className="px-3 py-2 whitespace-nowrap bg-slate-50 sticky top-0 z-30">办结人</th>
                  <th className="px-3 py-2 whitespace-nowrap bg-slate-50 sticky top-0 z-30">办结类型</th>
                  <th className="px-3 py-2 whitespace-nowrap bg-slate-50 sticky top-0 z-30">办结时间</th>
                  <th className="px-3 py-2 whitespace-nowrap bg-slate-50 sticky top-0 z-30 max-w-[150px]">完结说明</th>
                  <th className="px-3 py-2 whitespace-nowrap bg-slate-50 sticky top-0 z-30">作废人</th>
                  <th className="px-3 py-2 whitespace-nowrap bg-slate-50 sticky top-0 z-30">作废原因</th>
                  {/* REMOVED: 师傅退款时间, 公司退款时间, 师傅成本时间, 平台退款 */}

                  {/* Fixed Columns */}
                  <th className="px-3 py-2 whitespace-nowrap text-center w-[120px] sticky-th-solid sticky-col sticky-right-alert">剩余/超时(H)</th>
                  <th className="px-3 py-2 whitespace-nowrap text-center w-[240px] sticky-th-solid sticky-col sticky-right-action border-l border-gray-200">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-300">
                {currentData.map((order) => (
                  <tr key={order.id} className="bg-white even:bg-blue-50 hover:!bg-blue-100 transition-colors group text-xs border-b border-gray-300 last:border-0 align-middle">
                    <td className="px-3 py-2 text-center text-slate-600">{order.isMallOrder ? '是' : '否'}</td>
                    <td className="px-3 py-2">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-bold text-slate-800 font-mono text-xs select-all">{order.orderNo}</span>
                        <div className="flex items-center gap-1">
                          <span className="text-slate-500 font-mono text-[10px] select-all">{order.originalOrderNo}</span>
                          <span className="text-[10px] text-blue-500 hover:text-blue-700 cursor-pointer underline hover:no-underline whitespace-nowrap">跳转原始单详情</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-2 text-slate-800 font-bold font-mono">{order.mobile}</td>
                    <td className="px-3 py-2 text-slate-600 whitespace-nowrap">{order.serviceItem}</td>
                    <td className="px-3 py-2 text-slate-600 whitespace-nowrap">{order.initiator}</td>
                    
                    {/* Updated Order/Create Time Column */}
                    <td className="px-3 py-2 whitespace-nowrap">
                        <div className="flex flex-col">
                            <span className="text-slate-800 font-medium">{order.orderTime}</span>
                            <span className="text-slate-400 text-[10px] mt-0.5">{order.createTime}</span>
                        </div>
                    </td>
                    
                    <td className="px-3 py-2 text-slate-800 font-medium">{order.customerName}</td>
                    <td className="px-3 py-2 text-center whitespace-nowrap"><span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded border border-slate-200">{order.source}</span></td>
                    <td className="px-3 py-2 text-center"><StatusCell order={order} /></td>
                    <td className="px-3 py-2 text-center font-mono text-slate-700">{formatCurrency(order.cashierPaymentAmount)}</td>
                    <td className="px-3 py-2 text-slate-600 max-w-[120px]">
                      <TooltipCell content={order.customerRequest} />
                    </td>
                    <td className="px-3 py-2 text-slate-600 max-w-[120px] truncate" title={order.remark}>{order.remark || '-'}</td>
                    <td className="px-3 py-2 text-slate-600 whitespace-nowrap">{order.recorderName}</td>
                    <td className="px-3 py-2 text-slate-700 font-medium whitespace-nowrap">{order.masterName}</td>
                    <td className="px-3 py-2 text-center font-mono text-orange-600 font-bold">{formatCurrency(order.revenue)}</td>
                    <td className="px-3 py-2 text-slate-600">{order.responsibleParty}</td>
                    <td className="px-3 py-2 text-center font-mono text-slate-600">{formatCurrency(order.totalRefund)}</td>
                    <td className="px-3 py-2 text-center text-slate-500">{order.refundMethod}</td>
                    <td className="px-3 py-2 text-center font-mono text-slate-600">{formatCurrency(order.masterRefund)}</td>
                    <td className="px-3 py-2 text-center text-slate-600">{order.entryStatus}</td>
                    <td className="px-3 py-2 text-center font-mono text-slate-600">{formatCurrency(order.companyRefund)}</td>
                    <td className="px-3 py-2 text-center font-mono text-slate-500">{formatCurrency(order.masterCost)}</td>
                    
                    <td className="px-3 py-2"><ImageState hasImage={order.customerPaymentCode} /></td>
                    <td className="px-3 py-2"><ImageState hasImage={order.invalidVoucher} /></td>
                    <td className="px-3 py-2"><ImageState hasImage={order.paymentVoucher} /></td>
                    
                    <td className="px-3 py-2 text-slate-600">{order.completerName}</td>
                    <td className="px-3 py-2 text-slate-600">{order.completionType}</td>
                    <td className="px-3 py-2 text-slate-500 whitespace-nowrap">{order.completionTime}</td>
                    <td className="px-3 py-2 text-slate-500 max-w-[150px] truncate" title={order.completionNote}>{order.completionNote || '-'}</td>
                    <td className="px-3 py-2 text-slate-500">{order.voiderName}</td>
                    <td className="px-3 py-2 text-slate-500">{order.voidReason}</td>

                    {/* Fixed Columns */}
                    <td className="px-3 py-2 text-center sticky-col sticky-right-alert align-middle">
                      {[OrderStatus.Completed, OrderStatus.Void, OrderStatus.Returned].includes(order.status) ? (
                        <span className="text-white/70 font-medium">/</span>
                      ) : (
                        <div className="flex items-center justify-center gap-1 h-8">
                            <span className="text-base font-mono font-bold text-white">
                              {order.remainingTime}
                            </span>
                            {order.overtimeAlert > 0 && (
                              <span className="ml-1 px-1 border border-yellow-300 rounded text-[13px] font-extrabold text-yellow-300 animate-pulse">
                                +{order.overtimeAlert}
                              </span>
                            )}
                        </div>
                      )}
                    </td>
                    <td className="px-3 py-2 text-center sticky-col sticky-right-action sticky-bg-solid border-l border-gray-200">
                      <ActionCell order={order} onAction={handleAction} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* New Pagination Footer */}
          <div className="bg-white px-4 py-3 border-t border-gray-200 flex justify-center items-center mt-auto">
             <div className="flex items-center gap-3 select-none">
                <span className="text-sm text-slate-500">共 {totalItems} 条</span>
                
                <select 
                    value={pageSize}
                    onChange={(e) => {
                        setPageSize(Number(e.target.value));
                        setCurrentPage(1);
                    }}
                    className="border border-slate-300 rounded px-2 py-1 text-sm text-slate-600 outline-none focus:border-blue-500 cursor-pointer hover:border-blue-400"
                >
                    <option value={10}>10条/页</option>
                    <option value={20}>20条/页</option>
                    <option value={50}>50条/页</option>
                    <option value={100}>100条/页</option>
                </select>
                
                <div className="flex items-center gap-1">
                    <button 
                        onClick={handlePrevPage} 
                        disabled={currentPage === 1}
                        className="w-8 h-8 flex items-center justify-center border border-slate-300 rounded bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    
                    {paginationRange.map((page, idx) => (
                        page === '...' ? (
                            <span key={`dots-${idx}`} className="w-8 h-8 flex items-center justify-center text-slate-400 font-bold">···</span>
                        ) : (
                            <button
                                key={page}
                                onClick={() => handlePageChange(page as number)}
                                className={`w-8 h-8 flex items-center justify-center border rounded text-sm font-medium transition-colors ${
                                    currentPage === page 
                                        ? 'bg-blue-600 border-blue-600 text-white' 
                                        : 'border-slate-300 bg-white text-slate-600 hover:border-blue-500 hover:text-blue-500'
                                }`}
                            >
                                {page}
                            </button>
                        )
                    ))}
                    
                    <button 
                        onClick={handleNextPage} 
                        disabled={currentPage === totalPages}
                        className="w-8 h-8 flex items-center justify-center border border-slate-300 rounded bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-slate-500 ml-2">
                    <span>前往</span>
                    <input 
                        type="number" 
                        min={1} 
                        max={totalPages}
                        defaultValue={currentPage}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                const val = parseInt(e.currentTarget.value);
                                if (val >= 1 && val <= totalPages) setCurrentPage(val);
                            }
                        }}
                        onBlur={(e) => {
                             const val = parseInt(e.target.value);
                             if (val >= 1 && val <= totalPages) setCurrentPage(val);
                             else e.target.value = currentPage.toString();
                        }}
                        className="w-12 h-8 border border-slate-300 rounded text-center outline-none focus:border-blue-500 text-slate-700"
                    />
                    <span>页</span>
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* Updated Floating Suspended Filter Button */}
      <button
        onClick={() => setShowSuspendedOnly(!showSuspendedOnly)}
        className={`fixed bottom-6 right-6 w-20 h-20 rounded-full shadow-xl flex flex-col items-center justify-center text-white transition-all z-[9999] active:scale-95 ${
          showSuspendedOnly 
            ? 'bg-orange-600 ring-4 ring-orange-200 scale-110' 
            : 'bg-orange-500 hover:bg-orange-600 hover:scale-105'
        }`}
        title={showSuspendedOnly ? "显示全部订单" : "只显示挂起订单"}
      >
        <span className="text-[10px] font-medium opacity-90 mb-0.5 whitespace-nowrap">已挂起数</span>
        <span className="text-2xl font-bold leading-none">{suspendedCount}</span>
      </button>

      <CompleteOrderModal isOpen={completeModalOpen} onClose={() => setCompleteModalOpen(false)} order={currentOrder} />
    </div>
  );
};

const container = document.getElementById('root');
if (container) {
  const appRoot = createRoot(container);
  appRoot.render(<App />);
}